const express = require('express');
const Property = require('../models/Property');
const Category = require('../models/Category');
const router = express.Router();
const auth = require("../middleware/auth");


const validateProperty = (title, description, imageUrl, price, category) => {
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/;
    
    if (!title || !description || !imageUrl || !price || !category) {
        return { valid: false, message: 'All fields are required.' };
    }
    if (price <= 0) {
        return { valid: false, message: 'Price must be greater than zero.' };
    }
    if (!urlPattern.test(imageUrl)) {
        return { valid: false, message: 'Image URL must be a valid image link (jpg, jpeg, png, gif).' };
    }
    return { valid: true };
};

router.post('/', auth, async (req, res) => {
    const { title, description, imageUrl, price, category } = req.body;

    const validation = validateProperty(title, description, imageUrl, price, category);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    const newProperty = new Property({ title, description, imageUrl, price, category });
    try {
        const savedProperty = await newProperty.save();
        res.status(201).json(savedProperty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('category'); // Populate category details
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    } catch (error) {
        console.error('Error fetching property by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    const { sort, search } = req.query;
    let query = {};
    if (search) {
        query = { title: new RegExp(search, 'i') }; 
    }

    try {
        const properties = await Property.find(query)
            .populate('category')
            .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : {});
        console.log(properties);
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { title, description, imageUrl, price, category } = req.body;

    const validation = validateProperty(title, description, imageUrl, price, category);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category');
        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(updatedProperty);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedProperty = await Property.findByIdAndDelete(req.params.id);
        if (!deletedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json({ message: 'Property deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;