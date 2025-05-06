import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  displayName: text("display_name"),
  email: text("email").notNull().unique(),
  photoURL: text("photo_url"),
  role: text("role").default("student").notNull(), // student or teacher
  uid: text("uid").notNull().unique(), // Firebase auth user ID
});

export const insertUserSchema = createInsertSchema(users).pick({
  displayName: true,
  email: true,
  photoURL: true,
  role: true,
  uid: true,
});

// Notes schema
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  subject: text("subject"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNoteSchema = createInsertSchema(notes).pick({
  userId: true,
  title: true,
  content: true,
  subject: true,
  tags: true,
});

// Flashcards schema
export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  noteId: integer("note_id"),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFlashcardSchema = createInsertSchema(flashcards).pick({
  userId: true,
  noteId: true,
  question: true,
  answer: true,
  tags: true,
});

// Tasks schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  priority: text("priority").default("medium"), // low, medium, high, urgent
  status: text("status").default("pending"), // pending, in-progress, completed
  subject: text("subject"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  title: true,
  description: true,
  dueDate: true,
  priority: true,
  status: true,
  subject: true,
});

// Study sessions schema
export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subject: text("subject"),
  duration: integer("duration").notNull(), // in minutes
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  focusScore: integer("focus_score"), // percentage of time focused
  notes: text("notes"),
});

export const insertStudySessionSchema = createInsertSchema(studySessions).pick({
  userId: true,
  subject: true,
  duration: true,
  startTime: true,
  endTime: true,
  focusScore: true,
  notes: true,
});

// Book marketplace listings
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // seller
  title: text("title").notNull(),
  author: text("author").notNull(),
  edition: text("edition"),
  condition: text("condition").notNull(), // new, like-new, good, fair, poor
  originalPrice: integer("original_price"), // cents
  price: integer("price").notNull(), // cents
  description: text("description"),
  subject: text("subject"),
  imageUrl: text("image_url"),
  status: text("status").default("available"), // available, sold, reserved
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookSchema = createInsertSchema(books).pick({
  userId: true,
  title: true, 
  author: true,
  edition: true,
  condition: true,
  originalPrice: true,
  price: true,
  description: true,
  subject: true,
  imageUrl: true,
});

// Assignments for teachers
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date"),
  subject: text("subject"),
  points: integer("points"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAssignmentSchema = createInsertSchema(assignments).pick({
  teacherId: true,
  title: true,
  description: true,
  dueDate: true,
  subject: true,
  points: true,
});

// Student assignment submissions
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull(),
  studentId: integer("student_id").notNull(),
  content: text("content"),
  fileUrl: text("file_url"),
  grade: integer("grade"),
  feedback: text("feedback"),
  status: text("status").default("submitted"), // draft, submitted, graded
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  gradedAt: timestamp("graded_at"),
});

export const insertSubmissionSchema = createInsertSchema(submissions).pick({
  assignmentId: true,
  studentId: true,
  content: true,
  fileUrl: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
