import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import * as QRCode from 'qrcode';
import { storage } from '../storage';
import { gameEngine } from './gameEngine';
import { languageManager } from './languageManager';

class WhatsAppService {
  private client: Client | null = null;
  private qrString: string | null = null;
  private isReady = false;

  async initialize() {
    if (this.client) {
      return;
    }

    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    });

    this.client.on('qr', (qr) => {
      this.qrString = qr;
      console.log('QR Code generated');
    });

    this.client.on('ready', async () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
      this.qrString = null;
      
      // Update bot settings
      const currentSettings = await storage.getBotSettings();
      if (currentSettings) {
        await storage.updateBotSettings({
          commandPrefix: currentSettings.commandPrefix,
          defaultLanguage: currentSettings.defaultLanguage,
          welcomeMessage: currentSettings.welcomeMessage,
          autoResponse: currentSettings.autoResponse
        });
      }
    });

    this.client.on('message', async (message) => {
      await this.handleMessage(message);
    });

    this.client.on('disconnected', async () => {
      console.log('WhatsApp client disconnected');
      this.isReady = false;
      this.qrString = null;
      
      // Update bot settings
      const currentSettings = await storage.getBotSettings();
      if (currentSettings) {
        await storage.updateBotSettings({
          commandPrefix: currentSettings.commandPrefix,
          defaultLanguage: currentSettings.defaultLanguage,
          welcomeMessage: currentSettings.welcomeMessage,
          autoResponse: currentSettings.autoResponse
        });
      }
    });

    await this.client.initialize();
  }

  async handleMessage(message: any) {
    try {
      if (message.from === 'status@broadcast') return;
      
      const phoneNumber = message.from;
      const messageText = message.body.trim();
      
      // Get or create user session
      let userSession = await storage.getUserSession(phoneNumber);
      if (!userSession) {
        userSession = await storage.saveUserSession({
          phoneNumber,
          language: 'en',
          usedQuestions: []
        });
      }

      const settings = await storage.getBotSettings();
      if (!settings) return;

      // Check if message starts with command prefix
      if (messageText.startsWith(settings.commandPrefix)) {
        const command = messageText.slice(1).toLowerCase();
        await this.handleCommand(command, phoneNumber, userSession, message);
      } else {
        // Check if user is in a game
        const activeGame = await this.getActiveGame(phoneNumber);
        if (activeGame) {
          await gameEngine.handleGameInput(activeGame, messageText, phoneNumber, message, this);
        } else if (settings.autoResponse) {
          // Send welcome message for non-command messages
          const response = languageManager.getMessage('welcome', userSession.language);
          await message.reply(response);
        }
      }

      // Update message count
      await this.incrementMessageCount();
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  async handleCommand(command: string, phoneNumber: string, userSession: any, message: any) {
    const gameSettings = await storage.getGameSettings();
    
    // Language commands
    if (command === 'fr' || command === 'français') {
      await storage.updateUserSession(phoneNumber, { language: 'fr' });
      const response = languageManager.getMessage('languageChanged', 'fr');
      await message.reply(response);
      return;
    }
    
    if (command === 'en' || command === 'english') {
      await storage.updateUserSession(phoneNumber, { language: 'en' });
      const response = languageManager.getMessage('languageChanged', 'en');
      await message.reply(response);
      return;
    }

    // Help command
    if (command === 'help' || command === 'aide') {
      const response = languageManager.getHelpMessage(userSession.language, gameSettings);
      await message.reply(response);
      return;
    }

    // Game commands
    const gameCommand = `.${command}`;
    const game = gameSettings.find(g => g.command === gameCommand && g.enabled);
    
    if (game) {
      await gameEngine.startGame(game.gameName, phoneNumber, userSession.language, message, this);
    } else {
      const response = languageManager.getMessage('unknownCommand', userSession.language);
      await message.reply(response);
    }
  }

  async getActiveGame(phoneNumber: string) {
    const gameTypes = ['ticTacToe', 'emojiQuiz', 'wordGuess', 'riddles'];
    for (const gameType of gameTypes) {
      const gameState = await storage.getGameState(phoneNumber, gameType);
      if (gameState) {
        return gameState;
      }
    }
    return null;
  }

  async sendMessage(phoneNumber: string, message: string) {
    if (!this.client || !this.isReady) {
      throw new Error('WhatsApp client not ready');
    }
    
    const chatId = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;
    await this.client.sendMessage(chatId, message);
  }

  async getConnectionStatus() {
    return {
      isConnected: this.isReady,
      hasQR: !!this.qrString,
      phoneNumber: this.isReady ? this.client?.info?.wid?.user : null
    };
  }

  async getQRCode() {
    if (!this.qrString) {
      return null;
    }
    
    try {
      const qrDataURL = await QRCode.toDataURL(this.qrString);
      return qrDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.client = null;
      this.isReady = false;
      this.qrString = null;
    }
  }

  private async incrementMessageCount() {
    const stats = await storage.getBotStats();
    const newCount = parseInt(stats.messagesCount) + 1;
    await storage.updateBotStats({ messagesCount: newCount.toString() });
  }
}

export const whatsappService = new WhatsAppService();
