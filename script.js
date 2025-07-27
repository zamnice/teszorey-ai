// Konfigurasi Aplikasi
const CONFIG = {
    API_KEY: '', // Akan diisi dari environment variable atau prompt
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemma-pro:generateContent',
    DEFAULT_LANGUAGE: 'id',
    SAVE_INTERVAL: 5000 // Auto-save setiap 5 detik
};

// State Aplikasi
const APP_STATE = {
    currentLanguage: CONFIG.DEFAULT_LANGUAGE,
    darkMode: false,
    chatHistory: [],
    deferredPrompt: null
};

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Setup API Key
    setupApiKey();
    
    // Load saved data
    loadSavedData();
    
    // Setup UI
    setupUI();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show install prompt after delay
    setTimeout(showInstallPrompt, 5000);
    
    // Auto-save interval
    setInterval(saveChatHistory, CONFIG.SAVE_INTERVAL);
}

function setupApiKey() {
    // Coba dapatkan API key dari environment variable
    CONFIG.API_KEY = process.env.GEMMA_API_KEY || '';
    
    // Jika tidak ada, minta dari user
    if (!CONFIG.API_KEY) {
        const apiKey = prompt('Masukkan API Key Gemma Anda:');
        if (apiKey) {
            CONFIG.API_KEY = apiKey;
            localStorage.setItem('gemma_api_key', apiKey);
        } else {
            alert('API Key diperlukan untuk menggunakan aplikasi ini');
        }
    }
}

function loadSavedData() {
    // Load API key dari localStorage jika ada
    const savedApiKey = localStorage.getItem('gemma_api_key');
    if (savedApiKey) CONFIG.API_KEY = savedApiKey;
    
    // Load language preference
    const savedLanguage = localStorage.getItem('zorey_language');
    if (savedLanguage) APP_STATE.currentLanguage = savedLanguage;
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('zorey_darkmode') === 'true';
    if (savedDarkMode) toggleDarkMode(false);
    
    // Load chat history
    const savedChat = localStorage.getItem('zorey_chat_history');
    if (savedChat) {
        APP_STATE.chatHistory = JSON.parse(savedChat);
        renderChatHistory();
    }
}

function setupUI() {
    // Update language UI
    updateLanguageUI();
    
    // Update dark mode UI
    updateDarkModeUI();
    
    // Show welcome screen if no chat history
    if (APP_STATE.chatHistory.length === 0) {
        document.getElementById('welcome-screen').style.display = 'flex';
        document.getElementById('chat-container').style.display = 'none';
    } else {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
    }
}

function setupEventListeners() {
    // Tombol Header
    document.getElementById('new-chat').addEventListener('click', startNewChat);
    document.getElementById('share-chat').addEventListener('click', shareChat);
    document.getElementById('translate-btn').addEventListener('click', toggleLanguage);
    
    // Input Area
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Quick Questions
    document.querySelectorAll('.quick-question').forEach(button => {
        button.addEventListener('click', (e) => {
            const prompt = e.currentTarget.getAttribute('data-prompt');
            document.getElementById('user-input').value = prompt;
            sendMessage();
        });
    });
    
    // Install Prompt
    document.getElementById('install-cancel').addEventListener('click', hideInstallPrompt);
    document.getElementById('install-confirm').addEventListener('click', installApp);
    
    // Before Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        APP_STATE.deferredPrompt = e;
    });
}

