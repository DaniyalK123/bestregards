const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const uploadToCloudinary = (req, res, next) => {
  if (req.file) {
    let uri = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    console.log("File received", req.file);

    cloudinary.uploader.upload(uri, function (error, result) {
      console.log(result);
      req.imageURL = result.secure_url;
      req.imageAssetID = result.public_id;
      next();
    });
  } else {
    next();
  }
};

module.exports = { uploadToCloudinary };
