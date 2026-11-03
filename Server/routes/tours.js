// routes/tours.js
const express = require("express");
const router = express.Router();
const Tour = require("../models/Tour");
const auth = require("../middleware/auth");


router.post("/", auth, async (req, res) => {
    try {
        const { userId, propertyId, scheduledAt } = req.body;

        const tour = await Tour.findOneAndUpdate(
            { userId, propertyId },
            { access: true, scheduledAt: scheduledAt || null },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(tour);
    } catch (err) {
        if (err.code === 11000) {
            const tour = await Tour.findOne({ userId: req.body.userId, propertyId: req.body.propertyId });
            return res.json(tour);
        }
        console.error("Error creating/updating tour:", err);
        res.status(500).json({ msg: "Error creating/updating tour" });
    }
});

router.get("/access", auth, async (req, res) => {
    try {
        const { userId, propertyId } = req.query;
        const tour = await Tour.findOne({ userId, propertyId });
        res.json({ hasAccess: !!(tour && tour.access), tour });
    } catch (err) {
        console.error("Error checking access:", err);
        res.status(500).json({ msg: "Error checking access" });
    }
});

router.patch("/revoke", auth, async (req, res) => {
    try {
        const { userId, propertyId } = req.body;
        const tour = await Tour.findOneAndUpdate(
            { userId, propertyId },
            { access: false },
            { new: true }
        );
        res.json(tour);
    } catch (err) {
        console.error("Error revoking access:", err);
        res.status(500).json({ msg: "Error revoking access" });
    }
});

module.exports = router;
