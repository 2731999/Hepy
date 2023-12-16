import React from 'react';

const ImageUploadBox = ({ onChange, selectedImage, index }) => {
    const inputId = `fileInput-${index}`; 
    return (
        <div className="image-upload-box">
            <label htmlFor={inputId} className="upload-box-label">
                <div className="image-preview">
                    {selectedImage ? (
                        <img className="selected-image" src={URL.createObjectURL(selectedImage)} alt="Upload" />
                    ) : (
                        <p className="upload-placeholder">Upload</p>
                    )}
                </div>
            </label>   
            <input
                id={inputId}
                type="file"
                onChange={onChange}
                accept="image/*"
                style={{ display: 'none' }} 
            />
        </div>
    );
};

export default ImageUploadBox;
