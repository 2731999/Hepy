import React, { useState } from 'react';

function UsersLiked({ user }) {
  const [liked, setLiked] = useState(false);
  const [blurEnabled, setBlurEnabled] = useState(true);

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handlePermissionClick = () => {
    setBlurEnabled(false);
  };

  return (
    <div className={`like-box ${liked ? 'liked' : ''} ${blurEnabled ? 'blurred' : ''}`} onClick={handleLikeClick}>
      <img
        src={user.Pic[0]}
        alt={`${user.first_name}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', marginTop: '20px', borderRadius:'15px' }}
      />
      {blurEnabled && (
        <button className="permission-button" onClick={handlePermissionClick}>
        </button>
      )}
    </div>
  );
}

export default UsersLiked;
