require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

// CORS Ayarları
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept', 'Cache-Control']
}));

app.use(express.json());

// MongoDB Bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Lakera API Ayarları
const LAKERA_API_URL = process.env.LAKERA_API_URL || "https://api.lakera.ai/v2/guard";
const LAKERA_API_KEY = process.env.LAKERA_API_KEY;

// 🔹 Lakera Guard API’ye istek gönderen fonksiyon
async function checkWithLakera(prompt) {
  console.log("📡 Lakera API'ye istek gönderiliyor:", prompt);
  
  try {
    const response = await fetch(LAKERA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LAKERA_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      console.error("❌ Lakera API Hata Kodu:", response.status);
      throw new Error(`API Hatası: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🔍 Lakera API Yanıtı:", data);
    
    return data;
  } catch (error) {
    console.error("❌ Lakera API Bağlantı Hatası:", error);
    return { error: "Lakera API bağlantı hatası.", status: "error" };
  }
}

// Test endpoint
app.get("/", (req, res) => {
  res.send("LureOn Backend is running with Lakera API...");
});

// API health check
app.get("/api/ai", (req, res) => {
  res.json({ 
    message: "Lakera AI API is working!", 
    status: "success", 
    timestamp: new Date().toISOString() 
  });
});

// 🔹 Lakera API’yi çağıran Chat Endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mesaj gereklidir.", status: "error" });
    }

    console.log("📩 Kullanıcıdan gelen mesaj:", message);

    // Lakera API çağrısı yap
    const lakeraResponse = await checkWithLakera(message);
    
    console.log("🛡 Lakera API Yanıtı:", lakeraResponse);

    // Eğer API yanıtı hatalıysa, hata döndür
    if (lakeraResponse.error) {
      return res.status(500).json({ 
        error: lakeraResponse.error || "Bilinmeyen hata", 
        status: "error" 
      });
    }

    // Kullanıcıya AI yanıtını döndür
    return res.json({ 
      message: lakeraResponse.messages?.[0]?.content || "Lakera API yanıtı boş.",
      status: "success"
    });

  } catch (error) {
    console.error("❌ Genel Sunucu Hatası:", error);
    return res.status(500).json({ error: "Sunucu hatası.", details: error.message });
  }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ LureOn Backend çalışıyor: http://127.0.0.1:${PORT}`);
});
