import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const imagePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [valid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const filereader = new FileReader();
    filereader.onload = () => {
      setPreviewUrl(filereader.result);
    };
    filereader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let selectedFile;
    let fileIsValid;
    if (event.target.files && event.target.files.length === 1) {
      selectedFile = event.target.files[0];
      setFile(selectedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, selectedFile, fileIsValid);
  };

  const showImagePicker = () => {
    imagePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={imagePickerRef}
        onChange={pickedHandler}
      ></input>
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please enter an image.</p>}
        </div>
        <Button type="button" onClick={showImagePicker}>
          PICK IMAGE
        </Button>
      </div>
      {!valid && <p>{props.imageError}</p>}
    </div>
  );
};
export default ImageUpload;
