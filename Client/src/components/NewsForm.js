import React, { Component } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/NewsForm.css';

class NewsForm extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            image: '',
            error: '',
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, error: '' });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { title, content, image } = this.state;

        if (!title || !content) {
            this.setState({ error: 'Title and content are required.' });
            return;
        }

        if (image && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(image)) {
            this.setState({ error: 'Image URL must be a valid image link.' });
            return;
        }

        const newsData = { title, content, image };

        try {
            await axios.post('http://localhost:5000/api/articles', newsData, {
                headers: { "x-auth-token": localStorage.getItem("token") },
            });

            if (typeof this.props.fetchNews === 'function') {
                this.props.fetchNews();
            }

            this.setState({ title: '', content: '', image: '', error: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to add news. Please try again.';
            this.setState({ error: errorMsg });
            console.error('News submission error', error);
        }
    };

    render() {
        const { title, content, image, error } = this.state;
        const { user } = this.context;


        if (!user || user.role !== "admin") return null;

        return (
            <form className="news-form" onSubmit={this.handleSubmit}>
                <h2>Add News</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={this.handleChange}
                    placeholder="Title"
                    required
                    className="form-input"
                />
                <textarea
                    name="content"
                    value={content}
                    onChange={this.handleChange}
                    placeholder="Content"
                    required
                    className="form-textarea"
                />
                <input
                    type="text"
                    name="image"
                    value={image}
                    onChange={this.handleChange}
                    placeholder="Image URL"
                    className="form-input"
                />
                <button type="submit" className="submit-button">Add News</button>
            </form>
        );
    }
}

export default NewsForm;

