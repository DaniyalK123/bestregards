const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const _crypto = require('crypto')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      maxLength: 50,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    // 0 - free user, 1 - premium user
    userType: {
      type: Number,
      default: 0,
    },

    hashedPassword: {
      type: String,
      trim: true,
    },

    salt: String,

    resetTokenId: String,
    resetTokenExpire: Number,
    nylasEmail: {
      accessToken: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true },
)

// virtual field
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = uuidv4()
    this.hashedPassword = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword
  },

  encryptPassword: function (password) {
    if (!password) {
      return ''
    }
    try {
      return _crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
}

const UserModel = mongoose.model('User', userSchema)
module.exports = { UserModel }
