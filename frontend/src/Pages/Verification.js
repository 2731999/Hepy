import React, { useState, useEffect } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { AsYouType } from 'libphonenumber-js/min';
import { FaAngleLeft } from 'react-icons/fa';
import { FiDelete } from 'react-icons/fi';

// NumericKeypad component 
const NumericKeypad = ({ otp, onOtpChange }) => {
  const handleNumberClick = (number) => {
    if (number === '#') {
      const newOtp = otp.slice(0, -1);
      onOtpChange({ target: { value: newOtp } });
    } else if (otp.length < 4) {
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

// OtpVerification component
const OtpVerification = ({ setShowOtpPage }) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);


  const handleOtpChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value.length <= 4) {
      setOtp(value);
    }
  };

  const handleSendAgain = () => {
    setTimer(60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <div className='otpPage'>
      <button className='otpBack' onClick={() => setShowOtpPage(false)}><FaAngleLeft /></button>
      <p className="timer">{formatTime(timer)}</p>
      <div className='otpPhara'>
        <p className='p1'>Type the verification code</p>
        <p> we've sent you</p>
      </div>
      <div className='otp-container'>
        {Array.from({ length: 4 }, (_, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={otp[index] || ''}
            onChange={handleOtpChange}
          />
        ))}
      </div>
      <NumericKeypad otp={otp} onOtpChange={handleOtpChange} />
      <div className='sendBtn'>
        <button className='sendAgainBtn' onClick={handleSendAgain} disabled={timer > 0}>
          Send Again
        </button>
      </div>
    </div>
  );
};

// CustomPhoneInput component
const CustomPhoneInput = ({ value, onChange }) => {
  const handleInputChange = (value) => {
    onChange(value);
  };

  return (
    <div className="custom-phone-input">
      <div className="phone-input-container">
        <div className="phone-input">
          <PhoneInput
            international
            defaultCountry="US"
            value={value}
            onChange={handleInputChange}
            placeholder="Enter phone number"
          />
        </div>
      </div>
    </div>
  );
};


// Main component
const Verification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpPage, setShowOtpPage] = useState(false);

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };

  const handleContinue = () => {
    setShowOtpPage(true);
  };

  return (
    <div className="verificationPage">
      {showOtpPage ? (
        <OtpVerification setShowOtpPage={setShowOtpPage} />
      ) : (
        <div className="verContent">
          <h1>My Mobile</h1>
          <p>Please enter your valid phone number. We will send you a 4-digit code to verify your account.</p>
          <CustomPhoneInput value={phoneNumber} onChange={handlePhoneNumberChange} />
          <button className="continueBtn" onClick={handleContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default Verification;

