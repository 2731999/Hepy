import React from 'react';

const ChatMessage = ({ text, isSentByUser, timestamp }) => {
    const messageClass = isSentByUser ? 'sent' : 'received';
    const timestampClass = isSentByUser ? 'timestamp-right' : 'timestamp-left';

    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return (
        <>
            <div className={`chatMessage ${messageClass}`}>
                <p>{text}</p>
            </div>
            <div className={`timestamp ${timestampClass}`}>{formattedTime}</div>
        </>
    );
};

export default ChatMessage;
