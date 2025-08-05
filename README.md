# Bot WhatsApp Multilang ak Jwèt Entèraktif

Yon bot WhatsApp kreye pa **jeff_mitsuki** ki gen jwèt entèraktif yo tankou Tic Tac Toe, Emoji Quiz, Devinèt Mo (Mo Kache), ak Pwovèb Kase. Bot la ka pale franse ak anglè epi ou ka deploy li 100% gratis sou aparèy mobil yo.

## 🎮 Karakteristik yo

- **Jwèt Entèraktif yo:**
  - Tic Tac Toe (jwèt griy 3x3)
  - Emoji Quiz (devine mo yo ak emoji)
  - Mo Kache (jwèt mo yo ki kache)
  - Pwovèb Kase (defi pwovèb yo)

- **Sipò Plizyè Lang:**
  - Franse (Français)
  - Anglè (English)
  - Chwa lang nan kòmansman

- **Fonksyon Entelijan yo:**
  - Entèraksyon ak kòmand ak prefix ou ka chanje (pa defo: ".")
  - Li evite repete kesyon yo nan menm sesyon an
  - Repons otomatik ak sistèm èd
  - Tablo de bò yo pou siveyans nan tan reyèl

- **Deployment 100% Gratis:**
  - Pa gen okenn dépens nan konfigirasyon oswa operasyon an
  - Fonksyone sou aparèy mobil yo (Android)
  - Sipò solisyon hosting gratis yo

## 🚀 Konfigirasyon Rapid pou Android

### Etap 1: Telechaje nan GitHub

1. Ale nan repository sa a sou GitHub
2. Klike sou bouton vèt "Code" an
3. Chwazi "Download ZIP"
4. Ektè fichye ZIP la nan aparèy ou a

### Etap 2: Chwazi yon Platfòm Hosting Gratis

