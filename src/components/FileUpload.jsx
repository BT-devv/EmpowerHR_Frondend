import React, { useState } from "react";

import { HiOutlinePhoto } from "react-icons/hi2";

const FileUpload = ({ fileType, setSelectedFile }) => {
  const fileInputRef = React.useRef(null);
  const [preview, setPreview] = useState(null);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      {fileType === "avatar" ? (
        <>
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-[240px] h-[240px] object-cover border ml-[20px] mr-[15px]"
            />
          ) : (
            <button
              onClick={handleChooseFile}
              className="flex flex-col rounded-none ml-[20px] border-[1px] mr-[15px] w-[240px] h-[240px] bg-[#EAEAEA] border-gray-400 text-[#C5C5C5] text-[10px] justify-center items-center  hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2"
            >
              <HiOutlinePhoto className="w-[30px] h-[30px]" />
              <p className="w-[150px] mt-[5px] text-[12px]">
                Image: png, jpg, jpeg. Size Maximum: 1mb. Resolution: 500x500px.
              </p>
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </>
      ) : (
        <>
          <button
            onClick={handleChooseFile}
            className="border-[#000000] text-center p-1 border rounded-md w-fit h-fit flex items-center justify-center"
          >
            upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};

export default FileUpload;
