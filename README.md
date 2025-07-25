# 🤖 ZoreyAI – Your Playful Yet Powerful AI Assistant

![Build Status](https://img.shields.io/github/actions/workflow/status/zamnice/zorey-ai-test/deploy.yml?style=for-the-badge)
![License](https://img.shields.io/github/license/zamnice/zorey-ai-test?style=for-the-badge)
![Deploy to Netlify](https://img.shields.io/netlify/1234abcd-ef56-gh78-ijkl-90mnopqrstuv?label=Netlify%20Status&style=for-the-badge)
![PWA Ready](https://img.shields.io/badge/PWA-ready-orange?style=for-the-badge)

> ZoreyAI adalah aplikasi asisten pintar berbasis **AI dan PWA**, dibuat dengan cinta oleh pelajar kreatif untuk pelajar dan pengguna aktif lainnya. Bisa dipasang ke homescreen, digunakan offline, dan dibagikan ke mana-mana!

---

## 🧠 Fitur Keren

- ✅ **Chat Assistant AI** (Gemma/Gemini/OpenAI ready)
- 🌑 **Dark/Light Mode**
- 🔗 **Share & Copy Response**
- 📥 **Installable PWA** – Bisa seperti aplikasi native
- 📲 **Mobile & Desktop Friendly**
- 🗂️ **Offline Support + Autosave**
- 💬 **Multilingual Coming Soon!**
- 🔧 **Mudah dikembangkan & open for collab!**

---

## 🚀 Live Demo

🔗 **[https://zorey-ai.netlify.app](https://zorey-ai.netlify.app)**  
📱 **Install seperti aplikasi!** Cukup buka via browser Chrome/Edge, klik "Add to Home Screen".

---

## 📦 Teknologi Utama

| Teknologi       | Fungsi                         |
|----------------|--------------------------------|
| HTML5 + Tailwind CSS | UI minimalis & responsif     |
| JavaScript (Vanilla) | Logika interaktif & ringan   |
| Service Worker + Manifest | Offline support & PWA    |
| OpenAI/Gemma API | Mesin AI Chat utama (optional) |
| GitHub Codespace | Dev environment fleksibel     |
| Netlify         | Hosting & deploy super cepat   |

---

## 📁 Struktur Folder

ZoreyAI/ ├── public/ │   ├── favicon.ico │   └── manifest.json ├── src/ │   ├── assets/ │   ├── components/ │   ├── pages/ │   └── styles/ ├── index.html ├── service-worker.js └── package.json

---

## ⚙️ Cara Install Lokal

```bash
git clone https://github.com/merakitzam/ZoreyAI.git
cd ZoreyAI
npm install
npm run dev

Untuk deploy statis ke Netlify:

npm run build
```


---

📖 API & Konfigurasi

🔐 API Key (Gemini/Gemma/OpenAI)

1. Buat file .env:



API_KEY_GEMINI=your_key_here

2. Gunakan di JS (opsional proxy):



fetch("https://proxy.example.com/gemini", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${API_KEY_GEMINI}`
  },
  body: JSON.stringify({ prompt: "Halo" })
})

> Gunakan proxy untuk menyembunyikan API key (misal via Replit, Cloudflare Worker, atau backend sederhana Node.js).




---

🧩 API Response Format (Contoh Output)

{
  "response": "Halo! Saya ZoreyAI, siap membantu.",
  "source": "Gemini API"
}


---

🧑‍💻 Kontribusi

1. Fork repositori ini


2. Buat branch fitur: git checkout -b fitur-baru


3. Commit perubahanmu: git commit -m 'Tambah fitur baru'


4. Push: git push origin fitur-baru


5. Buka Pull Request ❤️




---

📜 Lisensi

ZoreyAI dirilis dengan GNU Affero General Public License v3.0
📄 Lihat selengkapnya di LICENSE

> Kamu boleh menggunakan, memodifikasi, dan menyebarkan ulang versi ini.
Jika kamu menyajikan ZoreyAI secara publik (misal deploy ke website), kamu wajib membagikan kode sumbernya juga.
Ini menjaga keadilan, kebebasan, dan kolaborasi. ✊




---

✨ Terinspirasi & Dibuat Oleh

ZAM ZAM – Pelajar Super Aktif
🔥 @merakitzam | 🌐 tugasfy.zone.id

Proyek ini merupakan bagian dari:

> 🎓 Komunitas PASTIOW
💡 MerakitZAM Build School
🚀 Tugasfy AI & EduTech Initiative




---

💬 Kata Penutup

> "ZoreyAI bukan hanya proyek. Ini adalah alat bantu belajar, pencipta produktivitas, dan permulaan revolusi AI versi pelajar."
