import React, { useState, useEffect } from 'react';
import UsersLiked from '../components/UsersLiked';
import SuperLikeBox from '../components/SuperLikes';
import { FaStar } from 'react-icons/fa';
import { FaUserAlt } from 'react-icons/fa';
import { FaClone } from 'react-icons/fa';
import { FaComment } from 'react-icons/fa';
import { PiArrowsDownUpLight } from 'react-icons/pi';
import axios from 'axios';
import { useCookies } from "react-cookie";

const LikesAndSuperLikes = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const userId = cookies.UserId;

    const superLikedUsers = [
        { id: 1, user: "SuperUser1" },
        { id: 2, user: "SuperUser2" },
        { id: 3, user: "SuperUser3" },
        { id: 3, user: "SuperUser3" },
        { id: 3, user: "SuperUser3" },
        { id: 3, user: "SuperUser3" },
    ];

    const [likedUsers, setLikedUsers] = useState([])
    const friends = likedUsers.map((user) => ({
        name: user.name,
        age: user.age,
        profilePicture: user.profilePicture,
    }));

    const getUser = async () => {
        try {
            const response = await axios.get('https://hepy-backend.vercel.app/user', {
                params: { userId }
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getLikedUsers = async (likedProfiles) => {
        try {
            if (likedProfiles && likedProfiles.length > 0) {
                const response = await axios.get('https://hepy-backend.vercel.app/liked-users', {
                    params: { gender: user.Interested_in }
                });

                const filteredUsers = response.data.filter((user) => likedProfiles.includes(user.user_id));

                setLikedUsers(filteredUsers);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, [userId]);

    useEffect(() => {
        if (user && user.Interested_in) {
            getLikedUsers(user.likedProfiles);
        }
    }, [user]);


    console.log('liked profiles', likedUsers)

    const handleFriendPageClick = () => {
        window.location.href = '/FriendPage';
    };
    const handleSelfClick = () => {
        window.location.href = '/Self';
    };
    const handleMessagesPageClick = () => {
        window.location.href = '/Messages';
    };

    return (
        <div className='likes-main'>
            <div>
                <div className='likes-main-head'>
                    <div className='likes-head'>
                        <h1>Likes</h1>
                    </div>
                    <div className='likes-head-icon'><PiArrowsDownUpLight /></div>
                </div>
                <p className='likes-p'>This is the list of people who have liked you and your matches.</p>
                <div className="like-box-container">
                    {likedUsers.map((user) => (
                        <UsersLiked key={user.user_id} user={user} />
                    ))}
                </div>
            </div>
            <div>
                <div className='super-likes'>
                    <h1>Super likes</h1>

                </div>
                <div className='divider-line'>
                    <div className='divider-text'>Likes</div>
                </div>
                <div className='super-like-box-container'>
                    {superLikedUsers.map((user) => (
                        <SuperLikeBox key={user.id} user={user.user} />
                    ))}
                </div>
            </div>
            <footer className={`likes-and-superlikes-footer${isChatOpen ? ' sticky' : ''}`}>
                <div className="likes-and-superlikes-footer-icons">
                    <a href="#" className="likes-and-superlikes-footer-icon" onClick={handleFriendPageClick}>
                        <FaClone />
                    </a>
                    <a href="#" className="likes-and-superlikes-footer-icon" onClick={handleMessagesPageClick}>
                        <FaComment />
                    </a>
                    <a href="#" className="likes-and-superlikes-footer-icon" style={{ color: 'var(--hepygirlcolor)' }}>
                        <FaStar />
                    </a>
                    <a href="#" className="likes-and-superlikes-footer-icon" onClick={handleSelfClick}>
                        <FaUserAlt />
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default LikesAndSuperLikes;