// Fungsi Chat
function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message || !CONFIG.API_KEY) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Prepare API request
    const requestBody = {
        contents: [{
            parts: [{
                text: message
            }]
        }]
    };
    
    // Call Gemma API
    fetch(`${CONFIG.API_URL}?key=${CONFIG.API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const aiResponse = data.candidates[0].content.parts[0].text;
        addMessage(aiResponse, 'ai');
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage('Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.', 'ai');
    })
    .finally(() => {
        hideTypingIndicator();
    });
}

function addMessage(text, sender) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    // Format AI response if needed
    if (sender === 'ai') {
        messageDiv.innerHTML = formatMarkdown(text);
    } else {
        messageDiv.textContent = text;
    }
    
    // Add to chat container
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to chat history
    APP_STATE.chatHistory.push({
        text,
        sender,
        timestamp: new Date().toISOString()
    });
    
    // Hide welcome screen if showing
    if (document.getElementById('welcome-screen').style.display !== 'none') {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
    }
}

function formatMarkdown(text) {
    // Simple markdown to HTML conversion
    return text
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
    document.getElementById('typing-indicator').classList.add('active');
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').classList.remove('active');
}

// Fungsi UI
function startNewChat() {
    if (confirm(APP_STATE.currentLanguage === 'id' ? 
        'Apakah Anda yakin ingin memulai obrolan baru?' : 
        'Are you sure you want to start a new chat?')) {
        APP_STATE.chatHistory = [];
        document.getElementById('chat-messages').innerHTML = '';
        document.getElementById('welcome-screen').style.display = 'flex';
        document.getElementById('chat-container').style.display = 'none';
        saveChatHistory();
    }
}

function shareChat() {
    const chatText = APP_STATE.chatHistory.map(msg => {
        return `${msg.sender === 'user' ? 'Anda' : 'Zorey AI'}: ${msg.text}`;
    }).join('\n\n');
    
    if (navigator.share) {
        navigator.share({
            title: 'Chat Zorey AI',
            text: chatText,
            url: window.location.href
        }).catch(err => {
            console.error('Error sharing:', err);
            copyToClipboard(chatText);
        });
    } else {
        copyToClipboard(chatText);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert(APP_STATE.currentLanguage === 'id' ? 
                'Chat berhasil disalin!' : 
                'Chat copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy:', err);
        });
}

function toggleLanguage() {
    APP_STATE.currentLanguage = APP_STATE.currentLanguage === 'id' ? 'en' : 'id';
    localStorage.setItem('zorey_language', APP_STATE.currentLanguage);
    updateLanguageUI();
}

function updateLanguageUI() {
    // Update UI berdasarkan bahasa
    // Ini bisa diperluas dengan sistem i18n yang lebih lengkap
    if (APP_STATE.currentLanguage === 'id') {
        document.getElementById('user-input').placeholder = 'Tanya apa saja...';
    } else {
        document.getElementById('user-input').placeholder = 'Ask anything...';
    }
}

function toggleDarkMode(save = true) {
    APP_STATE.darkMode = !APP_STATE.darkMode;
    document.body.classList.toggle('dark-mode');
    if (save) {
        localStorage.setItem('zorey_darkmode', APP_STATE.darkMode);
    }
    updateDarkModeUI();
}

function updateDarkModeUI() {
    // Update UI untuk dark mode
    // Tidak perlu implementasi khusus karena menggunakan CSS variables
}

// Fungsi PWA
function showInstallPrompt() {
    if (APP_STATE.deferredPrompt) {
        document.getElementById('install-prompt').style.display = 'flex';
    }
}

function hideInstallPrompt() {
    document.getElementById('install-prompt').style.display = 'none';
}

function installApp() {
    if (APP_STATE.deferredPrompt) {
        APP_STATE.deferredPrompt.prompt();
        APP_STATE.deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted install');
            } else {
                console.log('User dismissed install');
            }
            APP_STATE.deferredPrompt = null;
            hideInstallPrompt();
        });
    }
}

// Fungsi Penyimpanan
function saveChatHistory() {
    localStorage.setItem('zorey_chat_history', JSON.stringify(APP_STATE.chatHistory));
}

function renderChatHistory() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    
    APP_STATE.chatHistory.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender}-message`;
        
        if (msg.sender === 'ai') {
            messageDiv.innerHTML = formatMarkdown(msg.text);
        } else {
            messageDiv.textContent = msg.text;
        }
        
        chatMessages.appendChild(messageDiv);
    });
    
    if (APP_STATE.chatHistory.length > 0) {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('chat-container').style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
        }
