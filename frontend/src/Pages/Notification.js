import React, { useState } from 'react';
import notifyimg from '../images/notifyimg.png'

const NotificationPage = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const handleAboutmeSkipClick = () => {
        window.location.href = '/AboutMePage';
    };

    const handleToggleNotifications = () => {
        setNotificationsEnabled(prevEnabled => !prevEnabled);
    };

    return (
        <div className="notification-page">
            <button className="skip-button" onClick={handleAboutmeSkipClick}>Skip</button>
            <div className='notify-content'>
                <div className="message-image">
                    <img className='notifyimg' src={notifyimg} alt='notifyimg' />
                </div>
                <div className='notifyphara'>
                    <p className="enable-notifications">Enable Notification's</p>
                    <p className='notification-phara'>Get push notification when you get the match or receive a message.</p>
                </div>
                <button className="be-notified-button"> I want to be notified</button>
            </div>
        </div>
    );
};

export default NotificationPage;
