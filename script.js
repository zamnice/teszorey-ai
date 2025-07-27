<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zorey AI</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <link rel="manifest" href="manifest.json">
</head>
<body>
    <header>
        <h1>Zorey AI</h1>
        <div class="header-actions">
            <button id="darkmode-btn"><i class="fas fa-moon"></i></button>
            <button id="share-btn"><i class="fas fa-share-alt"></i></button>
        </div>
    </header>

    <main>
        <div id="chat-container">
            <div class="ai-message">Halo! Saya Zorey AI, ada yang bisa saya bantu?</div>
        </div>

        <div class="input-area">
            <input type="text" id="user-input" placeholder="Tanya apa saja..." autofocus>
            <button id="send-btn"><i class="fas fa-paper-plane"></i></button>
        </div>
    </main>

    <script src="script.js"></script>
</body>
</html>
