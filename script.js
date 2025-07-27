// script.js - Zorey AI Chatbot Assistant
// Versi Final dengan semua perbaikan

// Konfigurasi API dengan environment variable
const apiKey = process.env.GEMMA_API_KEY || 'YOUR_DEFAULT_API_KEY';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemma-pro:generateContent';

// Variabel global untuk manajemen state
let currentLanguage = 'id';
let deferredPrompt = null;

// Inisialisasi aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    registerServiceWorker();
    initi18n();
});

// Fungsi inisialisasi utama
function initApp() {
    // Setup event listeners
    setupEventListeners();
    
    // Load saved preferences
    loadPreferences();
    
    // Setup PWA install prompt
    setupInstallPrompt();
    
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        document.getElementById('loading-page').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-page').style.display = 'none';
        }, 500);
    }, 3000);
}

// Fungsi untuk setup semua event listeners
function setupEventListeners() {
    // Chat functionality
    document.getElementById('send-button').addEventListener('click', sendUserMessage);
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendUserMessage();
    });
    
    // Slide menu functionality
    document.getElementById('hamburger-menu').addEventListener('click', openSlideMenu);
    document.querySelector('.close-menu').addEventListener('click', closeSlideMenu);
    
    // Menu buttons
    document.getElementById('menu-dark-mode-toggle').addEventListener('click', toggleDarkMode);
    document.getElementById('menu-copy-button').addEventListener('click', copyChatHistory);
    document.getElementById('menu-share-button').addEventListener('click', shareChatHistory);
    document.getElementById('language-toggle').addEventListener('click', toggleLanguage);
    document.querySelector('.new-chat-button').addEventListener('click', startNewChat);
    
    // Install button
    document.getElementById('install-button').addEventListener('click', installPWA);
}

// Fungsi untuk mengirim pesan user
async function sendUserMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, true);
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get AI response
        const aiResponse = await getAIResponse(message);
        
        // Remove typing indicator and add AI response
        removeTypingIndicator();
        addMessageToChat(aiResponse, false);
        
    } catch (error) {
        removeTypingIndicator();
        addMessageToChat('Maaf, terjadi kesalahan saat memproses permintaan Anda: ' + error.message, false);
        console.error('Error:', error);
    }
}

// Fungsi untuk mendapatkan respons dari AI
async function getAIResponse(prompt) {
    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };
    
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Fungsi untuk menambahkan pesan ke chat
function addMessageToChat(message, isUser) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.classList.add(isUser ? 'user-message' : 'ai-message');
    
    if (isUser) {
        messageElement.textContent = message;
    } else {
        messageElement.innerHTML = markdownToHtml(message);
    }
    
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
    
    // Save chat history
    saveChatHistory();
}

// Fungsi untuk mengubah markdown ke HTML
function markdownToHtml(markdown) {
    // Convert headers
    markdown = markdown.replace(/^# (.*$)/gm, '<h1>$1</h1>')
                      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                      .replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Convert bold and italic
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert lists
    markdown = markdown.replace(/^\s*[\*\-\+]\s(.*$)/gm, '<li>$1</li>');
    
    // Convert code blocks
    markdown = markdown.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                      .replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert links
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Handle paragraphs and line breaks
    markdown = markdown.replace(/(\n\n|\r\r|\r\n\r\n)/g, '</p><p>')
                      .replace(/(\n|\r|\r\n)/g, '<br>');
    
    // Wrap in paragraph if needed
    if (!markdown.startsWith('<')) {
        markdown = '<p>' + markdown;
    }
    if (!markdown.endsWith('</p>')) {
        markdown = markdown + '</p>';
    }
    
    return markdown;
}

// Fungsi untuk menampilkan typing indicator
function showTypingIndicator() {
    const chatLog = document.getElementById('chat-log');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'ai-message typing-indicator';
    typingIndicator.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    typingIndicator.id = 'typing-indicator';
    chatLog.appendChild(typingIndicator);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// Fungsi untuk menghilangkan typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Fungsi untuk slide menu
function openSlideMenu() {
    document.getElementById('slide-menu').classList.add('open');
}

function closeSlideMenu() {
    document.getElementById('slide-menu').classList.remove('open');
}

// Fungsi untuk dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    updateDarkModeButtonText();
}

function updateDarkModeButtonText() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const darkModeText = document.querySelector('#menu-dark-mode-toggle .menu-text');
    darkModeText.textContent = isDarkMode ? 
        (currentLanguage === 'id' ? 'Mode Terang' : 'Light Mode') : 
        (currentLanguage === 'id' ? 'Mode Gelap' : 'Dark Mode');
}

