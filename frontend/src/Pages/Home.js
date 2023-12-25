import React, { useState } from 'react';
import AuthModal from '../components/AuthModal';
import logo from '../images/hepy-logo.PNG';
import { FaApple } from "react-icons/fa";
import { BsGoogle } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Verifications from './Verification';


const Home = () => {
    const [showLoginPage, setShowLoginPage] = useState(false);
    const [emailSignupBtnOpen, setEmailSignupBtnOpen] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['AuthToken', 'UserId']);
    const navigate = useNavigate();


    const handleContinueClick = () => {
        setShowLoginPage(true);
    };

    const handleEmailSignupClick = () => {
        setEmailSignupBtnOpen(true);
        setIsSignUp(true);
    };

    const handleLoginClick = () => {
        setShowLoginPage(true);
        setIsSignUp(false);
        setEmailSignupBtnOpen(true);
    };

    const handleNumberSignupClick = () => {
        navigate('/Verification')
    };    
    
    return (
        <div className='mainHome'>
            {!showLoginPage ? (
                <div className='homeoverlay'>
                    <div className='home'>
                        <div className='home-logo-container'>
                            <img className='home-logo' src={logo} alt='Logo' />
                        </div>
                        <button className='home-primary-button' onClick={handleContinueClick}>
                            Get started
                        </button>
                    </div>
                </div>
            ) : (
                <div className='auth'>
                    <div className='auth-home'>
                        <div onClick={handleLoginClick}>
                            <button className='home-login-btn' >
                                Login to continue
                            </button>
                        </div>
                        <div className='authLogo-container'>
                            <img className='auth-logo' src={logo} alt='Logo' />
                        </div>
                        <div className='authButtons'>
                            <button className='primary-button' onClick={handleEmailSignupClick}>
                                Continue with email
                            </button>
                            <button className='numberButton' onClick={handleNumberSignupClick}>
                                Use phone number
                            </button>
                        </div>
                    </div>
                    <p className='signUp'>or signup with</p>
                    <div className='signInLogos'>
                        <button className='Signing'><FaFacebookSquare /></button>
                        <button className='Signing'><BsGoogle /></button>
                        <button className='Signing'><FaApple /></button>
                    </div>
                    <div className='authFooter'>
                        <span className='authFooterContent'>Terms of use</span>
                        <span className='authFooterContent'>Privacy Policy</span>
                    </div>
                </div>
            )}
            {emailSignupBtnOpen && (
                <AuthModal setShowModal={setEmailSignupBtnOpen} isSignUp={isSignUp} />
            )}
        </div>
    );
}

export default Home;
