import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import Auth from "./Auth";
import { AuthContext } from "../context/AuthContext";
import '../styles/Navbar.css';

const Navbar = () => {
    const [currentDate, setCurrentDate] = useState("");
    const [timeZone, setTimeZone] = useState("");
    const { user } = useContext(AuthContext);

    const handleClick = (page) => {
        console.log(`Navigating to ${page}`);
    };

    useEffect(() => {
        const updateDate = () => {
            const date = new Date();
            setCurrentDate(date.toLocaleString());
            setTimeZone(
                new Intl.DateTimeFormat("en-US", {
                    timeZoneName: "short",
                }).format(date)
            );
        };

        updateDate();
        const intervalId = setInterval(updateDate, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/" onDoubleClick={() => handleClick('Home')}>Home</Link></li>
                <li><Link to="/properties" onMouseDown={() => handleClick('Properties')}>Properties</Link></li>
                <li><Link to="/news" onMouseUp={() => handleClick('News')}>News</Link></li>

                {/* ссылка видна только юзеру */}
                {user?.role === "user" && (
                    <li><Link to="/my-requests" onClick={() => handleClick('My requests')}>My requests</Link></li>
                )}

                {/* ссылки видны только админу */}
                {user?.role === "admin" && (
                    <>
                        <li><Link to="/admin/requests" onClick={() => handleClick('All requests')}>All requests</Link></li>
                        <li><Link to="/admin/deals" onClick={() => handleClick('Deals')}>Deals</Link></li>
                    </>
                )}
            </ul>


            <div className="date-time">
                <p>Current Date: {currentDate}</p>
            </div>
            <div className="date-time">
                <p>Time Zone: {timeZone}</p>
            </div>

            <Auth />
        </nav>
    );
};

export default Navbar;

