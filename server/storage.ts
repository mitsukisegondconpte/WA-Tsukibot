import { 
  type User, 
  type InsertUser, 
  type BotSettings, 
  type InsertBotSettings,
  type GameSettings,
  type InsertGameSettings,
  type GameState,
  type InsertGameState,
  type UserSession,
  type InsertUserSession,
  type BotStats
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getBotSettings(): Promise<BotSettings | undefined>;
  updateBotSettings(settings: InsertBotSettings): Promise<BotSettings>;
  
  getGameSettings(): Promise<GameSettings[]>;
  updateGameSetting(gameName: string, enabled: boolean): Promise<GameSettings>;
  
  getGameState(userId: string, gameType: string): Promise<GameState | undefined>;
  saveGameState(gameState: InsertGameState): Promise<GameState>;
  deleteGameState(userId: string, gameType: string): Promise<void>;
  
  getUserSession(phoneNumber: string): Promise<UserSession | undefined>;
  saveUserSession(session: InsertUserSession): Promise<UserSession>;
  updateUserSession(phoneNumber: string, updates: Partial<UserSession>): Promise<UserSession>;
  
  getBotStats(): Promise<BotStats>;
  updateBotStats(stats: Partial<BotStats>): Promise<BotStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private botSettings: BotSettings | undefined;
  private gameSettings: Map<string, GameSettings>;
  private gameStates: Map<string, GameState>;
  private userSessions: Map<string, UserSession>;
  private botStats: BotStats;

  constructor() {
    this.users = new Map();
    this.gameSettings = new Map();
    this.gameStates = new Map();
    this.userSessions = new Map();
    
    // Initialize default bot settings
    this.botSettings = {
      id: randomUUID(),
      commandPrefix: ".",
      defaultLanguage: "en",
      welcomeMessage: `Bonjou! / Hello! 👋
Chwazi lang ou / Choose your language:
🇫🇷 Tapez .fr pour Français
🇺🇸 Type .en for English`,
      autoResponse: true,
      isConnected: false,
      connectedNumber: null,
      updatedAt: new Date(),
    };

    // Initialize default game settings
    const defaultGames = [
      { gameName: "ticTacToe", command: ".tictactoe", description: "Classic 3x3 grid game", enabled: true },
      { gameName: "emojiQuiz", command: ".emojiquiz", description: "Guess words from emoji clues", enabled: true },
      { gameName: "wordGuess", command: ".mokache", description: "Hidden word guessing game", enabled: true },
      { gameName: "riddles", command: ".riddle", description: "Riddle and proverb challenges", enabled: true },
    ];

    defaultGames.forEach(game => {
      const gameSettings: GameSettings = {
        id: randomUUID(),
        gameName: game.gameName,
        command: game.command,
        description: game.description,
        enabled: game.enabled,
        updatedAt: new Date(),
      };
      this.gameSettings.set(game.gameName, gameSettings);
    });

    // Initialize bot stats
    this.botStats = {
      id: randomUUID(),
      activeUsers: "0",
      gamesPlayed: "0",
      messagesCount: "0",
      uptime: "99.9%",
      lastUpdated: new Date(),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBotSettings(): Promise<BotSettings | undefined> {
    return this.botSettings;
  }

  async updateBotSettings(settings: InsertBotSettings): Promise<BotSettings> {
    if (!this.botSettings) {
      this.botSettings = {
        id: randomUUID(),
        commandPrefix: settings.commandPrefix || ".",
        defaultLanguage: settings.defaultLanguage || "en",
        welcomeMessage: settings.welcomeMessage || "",
        autoResponse: settings.autoResponse || true,
        isConnected: false,
        connectedNumber: null,
        updatedAt: new Date(),
      };
    } else {
      this.botSettings = {
        ...this.botSettings,
        commandPrefix: settings.commandPrefix || this.botSettings.commandPrefix,
        defaultLanguage: settings.defaultLanguage || this.botSettings.defaultLanguage,
        welcomeMessage: settings.welcomeMessage || this.botSettings.welcomeMessage,
        autoResponse: settings.autoResponse !== undefined ? settings.autoResponse : this.botSettings.autoResponse,
        updatedAt: new Date(),
      };
    }
    return this.botSettings;
  }

  async getGameSettings(): Promise<GameSettings[]> {
    return Array.from(this.gameSettings.values());
  }

  async updateGameSetting(gameName: string, enabled: boolean): Promise<GameSettings> {
    const existing = this.gameSettings.get(gameName);
    if (!existing) {
      throw new Error(`Game ${gameName} not found`);
    }
    const updated = { ...existing, enabled, updatedAt: new Date() };
    this.gameSettings.set(gameName, updated);
    return updated;
  }

  async getGameState(userId: string, gameType: string): Promise<GameState | undefined> {
    return this.gameStates.get(`${userId}-${gameType}`);
  }

  async saveGameState(gameState: InsertGameState): Promise<GameState> {
    const id = randomUUID();
    const state: GameState = {
      id,
      userId: gameState.userId,
      gameType: gameState.gameType,
      state: gameState.state,
      language: gameState.language || "en",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.gameStates.set(`${gameState.userId}-${gameState.gameType}`, state);
    return state;
  }

  async deleteGameState(userId: string, gameType: string): Promise<void> {
    this.gameStates.delete(`${userId}-${gameType}`);
  }

  async getUserSession(phoneNumber: string): Promise<UserSession | undefined> {
    return this.userSessions.get(phoneNumber);
  }

  async saveUserSession(session: InsertUserSession): Promise<UserSession> {
    const id = randomUUID();
    const userSession: UserSession = {
      id,
      phoneNumber: session.phoneNumber,
      language: session.language || "en",
      usedQuestions: session.usedQuestions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userSessions.set(session.phoneNumber, userSession);
    return userSession;
  }

  async updateUserSession(phoneNumber: string, updates: Partial<UserSession>): Promise<UserSession> {
    const existing = this.userSessions.get(phoneNumber);
    if (!existing) {
      throw new Error(`User session for ${phoneNumber} not found`);
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.userSessions.set(phoneNumber, updated);
    return updated;
  }

  async getBotStats(): Promise<BotStats> {
    // Update real-time stats
    this.botStats.activeUsers = this.userSessions.size.toString();
    this.botStats.messagesCount = Math.floor(Math.random() * 1000 + 500).toString();
    this.botStats.lastUpdated = new Date();
    return this.botStats;
  }

  async updateBotStats(stats: Partial<BotStats>): Promise<BotStats> {
    this.botStats = { ...this.botStats, ...stats, lastUpdated: new Date() };
    return this.botStats;
  }
}

export const storage = new MemStorage();
