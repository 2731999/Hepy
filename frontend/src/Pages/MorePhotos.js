import React, { useState } from 'react';
import { CgArrowsExchangeAltV } from 'react-icons/cg';
import ImageUploadBox from '../components/ImageUploadBox';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const UploadPhotosComponent = () => {
    const [selectedPic, setselectedPic] = useState(Array(4).fill(null));
    const [cookies, setCookie, removeCookie] = useCookies("user3");
    const [formData, setFormData] = useState({ user_id: cookies.UserId });
    const [pic, setPic] = useState([]);

    const handleFileChange = async (event, index) => {
        try {
            const filesArray = Array.from(event.target.files);
            const newselectedPic = [...selectedPic];
            newselectedPic[index] = filesArray[0];

            const promises = newselectedPic.map(async (file) => {
                if (file) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    return new Promise((resolve) => {
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                    });
                } else {
                    return null;
                }
            });

            const base64Images = await Promise.all(promises);

            setPic(base64Images);
            setselectedPic(newselectedPic);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePhotosContinue = async (e) => {
        e.preventDefault();
        try {
            const chunkSize = 1024 * 1024; // 1MB chunk size
            const totalChunks = Math.ceil(pic.length / chunkSize);
    
            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = (i + 1) * chunkSize;
                const chunk = pic.slice(start, end);
    
                const formData = new FormData();
                formData.append('user_id', cookies.UserId);
                formData.append('pic', chunk);
    
                await axios.put('https://hepy-backend.vercel.app/user3', formData);
            }
    
            // Continue with your logic after all chunks are uploaded
            navigate('/QuestionsPage');
        } catch (error) {
            console.error(error);
        }
    };    
    

    let navigate = useNavigate();

    return (
        <div className="upload-photos-container">
            <div className="photosheader">
                <h1>Upload Photos</h1>
                <div className='more-photos-icon'>
                    <CgArrowsExchangeAltV />
                </div>
            </div>
            <p className='morePhotosP'>Upload the photos you would like to show on your profile.</p>
            <div className="upload-photos-container">
                <div className="file-boxes">
                    <div className="grid-container">
                        {[0, 1, 2, 3].map((index) => (
                            <ImageUploadBox
                                key={index}
                                index={index}
                                onChange={(e) => handleFileChange(e, index)}
                                selectedImage={selectedPic[index]} 
                            />
                        ))}
                    </div>
                </div>
            </div>
            <button className="photos-continue-button" onClick={handlePhotosContinue}>
                Continue
            </button>
        </div>
    );
};

export default UploadPhotosComponent;
