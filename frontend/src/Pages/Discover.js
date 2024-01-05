import React, { useState, useEffect, useRef } from 'react';
import { FaAngleLeft, FaComment, FaStar, FaUserAlt, FaClone, FaHeart, FaTimes } from 'react-icons/fa';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { Country } from "country-state-city";
import DiscoverCard from '../components/Discovercard';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Select from 'react-select';
import { FaMinus } from 'react-icons/fa';
import '../index3.css';
import { useNavigate } from 'react-router-dom';

function calculateAge(dob) {
  const dobDate = new Date(dob);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - dobDate.getFullYear();
  return age;
}

function Discover() {
  const [user, setUser] = useState(null)
  const [genderedUsers, setGenderedUsers] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [likedProfiles, setLikedProfiles] = useState([]);
  const userId = cookies.UserId

  const getUser = async () => {
    try {
      const response = await axios.get('https://hepy-backend.vercel.app/user', {
        params: { userId }
      })
      setUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getGenderedUsers = async () => {
    try {
      if (user && user.Interested_in) {
        const response = await axios.get('https://hepy-backend.vercel.app/gendered-users', {
          params: { gender: user.Interested_in }
        })
        setGenderedUsers(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser()
  }, [userId]);

  useEffect(() => {
    if (user) {
      getGenderedUsers()
    }
  }, [user]);

  console.log(genderedUsers)

  const [CardData, setCardData] = useState([]);
  const countries = Country.getAllCountries();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const swipeCardRef = useRef([]);
  const [isdiscoverFilterOpen, setIsdiscoverFilterOpen] = useState(false);
  const [cardOrder, setCardOrder] = useState(CardData.map(card => card.id).reverse());


  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction}`);
    setGenderedUsers((prevUsers) => prevUsers.slice(1));
    setIsChatOpen(false);
  };


  const handleHeartClick = () => {
    if (genderedUsers.length > 0) {
      setGenderedUsers((prevUsers) => prevUsers.slice(0, prevUsers.length - 1));
    }
  }

  const handleLeftSwipe = () => {
    if (genderedUsers.length > 0) {
      setGenderedUsers((prevUsers) => prevUsers.slice(0, prevUsers.length - 1));
    }
  }

  const handleRightSwipe = () => {
    if (genderedUsers.length > 0) {
      const removedUser = genderedUsers[genderedUsers.length - 1];
      setGenderedUsers((prevUsers) => prevUsers.slice(0, prevUsers.length - 1));
      logRemovedUserMatches(removedUser.user_id);
    }
  }

  const logRemovedUserMatches = (removedUserId) => {
    axios.get('https://hepy-backend.vercel.app/user', { params: { userId: removedUserId } })
      .then((response) => {
        const removedUserMatches = response.data.matches;
        console.log(`Matches for the removed user (ID: ${removedUserId}):`, removedUserMatches);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const updateMatches = async (matchedUserId) => {
    try {
      const response = await axios.put('https://hepy-backend.vercel.app/addmatch', {
        userId,
        matchedUserId
      });

      setGenderedUsers((prevUsers) => prevUsers.slice(0, prevUsers.length - 1));
    } catch (err) {
      console.log(err);
    }
  }


  console.log(user)

  const swiped = (direction, swipedUserId) => {
    if (direction === 'right') {
      updateMatches(swipedUserId)
    }
  }

  const togglediscoverFilter = () => {
    setIsdiscoverFilterOpen(!isdiscoverFilterOpen);
  };

  const handleSelfClick = () => {
    navigate('/Self');
  };

  const handleMessagesClick = () => {
    navigate('/Messages', { state: { likedProfiles } });
  };

  const handleLikesAndSuperlikesClick = () => {
    navigate('/LikesAndSuperLikes');
  };

  let navigate = useNavigate();

  return (
    <>
      {user &&
        <div className="Discover">
          <header>
            <div className="discover-header-container">
              <div className="discover-back-arrow">
                <FaAngleLeft />
              </div>
              <h1>Discover</h1>
              <div className="discover-filter-icon" onClick={togglediscoverFilter}>
                <TbAdjustmentsHorizontal />
              </div>
            </div> 
          </header>
          <main className="discover-card-main">
            <div className="card-stack">
              {genderedUsers?.map((genderedUser, index) => {
                const userImage = genderedUser.Pic && genderedUser.Pic[0];
                const dob = genderedUser.DOB;
                const userAge = dob ? calculateAge(dob) : null;

                return (
                  <div key={genderedUser.user_id} className="card-stack-item">
                    <DiscoverCard
                      name={`${genderedUser.first_name} ${genderedUser.last_name}`}
                      age={userAge}
                      imageSrc={userImage}
                      onSwipe={(dir) => {
                        swiped(dir, genderedUser.user_id);
                        setIsChatOpen(false);
                      }}
                      zIndex={cardOrder.length - index}
                    />
                  </div>
                );
              })}
            </div>
          </main>
          <div className="discover-circle-icons">
            <div className="discover-circle-icon" onClick={handleLeftSwipe}>
              <FaTimes />
            </div>
            <div className="discover-big-circle-icon" onClick={handleHeartClick}>
              <FaHeart />
            </div>
            <div className="discover-star-circle-icon" onClick={() => {
              if (genderedUsers.length > 0) {
                const matchedUserId = genderedUsers[genderedUsers.length - 1].user_id;
                updateMatches(matchedUserId);
              }
            }}>
              <FaStar />
            </div>
          </div>
          <footer className={`discover-footer${isChatOpen ? ' sticky' : ''}`}>
            <div className="discover-footer-icons">
              <a href="#" className="discover-footer-icon" style={{ color: 'var(--hepygirlcolor)' }}>
                <FaClone />
              </a>
              <a href="#" className="discover-footer-icon" onClick={handleMessagesClick}>
                <FaComment />
              </a>
              <a href="#" className="discover-footer-icon" onClick={handleLikesAndSuperlikesClick}>
                <FaStar />
              </a>
              <a href="#" className="discover-footer-icon" onClick={handleSelfClick}>
                <FaUserAlt />
              </a>
            </div>
          </footer>
          {isdiscoverFilterOpen && (
            <div className="discoveroverlay" onClick={togglediscoverFilter}></div>
          )}
          {isdiscoverFilterOpen ? (
            <div className="discoverFilter-container" style={{ borderTopLeftRadius: '25px', borderTopRightRadius: '25px' }}>
              <button className="discoverFilter-toggle-button" onClick={togglediscoverFilter}>
                <FaMinus />
              </button>
              <div>
                <div className='discover-filter-heding'>
                  <h2 >Filters</h2>
                  <button className='discoverFilterBtn'>Clear</button>
                </div>
                <div className='discover-filter-intrest'>
                  <h4>Intrested in</h4>
                  <div className="filter-box-container">
                    <div className="filter-box">Boys</div>
                    <div className="filter-box">Girls</div>
                    <div className="filter-box">All</div>
                  </div>
                </div>
                <div className="discover-filter-location">
                  <label className='discover-filter-locationHead'>Location</label>
                  <Select
                    className='discover-filter-location-select'
                    value={{
                      value: selectedCountry.isoCode,
                      label: selectedCountry.name,
                    }}
                    options={countries.map((country) => ({
                      value: country.isoCode,
                      label: country.name,
                    }))}
                    onChange={(selectedOption) => {
                      const selected = countries.find((country) => country.isoCode === selectedOption.value);
                      setSelectedCountry(selected);
                    }}
                  />
                </div>

                <div className="filter-distance-Input">
                  <div className="filter-distance">
                    <label>
                      Distance
                    </label>
                    <h3>100 Km</h3>
                  </div>
                  <div className="filter-location-input">
                    <input type="range" max='100000' min='0' />
                  </div>
                </div>
                <div className="filter-age-Input">
                  <div className="filter-age">
                    <label>
                      Age
                    </label>
                    <h3>18-35</h3>
                  </div>
                  <div className="filter-age-input flex">
                    <input type="range" max='100000' min='0' />
                  </div>
                </div>
                <button className='discoverFilterclearBtn'>Continue</button>
              </div>
            </div >
          ) : (
            <div className="bottom-button-container"></div>
          )
          }
        </div >
      }
    </>
  );
}

export default Discover;
