

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
    res.send("LureOn Backend is running...");
});

app.get("/api/ai", (req, res) => {
    res.json({ message: "AI API is working!", status: "success", timestamp: new Date().toISOString() });
});

app.post("/api/ai", (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required", status: "error" });
        }
        let aiResponse = "I'm your AI assistant."
        res.json({ message: aiResponse, status: "success", timestamp: new Date().toISOString() });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", status: "error", details: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`LureOn Backend çalışıyor: http://127.0.0.1:${PORT}`);
});