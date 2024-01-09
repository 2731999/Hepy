import React, { useState, useEffect } from 'react';
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Passion = () => {
  const [selectedpassions, setSelectedpassions] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies("user2")
  const [formData, setFormData] = useState({ user_id: cookies.UserId, });
  const [error, setError] = useState('');
  const passionOptions = ['Shopping', 'Karaoke', 'Photography', 'Yoga', 'Reading', 'Writing', 'Music', 'Travel'];
  const otherOptions = ['Smoking', 'Drinking', 'Children', 'Height', 'Language', 'Distance'];
  const additionalOptions = [
    'Exercise and fitness',
    'Cooking and trying new recipes',
    'Travelling and expolring new places',
    'Reading and books club discussions',
    'Outdoor activities such as hiking, biking and camping',
    'Photography and capturing special moments',
    'Trying new restaurants and discovering different cuisines',
    'Gardening and cultivating plants',
    'Yoga and meditation for relaxation and mindfulness',
    'Art and creativity, such as painting or pottery',
    'Attending live music concert and festivals',
    'Volunteering and giving back to the community',
    'Fashion and personal style',
    'DIY projects and home improvement',
    'Watching and discussing movies and TV shows',
    'Socializing and spending time with friends and loved onces',
    'Personal developent and self improvement',
    'Writing and journaling',
    'Interiror design and home decor',
    'Mindfulness and practicing gratitude',
    'Pets and animal welfaree',
    'Wine testing and exploring different types of wine',
    'Sustainable living and eco friendly practices',
    'Collectinf and trading various items or objects',
    'Fashion blogging and keeping up with the latest trends',
  ];

  const halfLength = Math.ceil(passionOptions.length / 2);
  const firstRowOptions = passionOptions.slice(0, halfLength);
  const secondRowOptions = passionOptions.slice(halfLength);

  const handlepassionToggle = (passion) => {
    if (selectedpassions.includes(passion)) {
      setSelectedpassions(selectedpassions.filter((item) => item !== passion));
    } else {
      setSelectedpassions([...selectedpassions, passion]);
    }
  };

  const handlePassionClick = async () => {
    if (selectedpassions.length < 3) {
      setError('Please select at least 3 options.');
      return;
    }

    try {
      const response = await axios.put('https://hepy-backend.vercel.app/user2', {
        formData: {
          user_id: formData.user_id,
          passions: selectedpassions,
        },
      });
      const success = response.status === 200;
      if (success) {
        navigate('/MorePhotos');
      }
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    const rootElement = document.documentElement;

    const handleClassChange = () => {
      if (rootElement.classList.contains('change-to-boy-color')) {
        rootElement.classList.add('passion-boy-color');
      } else {
        rootElement.classList.remove('passion-boy-color');
      }
    };
    rootElement.addEventListener('transitionend', handleClassChange);
    return () => {
      rootElement.removeEventListener('transitionend', handleClassChange);
    };
  }, []);

  const handleAboutmeSkipClick = () => {
    window.location.href = '/MorePhotos';
  };

  const handleAboutmeArrowClick = () => {
    window.location.href = '/AboutMePage';
  };

  let navigate = useNavigate()

  return (
    <div className="Passion">
      <header className="passionHeader">
        <div className="passionArrow" onClick={handleAboutmeSkipClick}><FaAngleLeft /></div>
        <div className="passionSkip" onClick={handleAboutmeArrowClick}>Skip</div>
      </header>
      <div>
        <h1 className="passionh1">Your interests</h1>
        <p className='passionPhara1'>Select a few of your interests and let everyone know what you are passionate about.</p>
      </div>
      <div className="passion-options-container">
        <div className="passion-options-inner-container">
          {firstRowOptions.map((option, idx) => (
            <label
              key={idx}
              className={`passion-option-label ${selectedpassions.includes(option) ? 'active' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedpassions.includes(option)}
                onChange={() => handlepassionToggle(option)}
              />
              {option}
            </label>
          ))}
        </div>
        <div className="passion-options-inner-container">
          {secondRowOptions.map((option, idx) => (
            <label
              key={idx}
              className={`passion-option-label ${selectedpassions.includes(option) ? 'active' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedpassions.includes(option)}
                onChange={() => handlepassionToggle(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      <div className="extra-options-container">
        {otherOptions.map((option, idx) => (
          <label
            key={idx}
            className={`extra-option-label ${selectedpassions.includes(option) ? 'active' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedpassions.includes(option)}
              onChange={() => handlepassionToggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
      <div className='passion-content'>
        <div className='passion-additional-options'>
          {additionalOptions.map((option, idx) => (
            <label
              key={idx + otherOptions.length}
              className={`additional-option-label ${selectedpassions.includes(option) ? 'active' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedpassions.includes(option)}
                onChange={() => handlepassionToggle(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      <div className='passion-footer'>
        <div className='passionPhara2'>
          <p className='passionP'>We understand that your likes and dislikes can change over time.</p>
          <p>You can change this information later on.</p>
        </div>
        <button className="passion-continue-button" onClick={handlePassionClick}>
          Continue
        </button>
        {error && <div className="passion-error-message">{error}</div>}
      </div>
    </div>

  );
};

export default Passion;