// Fungsi untuk multi-bahasa
function initi18n() {
    i18next
        .use(i18nextHttpBackend)
        .init({
            lng: 'id',
            fallbackLng: 'en',
            debug: false,
            backend: {
                loadPath: 'locales/{{lng}}/translation.json'
            }
        }, function(err, t) {
            if (err) console.error(err);
            updateContent();
        });
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'id' ? 'en' : 'id';
    i18next.changeLanguage(currentLanguage, updateContent);
    updateDarkModeButtonText();
}

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = i18next.t(key);
    });
}

// Fungsi untuk chat history
function saveChatHistory() {
    const messages = Array.from(document.querySelectorAll('.chat-message')).map(msg => ({
        text: msg.textContent,
        sender: msg.classList.contains('user-message') ? 'user' : 'ai',
        html: msg.innerHTML
    }));
    localStorage.setItem('zoreyAiChatHistory', JSON.stringify(messages));
}

function loadChatHistory() {
    const savedChat = localStorage.getItem('zoreyAiChatHistory');
    if (savedChat) {
        const messages = JSON.parse(savedChat);
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.classList.add(`${msg.sender}-message`, 'chat-message');
            messageElement.innerHTML = msg.html || msg.text;
            document.getElementById('chat-log').appendChild(messageElement);
        });
    }
}

function copyChatHistory() {
    const messages = Array.from(document.querySelectorAll('.chat-message')).map(msg => {
        const sender = msg.classList.contains('user-message') ? 'Anda' : 'Zorey AI';
        return `${sender}: ${msg.textContent}`;
    }).join('\n\n');

    navigator.clipboard.writeText(messages)
        .then(() => {
            alert(i18next.t('copy_success'));
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            alert('Gagal menyalin percakapan');
        });
}

function shareChatHistory() {
    const messages = Array.from(document.querySelectorAll('.chat-message')).map(msg => {
        const sender = msg.classList.contains('user-message') ? 'Anda' : 'Zorey AI';
        return `${sender}: ${msg.textContent}`;
    }).join('\n\n');

    if (navigator.share) {
        navigator.share({
            title: 'Percakapan dengan Zorey AI',
            text: messages,
            url: window.location.href
        }).catch(err => {
            console.error('Error sharing:', err);
            fallbackShare(messages);
        });
    } else {
        fallbackShare(messages);
    }
}

function fallbackShare(text) {
    const shareUrl = `mailto:?subject=Percakapan dengan Zorey AI&body=${encodeURIComponent(text)}`;
    window.location.href = shareUrl;
}

function startNewChat() {
    if (confirm(currentLanguage === 'id' ? 
        'Apakah Anda yakin ingin memulai obrolan baru? Riwayat percakapan saat ini akan dihapus.' : 
        'Are you sure you want to start a new chat? Current chat history will be lost.')) {
        document.getElementById('chat-log').innerHTML = '';
        localStorage.removeItem('zoreyAiChatHistory');
    }
}

// Fungsi untuk PWA
function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('install-prompt').style.display = 'block';
    });
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
            document.getElementById('install-prompt').style.display = 'none';
        });
    }
}

function registerServiceWorker() {
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
}

// Fungsi untuk load preferences
function loadPreferences() {
    // Load dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Load chat history
    loadChatHistory();
    
    // Update button text
    updateDarkModeButtonText();
              }
