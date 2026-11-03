import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/Home.css';
import '../App.css';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [catImage, setCatImage] = useState('');
    const [joke, setJoke] = useState('');

    useEffect(() => {
        const fetchCatImage = async () => {
            if (!user) {
                console.warn('User not logged in. Cannot fetch cat image.');
                return;
            }

            try {
                const response = await axios.get('https://api.thecatapi.com/v1/images/search');
                setCatImage(response.data[0].url);
            } catch (error) {
                console.error('Error fetching cat image:', error);
            }
        };

        const fetchJoke = async () => {
            if (!user) {
                console.warn('User not logged in. Cannot fetch joke.');
                return;
            }

            try {
                const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
                if (response.data.type === 'single') {
                    setJoke(response.data.joke);
                } else {
                    setJoke(`${response.data.setup} - ${response.data.delivery}`);
                }
            } catch (error) {
                console.error('Error fetching joke:', error);
            }
        };

        fetchCatImage();
        fetchJoke();
    }, [user]);

    return (
        <div className="home-container">
            <h1>Welcome to our Realtor Agency!</h1>
            <p>Enjoy some cute cat pictures and a random joke!</p>

            {user ? (
                <>
                    <h2>Random Cat Image</h2>
                    {catImage && <img src={catImage} alt="Cute Cat" className="cat-image" />}

                    <h2>Random Joke</h2>
                    {joke && <p className="joke-text">{joke}</p>}
                </>
            ) : (
                <p>Please log in to see cat images and jokes!</p>
            )}
        </div>
    );
};

export default Home;