#### Opsyon A: Railway (Rekòmande)
1. Ale nan [railway.app](https://railway.app)
2. Ouvri kont ou ak kont GitHub ou
3. Klike "Deploy from GitHub repo"
4. Chwazi repository sa a
5. Railway ap otomatikman deploy bot ou a

#### Opsyon B: Render
1. Ale nan [render.com](https://render.com)
2. Ouvri kont ou ak kont GitHub ou
3. Klike "New +" → "Web Service"
4. Konekte kont GitHub ou a
5. Itilize paramèt sa yo:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

#### Opsyon C: Replit
1. Ale nan [replit.com](https://replit.com)
2. Klike "Create Repl"
3. Chwazi "Import from GitHub"
4. Kole URL repository ou a
5. Klike "Import from GitHub"

### Etap 3: Konfigirasyon Anviwonman

Kreye yon fichye `.env` nan rasin pwojè ou a ak:

```env
PORT=5000
NODE_ENV=production
```

### Etap 4: Konekte Bot la ak WhatsApp

1. **Kòmanse Bot la:**
   - Nan Railway/Render/Replit, bot la ap kòmanse otomatikman
   - Ou ap resevwa yon URL tankou: `https://your-app.railway.app`

2. **Aksè Dashboard la:**
   - Ouvri URL la nan browser ou a
   - Ou ap wè dashboard bot la

3. **Koneksyon WhatsApp:**
   - Nan dashboard la, klike "Connect to WhatsApp"
   - Yon QR code ap parèt
   - Ouvri WhatsApp sou telefòn ou a
   - Ale nan Settings → Linked Devices → Link a Device
   - Skane QR code la

4. **Teste Bot la:**
   - Voye yon mesaj ba ou menm nan WhatsApp
   - Tape `.help` pou wè kòmand yo
   - Tape `.fr` pou Franse oswa `.en` pou Anglè

## 🎲 Kòmand Bot yo

### Kòmand Prensipal yo:
- `.help` - Montre kòmand yo ki disponib
- `.fr` - Chanje nan Franse
- `.en` - Chanje nan Anglè

### Jwèt yo:
- `.tictactoe` - Kòmanse Tic Tac Toe
- `.emojiquiz` - Kòmanse Emoji Quiz
- `.mokache` - Kòmanse Mo Kache
- `.riddle` - Kòmanse Pwovèb Kase

## ⚙️ Jesyon ak Dashboard

Dashboard la bay ou:
- **Estatistik Bot la:** Itilizatè aktif yo, jwèt yo ki jwe, mesaj yo
- **Paramèt Bot la:** Prefix kòmand, lang pa defo, mesaj akèy
- **Jesyon Jwèt:** Aktive/Deaktive jwèt yo
- **Koneksyon WhatsApp:** Statut koneksyon ak QR code
- **Aktivite Resan yo:** Aksyon yo ki fèt resan yo

## 🔧 Konfigirasyon Avanse

### Variables Anviwonman yo:
```env
# Port pou aplikasyon an (obligatwa pou platfòm hosting)
PORT=5000

# Anviwonman (development/production)
NODE_ENV=production

# URL Database (opsyonèl - itilize memwa pa defo)
DATABASE_URL=your_database_url_here

# Non sesyon WhatsApp (opsyonèl)
WHATSAPP_SESSION_NAME=whatsapp-bot

# Konfigirasyon bot (opsyonèl - ka konfigure nan dashboard)
DEFAULT_COMMAND_PREFIX=.
DEFAULT_LANGUAGE=en
AUTO_RESPONSE=true
```

### Upload nan GitHub:

1. **Kreye Repository GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - WhatsApp Bot by jeff_mitsuki"
   git branch -M main
   git remote add origin https://github.com/your-username/whatsapp-bot.git
   git push -u origin main
   ```

2. **Upload nan GitHub Mobile:**
   - Telechaje GitHub app
   - Kreye repository nouvo
   - Upload fichye yo youn pa youn

## 🚨 Rezoud Pwoblèm yo

### Bot la pa konekte:
- Verifye si QR code la valid
- Rechèche koneksyon entènèt ou a
- Teste ak kont WhatsApp diferan

### Jwèt yo pa travay:
- Verifye si yo aktive nan dashboard la
- Teste ak kòmand help
- Rechèche aplikasyon an

### Hosting pwoblèm:
- Verifye si PORT variable la konfigire
- Gade log yo nan platfòm hosting ou a
- Asire w NODE_ENV=production

## 📱 Sipò Platfòm yo

- **Android:** ✅ Fonksyone konplètman
- **iOS:** ✅ Fonksyone konplètman
- **WhatsApp Web:** ✅ Sipòte
- **WhatsApp Business:** ✅ Fonksyone

## 🆓 Hosting Gratis yo Rekòmande

1. **Railway** - Pi fasil, auto-deploy
2. **Render** - Bon pou kòmansan yo
3. **Replit** - Pèfè pou devlopman ak teste
4. **Vercel** - Rapid ak otomatik
5. **Netlify** - Senp ak dirèk

## 📞 Sipò ak Èd

Si ou gen pwoblèm:
1. Verifye `.env` fichye ou a
2. Gade dashboard log yo
3. Teste koneksyon entènèt ou a
4. Rechèche bot la

## 🏆 Otè

**jeff_mitsuki** - Mèt pwojè a

---

# WhatsApp Bot with Interactive Games (English)

A multilingual WhatsApp bot created by **jeff_mitsuki** that features interactive games including Tic Tac Toe, Emoji Quiz, Word Guessing (Mo Kache), and Riddles (Pwovèb Kase). The bot supports both French and English languages and can be deployed completely free on mobile devices.

## 🎮 Features

- **Interactive Games:**
  - Tic Tac Toe (3x3 grid game)
  - Emoji Quiz (guess words from emoji clues)
  - Word Guessing (Mo Kache - hidden word game)
  - Riddles (Pwovèb Kase - riddle challenges)

- **Multi-language Support:**
  - French (Français)
  - English
  - Language selection at startup

- **Smart Features:**
  - Command-based interaction with customizable prefix (default: ".")
  - Avoids repeating questions in the same session
  - Automatic responses and help system
  - Real-time dashboard for monitoring

- **100% Free Deployment:**
  - No costs involved in setup or operation
  - Works on mobile devices (Android)
  - Free hosting solutions supported

## 🚀 Quick Setup for Android

### Step 1: Download from GitHub

1. Go to this repository on GitHub
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to your device

### Step 2: Choose a Free Hosting Platform

#### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "Deploy from GitHub repo"
4. Select this repository
5. Railway will automatically deploy your bot

#### Option B: Render
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Use these settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

#### Option C: Replit
1. Go to [replit.com](https://replit.com)
2. Click "Create Repl"
3. Select "Import from GitHub"
4. Paste your repository URL
5. Click "Import from GitHub"

### Step 3: Environment Setup

Create a `.env` file in your project root with:

```env
PORT=5000
NODE_ENV=production
```

### Step 4: Connect Bot to WhatsApp

1. **Start the Bot:**
   - On Railway/Render/Replit, the bot will start automatically
   - You'll receive a URL like: `https://your-app.railway.app`

2. **Access Dashboard:**
   - Open the URL in your browser
   - You'll see the bot dashboard

3. **WhatsApp Connection:**
   - In the dashboard, click "Connect to WhatsApp"
   - A QR code will appear
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices → Link a Device
   - Scan the QR code

4. **Test the Bot:**
   - Send yourself a message on WhatsApp
   - Type `.help` to see commands
   - Type `.fr` for French or `.en` for English

## 🎲 Bot Commands

### Main Commands:
- `.help` - Show available commands
- `.fr` - Change to French
- `.en` - Change to English

### Games:
- `.tictactoe` - Start Tic Tac Toe
- `.emojiquiz` - Start Emoji Quiz
- `.mokache` - Start Word Guessing
- `.riddle` - Start Riddles

## ⚙️ Management with Dashboard

The dashboard provides:
- **Bot Statistics:** Active users, games played, messages
- **Bot Settings:** Command prefix, default language, welcome message
- **Game Management:** Enable/Disable games
- **WhatsApp Connection:** Connection status and QR code
- **Recent Activity:** Recent actions performed

## 🔧 Advanced Configuration

### Environment Variables:
```env
# Port for the application (required for hosting platforms)
PORT=5000

# Environment (development/production)
NODE_ENV=production

# Database URL (optional - uses in-memory storage by default)
DATABASE_URL=your_database_url_here

# WhatsApp session name (optional)
WHATSAPP_SESSION_NAME=whatsapp-bot

# Bot configuration (optional - can be set via dashboard)
DEFAULT_COMMAND_PREFIX=.
DEFAULT_LANGUAGE=en
AUTO_RESPONSE=true
```

### Upload to GitHub:

1. **Create GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - WhatsApp Bot by jeff_mitsuki"
   git branch -M main
   git remote add origin https://github.com/your-username/whatsapp-bot.git
   git push -u origin main
   ```

2. **Upload via GitHub Mobile:**
   - Download GitHub app
   - Create new repository
   - Upload files one by one

## 🚨 Troubleshooting

### Bot not connecting:
- Verify QR code is valid
- Check your internet connection
- Try with different WhatsApp account

### Games not working:
- Verify they are enabled in dashboard
- Test with help command
- Restart the application

### Hosting issues:
- Verify PORT variable is set
- Check logs in your hosting platform
- Ensure NODE_ENV=production

## 📱 Platform Support

- **Android:** ✅ Fully functional
- **iOS:** ✅ Fully functional
- **WhatsApp Web:** ✅ Supported
- **WhatsApp Business:** ✅ Functional

## 🆓 Recommended Free Hosting

1. **Railway** - Easiest, auto-deploy
2. **Render** - Great for beginners
3. **Replit** - Perfect for development and testing
4. **Vercel** - Fast and automatic
5. **Netlify** - Simple and direct

## 📞 Support and Help

If you have issues:
1. Check your `.env` file
2. Look at dashboard logs
3. Test your internet connection
4. Restart the bot

## 🏆 Author

**jeff_mitsuki** - Project Owner

---

## 🔒 License

This project is free to use for personal and educational purposes. No warranty is provided.

## 🤝 Contributing

Feel free to contribute by:
- Adding new games
- Improving translations
- Fixing bugs
- Adding features

Contact jeff_mitsuki for collaboration.