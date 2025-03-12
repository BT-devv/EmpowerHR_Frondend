import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      [{ align: [] }],
      [{ color: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ background: [] }],
      [{ list: "bullet" }, { list: "ordered" }],
      ["link", "image"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  return (
    <div className="w-[95%]">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="
          [&_.ql-toolbar]:!bg-[#9CD2BB] 
          [&_.ql-toolbar]:!text-white 
          [&_.ql-toolbar]:!rounded-t-lg 
          [&_.ql-container]:!bg-white
          [&_.ql-editor]:!text-black
          [&_.ql-editor]:!min-h-[200px]
        "
      />
    </div>
  );
};

export default TextEditor;
