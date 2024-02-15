// UserListItem.js

import React from 'react';

const PostLikedList = ({ profilePicture, userName }) => {
    return (
        <div className="user-list-item">
            <div className="post-circular-container">
                {profilePicture && (
                    <img
                        src={profilePicture}
                        alt=""
                        className="user-user-profile-pic"
                    />
                )}
            </div>
            <p className="user-name">{userName}</p>
        </div>
    );
};

export default PostLikedList;
