import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaMinus } from 'react-icons/fa';
import { useCookies } from 'react-cookie';

const ProfileDetails = () => {
    const [cookies, setCookie, removeCookie] = useCookies("user")
    const [selectedDOB, setSelectedDOB] = useState(null);
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectedImages: [null],
        DOB: selectedDOB,
    });

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleImageChange = (index, image) => {
        setFormData((prevUser) => {
            const newSelectedImages = [...prevUser.selectedImages];
            newSelectedImages[index] = URL.createObjectURL(image);
            return {
                ...prevUser,
                selectedImages: newSelectedImages,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put('https://hepy-backend.vercel.app/user', { formData })
            const success = response.status === 200
            if (success) navigate('/Notification')
        } catch (err) {
            console.log(err)
        }
    }
    

    const saveDOB = () => {
        if (selectedDOB) {
            const localMidnightDOB = new Date(
                Date.UTC(selectedDOB.getFullYear(), selectedDOB.getMonth(), selectedDOB.getDate(), 0, 0, 0)
            );

            setFormData({
                ...formData,
                DOB: localMidnightDOB.toISOString(),
            });
        }
        setIsCalendarOpen(false);
    };

    const handleImageClick = (index) => {
        document.getElementById(`imageInput${index}`).click();
    };

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    let navigate = useNavigate()


    return (
        <div className="profile-container">
            <div className='scrollable-container'>
                <h1>Profile Details</h1>
                <div className="slider-container">
                    {formData.selectedImages.map((selectedImage, index) => (
                        <div className="container" key={index} onClick={() => handleImageClick(index)}>
                            <label htmlFor={`imageInput${index}`}>
                                <img
                                    src={selectedImage || 'path/to/default-image.jpg'}
                                    alt={`${index}`}
                                    className="gallery-image"
                                />
                            </label>
                            <input
                                type="file"
                                id={`imageInput${index}`}
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageChange(index, e.target.files[0])}
                            />
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className='form'>
                    <div className="form-group">
                        <label className='formHead'>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className='form-group-textarea'
                        />
                    </div>
                    <div className="form-group">
                        <label className='formHead'>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className='form-group-textarea'
                        />
                    </div>
                    {/* {fullForm && (
                        <>
                            <div className="form-group">
                                <label className="formHead">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required={true}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-group-textarea"
                                />
                            </div>
                            <div className="form-group">
                                <label className="formHead">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required={true}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-group-textarea"
                                />
                            </div>
                            <div className="form-group">
                                <label className="formHead">Confirm Password</label>
                                <input
                                    type="password-check"
                                    id="password-check"
                                    name="password-check"
                                    required={true}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-group-textarea"
                                />
                            </div>
                        </>
                    )} */}
                </form>
            </div>
            <div className='profileDetailFooter'>
                <div className='profilePhara'>
                    <p>Only your initials will be shown to users.</p>
                    <p>Please upload a minimum of 1 photo.</p>
                    <p>Please confirm all details as you cannot change them once you are verified.</p>
                    <p>Terms & conditions</p>
                </div>
                <button type="submit" className="verify-button" onClick={handleSubmit}>
                    Verify
                </button>
                {isCalendarOpen && (
                    <div className="pdoverlay" onClick={toggleCalendar}></div>
                )}
                {isCalendarOpen ? (
                    <div className="calendar-container" style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
                        <div>
                            <div className='react-outer-calendar'>
                                <Calendar onChange={date => setSelectedDOB(date)} />
                            </div>
                            <button className='calendarBtn' onClick={saveDOB}>Save</button>
                        </div>
                        <button className="calendar-toggle-button" onClick={toggleCalendar}>
                            <FaMinus />
                        </button>
                    </div>
                ) : (
                    <div className="bottom-button-container">
                        <button className="calendar-toggle-button" onClick={toggleCalendar}>
                            <FaMinus />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileDetails;
