import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { InferInsertModel } from "drizzle-orm";

// USERS
export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password"),
  name: text("name").notNull(),
  role: text("role").default("admin"),
  provider: text("provider").default("credentials"),
  createdAt: timestamp("created_at").defaultNow(),
});

// SOCIAL ACCOUNTS
export const socialAccounts = pgTable("social_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  account: text("account"),
  accountName: text("account_name"),
  accountType: text("account_type"),
  createdAt: timestamp("created_at").defaultNow(),
});

// HERO SECTIONS
export const heroSections = pgTable("hero_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  socialAccountId: uuid("social_account_id").references(() => socialAccounts.id, { onDelete: "set null" }).array(),

  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  email: text("email").notNull(),
  cvUrl: text("cv_url"),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// MAIN HEADERS
export const mainHeaders = pgTable("main_headers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  socialAccountId: uuid("social_account_id").references(() => socialAccounts.id, { onDelete: "set null" }).array(),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// MAIN FOOTERS
export const mainFooters = pgTable("main_footers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  socialAccountId: uuid("social_account_id").references(() => socialAccounts.id, { onDelete: "set null" }).array(),
  descriptionMyself: text("description_myself").notNull(),
  phone: integer("phone"),
  adress: text("adress").notNull(),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// PROJECTS
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
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
});

// SKILLS
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  level: integer("level").notNull(),
  icon: text("icon"),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// EXPERIENCES
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  company: text("company").notNull(),
  position: text("position").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  current: boolean("current").default(false),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// CONTACT
export const contact = pgTable("contact", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

export type Contact = typeof contact.$inferSelect;

export type HeroSection = typeof heroSections.$inferSelect;
export type MainHeader = typeof mainHeaders.$inferSelect;
export type MainFooter = typeof mainFooters.$inferSelect;

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type NewSocialAccount = typeof socialAccounts.$inferInsert;

export type SkillInsert = InferInsertModel<typeof skills>;
