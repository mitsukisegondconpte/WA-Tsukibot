import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { whatsappService } from "./services/whatsapp";
import { insertBotSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bot settings routes
  app.get("/api/bot/settings", async (req, res) => {
    try {
      const settings = await storage.getBotSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot settings" });
    }
  });

  app.post("/api/bot/settings", async (req, res) => {
    try {
      const validatedData = insertBotSettingsSchema.parse(req.body);
      const settings = await storage.updateBotSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Game settings routes
  app.get("/api/games/settings", async (req, res) => {
    try {
      const gameSettings = await storage.getGameSettings();
      res.json(gameSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get game settings" });
    }
  });

  app.patch("/api/games/:gameName/toggle", async (req, res) => {
    try {
      const { gameName } = req.params;
      const { enabled } = req.body;
      const gameSettings = await storage.updateGameSetting(gameName, enabled);
      res.json(gameSettings);
    } catch (error) {
      res.status(400).json({ message: "Failed to update game setting" });
    }
  });

  // WhatsApp connection routes
  app.get("/api/whatsapp/status", async (req, res) => {
    try {
      const status = await whatsappService.getConnectionStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to get WhatsApp status" });
    }
  });

  app.post("/api/whatsapp/connect", async (req, res) => {
    try {
      await whatsappService.initialize();
      res.json({ message: "WhatsApp connection initialized" });
    } catch (error) {
      res.status(500).json({ message: "Failed to initialize WhatsApp connection" });
    }
  });

  app.post("/api/whatsapp/disconnect", async (req, res) => {
    try {
      await whatsappService.disconnect();
      res.json({ message: "WhatsApp disconnected" });
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect WhatsApp" });
    }
  });

  app.get("/api/whatsapp/qr", async (req, res) => {
    try {
      const qrCode = await whatsappService.getQRCode();
      if (qrCode) {
        res.json({ qrCode });
      } else {
        res.status(404).json({ message: "No QR code available" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get QR code" });
    }
  });

  // Bot stats routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getBotStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot stats" });
    }
  });

  // Activity log routes
  app.get("/api/activity", async (req, res) => {
    try {
      const activities = [
        { id: "1", message: "User started Tic Tac Toe", timestamp: new Date(Date.now() - 2 * 60 * 1000) },
        { id: "2", message: "Language changed to French", timestamp: new Date(Date.now() - 5 * 60 * 1000) },
        { id: "3", message: "Emoji Quiz completed", timestamp: new Date(Date.now() - 12 * 60 * 1000) },
      ];
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to get activities" });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize WhatsApp service
  whatsappService.initialize().catch(console.error);

  return httpServer;
}
