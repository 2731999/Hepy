import React from 'react';
import PropTypes from 'prop-types';
import '../index3.css';
import male_logo from '../images/male_logo.png'; // Replace with the actual path
import female_logo from '../images/female_logo.png'; // Replace with the actual path


const DiscoverCard = ({ user, name, age, imageSrc, onSwipe }) => {
  const swipeConfig = {
    onSwipedLeft: () => onSwipe('left'),
    onSwipedRight: () => onSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  };

  const [firstName, lastName] = name.split(' ');
  const firstLetter = firstName ? firstName[0] : '';
  const lastLetter = lastName ? lastName[0] : '';

  const defaultImage = user && user.gender === 'male' ? male_logo : female_logo;

  return (
    <div className='outer-discover-card'>
      <div className="discover-card">
        <div className="discover-card-img">
          <img
            src={imageSrc || defaultImage}
            alt={'Photo of ' + name}
          />
        </div>
        <div className="discover-card-details">
          <div className="discover-card-p">
            <p>{firstLetter} {lastLetter}</p>
            <p>{age}</p>
          </div>
          <p className='discover-card-profession'>Profession</p>
        </div>
      </div>
    </div>
  );
};

DiscoverCard.propTypes = {
  user: PropTypes.shape({
    gender: PropTypes.string,
  }),
  imageSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  profession: PropTypes.string.isRequired,
  onSwipe: PropTypes.func.isRequired,
};

export default DiscoverCard;
