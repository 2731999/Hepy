import React from 'react';
import contactlist from '../images/contactlist.png'
import { useNavigate } from 'react-router-dom'
 
const InviteFriends = () => {
    const navigate = useNavigate();

    const handleInviteSkipClick = () => {
        navigate('/QuestionsPage');
    };

    return (
        <div>
            <button className="skipButton" onClick={handleInviteSkipClick}>Skip</button>
            <div className='contactImg'>
                <img className="contactImage" src={contactlist} alt="Contact" />
            </div>
            <h1 className="inviteHeading">Invite Friends</h1>
            <p className="contactPhara"> You can find friends from your contact lists to connect</p>
            <button className="contactListButton">Access Contact List</button>
        </div>
    );
};

export default InviteFriends;
