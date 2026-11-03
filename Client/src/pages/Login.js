import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../styles/Login.css'; // Path to styles

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        try {
            await login(username, password);
            navigate("/");
        } catch (error) {
            console.error('Login failed', error);
            setError('Login failed. Please check your credentials.');
        }
    };

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        window.location.href = "http://localhost:5000/auth/google";
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    className={`form-input ${error.includes('Password') || error.includes('credentials') ? 'error' : ''}`}
                />
                <button type="submit" className="submit-button">Login</button>
                <button onClick={handleGoogleLogin} className="google-button">
                    Login with Google
                </button>
            </form>
        </div>
    );
};

export default Login;

