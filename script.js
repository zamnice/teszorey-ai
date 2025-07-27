const apiKey = process.env.GEMMA_API_KEY;

// Kirim pesan ke API
async function sendMessage(message) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-1b-it:generateContent?key=${apiKey}`;
  const data = { contents: [{ parts: [{ text: message }] }] };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    const aiResponse = result.candidates[0].content.parts[0].text;
    return aiResponse;
  } catch (error) {
    console.error('Error:', error);
    return '⚠️ Gagal mendapatkan respon. Coba lagi nanti.';
  }
}

function addMessageToChat(message, isUser) {
  const chatLog = document.getElementById('chat-log');
  const msg = document.createElement('div');
  msg.className = isUser ? 'user-message' : 'ai-message';
  msg.textContent = message;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Tombol kirim
const sendBtn = document.getElementById('send-button');
sendBtn.addEventListener('click', async () => {
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;
  addMessageToChat(text, true);
  input.value = '';
  const reply = await sendMessage(text);
  addMessageToChat(reply, false);
});

// Tekan enter
const userInput = document.getElementById('user-input');
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

// Hamburger menu
const menu = document.getElementById('sideMenu');
document.getElementById('hamburger').onclick = () => menu.classList.add('open');
document.getElementById('closeBtn').onclick = () => menu.classList.remove('open');

// Dark mode toggle
const toggleDark = document.getElementById('toggle-dark');
toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Copy chat
const copyBtn = document.getElementById('copy-button');
copyBtn.addEventListener('click', () => {
  const text = document.getElementById('chat-log').innerText;
  navigator.clipboard.writeText(text).then(() => alert('📋 Chat disalin!'));
});

// Share chat
const shareBtn = document.getElementById('share-now');
shareBtn.addEventListener('click', () => {
  const text = document.getElementById('chat-log').innerText;
  if (navigator.share) {
    navigator.share({ title: 'Zorey AI Chat', text, url: location.href });
  } else {
    alert('❌ Fitur share tidak didukung di browser ini.');
  }
});

// Ganti Bahasa (sederhana)
const langSelect = document.getElementById('languageSelect');
langSelect.addEventListener('change', (e) => {
  const lang = e.target.value;
  i18next.init({
    lng: lang,
    resources: {
      id: { translation: { 'Halo! Ada yang bisa saya bantu?': 'Halo! Ada yang bisa saya bantu?' } },
      en: { translation: { 'Halo! Ada yang bisa saya bantu?': 'Hello! How can I help you?' } }
    }
  }, () => {
    document.querySelectorAll('.ai-message').forEach(el => {
      el.textContent = i18next.t(el.textContent.trim());
    });
  });
});

// Install Prompt PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.textContent = '⬇️ Install Aplikasi Zorey AI';
  installBtn.style.cssText = 'position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); z-index: 9999; padding: 10px; background: #FF6B00; color: white; border: none; border-radius: 10px;';
  document.body.appendChild(installBtn);

  installBtn.addEventListener('click', async () => {
    installBtn.remove();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Install prompt outcome: ${outcome}`);
    deferredPrompt = null;
  });
});
                          
