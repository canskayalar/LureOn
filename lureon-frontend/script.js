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
  

console.log("script.js çalışıyor!");

const API_URL = "http://127.0.0.1:3001/api/ai";

const fetchAIResponse = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        console.log("Backend'den Gelen Yanıt:", data);
    } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    fetchAIResponse();
});

document.getElementById("send_button").addEventListener("click", async () => {
    const userInput = document.getElementById("chat_box").value;
    if (!userInput.trim()) return;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput }) // "message" alanı kullanıldı
        });

        const data = await response.json();
        document.querySelector(".chat_output").textContent = `AI: ${data.message}`;
    } catch (error) {
        console.error("Backend bağlantı hatası:", error);
        document.querySelector(".chat_output").textContent = "Bağlantı hatası!";
    }
});