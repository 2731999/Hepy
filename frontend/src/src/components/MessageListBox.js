import React from 'react';
import { ImCross } from 'react-icons/im';
import {useNavigate} from 'react-router-dom'


const MessageListBox = ({ friend, backgroundImage, toggleChat, currentFriendProfilePicture}) => {
    const cardStyle = {
        backgroundImage: `url(${backgroundImage})`,
    };

    const handleToggleChat = () => {
        toggleChat(friend);
    };

    const handleFriendPageClick = () => {
        navigate('/FriendPage', { state: { clickedProfile: friend } });
    };

    const navigate = useNavigate();

    return (
        <div className="friend-card" style={cardStyle}>
            <div className="friend-info">
                <div className="name-age" onClick={handleFriendPageClick}>
                    <h2>{friend.name}, {friend.age}</h2>
                </div>
                <p className="message-received">{friend.message}</p>
                <div className="message-remove">
                    <button className="toggle-message" onClick={handleToggleChat}>Message</button>
                    <button className="remove-button"><ImCross /></button>
                </div>
            </div>
            <div className="friend-card-blur"></div>
            {currentFriendProfilePicture && (
                <img src={currentFriendProfilePicture} alt="Profile Picture" className="friend-profile-picture" />
            )}
        </div>
    );
};

export default MessageListBox;
