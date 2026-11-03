import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NewsDetail from '../components/NewsDetail';

const NewsDetailPage = () => {
    const { id } = useParams();
    const [newsItem, setNewsItem] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchNewsItem = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/articles/${id}`);
            setNewsItem(response.data);
        } catch (err) {
            console.error("Error fetching news item:", err);
            setError("Failed to load news item.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsItem();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!newsItem) return <div>News not found</div>;

    return (
        <div>
            {/* пробрасываем fetchNewsItem вниз */}
            <NewsDetail newsItem={newsItem} fetchNews={fetchNewsItem} />
        </div>
    );
};

export default NewsDetailPage;
