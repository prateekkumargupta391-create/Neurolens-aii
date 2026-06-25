import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

// Topics Table - For storing our 20-30 comprehensive neuroscience topics
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(), // e.g., 'Memory', 'Attention', 'Sleep', 'Learning', 'Habits', 'Dopamine', 'Emotions', 'Stress', 'Motivation', 'Decision Making'
  tagline: text("tagline").notNull(),
  simpleExplanation: text("simple_explanation").notNull(),
  realLifeExamples: jsonb("real_life_examples").$type<string[]>().notNull(), // array of strings
  whyItMatters: text("why_it_matters").notNull(),
  commonMisconceptions: jsonb("common_misconceptions").$type<{ myth: string; truth: string }[]>().notNull(), // Array of myth/truth objects
  keyTakeaways: jsonb("key_takeaways").$type<string[]>().notNull(), // Array of core bullet points
  references: text("references").notNull(), // scientific papers & journals
  relatedTopics: jsonb("related_topics").$type<{ title: string; slug: string }[]>().notNull(), // Slugs & titles of related topics
});

// Daily Facts Table - Premium facts to display on the home screen
export const dailyFacts = pgTable("daily_facts", {
  id: serial("id").primaryKey(),
  fact: text("fact").notNull(),
  explanation: text("explanation").notNull(),
  category: text("category").notNull(), // e.g., 'Neuroanatomy', 'Neurotransmitters', etc.
  source: text("source").default("Neuroscience Journal"),
});

// Quizzes Table - Interactive quiz questions with explanations
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'Memory', 'Sleep', 'Habits', 'Emotions', 'Learning', 'Dopamine'
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull(), // List of 4 multiple choice options
  correctAnswerIndex: integer("correct_answer_index").notNull(), // Index of correct option (0-3)
  explanation: text("explanation").notNull(), // Explanation shown after answering
});

// AI Chats Table - Saved neuroscience AI conversations
export const aiChats = pgTable("ai_chats", {
  id: serial("id").primaryKey(),
  userQuery: text("user_query").notNull(),
  aiResponse: text("ai_response").notNull(),
  category: text("category").notNull(), // Category of the prompt
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
