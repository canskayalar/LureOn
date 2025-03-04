/*console.log("script.js çalışıyor!"); // Konsolda kontrol için

const API_URL = "http://127.0.0.1:3001/api/ai"; // Backend API URL'si

// Sayfa yüklendiğinde backend bağlantısını test et
const fetchAIResponse = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log("Backend'den Gelen Yanıt:", data);
  } catch (error) {
    console.error("API isteğinde hata oluştu:", error);
  }
};

// Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", () => {
  fetchAIResponse();
});

// Kullanıcı mesajını AI'a gönder
document.getElementById("send_button").addEventListener("click", async () => {
  const userInput = document.getElementById("chat_box").value;
  if (!userInput.trim()) return; // Boş mesaj göndermeyi engelle

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userInput })
    });

    const data = await response.json();
    document.querySelector(".chat_output").textContent = `AI: ${data.message}`;
  } catch (error) {
    console.error("Backend bağlantı hatası:", error);
    document.querySelector(".chat_output").textContent = "Bağlantı hatası!";
  }
});*/
