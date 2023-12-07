import React, { useState } from 'react';
import QuestionOptionComponent from '../components/QuestionOptionComponent';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

function QuestionOption() {
    const [selectedQO, setSelectedQO] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies("user1")
    const [formData, setFormData] = useState({ user_id: cookies.UserId, });


    const handleQOSelect = (option) => {
        setSelectedQO(option);
    };

    const QuestionOptionBtnClick = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('https://hepy-backend.vercel.app/user4', {
                formData: {
                    user_id: formData.user_id,
                    QO: selectedQO, 
                },
            });
            const success = response.status === 200;
            if (success) {
                navigate('/Discover');
            }
        } catch (err) {
            console.log(err);
        }
    };
    

    const navigate = useNavigate();

    // Replace with your daily question and options
    const question = "What color do you like?";
    const options = ["Red", "Blue"];

    return (
        <div className="QuestionOption">
            <QuestionOptionComponent
                question={question}
                options={options}
                selectedQO={selectedQO}
                onQOSelect={handleQOSelect}
            />

            <p className='questionOptionp2'>Your answers will help us find you a better match. This information will not be shared
                with any of the users directly.</p>

            <button className='QuestionOptionBtn' onClick={QuestionOptionBtnClick}>Continue</button>
        </div>
    );
}

export default QuestionOption;
