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
                if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
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
                    return imageData.url;
                } else {
                    return null;
                }
            });

            const imageUrls = await Promise.all(promises);

            setPic(imageUrls);
            console.log(imageUrls); 
            setselectedPic(newselectedPic);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePhotosContinue = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('https://hepy-backend.vercel.app/user3', {
                formData: {
                    user_id: formData.user_id,
                    pic: pic, 
                },
            });
    
            const success = response.status === 200;
            if (success) {
                localStorage.setItem("userInfo", JSON.stringify(response.data));
                navigate('/InviteFriends');
                console.log(response.data);
            }
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
