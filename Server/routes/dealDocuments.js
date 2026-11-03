// routes/dealDocuments.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Deal = require("../models/Deal");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        // уникальное имя: dealId_timestamp.ext
        const ext = path.extname(file.originalname);
        cb(null, `${req.body.dealId}_${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

router.post("/", upload.single("document"), async (req, res) => {
    try {
        const { dealId } = req.body;
        if (!dealId || !req.file) {
            return res.status(400).json({ error: "dealId и файл обязательны" });
        }

        const deal = await Deal.findById(dealId);
        if (!deal) return res.status(404).json({ error: "Сделка не найдена" });

        deal.documents.push({
            title: req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            uploadedAt: new Date()
        });
        await deal.save();

        res.json({ msg: "Документ загружен", document: deal.documents.at(-1) });
    } catch (err) {
        console.error("Ошибка загрузки документа:", err);
        res.status(500).json({ error: "Ошибка загрузки документа" });
    }
});

module.exports = router;
