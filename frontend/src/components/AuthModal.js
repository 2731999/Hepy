import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'


const AuthModal = ({ setShowModal, isSignUp }) => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies("user")

    let navigate = useNavigate()

    console.log(email, password, confirmPassword)

    const handleClick = () => {
        setShowModal(false)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp && (password !== confirmPassword)) {
                setError('Passwords need to match!');
                return;
            }

            const response = await axios.post(`https://hepy-web-backend.vercel.app//${isSignUp ? 'signup' : 'login'}`, { email, password });

            setCookie('AuthToken', response.data.token);
            setCookie('UserId', response.data.userId);

            const success = response.status === 201;
            if (success && isSignUp) navigate('/ProfileDetail');
            if (success && !isSignUp) navigate('/Discover');

            setError(null);

            window.location.reload();

        } catch (error) {
            console.log('Error:', error);

            if (error.response) {
                console.log('Response Status:', error.response.status);
                console.log('Response Data:', error.response.data);
            }

            if (error.response.status === 400) {
                setError('Invalid email or password. Please try again.');
            } else if (error.response.status === 404 && !isSignUp) {
                setError('Email not found. Please check your email or sign up.');
            } else if (error.response.status === 409) {
                setError('Email already used. Please login');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    }

    return (
        <div className="emailSignup-container">
            <div className="form-close-icon" onClick={handleClick}>ⓧ</div>
            <h2>{isSignUp ? 'SIGN UP' : 'LOG IN'}</h2>
            <form onSubmit={handleSubmit} className="emailVerificationForm">
                <h5>Email</h5>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <h5>Password</h5>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isSignUp && (
                    <div>
                        <h5>Confirm Password</h5>
                        <input
                            type="password"
                            id="password-check"
                            name="password-check"
                            placeholder="confirm password"
                            required={true}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}
                <div className='auth-footer'>
                    <button type="submit" className="emailVerSubmitBtn">Submit</button>
                    <p>{error}</p>
                </div>
            </form>
        </div>
    )
}
export default AuthModal
