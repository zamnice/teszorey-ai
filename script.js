const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

const customPrompt = `Kamu adalah Zorey AI, chatbot AI yang ramah, cerdas, dan bisa bantu apa saja. Fokus kamu adalah membantu pelajar dengan cara yang menyenangkan, sopan, tidak membosankan, serta mudah dimengerti.`;

// Kirim chat saat tombol diklik
sendButton.addEventListener("click", () => {
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage(message, "user");
  userInput.value = "";
  sendMessageToAI(message);
});

// Tambahkan pesan ke layar
function appendMessage(message, sender = "ai") {
  const msgEl = document.createElement("div");
  msgEl.className = sender === "user" ? "user-message" : "ai-message";
  msgEl.textContent = message;
  chatLog.appendChild(msgEl);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Fungsi kirim pesan ke API (melalui /api/gemma proxy)
async function sendMessageToAI(userText) {
  appendMessage("⏳ Zorey sedang mengetik...");
  try {
    const res = await fetch("/api/gemma", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: customPrompt,
        message: userText
      })
    });

    const data = await res.json();
    const response = data.text || "❌ Maaf, tidak ada respon dari AI.";
    document.querySelector(".ai-message:last-child").remove();
    appendMessage(response, "ai");
  } catch (err) {
    document.querySelector(".ai-message:last-child").remove();
    appendMessage("⚠️ Terjadi error saat terhubung ke AI.");
  }
}

// Sidebar menu
document.getElementById("hamburger").onclick = () => {
  document.getElementById("sidebar").classList.add("show");
};
document.getElementById("closeBtn").onclick = () => {
  document.getElementById("sidebar").classList.remove("show");
};

// Dark Mode toggle
document.getElementById("toggle-dark").onclick = () => {
  document.body.classList.toggle("dark-mode");
  Swal.fire({
    icon: 'success',
    title: 'Mode Gelap Aktif!',
    timer: 1200,
    showConfirmButton: false
  });
};

// Copy Chat
document.getElementById("copy-button").onclick = () => {
  const text = [...document.querySelectorAll(".ai-message, .user-message")]
    .map(e => e.textContent).join("\n");
  navigator.clipboard.writeText(text);
  Swal.fire({
    icon: 'success',
    title: 'Berhasil Disalin!',
    text: 'Chat sudah disalin ke clipboard.',
    timer: 1400,
    showConfirmButton: false
  });
};

// Share Link
document.getElementById("share-now").onclick = () => {
  const text = encodeURIComponent("Coba Zorey AI – Chatbot canggih untuk belajar!\n" + location.href);
  window.open(`https://wa.me/?text=${text}`, "_blank");
};

// New Chat
document.getElementById("new-chat").onclick = () => {
  chatLog.innerHTML = '<div class="ai-message">Halo! Ada yang bisa saya bantu?</div>';
};

// Ganti bahasa (manual)
document.getElementById("languageSelect").onchange = (e) => {
  const lang = e.target.value;
  if (lang === "id") return location.reload();
  document.querySelector(".ai-message").textContent = "Hello! How can I assist you?";
};

// Prompt Install
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  Swal.fire({
    title: "Pasang Zorey AI?",
    text: "Akses langsung dari layar utama kamu!",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Pasang Sekarang",
    cancelButtonText: "Nanti"
  }).then(result => {
    if (result.isConfirmed && deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choice => {
        if (choice.outcome === 'accepted') {
          Swal.fire("Berhasil!", "Zorey AI dipasang di perangkat kamu.", "success");
        }
      });
      deferredPrompt = null;
    }
  });
});
