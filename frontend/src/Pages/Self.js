import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SelfSmallPhotoBox from '../components/SelfSmallPhotoBox';
import DarkMode from '../components/DarkMode/DarkMode';
import { FaComment } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { FaUserAlt } from 'react-icons/fa';
import { FaClone } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { FaStarOfDavid } from 'react-icons/fa';
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import { MdDarkMode } from 'react-icons/md';
import { BsBrightnessHighFill } from 'react-icons/bs';

function calculateAge(dob) {
    const dobDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - dobDate.getFullYear();
    return age;
}

const Self = () => {

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSettingBtnOpen, setIsSettingBtnOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [selfUserDetails, setSelfUserDetails] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [user, setUser] = useState(null)
    const [interests, setInterests] = useState([]);
    const [largePhotos, setLargePhotos] = useState([]);
    const [smallPhotos, setSmallPhotos] = useState([]);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const userId = cookies.UserId
    const authToken = cookies.AuthToken;

    const handleAddPhoto = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const newPhoto = { src: e.target.result, caption: '' };
                setSmallPhotos((prevPhotos) => [...prevPhotos, newPhoto]);

                try {
                    const data = new FormData();
                    data.append("file", file);
                    data.append("upload_preset", "Hepy-App");
                    data.append("cloud_name", "dbqu0itdj");

                    const response = await fetch(
                        "https://api.cloudinary.com/v1_1/dbqu0itdj/image/upload",
                        {
                            method: "POST",
                            body: data,
                        }
                    );

                    const imageData = await response.json();
                    const imageUrl = imageData.url;

                    console.log('Image URL:', imageUrl);
                    try {
                        const saveResponse = await axios.post('https://hepy-backend.vercel.app/user3', {
                            userId: cookies.UserId,
                            photoUrl: imageUrl,
                        });
                        console.log('Image URL saved to the database:', saveResponse.data);
                    } catch (saveError) {
                        console.log('Error saving image URL to the database:', saveError);
                    }

                } catch (error) {
                    console.log('Error uploading image to Cloudinary:', error);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const ConfirmationModal = ({ onConfirm, onCancel }) => {
        return (
            <div className="confirmation-modal">
                <p>Are you sure you want to delete your account?</p>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        );
    };

    const handleDeleteAccount = () => {
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmedDelete = async () => {
        try {
            await axios.delete('https://hepy-backend.vercel.app/user', {
                data: { userId },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            navigate('/');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handleReadMoreClick = () => {
        setShowMore(!showMore);
    };


    const handlePhotoSelect = (selectedFiles, id) => {
        if (selectedFiles.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPhoto = { src: e.target.result, caption: '' };
                const updatedPhotos = smallPhotos.map((photo, index) => {
                    if (index === id) {
                        return newPhoto;
                    }
                    return photo;
                });
                setSmallPhotos(updatedPhotos);
            };
            reader.readAsDataURL(selectedFiles[0]);
        }
    };

    const handleBigPhotoClick = () => {
        const fileInput = document.getElementById('bigPhotoInput');
        if (fileInput) {
            fileInput.click();
        }
    };

    const getUser = async () => {
        try {
            const response = await axios.get('https://hepy-backend.vercel.app/user', {
                params: { userId }
            });
            setUser(response.data);

            const firstName = response.data.first_name;
            const lastName = response.data.last_name;
            const firstLetterFirstName = firstName ? firstName.charAt(0) : '';
            const firstLetterLastName = lastName ? lastName.charAt(0) : '';
            const dob = response.data.DOB;
            const age = dob ? calculateAge(dob) : null;
            setSelfUserDetails({
                firstLetterFirstName,
                firstLetterLastName,
                age,
                profilePicture: response.data.Pic[0],
                passions: response.data.Passions,
                galleryPhotos: response.data.Pic.filter(photo => photo !== null),
            });
            setInterests(response.data.Passions || []);
            const userGalleryPhotos = response.data.Pic.filter(photo => photo !== null) || [];
            setLargePhotos(userGalleryPhotos.slice(0, 4));
            if (userGalleryPhotos.length > 4) {
                setSmallPhotos(userGalleryPhotos.slice(4));
            } else {
                setSmallPhotos([]);
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getUser();
    }, []);
    console.log('user', user);
    const handleSettingClick = () => {
        setIsSettingBtnOpen(!isSettingBtnOpen);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const navigate = useNavigate();

    const handleSelfLogoutClick = () => {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
        window.location.href = '/';
    };

    const handleFriendPageClick = () => {
        window.location.href = '/FriendPage';
    };
    const handleLikesAndSuperlikesClick = () => {
        window.location.href = '/LikesAndSuperLikes';
    };
    const handleMessagesPageClick = () => {
        window.location.href = '/Messages';
    };


    return (

        <div className={`self-main${isDarkMode ? ' dark' : ''}`}>
            <div className={`self-profile-container${isDarkMode ? ' dark' : ''}`}>
                <div className="self-profile-picture">
                    <div className={`self-picture${isDarkMode ? ' dark' : ''}`}>
                        <img src={selfUserDetails?.profilePicture} alt="User Profile" />
                    </div>
                    <div className={`self-profile-info${isDarkMode ? ' dark' : ''}`}>
                        <p className="self-user-info">{selfUserDetails?.firstLetterFirstName}</p>
                        <p className="self-user-info">{selfUserDetails?.firstLetterLastName}</p>
                        <p className="self-user-info">{selfUserDetails?.age}</p>
                        <p className="self-user-profession">Profession</p>
                    </div>
                </div>
                <div className="self-manage-subscription">
                    <h3>Manage Subscriptions</h3>
                </div>
                <div className="self-three-boxes">
                    <div className="self-box-1">
                        <div className='icon-self-box'><FaStarOfDavid /></div>
                        <div class="circle-icon">+</div>
                    </div>
                    <div className="self-box-2">
                        <div className='icon-self-box'><FaHeart /></div>
                        <div class="circle-icon">+</div>
                    </div>
                    <div className="self-box-3">
                        <div className='icon-self-box'><FaStar /></div>
                        <div class="circle-icon">+</div>
                    </div>
                </div>
                <hr />
                <div className="self-your-profile">
                    <h2>Your Profile</h2>
                </div>

                <div className={`self-about${isDarkMode ? ' dark' : ''}`}>
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
                    <button
                        onClick={handleReadMoreClick}
                        className={`selfAboutButton${isDarkMode ? ' dark-button' : ''}`}
                    >
                        {showMore ? 'Read Less' : 'Read More'}
                    </button>

                </div>

                {/* Gallery Section */}
                <div className="self-gallery">
                    <div className='self-gallery-heading'>
                        <h2>Gallery</h2>
                        <label htmlFor="photoInput" className="add-photos-button">
                            Add Photos
                        </label>
                        <input
                            type="file"
                            id="photoInput"
                            accept="image/*"
                            onChange={handleAddPhoto}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div className="self-big-boxes">
                        <div className="self-big-photo-box">
                            <img src={largePhotos[0]} alt="" onClick={handleBigPhotoClick} />
                        </div>
                        <div className="self-big-photo-box">
                            <img src={largePhotos[1]} alt="" onClick={handleBigPhotoClick} />
                        </div>
                        <div className="self-big-photo-box">
                            <img src={largePhotos[2]} alt="" onClick={handleBigPhotoClick} />
                        </div>
                        <div className="self-big-photo-box">
                            <img src={largePhotos[3]} alt="" onClick={handleBigPhotoClick} />
                        </div>
                    </div>
                    <div className="self-small-photo-boxes">
                        {smallPhotos.map((photo, index) => (
                            <SelfSmallPhotoBox
                                key={index}
                                src={photo.src}
                                caption={''}
                                onPhotoSelect={handlePhotoSelect}
                                id={index}
                            />
                        ))}
                    </div>
                </div>
                <div className="self-interests">
                    <div className='self-intrests-head'>
                        <h2>Interests</h2>
                        <button className={`edit-interests-button${isDarkMode ? ' dark' : ''}`}>Edit</button>
                    </div>
                    <div className="self-small-interest-boxes">
                        {interests.map((interest, index) => (
                            <div className="self-small-interest-box" key={index}>
                                {interest}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="self-vertical-buttons-container">
                    <button className="self-vertical-button" onClick={handleSettingClick}>Setting</button>
                    <button className="self-vertical-button">Privacy</button>
                    <button className="self-vertical-button" onClick={handleSelfLogoutClick}>Log out</button>
                </div>
            </div>
            <footer className={`self-footer${isChatOpen ? ' sticky' : ''}${isDarkMode ? ' dark' : ' light'}`}>
                <div className="self-footer-icons">
                    <a href="#" className="self-footer-icon" onClick={handleFriendPageClick}>
                        <FaClone />
                    </a>
                    <a href="#" className="self-footer-icon" onClick={handleMessagesPageClick}>
                        <FaComment />
                    </a>
                    <a href="#" className="self-footer-icon" onClick={handleLikesAndSuperlikesClick}>
                        <FaStar />
                    </a>
                    <a href="#" className="self-footer-icon" style={{ color: 'var(--hepygirlcolor)' }}>
                        <FaUserAlt />
                    </a>
                </div>
            </footer>
            {isSettingBtnOpen && (
                <div className="selfSettingoverlay" onClick={handleSettingClick}></div>
            )}
            {isSettingBtnOpen ? (
                <div className={`selfSetting-container${isDarkMode ? ' dark' : ''}`}>
                    <div>
                        <div className='selfSetting-heading'>
                            <h2 >Setting</h2>
                        </div>
                        <div className='selfSetting-theme'>
                            <h3 className={`selfSettingThemeHead${isDarkMode ? ' dark' : ''}`}>Theme</h3>
                            <DarkMode toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
                        </div>
                        <div className='selfSetting-delete'>
                            <h2>Account</h2>
                            <button
                                className={`selfSettingDeleteBtn${isDarkMode ? ' dark-button' : ''}`}
                                onClick={handleDeleteAccount}
                            >
                                Delete
                            </button>
                        </div>
                        {/* <button className='selfSettingBtn'>Save</button> */}
                    </div>
                </div>
            ) : (
                <div className="bottom-button-container"></div>
            )}
            {isConfirmationModalOpen && (
                <ConfirmationModal
                    onConfirm={handleConfirmedDelete}
                    onCancel={() => setIsConfirmationModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Self;
