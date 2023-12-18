import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { auth } from '../firebase/setup';
import { FaAngleLeft } from 'react-icons/fa';
import { FiDelete } from 'react-icons/fi';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NumericKeypad = ({ otp, onOtpChange }) => {
    const handleNumberClick = (number) => {
        if (number === '#') {
            const newOtp = otp.slice(0, -1);
            onOtpChange({ target: { value: newOtp } });
        } else if (otp.length < 6) {
            const newOtp = otp + number;
            onOtpChange({ target: { value: newOtp } });
        }
    };

    return (
        <div className="numeric-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '#'].map((number) => (
                <button
                    key={number}
                    onClick={() => handleNumberClick(number)}
                    className={`numeric-button ${number === 0 ? 'zero' : ''} ${number === '#' ? 'hash' : ''}`}
                >
                    {number === '#' ? <FiDelete /> : number}
                </button>
            ))}
        </div>
    );
};

function Verifications() {
    const [phone, setPhone] = useState('');
    const [user, setUser] = useState({ confirmation: null });
    const [showVerification, setShowVerification] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [cookies, setCookie, removeCookie] = useCookies("user")
    const [verMessage, setVerMessage] = useState(""); 
    const [phoneNumberExists, setPhoneNumberExists] = useState(false); 
    
    const sendOtp = async () => {
        try {
            const checkPhoneNumberResponse = await fetch('https://hepy-backend.vercel.app/check-phone-number-exists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: phone,
                }),
            });
            const checkPhoneNumberData = await checkPhoneNumberResponse.json();
            if (checkPhoneNumberData.exists) {
                setPhoneNumberExists(true);
                setVerMessage('Phone number already exists. Please use different number.');
            } else {
                const recaptcha = new RecaptchaVerifier(auth, 'recaptcha', {});
                const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
                setUser({ confirmation });
                setShowVerification(true);
                startTimer();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const startTimer = () => {
        setTimer(60);
        const interval = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    };

    const handleOtpChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) && value.length <= 6) {
            setOtp(value);
        }
    };


    const verifyOtp = async () => {
        try {
            const { confirmation } = user;
            const data = await confirmation.confirm(otp);

            const savePhoneNumberResponse = await fetch('https://hepy-backend.vercel.app/phone-number', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: data.user.user_id,
                    phoneNumber: phone,
                }),
            });

            console.log('Server Response:', savePhoneNumberResponse);
            const responseData = await savePhoneNumberResponse.json();
            console.log('Server Response Data:', responseData);
            setCookie('AuthToken', responseData.token);
            setCookie('UserId', responseData.userId);

            console.log('Updated Cookies:', cookies);
            navigate('/ProfileDetail');
        } catch (err) {
            console.error(err);
        }
    };


    const navigate = useNavigate();

    return (
        <div className="verificationPage">
            {!showVerification ? (
                <div className="verContent">
                    <h1>My Mobile</h1>
                    <p>Please enter your valid phone number. We will send you a 4-digit code to verify your account.</p>
                    <div className="custom-phone-input">
                        <div className="phone-input-container">
                            <div className="phone-input">
                                <PhoneInput
                                    country={'us'}
                                    value={phone}
                                    onChange={(phone) => setPhone('+' + phone)}
                                />
                            </div>
                        </div>
                    </div>
                    <button className="continueBtn" onClick={sendOtp}>
                        Continue
                    </button>
                    <div id="recaptcha" style={{ marginTop: '30px', marginLeft: '12px' }}></div>
                    {phoneNumberExists && (
                        <p style={{ color: 'black' }}>{verMessage}</p>
                    )}
                </div>
            ) : (
                <div className="verifyOtp">
                    <button className="otpBack" onClick={() => setShowVerification(false)}>
                        <FaAngleLeft />
                    </button>
                    <p className="timer">{timer}</p>
                    <div className="otpPhara">
                        <p className="p1">Type the verification code</p>
                        <p> we've sent you</p>
                    </div>
                    <div className="otp-container">
                        {Array.from({ length: 6 }, (_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={otp[index] || ''}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        ))}
                    </div>
                    <NumericKeypad otp={otp} onOtpChange={handleOtpChange} />
                    <div className="sendBtn">
                        <button className="OTPVerify" onClick={verifyOtp}>
                            Verify OTP
                        </button>
                        <button className="sendAgainBtn" disabled={timer > 0} onClick={sendOtp}>
                            Resend OTP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Verifications;
