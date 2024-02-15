import React, { useState, useEffect } from 'react';
import MessageListBox from '../components/MessageListBox';
import ChatMessage from '../components/ChatMessages';
import { useNavigate } from 'react-router-dom'
import { FaEllipsisV } from 'react-icons/fa';
import { FaClone } from 'react-icons/fa';
import { FaComment } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { FaUserAlt } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa';
import { FaMicrophone } from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { useCookies } from "react-cookie";
import io from 'socket.io-client';
import FriendPage from './FriendPage';
import CaptureAudio from '../components/CaptureAudio';


function calculateAge(dob) {
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();
    return age;
}

const Messages = ({ friend }) => {
    const [likedUsers, setLikedUsers] = useState([])
    const friends = likedUsers.map((user) => ({
        name: user.name,
        age: user.age,
        profilePicture: user.profilePicture,
    }));

    const chunkSize = 2;
    const friendChunks = [];
    for (let i = 0; i < friends.length; i += chunkSize) {
        friendChunks.push(friends.slice(i, i + chunkSize));
    }

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentFriendName, setCurrentFriendName] = useState('');
    const [currentFriendProfilePicture, setCurrentFriendProfilePicture] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isChatContainerOpen, setIsChatContainerOpen] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isDarkIcon, setIsDarkIcon] = useState(false);
    const darkThemeClass = isDarkTheme ? 'dark-theme' : '';
    const [user, setUser] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [isProfilePictureValid, setIsProfilePictureValid] = useState(false);
    const userId = cookies.UserId;
    const [clickedProfile, setClickedProfile] = useState(null);
    const msguserId = user?.user_id;
    const currentFriendId = clickedProfile ? clickedProfile.user_id : null;
    const [sentMessages, setSentMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [textArea, setTextArea] = useState(null)
    const [allMessages, setAllMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [showAudioRecoder, setShowAudioRecoder] = useState(false)
    const socket = io.connect('https://hepy-backend-abhisheks-projects-b60f698d.vercel.app/');
    console.log('Socket Connection:', socket.connected);


    const getUser = async () => {
        try {
            const response = await axios.get('https://hepy-web-backend.vercel.app//user', {
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
                const response = await axios.get('https://hepy-web-backend.vercel.app//liked-users', {
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

    const toggleChatContainer = (friend) => {
        setCurrentFriendName(friend.name);
        setCurrentFriendProfilePicture(friend.profilePicture);
        setClickedProfile(friend.user);
        setIsChatOpen(true);
        setIsChatContainerOpen(true);
        console.log('clickedprofile:', friend.user);
    };

    const closeChat = () => {
        setIsChatOpen(false);
        setIsChatContainerOpen(false);
    };

    const sendMessage = () => {
        if (newMessage.trim() === '') return;

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        const message = {
            text: newMessage,
            isSentByUser: true,
            timestamp: time,
        };

        setMessages([...messages, message]);
        setNewMessage('');
    };

    const toggleOptions = () => {
        const optionsContainer = document.querySelector('.options-container');
        if (optionsContainer) {
            optionsContainer.style.display = optionsContainer.style.display === 'block' ? 'none' : 'block';
        }
    };

    const getUsersMessages = async (msguserId, correspondingUserId) => {
        try {
            const response = await axios.get('https://hepy-web-backend.vercel.app//messages', {
                params: { msguserId, correspondingUserId }
            });
            if (response.data) {
                setSentMessages(response.data);
            }
        } catch (error) {
            console.error('Error fetching sent messages:', error);
        }
    };

    const getReceivedMessages = async (msguserId, correspondingUserId) => {
        try {
            const response = await axios.get('https://hepy-web-backend.vercel.app//messages', {
                params: { msguserId: correspondingUserId, correspondingUserId: msguserId }
            });
            if (response.data) {
                setReceivedMessages(response.data);
            }
        } catch (error) {
            console.error('Error fetching received messages:', error);
        }
    };

    useEffect(() => {
        if (isChatOpen && currentFriendId) {
            getUsersMessages(msguserId, currentFriendId)
                .then((response) => {
                    if (response && response.data) {
                        setSentMessages(response.data);
                    } else {
                        console.error('Received an invalid response for sent messages.');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching sent messages:', error);
                });

            getReceivedMessages(msguserId, currentFriendId)
                .then((response) => {
                    if (response && response.data) {
                        setReceivedMessages(response.data);
                    } else {
                        console.error('Received an invalid response for received messages.');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching received messages:', error);
                });
        }
    }, [isChatOpen, currentFriendId, msguserId]);

    useEffect(() => {
        const mergedMessages = [...sentMessages, ...receivedMessages];
        const sortedMessages = mergedMessages.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setAllMessages(sortedMessages);
    }, [sentMessages, receivedMessages]);

    const descendingOrderMessages = allMessages?.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    // const addMessage = async () => {

    //     const messageData = {
    //         timestamp: new Date().toISOString(),
    //         from_userId: userId,
    //         to_userId: clickedProfile.user_id,
    //         message: newMessage,
    //     };

    //     try {
    //         const response = await axios.post('https://hepy-web-backend.vercel.app//message', { message: messageData });
    //         console.log('Message sent successfully:', response.data);
    //         setNewMessage('');


    //     } catch (error) {
    //         console.error('Error sending the message:', error);
    //     }
    //     await socket.emit("send_message", messageData)
    // };     


    const addMessage = async () => {
        const messageData = {
            timestamp: new Date().toISOString(),
            from_userId: userId,
            to_userId: clickedProfile.user_id,
            message: newMessage,
        };

        try {
            const response = await axios.post('https://hepy-web-backend.vercel.app//message', { message: messageData });
            console.log('Message sent successfully:', response.data);
            setAllMessages((prevMessages) => [...prevMessages, messageData]);
            setNewMessage('');

            await socket.emit("send_message", messageData);
        } catch (error) {
            console.error('Error sending the message:', error);
        }
    };


    useEffect(() => {
        socket.on('receive_message', (data) => {
            setAllMessages((prevMessages) => [...prevMessages, data]);
        });
    }, [socket]);

    // useEffect(() => {
    //     const socket = io.connect('https://hepy-backend-abhisheks-projects-b60f698d.vercel.app/');
    //     socket.on('connect', () => {
    //         console.log('Socket Connected:', socket.id);
    //     });
    //     socket.on('disconnect', () => {
    //         console.log('Socket Disconnected');
    //     });
    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    useEffect(() => {
        const socket = io.connect('https://hepy-backend-abhisheks-projects-b60f698d.vercel.app/');
        socket.on('connect', () => {
            console.log('Socket Connected:', socket.id);
        });
        socket.on('disconnect', () => {
            console.log('Socket Disconnected');
        });

        socket.on('receive_message', (data) => {
            setAllMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const toggleDarkTheme = () => {
        setIsDarkIcon(!isDarkIcon);
        setIsDarkTheme(!isDarkTheme);
    };

    const handleSelfClick = () => {
        window.location.href = '/Self';
    };
    const handleDiscoverPageClick = () => {
        window.location.href = '/Discover';
    };

    const handleLikesAndSuperlikesClick = () => {
        window.location.href = '/LikesAndSuperLikes';
    };

    let navigate = useNavigate()

    return (
        <div className={`Messages ${darkThemeClass}`}>
            <header className={`Messages-header${isChatContainerOpen ? ' sticky' : ''}`}>
                <div className='message-h1-menu'>
                    <h1 >Messages</h1>
                    <div className='message-menu'>
                        <FaEllipsisV onClick={toggleOptions} />
                        {isDarkIcon ? (
                            <div className="options-container">
                                <p className='darkOption' onClick={toggleDarkTheme}>D</p>
                            </div>
                        ) : (
                            <div className="options-container">
                                <p className='darkOption' onClick={toggleDarkTheme}>L</p>
                            </div>
                        )}
                    </div>
                </div>
                <p className='Messages-header-p'>This is the list of people who have liked you and your matches.</p>
                <div className="friend-rows">
                    {likedUsers.map((likedUser, index) => {
                        const age = likedUser.DOB ? calculateAge(likedUser.DOB) : null;
                        const userImage = likedUser.Pic && likedUser.Pic[0];
                        return (
                            <div key={index} className="friend-row">
                                <MessageListBox
                                    friend={{
                                        user: likedUser,
                                        name: `${likedUser.first_name.charAt(0)} ${likedUser.last_name.charAt(0)}`,
                                        age: age,
                                    }}
                                    backgroundImage={userImage}
                                    toggleChat={toggleChatContainer}
                                />
                            </div>
                        );
                    })}
                </div>
            </header>
            <footer className={`message-footer${isChatOpen ? ' sticky' : ''}`}>
                <div className="message-footer-icons">
                    <a href="#" className="message-footer-icon" onClick={handleDiscoverPageClick}>
                        <FaClone />
                    </a>
                    <a href="#" className="message-footer-icon" style={{ color: 'var(--hepygirlcolor)' }}>
                        <FaComment />
                    </a>
                    <a href="#" className="message-footer-icon" onClick={handleLikesAndSuperlikesClick}>
                        <FaStar />
                    </a>
                    <a href="#" className="message-footer-icon" onClick={handleSelfClick}>
                        <FaUserAlt />
                    </a>
                </div>
            </footer>
            {isChatOpen && (
                <>
                    <div className="chatoverlay"></div>
                    <div className='chat-container' style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
                        <button className="chat-toggle-button" onClick={closeChat}>
                            <FaMinus />
                        </button>
                        <div className="chat-header">
                            <div className="chat-profile-picture">
                                <img src={currentFriendProfilePicture} alt={currentFriendProfilePicture?.first_name} />
                            </div>
                            <div className="friend-profile-name">
                                <h2>{currentFriendName}</h2>
                                <p>{friends.find(friend => friend.name === currentFriendName)?.online ? 'Online' : 'Offline'}</p>
                                <div className='chat-container-dots'><FaEllipsisV /></div>
                            </div>
                        </div>
                        <div className="chat-messages">
                            {allMessages.reverse().map((message, index) => (
                                <ChatMessage
                                    text={message.message}
                                    isSentByUser={message.from_userId === userId}
                                    timestamp={message.timestamp}
                                    user={user}
                                    key={index}
                                    profilePicture={currentFriendProfilePicture}
                                />
                            ))}
                        </div>
                        {
                            !showAudioRecoder ? (
                                <div className="chat-input-bar">
                                    <input
                                        className="chat-input-textarea"
                                        type="text"
                                        placeholder="Your message"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button className="msg-send-button" onClick={addMessage}>
                                        <FaPaperPlane />
                                    </button>
                                    <button className="mic-button" title='record' onClick={() => setShowAudioRecoder(true)}>
                                        <FaMicrophone />
                                    </button>
                                </div>
                            ) : (
                                <div className="chat-input-bar">
                                    {null}
                                    {/* <button className="mic-button" title='record' onClick={() => setShowAudioRecoder(false)}>
                                        <FaMicrophone />
                                    </button> */}
                                </div>
                            )
                        }
                        {showAudioRecoder && <CaptureAudio hide={setShowAudioRecoder} user={user}/>}
                    </div>
                </>
            )}
        </div>
    );
}

export default Messages;
