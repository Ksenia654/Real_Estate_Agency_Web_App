import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }


        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            setError('Username can only contain letters, numbers, and underscores.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/auth/register', { username, password });
            navigate("/login");
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Registration error', error);
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    value={username}
                    onKeyDown={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className={`form-input ${error.includes('Username') ? 'error' : ''}`}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className={`form-input ${error.includes('Password') ? 'error' : ''}`}
                />
                <button type="submit" className="submit-button">Register</button>
            </form>
        </div>
    );
};

export default Register;
