const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `You are StorageWars AI, an assistant for a storage auction website. Answer clearly and briefly about auctions, bidding, products, orders and using the website. User question: ${message}`
        });

        res.status(200).json({
            success: true,
            reply: response.text
        });

    } catch (error) {
        console.error("AI ERROR:", error);

        res.status(500).json({
            success: false,
            message: "AI response failed",
            error: error.message
        });
    }
});

module.exports = router;