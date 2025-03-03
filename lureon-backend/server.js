require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS'u etkinleştir
app.use(cors());
app.use(express.json());

// MongoDB'ye bağlan
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Bağlandı"))
  .catch((err) => console.error("❌ MongoDB Bağlantı Hatası:", err));

// Ana sayfa endpoint'i
app.get("/", (req, res) => {
  res.send("LureOn Backend is running...");
});

// AI API Endpoints
// GET endpoint for initial connection test
app.get("/api/ai", (req, res) => {
  res.json({ 
    message: "AI API is working!",
    status: "success",
    timestamp: new Date().toISOString()
  });
});

// POST endpoint for chat messages
app.post("/api/ai", (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: "Message is required",
        status: "error" 
      });
    }

    res.json({ 
      message: `Received: ${message}`,
      status: "success",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      error: "Internal server error",
      status: "error"
    });
  }
});

// Portu ayarla (dotenv varsa onu kullan, yoksa 3001 kullan)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 LureOn Backend çalışıyor: http://127.0.0.1:${PORT}`);
});
