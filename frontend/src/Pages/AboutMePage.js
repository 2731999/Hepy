import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import axios from 'axios';

const GenderSelector = () => {
  const genderOptions = ['Woman', 'Man', 'Other'];
  const interestOptions = ['Woman', 'Man', 'All'];
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies("user1")
  const [formData, setFormData] = useState({ user_id: cookies.UserId, });
  const [error, setError] = useState('');


  const handleGenderClick = (gender) => {
    setSelectedGender(gender);
    if (gender === 'Man') {
      document.documentElement.classList.add('change-to-boy-color');
    } else {
      document.documentElement.classList.remove('change-to-boy-color');
    }
  };


  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleContinueClick = async (e) => {
    e.preventDefault();
    if (!selectedGender || selectedInterests.length === 0) {
      setError('Please select your gender and interests.');
      return;
    }
    try {
      const response = await axios.put('https://hepy-web-backend.vercel.app//user1', {
        formData: {
          user_id: formData.user_id,
          gender: selectedGender,
          interests: selectedInterests.join(',')
        },
      });
      const success = response.status === 200;
      if (success) {
        navigate('/Passion');
      }
    } catch (err) {
      console.log(err);
    }
  };

  let navigate = useNavigate()


  return (
    <div className='Aboutmehead'>
      <div className="section">
        <h1 className="aboutmeh1">I am a</h1>
        <div className="about-options-container">
          {genderOptions.map((option, idx) => (
            <button
              key={idx}
              className={`option-button ${selectedGender === option ? 'active' : ''
                }`}
              onClick={() => handleGenderClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="section">
        <h1 className="aboutmeh2">Interested in</h1>
        <div className="about-options-container">
          {interestOptions.map((option, idx) => (
            <label
              key={idx}
              className={`option-label ${selectedInterests.includes(option) ? 'active' : ''
                }`}
            >
              <input
                type="checkbox"
                checked={selectedInterests.includes(option)}
                onChange={() => handleInterestToggle(option)}
              />
              {option}
            </label>
          ))}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
      <button className="continue-button" onClick={handleContinueClick}>
        Continue
      </button>
    </div>
  );
};

export default GenderSelector;
