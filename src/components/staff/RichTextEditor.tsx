import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({
    value,
    onChange,
    placeholder = "Enter text here",
}: any) => {
    const quillRef = React.useRef(null);

    const modules = {
        toolbar: {
            container: [
                // Header dropdown (includes font size options)
                [{ header: [1, 2, 3, 4, 5, 6, false] }],

                // Font family
                [{ font: [] }],

                // Font size
                [{ size: ["small", false, "large", "huge"] }],

                // Text alignment
                [{ align: [] }],

                // Bold, italic, underline, strikethrough
                ["bold", "italic", "underline", "strike"],

                // Text color and background color
                [{ color: [] }, { background: [] }],

                // Ordered list, bullet list, and indentation
                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],

                // Blockquote and code block
                ["blockquote", "code-block"],

                // Links, images, and videos
                ["link", "image", "video"],

                // Clean formatting
                ["clean"],
            ],
        },
    };


    return (
        <div className={`relative`}>
            <ReactQuill
                ref={quillRef}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                theme="snow"
                className="h-full rounded-lg border border-gray-300"
                modules={modules}
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            />
        </div>
    );
};

export default RichTextEditor;
