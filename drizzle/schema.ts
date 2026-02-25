import { boolean, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 64 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 64 }),
  subscriptionStatus: mysqlEnum("subscription_status", ["free", "pro", "cancelled"]).default("free").notNull(),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here

// ─── Market Indices ──────────────────────────────────────────────
export const marketIndices = mysqlTable("market_indices", {
  id: int("id").autoincrement().primaryKey(),
  symbol: varchar("symbol", { length: 32 }).notNull(),
  name: varchar("name", { length: 64 }).notNull(),
  value: varchar("value", { length: 32 }).notNull(),
  change: varchar("change", { length: 16 }).notNull(),
  isUp: boolean("is_up").notNull().default(true),
  sparkline: json("sparkline").notNull().$type<number[]>(),
  sortOrder: int("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type MarketIndex = typeof marketIndices.$inferSelect;

// ─── Stocks ──────────────────────────────────────────────────────
export const stocks = mysqlTable("stocks", {
  id: int("id").autoincrement().primaryKey(),
  symbol: varchar("symbol", { length: 16 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  price: varchar("price", { length: 32 }).notNull(),
  change: varchar("change", { length: 16 }).notNull(),
  isUp: boolean("is_up").notNull().default(true),
  volume: varchar("volume", { length: 32 }).notNull(),
  pe: varchar("pe", { length: 16 }).notNull(),
  pb: varchar("pb", { length: 16 }).notNull(),
  marketCap: varchar("market_cap", { length: 32 }).notNull(),
  narrative: text("narrative").notNull(),
  earnings: text("earnings").notNull(),
  sortOrder: int("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Stock = typeof stocks.$inferSelect;

// ─── News ────────────────────────────────────────────────────────
export const newsItems = mysqlTable("news_items", {
  id: int("id").autoincrement().primaryKey(),
  time: varchar("time", { length: 16 }).notNull(),
  tier: mysqlEnum("tier", ["宏观", "产业", "行业", "个股"]).notNull(),
  title: text("title").notNull(),
  source: varchar("source", { length: 64 }).notNull(),
  sentiment: mysqlEnum("sentiment", ["positive", "negative", "neutral"]).notNull(),
  transmissionChain: json("transmission_chain").notNull().$type<string[]>(),
  stockImpact: json("stock_impact").notNull().$type<
    { symbol: string; impact: "positive" | "negative" | "neutral"; note: string }[]
  >(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export type NewsItem = typeof newsItems.$inferSelect;

// ─── Portfolio Holdings ──────────────────────────────────────────
export const portfolioHoldings = mysqlTable("portfolio_holdings", {
  id: int("id").autoincrement().primaryKey(),
  symbol: varchar("symbol", { length: 16 }).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  weight: varchar("weight", { length: 16 }).notNull(),
  shares: int("shares").notNull(),
  avgCost: varchar("avg_cost", { length: 32 }).notNull(),
  currentPrice: varchar("current_price", { length: 32 }).notNull(),
  gainLoss: varchar("gain_loss", { length: 16 }).notNull(),
  gainLossPercent: varchar("gain_loss_percent", { length: 16 }).notNull(),
  isUp: boolean("is_up").notNull().default(true),
  sector: varchar("sector", { length: 64 }).notNull(),
  pe: varchar("pe", { length: 16 }).notNull(),
  pb: varchar("pb", { length: 16 }).notNull(),
  marketCap: varchar("market_cap", { length: 32 }).notNull(),
  narrative: text("narrative").notNull(),
  earnings: text("earnings").notNull(),
  sortOrder: int("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioHolding = typeof portfolioHoldings.$inferSelect;

// ─── Portfolio Performance (for chart) ──────────────────────────
export const portfolioPerformance = mysqlTable("portfolio_performance", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 16 }).notNull(),
  ucCapital: varchar("uc_capital", { length: 16 }).notNull(),
  spy: varchar("spy", { length: 16 }).notNull(),
  qqq: varchar("qqq", { length: 16 }).notNull(),
  sortOrder: int("sort_order").notNull().default(0),
});

export type PortfolioPerformance = typeof portfolioPerformance.$inferSelect;

// ─── Daily Market Analysis ───────────────────────────────────────
export const dailyAnalysis = mysqlTable("daily_analysis", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 32 }).notNull(),
  sentimentScore: int("sentiment_score").notNull(),
  sentimentLabel: varchar("sentiment_label", { length: 32 }).notNull(),
  sentimentSummary: text("sentiment_summary").notNull(),
  sentimentData: json("sentiment_data").notNull().$type<
    { subject: string; value: number; fullMark: number }[]
  >(),
  fundamentalsSummary: text("fundamentals_summary").notNull(),
  fundamentalsHighlights: json("fundamentals_highlights").notNull().$type<
    { label: string; value: string; trend: string }[]
  >(),
  technicalsSummary: text("technicals_summary").notNull(),
  technicalsLevels: json("technicals_levels").notNull().$type<
    { label: string; value: string; type: string }[]
  >(),
  weeklyOutlook: varchar("weekly_outlook", { length: 32 }).notNull(),
  weeklySummary: text("weekly_summary").notNull(),
  weeklyEvents: json("weekly_events").notNull().$type<
    { date: string; event: string; importance: string }[]
  >(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DailyAnalysis = typeof dailyAnalysis.$inferSelect;