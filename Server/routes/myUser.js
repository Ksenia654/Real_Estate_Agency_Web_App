const express = require('express');
const User = require('../models/MyUser');
const router = express.Router();
const auth = require("../middleware/auth");

router.get('/', auth, async (req, res) => {
    try {
        const requestingUser = await User.findById(req.user.id);
        if (!requestingUser || requestingUser.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const users = await User.find().select("_id username role");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

router.post('/', async (req, res) => {
    const { username, password, googleId } = req.body;

    try {
        const newUser = new User({
            username,
            password,
            googleId,
            role: "user" // всегда обычный пользователь
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const requestingUser = await User.findById(req.user.id);
        if (!requestingUser || requestingUser.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
