import * as React from "react";
import TextField from '@material-ui/core/TextField'
import {Editor} from '@tinymce/tinymce-react';
import {useRef} from "react";
import ReactHtmlParser from 'react-html-parser';
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";

export default function EditArea(props) {

    const useStyles = makeStyles((theme) => ({
        infospan: {
            'font-weight': 'bold',
            'color':'red',
        }
    }));
    const classes = useStyles();

    // const [value, setValue] = React.useState(props.selectedMessage);
    const editorRef = useRef(null);
    const contactVars = props.contactVariables;
    const customVars = props.customVariables;
    const templateVars = props.templateVariables;

    const handleEditorChange = (a, editor) => {
        props.setValue((editor.getContent()));
        props.setSelectedMessage(editor.getContent());
    }

    const previewValue = (value) => {
        contactVars.concat(customVars).concat(templateVars).forEach((v) => {
            value = value.replace("$"+v+"!", v +" (EX)");
        });
        return value;
    }

    return (
        <div>
            <h3>Edit Template</h3>
            <p>(Use <span className={classes.infospan} >$Var!</span> to represent variable
                Var, <span className={classes.infospan}>Var(EX)</span> will
                then be shown in the Preview Section)</p>
            <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={props.selectedMessage}
                init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onEditorChange={handleEditorChange}
            />
            <h3>Preview</h3>
            <div>
                {ReactHtmlParser(previewValue(props.value))}
            </div>

        </div>
    );
}
