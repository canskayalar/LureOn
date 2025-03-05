console.log("✅ script.js çalışıyor!");

// API Adresi (Lakera Guard API'yi destekleyen backend URL'si)
function toggleMenu() {
    document.getElementById("profileMenu").classList.toggle("active");
  }
  
  // Menü dışında bir yere tıklanınca kapanmasını sağla
  document.addEventListener("click", function(event) {
    const profileMenu = document.getElementById("profileMenu");
    const profileIcon = document.querySelector(".user_profile");
  
    if (!profileMenu.contains(event.target) && !profileIcon.contains(event.target)) {
      profileMenu.classList.remove("active");
    }
  });
  

console.log("✅ script.js çalışıyor!");

// API Adresi (Lakera Guard API'yi destekleyen backend URL'si)
const API_URL = "http://127.0.0.1:3001/api/ai";

// AI API'yi çağırıp, yanıtı konsola yazdıran fonksiyon
const fetchAIResponse = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("🔹 Backend'den Gelen Yanıt:", data);
    } catch (error) {
        console.error("❌ API isteğinde hata oluştu:", error);
    }
};

// Sayfa yüklendiğinde AI API'yi test et
document.addEventListener("DOMContentLoaded", () => {
    fetchAIResponse();
});

// Kullanıcının mesajını Lakera API'ye gönder ve yanıt al
document.getElementById("send_button").addEventListener("click", async () => {
    const userInput = document.getElementById("chat_box").value;
    const chatOutput = document.querySelector(".chat_output");

    if (!userInput.trim()) {
        chatOutput.textContent = "⚠ Lütfen bir mesaj girin!";
        return;
    }

    chatOutput.textContent = "⌛ Yanıt bekleniyor...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })  // "message" alanı kullanıldı
        });

        const data = await response.json();

        if (data.error) {
            chatOutput.textContent = `🚨 Hata: ${data.error}`;
        } else {
            chatOutput.textContent = `🤖 AI: ${data.message}`;
        }
    } catch (error) {
        console.error("❌ Backend bağlantı hatası:", error);
        chatOutput.textContent = "Bağlantı hatası!";
    }
});
