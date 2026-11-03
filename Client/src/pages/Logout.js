import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await fetch('http://localhost:5000/api/users/logout', {
                    method: 'POST',
                    credentials: 'include',
                });
                navigate('/');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        logoutUser();
    }, [navigate]);

    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
};

export default Logout;