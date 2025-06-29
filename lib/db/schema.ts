import { pgTable, serial, text, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core"
import { InferInsertModel } from "drizzle-orm"

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  imageUrl: text("image_url"),
  demoUrl: text("demo_url"),
  githubUrl: text("github_url"),
  technologies: text("technologies").array(),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  level: integer("level").notNull(), // 1-5 scale
  icon: text("icon"),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
})

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  current: boolean("current").default(false),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
})

export const contact = pgTable("contact", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

export const users = pgTable("users", {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password"),
  name: text("name").notNull(),
  role: text("role").default("admin"),
  provider: text("provider").default("credentials"),
  createdAt: timestamp("created_at").defaultNow(),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert
export type Experience = typeof experiences.$inferSelect
export type NewExperience = typeof experiences.$inferInsert
export type Contact = typeof contact.$inferSelect
export type User = typeof users.$inferSelect

export type SkillInsert = InferInsertModel<typeof skills>