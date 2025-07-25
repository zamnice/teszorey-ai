// script.js
// Ambil API Key dari environment variable
const apiKey = 'AIzaSyDJ0R_S8bcqcRNvwfsv0wWm7YE8pUiZ8Is'; // Ganti dengan API Key Anda

// Fungsi untuk mengirim pesan ke AI
async function sendMessage(message) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemma-3-1b-it:generateContent?key=' + apiKey;
    const data = {
        contents: [{
            parts: [{ text: message }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const aiResponse = result.candidates[0].content.parts[0].text;
        return aiResponse;
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan: ' + error.message);
        return '1105 Maaf nih, Mungkin sedang ada yang gak beres, Coba lagi nanti ya.';
    }
}

// Fungsi untuk menambahkan pesan ke chat log
function addMessageToChat(message, isUser) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.classList.add(isUser ? 'user-message' : 'ai-message');
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// Event listener untuk tombol kirim
document.getElementById('send-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput) {
        addMessageToChat(userInput, true);
        document.getElementById('user-input').value = '';

        const aiResponse = await sendMessage(userInput);
        addMessageToChat(aiResponse, false);
    }
});

// Event listener untuk input enter
document.getElementById('user-input').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        document.getElementById('send-button').click();
    }
});

// Dark mode toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Copy chat
document.getElementById('copy-button').addEventListener('click', () => {
    const chatLog = document.getElementById('chat-log').innerText;
    navigator.clipboard.writeText(chatLog).then(() => {
        alert('Chat berhasil disalin!');
    });
});

// Share chat
document.getElementById('share-button').addEventListener('click', () => {
    if (navigator.share) {
        const chatLog = document.getElementById('chat-log').innerText;
        navigator.share({
            title: 'Zorey AI Chat',
            text: chatLog,
            url: document.location.href
        }).then(() => {
            console.log('Chat berhasil dibagikan');
        }).catch((error) => {
            console.error('Error sharing:', error);
        });
    } else {
        alert('Fitur share tidak didukung di browser ini.');
    }
});

// PWA service worker registration (optional, sudah ada di bawah)
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/service-worker.js');
//     });
// }
