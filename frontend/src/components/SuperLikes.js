import React, { useState } from 'react';


function SuperLikeBox({ user }) {
  const [superLiked, setSuperLiked] = useState(false);

  const handleSuperLikeClick = () => {
    setSuperLiked(!superLiked);
  };

  return (
    <div className={`super-like-box ${superLiked ? 'super-liked' : ''}`} onClick={handleSuperLikeClick}>
      {superLiked ? '-!' : '-'}
    </div>
  );
}

export default SuperLikeBox;
