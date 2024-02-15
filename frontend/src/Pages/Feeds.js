import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { AiFillMessage } from 'react-icons/ai';
import { IoNotifications } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import logo from '../images/hepy-logo.PNG';
import PostLikedList from '../components/PostLikedList';
import axios from 'axios';

const Feeds = () => {
    const [newPostContent, setNewPostContent] = useState('');
    const [selectedImageName, setSelectedImageName] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies("postFeedImg");
    const [formData, setFormData] = useState({ user_id: cookies.UserId, image: '' });
    const [image, setImage] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [likedPosts, setLikedPosts] = useState([]);
    const [commentVisible, setCommentVisible] = useState(false);
    const [commentVisibleIndex, setCommentVisibleIndex] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [feedUserDetails, setFeedUserDetails] = useState(null);
    const [userListData, setUserListData] = useState([]);
    const location = useLocation();
    const userId = cookies.UserId


    const handleLike = async (index) => {
        try {
            if (!likedPosts[index]) {
                const response = await axios.post(`http://localhost:5000/likePost/${allPosts[index]._id}`);
                if (response.status === 200) {
                    const updatedPosts = [...allPosts];
                    updatedPosts[index].isLikedByCurrentUser = true;
                    updatedPosts[index].likes += 1;
                    setAllPosts(updatedPosts);

                    const updatedLikedPosts = [...likedPosts];
                    updatedLikedPosts[index] = true;
                    setLikedPosts(updatedLikedPosts);
                } else {
                    console.error('Failed to like the post');
                }
            } else {
                console.log('Post already liked');
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleUnlike = async (index) => {
        try {
            if (likedPosts[index]) {
                const response = await axios.post(`http://localhost:5000/unlikePost/${allPosts[index]._id}`);
                if (response.status === 200) {
                    const updatedLikedPosts = [...likedPosts];
                    updatedLikedPosts[index] = false;
                    setLikedPosts(updatedLikedPosts);

                    const updatedPosts = [...allPosts];
                    updatedPosts[index].isLikedByCurrentUser = false;
                    updatedPosts[index].likes -= 1;
                    setAllPosts(updatedPosts);
                } else {
                    console.error('Failed to unlike the post');
                }
            } else {
                console.log('Post is not liked');
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleComment = (index) => {
        setCommentVisibleIndex(commentVisibleIndex === index ? null : index);
        setCommentContent('');
    };


    const handleCommentInputChange = (e) => {
        setCommentContent(e.target.value);
    };

    const handleCommentSubmit = async (index) => {
        try {
            const response = await axios.post(`http://localhost:5000/saveComment/${allPosts[index]._id}`, {
                userId: cookies.UserId,
                commentContent,
            });

            if (response.status === 201) {
                console.log('Comment submitted successfully:', response.data);
                setCommentVisible(false);
            } else {
                console.error('Failed to save comment');
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handlePostChange = (e) => {
        setNewPostContent(e.target.value);
    };

    const handleImageButtonClick = () => {
        document.getElementById('imageInput').click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        const truncatedName = file ? file.name.substring(0, 4) + '...' : '';
        setSelectedImageName(truncatedName);

        const imageDataURL = file ? URL.createObjectURL(file) : '';

        setFormData({
            ...formData,
            image: imageDataURL,
        });
    };


    const handlePostSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('user_id', cookies.UserId);
            formData.append('content', newPostContent);
            formData.append('image', image);

            const response = await axios.post('http://localhost:5000/postFeedsUpload', formData);
            const success = response.status === 200;

            if (success) {
                localStorage.setItem("userInfo", JSON.stringify(response.data));
                console.log(response.data);
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const formatUploadTime = (timestamp) => {
        const now = new Date();
        const uploadTime = new Date(timestamp);
        const elapsedMilliseconds = now - uploadTime;
        const seconds = Math.floor(elapsedMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} ${days === 1 ? 'day' : 'days'}`;
        } else if (hours > 0) {
            return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
        } else if (minutes > 0) {
            return `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
        } else {
            return `${seconds} ${seconds === 1 ? 'sec' : 'sec'}`;
        }
    };

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user', {
                params: { userId }
            });

            const userGalleryPhotos = (response.data.Pic || []).filter(photo => photo !== null);

            setUser(response.data);
            setFeedUserDetails({
                profilePicture: userGalleryPhotos.length > 0 ? userGalleryPhotos[0] : 'default-profile-image-url',
            });
        } catch (error) {
            console.error(error);
            setFeedUserDetails({
                profilePicture: 'default-profile-image-url',
            });
        }
    };

    useEffect(() => {
        getUser();
    }, []);
    console.log('user', user);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/allPosts');
                const fetchedPosts = response.data;

                const sortedPosts = fetchedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                console.log('Sorted Posts:', sortedPosts);

                setAllPosts(sortedPosts);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllPosts();
    }, []);


    useEffect(() => {
        const initialLikedPosts = allPosts.map(post => post.isLikedByCurrentUser);
        setLikedPosts(initialLikedPosts);
    }, [allPosts]);

    const handleDiscoverClick = () => {
        navigate('/Discover');
    };

    const handleSelfClick = () => {
        navigate('/Self');
    };

    let navigate = useNavigate();

    return (
        <div className="feed-app-container">
            <div className="feed-navbar">
                <div className="feed-header">
                    {/* <img className='auth-logo' src={logo} alt='Logo' /> */}
                    <div className="feed-search-bar">
                        <FaSearch />
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className="feed-icons">
                        <FaHome onClick={handleDiscoverClick}/>
                        <FaRegUserCircle />
                    </div>
                    <div className="feed-icons-l">
                        <FiSettings />
                        <AiFillMessage />
                        <IoNotifications />
                        <FaUser onClick={handleSelfClick} />
                    </div>
                </div>
            </div>

            <div className='feed-containers'>
                <div className='feed-user'>
                    <div className="feed-user-head">
                        <h4>See who likes you</h4>
                        <h4>See all</h4>
                    </div>
                    {user && user.beingLiked && (
                        <div className='feed-user-list'>
                            {user.beingLiked.map(likedUser => (
                                <div key={likedUser.user_id} className="beingLiked-profiles">
                                    <div className='post-circular-container'>
                                        <img src={likedUser.pic || 'default-profile-image-url'} alt="" />
                                    </div>
                                    <p>{likedUser.userName}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="feeds">
                    <div className='feed-post-container'>
                        <div className="feed-post-input-container">
                            <div className="post-circular-container">
                                <img src={feedUserDetails?.profilePicture} alt="" />
                            </div>
                            <textarea
                                className="feed-text"
                                value={newPostContent}
                                onChange={handlePostChange}
                                placeholder="Write your post..."
                            />
                            <button className="feed-post-button" onClick={handlePostSubmit}>
                                Post
                            </button>
                        </div>
                        <div className='feed-posts'>
                            <label className="custom-file-upload">
                                {selectedImageName || 'Image'}
                                <input
                                    id="imageInput"
                                    className="feed-post-image"
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </label>
                            <label className="custom-file-upload">
                                Video
                                <input className="feed-post-image" type="file" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                    </div>
                    <div className='feed-postss'>
                        {allPosts.map((post, index) => (
                            <div className="feed-post" key={index}>
                                <div className="feed-post-header">
                                    <div className='post-pic-name'>
                                        <div className="post-circular-container">
                                            {post.userPic && (
                                                <img
                                                    src={post.userPic}
                                                    alt="User Profile"
                                                    className="post-user-profile-pic"
                                                />
                                            )}
                                        </div>
                                        {post.userName && <p className="post-user-name">{post.userName}</p>}
                                    </div>
                                    <p className="post-upload-time">
                                        {formatUploadTime(post.timestamp)}
                                    </p>
                                </div>
                                <p className='postContent'>{post.content}</p>
                                <div className='feed-img-container'>
                                    {post.image && (
                                        <img
                                            src={`data:image/jpeg;base64,${post.image.toString('base64')}`}
                                            alt="Posted Image"
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                </div>
                                <div className="feed-lc-buttons-container">
                                    <div className="feed-lc-counts">
                                        <p>{post.likes} Likes</p>
                                        <p>{post.comments.length} Comments</p>
                                    </div>
                                    <div className="feed-lc-buttons">
                                        <button
                                            onClick={() => likedPosts[index] ? handleUnlike(index) : handleLike(index)}
                                            className={likedPosts[index] ? 'unlike-button' : 'like-button'}
                                        >
                                            {likedPosts[index] ? 'Unlike' : 'Like'}
                                        </button>
                                        <button onClick={() => handleComment(index)} className='post-comments'>
                                            Comments
                                        </button>
                                    </div>
                                    {commentVisibleIndex === index && (
                                        <div className="post-comment-box">
                                            <div className='feed-lc-comments-container'>
                                                <div className='feed-comments'>
                                                    {post.comments.map((comment, commentIndex) => (
                                                        <div key={commentIndex} className='feed-comment'>
                                                            <div className='comment-header'>
                                                                <p className='comment-username'>{comment.userName} .</p>
                                                                <p className='comment-timestamp'>{formatUploadTime(comment.timestamp)}</p>
                                                            </div>
                                                            <p className='comment-content'>{comment.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='comment-text-box'>
                                                <textarea
                                                    className='post-comment-text'
                                                    placeholder="Write your comment..."
                                                    value={commentContent}
                                                    onChange={handleCommentInputChange}
                                                />
                                                <button onClick={() => handleCommentSubmit(index)}>Send</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='feed-matches'>
                    <div className='feed-matched-user-head'>
                        <h4> Matched User </h4>
                        <h4> See all</h4>
                    </div>
                    <div className='feed-matched-user-list'>
                        {/* Render the matched user list here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feeds;
