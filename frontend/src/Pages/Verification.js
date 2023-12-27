import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { auth } from '../firebase/setup';
import { FaAngleLeft } from 'react-icons/fa';
import { FiDelete } from 'react-icons/fi';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { FaMinus } from 'react-icons/fa';
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
    const [isVarContainerOpen, setisVarContainerOpen] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const [loading, setLoading] = useState(false);
    const [otpVerificationError, setOtpVerificationError] = useState(null);
    const [error, setError] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)

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
            setLoading(true);

            const { confirmation } = user;
            const data = await confirmation.confirm(otp);
            if (!data.success) {
                if (!loading) {
                    togglediscoverFilter();
                }
            } else {
                setOtpVerificationError(null);
                console.error('OTP verification failed');
            }
        } catch (err) {
            setOtpVerificationError('Invalid OTP. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isSignUp && (password !== confirmPassword)) {
                setError('Passwords need to match!');
                return;
            }

            const response = await axios.post('https://hepy-backend.vercel.app/phone-number', {
                email,
                password,
                phoneNumber: phone,
            });

            setCookie('AuthToken', response.data.token);
            setCookie('UserId', response.data.userId);

            const success = response.status === 201;
            if (success && isSignUp) navigate('/ProfileDetail');

            setError(null);

            window.location.reload();

        } catch (error) {
            console.log(error);

            if (error.response.status === 400) {
                setError('Invalid email or password. Please try again.');
            } else if (error.response.status === 404 && !isSignUp) {
                setError('Email not found. Please check your email or sign up.');
            } else if (error.response.status === 409) {
                setError('Email already used. Please login');
            } else {
                setError('Email already used. Please login');
            }
        }
    }


    const togglediscoverFilter = () => {
        setisVarContainerOpen(!isVarContainerOpen);
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
                    <button className="verContinueBtn" onClick={sendOtp}>
                        Continue
                    </button>
                    <div id="recaptcha" style={{ marginTop: '30px'}}></div>
                    {phoneNumberExists && (
                        <p style={{ color: 'black' }}>{verMessage}</p>
                    )}
                </div>
            ) : (
                <div className="verifyOtp" style={{ height: "65vh"}}>
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
                        <button className="OTPVerify" onClick={verifyOtp} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button className="sendAgainBtn" disabled={timer > 0} onClick={sendOtp}>
                            Resend OTP
                        </button>
                        {otpVerificationError && (
                            <p style={{ color: 'black' }}>{otpVerificationError}</p>
                        )}
                    </div>
                </div>
            )}
            {isVarContainerOpen && (
                <div className="varOverlay" onClick={togglediscoverFilter}></div>
            )}
            {isVarContainerOpen ? (
                <div className='var-outer-container'>
                    <div className="var-container" style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
                        <button className="discoverFilter-toggle-button" onClick={togglediscoverFilter}>
                            <FaMinus />
                        </button>
                        <form onSubmit={handleSubmit} className='var-form'>
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
                                    type="password"
                                    id="confirmpassword"
                                    name="confirm_password"
                                    required={true}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-group-textarea"
                                />
                            </div>
                        </form>
                        <button className="emailVerSubmitBtn" onClick={handleSubmit}>Submit</button>
                        {error && <p style={{ color: 'Black' }}>{error}</p>}
                    </div >
                </div>
            ) : (
                <div className="bottom-button-container"></div>
            )
            }
        </div>
    );
}

export default Verifications;
