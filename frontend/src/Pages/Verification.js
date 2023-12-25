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
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)

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


      if (!responseData.success) {
        if (!loading) {
          togglediscoverFilter();
          // navigate('/ProfileDetail');
        }
      } else {
        console.error('OTP verification failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglediscoverFilter = () => {
    setisVarContainerOpen(!isVarContainerOpen);
  };


  async function handleSubmit() {
    try {
      console.log('Before fetch');
      const response = await fetch('https://hepy-backend.vercel.app/phonesignup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Server Response:', response);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Successful Response Data:', responseData);
        if (!responseData.success) {
          navigate('/ProfileDetail');
        } else {
          setError('Server response indicates failure.');
        }
      } else if (response.status === 409) {
        setError('Email already used. Please login.');
      } else {
        setError('Unexpected error during fetch: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      setError('An error occurred. Please try again.');
    }
  }

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
          <div id="recaptcha" style={{ marginTop: '30px', marginLeft: '9px' }}></div>
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
            <button className="OTPVerify" onClick={verifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button className="sendAgainBtn" disabled={timer > 0} onClick={sendOtp}>
              Resend OTP
            </button>
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
            <div className='var-form'>
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
                  name="confirmpassword"
                  required={true}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-group-textarea"
                />
              </div>
            </div>
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
