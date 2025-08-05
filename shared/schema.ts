import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const botSettings = pgTable("bot_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  commandPrefix: text("command_prefix").notNull().default("."),
  defaultLanguage: text("default_language").notNull().default("en"),
  welcomeMessage: text("welcome_message").notNull(),
  autoResponse: boolean("auto_response").notNull().default(true),
  isConnected: boolean("is_connected").notNull().default(false),
  connectedNumber: text("connected_number"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gameSettings = pgTable("game_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameName: text("game_name").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  command: text("command").notNull(),
  description: text("description").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gameStates = pgTable("game_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  gameType: text("game_type").notNull(),
  state: json("state").notNull(),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull(),
  language: text("language").notNull().default("en"),
  usedQuestions: json("used_questions").notNull().default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const botStats = pgTable("bot_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  activeUsers: text("active_users").notNull().default("0"),
  gamesPlayed: text("games_played").notNull().default("0"),
  messagesCount: text("messages_count").notNull().default("0"),
  uptime: text("uptime").notNull().default("0"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertBotSettingsSchema = createInsertSchema(botSettings).pick({
  commandPrefix: true,
  defaultLanguage: true,
  welcomeMessage: true,
  autoResponse: true,
});

export const insertGameSettingsSchema = createInsertSchema(gameSettings).pick({
  gameName: true,
  enabled: true,
  command: true,
  description: true,
});

export const insertGameStateSchema = createInsertSchema(gameStates).pick({
  userId: true,
  gameType: true,
  state: true,
  language: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).pick({
  phoneNumber: true,
  language: true,
  usedQuestions: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type BotSettings = typeof botSettings.$inferSelect;
export type InsertBotSettings = z.infer<typeof insertBotSettingsSchema>;
export type GameSettings = typeof gameSettings.$inferSelect;
export type InsertGameSettings = z.infer<typeof insertGameSettingsSchema>;
export type GameState = typeof gameStates.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type BotStats = typeof botStats.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
