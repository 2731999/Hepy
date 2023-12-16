import React, { useState, useRef, useEffect } from 'react';

const SelfSmallPhotoBox = ({ src, caption, onPhotoSelect, id }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (src) {
      setFile(null); 
    }
  }, [src]);

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFile(selectedFiles[0]);
    if (onPhotoSelect) {
      onPhotoSelect(selectedFiles, id);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="self-small-photo-box" onClick={handleClick}>
      {src ? (
        <img src={src} alt={caption} />
      ) : (
        <label className="self-small-photo-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
        </label>
      )}
    </div>
  );
};

export default SelfSmallPhotoBox;
