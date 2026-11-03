import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import NewsList from './NewsList';
import NewsForm from './NewsForm';
import { AuthContext } from '../context/AuthContext';
import '../styles/NewsContainer.css';

const NewsContainer = () => {
    const [news, setNews] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchNews = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/articles');
            setNews(response.data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <div className="news-container">
            <h1 className="news-title">News</h1>
            {user && <NewsForm fetchNews={fetchNews} />}
            <NewsList news={news} />
        </div>
    );
};

export default NewsContainer;
