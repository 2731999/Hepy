import React from 'react';
import PropTypes from 'prop-types';
import '../index3.css';

const DiscoverCard = ({  user, name, age, imageSrc, onSwipe }) => {
  const swipeConfig = {
    onSwipedLeft: () => onSwipe('left'),
    onSwipedRight: () => onSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  };

  const [firstName, lastName] = name.split(' ');
  const firstLetter = firstName ? firstName[0] : '';
  const lastLetter = lastName ? lastName[0] : '';

  return (
    <div className="discover-card">
       <div className="discover-card-img">
        <img src={imageSrc} alt={'Photo of ' + name} />
      </div>
      <div className="discover-card-details">
        <div className="discover-card-p">
        <p>{firstLetter} {lastLetter}</p>
          <p>{age}</p>
        </div>
        <p className='discover-card-profession'>Profession</p>
      </div>
    </div>
  );
};

DiscoverCard.propTypes = {
  user: PropTypes.object.isRequired,
  imageSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  profession: PropTypes.string.isRequired,
  onSwipe: PropTypes.func.isRequired,
};

export default DiscoverCard;
