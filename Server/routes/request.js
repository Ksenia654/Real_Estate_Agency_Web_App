const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const Deal = require("../models/Deal");


router.post("/", async (req, res) => {
    try {
        const request = new Request({
            property: req.body.propertyId,
            user: req.body.userId, // ⚠️ теперь берём id юзера из тела запроса
            status: "waiting" // по умолчанию заявка в ожидании
        });
        await request.save();
        res.json(request);
    } catch (err) {
        res.status(500).json({ msg: "Error creating request" });
    }
});

router.get("/my", async (req, res) => {
    try {
        const userId = req.query.userId;
        const requests = await Request.find({ user: userId }).populate("property");
        res.json(requests);
    } catch (err) {
        console.error("Error fetching requests:", err.message, err.stack);
        res.status(500).json({ msg: "Error fetching requests" });
    }
});

router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: "Request not found" });
        }

        request.status = status;
        await request.save();

        if (status === "approved") {
            const deal = new Deal({
                requestId: request._id,
                propertyId: request.property,
                clientId: request.user,
                status: "draft"
            });
            await deal.save();
        }

        res.json(request);
    } catch (err) {
        console.error("Error updating request status:", err.message, err.stack);
        res.status(500).json({ msg: "Error updating request status" });
    }
});

router.get("/", async (req, res) => {
    try {
        const requests = await Request.find()
            .populate("property")
            .populate("user");
        res.json(requests);
    } catch (err) {
        console.error("Error fetching all requests:", err.message, err.stack);
        res.status(500).json({ msg: "Error fetching all requests" });
    }
});

module.exports = router;
