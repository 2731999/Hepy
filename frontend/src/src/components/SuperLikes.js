import React, { useState } from 'react';


function SuperLikeBox({ user }) {
  const [superLiked, setSuperLiked] = useState(false);

  const handleSuperLikeClick = () => {
    setSuperLiked(!superLiked);
  };

  return (
    <div className={`super-like-box ${superLiked ? 'super-liked' : ''}`} onClick={handleSuperLikeClick}>
      {superLiked ? 'Super Liked!' : 'Super Like'}
    </div>
  );
}

export default SuperLikeBox;
