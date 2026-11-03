import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/AuthLinks.css";

const Auth = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="auth-links">
            {user ? (
                <>
          <span className="username">
            {user.username} <span className="role">({user.role})</span>
          </span>
                    <button className="logout-button" onClick={logout}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" className="auth-link">Login</Link>
                    <Link to="/register" className="auth-link">Register</Link>
                </>
            )}
        </div>
    );
};

export default Auth;
