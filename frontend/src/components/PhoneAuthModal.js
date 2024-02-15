import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Select from 'react-select';

const PhoneAuthModal = ({ setShowModal, isSignUp }) => {
    const [selectedCountry, setSelectedCountry] = useState({ label: '+1 (US)', value: '+1' }); // Default country code
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const navigate = useNavigate();

    const handleClick = () => {
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const phoneNumberWithCountryCode = `${selectedCountry.value}${phoneNumber}`;

            const response = await axios.post(
                'https://hepy-web-backend.vercel.app//phonelogin',
                { phone_number: phoneNumberWithCountryCode, password }
            );

            const success = response.status === 201;

            if (success) {
                setCookie('AuthToken', response.data.token);
                setCookie('UserId', response.data.userId);
                navigate('/Discover');
            } else {
                setError('Invalid phone number or password. Please try again.');
            }
        } catch (error) {
            console.log(error);
            setError('Phone Number not exist. Please signup.');
        }
    };    

    const formatPhoneNumber = (input) => {
        return input;
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: '400%',
        }),
    };

    // List of country options
    const countryOptions = [
        { label: 'United States (+1)', value: '+1' },
        { label: 'China (+86)', value: '+86' },
        { label: 'India (+91)', value: '+91' },
        { label: 'Indonesia (+62)', value: '+62' },
        { label: 'Pakistan (+92)', value: '+92' },
        { label: 'Brazil (+55)', value: '+55' },
        { label: 'Nigeria (+234)', value: '+234' },
        { label: 'Bangladesh (+880)', value: '+880' },
        { label: 'Russia (+7)', value: '+7' },
        { label: 'Mexico (+52)', value: '+52' },
        { label: 'Japan (+81)', value: '+81' },
        { label: 'Ethiopia (+251)', value: '+251' },
        { label: 'Philippines (+63)', value: '+63' },
        { label: 'Egypt (+20)', value: '+20' },
        { label: 'Vietnam (+84)', value: '+84' },
        { label: 'DR Congo (+243)', value: '+243' },
        { label: 'Turkey (+90)', value: '+90' },
        { label: 'Iran (+98)', value: '+98' },
        { label: 'Germany (+49)', value: '+49' },
        { label: 'Thailand (+66)', value: '+66' },
        { label: 'United Kingdom (+44)', value: '+44' },
        { label: 'France (+33)', value: '+33' },
        { label: 'Italy (+39)', value: '+39' },
        { label: 'South Africa (+27)', value: '+27' },
        { label: 'Tanzania (+255)', value: '+255' },
        { label: 'Myanmar (+95)', value: '+95' },
        { label: 'South Korea (+82)', value: '+82' },
        { label: 'Colombia (+57)', value: '+57' },
        { label: 'Kenya (+254)', value: '+254' },
        { label: 'Spain (+34)', value: '+34' },
        { label: 'Argentina (+54)', value: '+54' },
        { label: 'Algeria (+213)', value: '+213' },
        { label: 'Ukraine (+380)', value: '+380' },
        { label: 'Sudan (+249)', value: '+249' },
        { label: 'Uganda (+256)', value: '+256' },
        { label: 'Iraq (+964)', value: '+964' },
        { label: 'Poland (+48)', value: '+48' },
        { label: 'Canada (+1)', value: '+1' },
        { label: 'Morocco (+212)', value: '+212' },
        { label: 'Afghanistan (+93)', value: '+93' },
        { label: 'Saudi Arabia (+966)', value: '+966' },
        { label: 'Peru (+51)', value: '+51' },
        { label: 'Angola (+244)', value: '+244' },
        { label: 'Malaysia (+60)', value: '+60' },
        { label: 'Mozambique (+258)', value: '+258' },
        { label: 'Ghana (+233)', value: '+233' },
        { label: 'Yemen (+967)', value: '+967' },
        { label: 'Nepal (+977)', value: '+977' },
        { label: 'Venezuela (+58)', value: '+58' },
        { label: 'Madagascar (+261)', value: '+261' },
        { label: 'Cameroon (+237)', value: '+237' },
        { label: 'Côte d\'Ivoire (+225)', value: '+225' },
        { label: 'North Korea (+850)', value: '+850' },
        { label: 'Australia (+61)', value: '+61' },
        { label: 'Niger (+227)', value: '+227' },
        { label: 'Taiwan (+886)', value: '+886' },
        { label: 'Sri Lanka (+94)', value: '+94' },
        { label: 'Burkina Faso (+226)', value: '+226' },
        { label: 'Mali (+223)', value: '+223' },
        { label: 'Romania (+40)', value: '+40' },
        { label: 'Malawi (+265)', value: '+265' },
        { label: 'Chile (+56)', value: '+56' },
        { label: 'Kazakhstan (+7)', value: '+7' },
        { label: 'Zambia (+260)', value: '+260' },
        { label: 'Guatemala (+502)', value: '+502' },
        { label: 'Ecuador (+593)', value: '+593' },
        { label: 'Syria (+963)', value: '+963' },
        { label: 'Netherlands (+31)', value: '+31' },
        { label: 'Senegal (+221)', value: '+221' },
        { label: 'Cambodia (+855)', value: '+855' },
        { label: 'Chad (+235)', value: '+235' },
        { label: 'Somalia (+252)', value: '+252' },
        { label: 'Zimbabwe (+263)', value: '+263' },
        { label: 'Guinea (+224)', value: '+224' },
        { label: 'Rwanda (+250)', value: '+250' },
        { label: 'Benin (+229)', value: '+229' },
        { label: 'Burundi (+257)', value: '+257' },
        { label: 'Tunisia (+216)', value: '+216' },
        { label: 'Bolivia (+591)', value: '+591' },
        { label: 'Belgium (+32)', value: '+32' },
        { label: 'Cuba (+53)', value: '+53' },
        { label: 'Haiti (+509)', value: '+509' },
        { label: 'Greece (+30)', value: '+30' },
    ];
    
    
    return (
        <div className="emailSignup-container">
            <div className="form-close-icon" onClick={handleClick}>
                ⓧ
            </div>
            <h2>LOG IN</h2>
            <form onSubmit={handleSubmit} className="PhoneVerificationForm">
                <h5>Select county</h5>
                <div className="country-code-dropdown">
                    <Select
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={(option) => setSelectedCountry(option)}
                        isSearchable={true}
                        styles={customStyles} 
                    />
                </div>
                <h5>Phone number</h5>
                <input
                    className='numberVerInput'
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="phone number"
                    required={true}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    value={phoneNumber}
                />
                <h5>Password</h5>
                <input
                    className='numverPasswordVerInput'
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="emailVerSubmitBtn">Submit</button>
                <p>{error}</p>
            </form>
        </div>
    );
};

export default PhoneAuthModal;
