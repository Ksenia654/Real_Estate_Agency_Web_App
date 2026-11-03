import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NewsList.css'; 

const NewsList = ({ news }) => {
    return (
        <ul className="news-list">
            {news.map(item => (
                <li key={item._id} className="news-item">
                    <Link to={`/news/${item._id}`} className="news-link">
                        <h3 className="news-title">{item.title}</h3>
                        <p className="news-content">{item.content.substring(0, 100)}...</p>
                        {item.image && <img className="news-image" src={item.image} alt={item.title} />}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default NewsList;