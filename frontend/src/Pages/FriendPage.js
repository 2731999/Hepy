import React, { useState, useEffect } from 'react';
import { FaComment } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { FaUserAlt } from 'react-icons/fa';
import { FaClone } from 'react-icons/fa';
import GirlDp from '../images/GirlDp.png';
import { FaHeart } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { CiLocationOn } from 'react-icons/ci';
import { FiSend } from 'react-icons/fi';

const FriendPage = () => {
    const location = useLocation();
    const clickedProfile = location.state && location.state.clickedProfile;
    const clickedPassions = clickedProfile && clickedProfile.user ? clickedProfile.user.Passions : [];
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [smallPhotos, setSmallPhotos] = useState([
        { src: '', caption: '' },
        { src: '', caption: '' },
        { src: '', caption: '' },
    ]);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [photos, setPhotos] = useState([]);

    const toggleShowAllPhotos = () => {
        setShowAllPhotos(!showAllPhotos);
    };

    const [showMore, setShowMore] = useState(false)
    const [interests, setInterests] = useState([]);

    useEffect(() => {
        if (clickedProfile && clickedProfile.user && clickedProfile.user.Passions) {
            console.log('Setting interests:', clickedProfile.user.Passions);
            setInterests(clickedProfile?.user?.Passions || []);
            console.log('Clicked Profile:', clickedProfile);
        } else {
            console.error('clickedProfile or its user or Passions is null or undefined');
        }
    }, [clickedProfile]);

    useEffect(() => {
        if (clickedProfile && clickedProfile.user && clickedProfile.user.Pic) {
            console.log('Setting photos:', clickedProfile.user.Pic);
            setPhotos(clickedProfile.user.Pic);
            setSmallPhotos([
                { src: clickedProfile.user.Pic[0], caption: '' },
                { src: clickedProfile.user.Pic[1], caption: '' },
                { src: clickedProfile.user.Pic[2], caption: '' },
            ]);
        } else {
            console.error('clickedProfile or its user or Pic is null or undefined');
        }
    }, [clickedProfile]);

    const handleReadMoreClick = () => {
        setShowMore(!showMore);
    };

    const handleSelfClick = () => {
        window.location.href = '/Self';
    };

    const handleLikesAndSuperlikesClick = () => {
        window.location.href = '/LikesAndSuperLikes';
    };

    const handleMessagesClick = () => {
        window.location.href = '/Messages';
    };
    const handleDiscoverClick = () => {
        window.location.href = '/Discover';
    };

    return (
        <div className='friend-main'>
            <div className="friend-profile-container">
                <div className="friend-profile-picture">
                    <div className="friend-picture">
                        <img src={clickedProfile?.user?.Pic[0]} alt="User Profile" />
                    </div>
                    <div className="friend-circles-picture">
                        <div className="friend-first-circle"><FaTimes /></div>
                        <div className="friend-second-circle"><FaHeart /></div>
                        <div className="friend-third-circle"><FaStar /></div>
                    </div>
                    <div className="friend-page-header">
                        <div className="friend-profile-info">
                            <p className="friend-user-info">{clickedProfile?.name}</p>
                            <p className="friend-user-info">{clickedProfile?.age}</p>
                            <p className="friend-user-profession">Profession</p>
                        </div>
                        <div className='friendpage-message-btn'>
                            <FiSend />
                        </div>
                    </div>
                </div>
                <div className="friend-location-subscription">
                    <h3>Location</h3>
                    <div className='friend-distance'>
                        <CiLocationOn />
                        <h5>{clickedProfile?.distance} km</h5>
                    </div>
                </div>
                <p className='friend-location-subscription-phara'>Chicago, United state</p>
                <div className="friend-about">
                    <h3>About</h3>
                    <p>
                        This is a brief paragraph about the user and their profile. Can
                        {showMore ? (
                            <>
                                add more details here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Mauris vitae ullamcorper lectus. Sed in ex id elit congue finibus. Nullam
                                vehicula euismod sem, ac posuere nisl faucibus eu.
                            </>
                        ) : null}
                    </p>
                    <button onClick={handleReadMoreClick}>
                        {showMore ? 'Read Less' : 'Read More'}
                    </button>
                </div>
                <div className="friend-interests">
                    <div className='friend-intrests-head'>
                        <h2>Interests</h2>
                    </div>
                    <div className="friend-small-interest-boxes">
                        {interests.map((interest, index) => (
                            <div className="friend-small-interest-box" key={index}>
                                {interest}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="friend-gallery">
                    <div className="friend-gallery-heading">
                        <h2>Gallery</h2>
                        <button onClick={toggleShowAllPhotos}>
                            {showAllPhotos ? 'Show Less' : 'Show All'}
                        </button>
                    </div>
                    <div className="friend-big-boxes">
                        {photos.slice(0, 2).map((photo, index) => (
                            <div className="friend-big-photo-box" key={index}>
                                <img src={photo} alt={''} />
                            </div>
                        ))}
                    </div>
                    <div className="friend-small-photo-boxes">
                        {showAllPhotos
                            ? photos.slice(2).map((photo, index) => (
                                <div className="friend-small-photo-box" key={index}>
                                    <img src={photo} alt={''} />
                                </div>
                            ))
                            : photos.slice(2, 5).map((photo, index) => (
                                <div className="friend-small-photo-box" key={index}>
                                    <img src={photo} alt={''} />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <footer className={`friendPage-footer${isChatOpen ? ' sticky' : ''}`}>
                <div className="friendPage-footer-icons">
                    <a href="#" className="friendPage-footer-icon" onClick={handleDiscoverClick}>
                        <FaClone />
                    </a>
                    <a href="#" className="friendPage-footer-icon" onClick={handleMessagesClick}>
                        <FaComment />
                    </a>
                    <a href="#" className="friendPage-footer-icon" onClick={handleLikesAndSuperlikesClick}>
                        <FaStar />
                    </a>
                    <a href="#" className="friendPage-footer-icon" onClick={handleSelfClick}>
                        <FaUserAlt />
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default FriendPage;
