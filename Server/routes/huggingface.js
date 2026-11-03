const express = require("express");
const axios = require("axios");
const router = express.Router();

const OLLAMA_URL = "http://localhost:11434/api/generate";

router.post("/describe-object", async (req, res) => {
    const { objectPrompt } = req.body;

    try {
        const response = await axios.post(
            OLLAMA_URL,
            {
                model: "mistral",
                prompt: `Сгенерируй описание объекта для продажи красиво в двух предложениях, чтобы сразу захотелось купить: ${objectPrompt}`,
                stream: false
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const description = response.data?.response || "Нет ответа от Ollama";

        res.json({ description });
    } catch (err) {
        console.error("Ошибка Ollama API:", err.message);
        res.status(500).send("Ошибка AI API");
    }
});

module.exports = router;

