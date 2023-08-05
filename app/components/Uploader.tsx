import React, { type ReactElement } from "react";
import type { ImageListType } from "react-images-uploading";
import ImageUploading from "react-images-uploading";

export default function Uploader({
  onChange,
  maxNumber = 1,
  landing,
}: {
  onChange: (imgs: ImageListType) => void;
  maxNumber?: number;
  landing?: ReactElement;
}) {
  return (
    <div>
      <ImageUploading
        value={[]}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="dataUrl"
        acceptType={["jpg", "png"]}
        inputProps={{ name: "file" }}
      >
        {({ onImageUpload, isDragging, dragProps }) => (
          // write your building UI
          <div
            className={`upload__image-wrapper${
              isDragging
                ? "bg-slate-400 dark:bg-slate-900 text-black dark:text-white"
                : ""
            }`}
          >
            {landing ? (
              React.cloneElement(landing, {
                onClick: onImageUpload,
                ...dragProps,
              })
            ) : (
              <div
                className="btn btn-ghost btn-lg normal-case"
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </div>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
