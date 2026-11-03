const express = require('express');
const User = require('../models/MyUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.post(
    "/register",
    [
        check("username", "Username is required").not().isEmpty(),
        check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username });
            if (user) return res.status(400).json({ msg: "User already exists" });

            // роль всегда "user" по умолчанию
            user = new User({ username, password, role: "user" });
            await user.save();

            res.status(201).json({ msg: "User registered successfully" });
        } catch (err) {
            res.status(500).json({ msg: "Server error" });
        }
    }
);

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // добавляем роль в payload
        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fdssdf', { expiresIn: "1h" });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
    (req, res) => {
        const payload = { id: req.user.id, role: req.user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fdssdf', { expiresIn: "1h" });

        res.redirect(`http://localhost:3000/?token=${token}`);
    }
);

module.exports = router;
