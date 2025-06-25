import React, { useState } from 'react';
import axios from 'axios';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

const LoginPopup = ({ setshowLogin }) => {
    const [currState, setCurrState] = useState("Sign Up");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
          const url = currState === "Sign Up" ? 'http://localhost:4000/api/user/register' : 'http://localhost:4000/api/user/login';

            const response = await axios.post(url, data);
            if (currState === "Login") {
                localStorage.setItem('token', response.data.token); // Store JWT token in local storage
                setshowLogin(false); // Close login popup on successful login
            } else {
                // Handle sign-up success (e.g., show a success message or redirect)
                alert('Registration successful');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onSubmitHandler} className='login-popup-container'>
                <div className="login-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setshowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? null : <input name="name" value={data.name} onChange={onChangeHandler} type="text" placeholder='Your name' required />}
                    <input name="email" value={data.email} onChange={onChangeHandler} type="email" placeholder='Your email' required />
                    <input name="password" value={data.password} onChange={onChangeHandler} type="password" placeholder='Your Password' required />
                </div>
                <div className="login-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
                <button type='submit'>{currState}</button>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click Here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                }
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}

export default LoginPopup;
