const express = require('express');
const Article = require('../models/Article');
const auth = require("../middleware/auth");
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const validateArticleData = (title, content, image) => {
    if (!title || !content) {
        return { valid: false, message: 'Title and content are required.' };
    }
    if (image && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(image)) {
        return { valid: false, message: 'Image URL must be a valid image link.' };
    }
    return { valid: true };
};

router.post('/', auth, async (req, res) => {
    const { title, content, image } = req.body;
    
    const validation = validateArticleData(title, content, image);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const newArticle = new Article({ title, content, image });
    
    try {
        const savedArticle = await newArticle.save();
        res.status(201).json(savedArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { title, content, image } = req.body;
    
    const validation = validateArticleData(title, content, image);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, { title, content, image }, { new: true, runValidators: true });
        if (!updatedArticle) return res.status(404).json({ message: 'Article not found' });
        res.json(updatedArticle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json({ message: 'Article deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;