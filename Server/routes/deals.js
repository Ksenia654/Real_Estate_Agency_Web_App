const express = require("express");
const router = express.Router();
const Deal = require("../models/Deal");

router.post("/", async (req, res) => {
    try {
        const deal = new Deal(req.body);
        await deal.save();
        res.status(201).json(deal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const deals = await Deal.find().populate("requestId propertyId clientId");
        res.json(deals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(deal);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
