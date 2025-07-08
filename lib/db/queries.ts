import 'server-only';

import {
  and,
  asc,
  desc,
  eq,
  inArray,
  sql,
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  users,
  projects,
  skills,
  experiences,
  contact,
  heroSections,
  mainHeaders,
  mainFooters,
  socialAccounts,
  SkillInsert,
} from './schema';
import * as schema from './schema';

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client, { schema });

// --- USER FUNCTIONS ---

export async function createUser(
  email: string,
  password: string | null,
  provider: string,
  name: string,
  role: string = 'user'
) {
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password: password ?? null,
      name,
      provider,
      role,
    })
    .returning();

  return newUser;
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

export async function getUserById(userId: string) {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] || null;
}

// --- SOCIAL ACCOUNTS ---

export async function createSocialAccount(data: {
  userId: string;
  githubAccount?: string;
  linkedinAccount?: string;
  telegramAccount?: string;
}) {
  const [social] = await db
    .insert(socialAccounts)
    .values({
      userId: data.userId,
      githubAccount: data.githubAccount ?? null,
      linkedinAccount: data.linkedinAccount ?? null,
      telegramAccount: data.telegramAccount ?? null,
      createdAt: new Date(),
    })
    .returning();

  return social;
}

export async function getSocialAccountByUserId(userId: string) {
  const result = await db.select().from(socialAccounts).where(eq(socialAccounts.userId, userId)).limit(1);
  return result[0] || null;
}

export async function updateSocialAccount(id: number, data: {
  githubAccount?: string;
  linkedinAccount?: string;
  telegramAccount?: string;
}) {
  const [updated] = await db
    .update(socialAccounts)
    .set({
      githubAccount: data.githubAccount ?? null,
      linkedinAccount: data.linkedinAccount ?? null,
      telegramAccount: data.telegramAccount ?? null,
    })
    .where(eq(socialAccounts.id, id))
    .returning();

  return updated;
}

// --- PROJECTS ---

export async function createProject(data: {
  userId: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
}) {
  const [project] = await db
    .insert(projects)
    .values({
      userId: data.userId,
      title: data.title,
      description: data.description,
      longDescription: data.longDescription ?? null,
      imageUrl: data.imageUrl ?? null,
      demoUrl: data.demoUrl ?? null,
      githubUrl: data.githubUrl ?? null,
      technologies: data.technologies,
      featured: data.featured,
      published: data.published,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return project;
}

export async function getProjectsByUserId(userId: string) {
  return await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt));
}

export async function updateProject(id: number, data: {
  title: string;
  description: string;
  longDescription?: string;
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
}) {
  const [updated] = await db
    .update(projects)
    .set({
      title: data.title,
      description: data.description,
      longDescription: data.longDescription ?? null,
      imageUrl: data.imageUrl ?? null,
      demoUrl: data.demoUrl ?? null,
      githubUrl: data.githubUrl ?? null,
      technologies: data.technologies,
      featured: data.featured,
      published: data.published,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  return updated;
}

export async function deleteProject(id: number) {
  const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning();
  return deleted;
}

// --- SKILLS ---

export async function createSkill(data: SkillInsert & { userId: string }) {
  const [skill] = await db
    .insert(skills)
    .values({
      userId: data.userId,
      name: data.name,
      category: data.category,
      level: Number(data.level),
      icon: data.icon ?? null,
      published: data.published ?? true,
      createdAt: new Date(),
    })
    .returning();

  return skill;
}

export async function getSkillsByUserId(userId: string) {
  return await db.select().from(skills).where(eq(skills.userId, userId)).orderBy(desc(skills.createdAt));
}

export async function updateSkill(id: number, data: {
  name: string;
  category: string;
  level: number;
  icon?: string | null;
  published: boolean;
}) {
  const [updated] = await db
    .update(skills)
    .set({
      name: data.name,
      category: data.category,
      level: data.level,
      icon: data.icon ?? null,
      published: data.published,
    })
    .where(eq(skills.id, id))
    .returning();

  return updated;
}

export async function deleteSkill(id: number) {
  const [deleted] = await db.delete(skills).where(eq(skills.id, id)).returning();
  return deleted;
}

// --- EXPERIENCES ---

export async function createExperience(data: {
  userId: string;
  company: string;
  position: string;
  description: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current?: boolean;
  published?: boolean;
}) {
  const [experience] = await db
    .insert(experiences)
    .values({
      userId: data.userId,
      company: data.company,
      position: data.position,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current ?? false,
      published: data.published ?? true,
      createdAt: new Date(),
    })
    .returning();

  return experience;
}

export async function getExperiencesByUserId(userId: string, publishedOnly: boolean = false) {
  if (publishedOnly) {
    return await db
      .select()
      .from(experiences)
      .where(and(eq(experiences.userId, userId), eq(experiences.published, true)))
      .orderBy(desc(experiences.startDate));
  }

  return await db
    .select()
    .from(experiences)
    .where(eq(experiences.userId, userId))
    .orderBy(desc(experiences.startDate));
}

export async function updateExperience(id: number, data: {
  company: string;
  position: string;
  description: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  published: boolean;
}) {
  const [updated] = await db
    .update(experiences)
    .set({
      company: data.company,
      position: data.position,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current,
      published: data.published,
    })
    .where(eq(experiences.id, id))
    .returning();

  return updated;
}

export async function deleteExperience(id: number) {
  const [deleted] = await db.delete(experiences).where(eq(experiences.id, id)).returning();
  return deleted;
}

// --- CONTACT ---

export async function createContact(data: {
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const [contactEntry] = await db
    .insert(contact)
    .values({
      userId: data.userId,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      read: false,
      createdAt: new Date(),
    })
    .returning();

  return contactEntry;
}

export async function getContactsByUserId(userId: string) {
  return await db.select().from(contact).where(eq(contact.userId, userId)).orderBy(desc(contact.createdAt));
}

export async function updateContactReadStatus(id: number, read: boolean) {
  const [updated] = await db
    .update(contact)
    .set({ read })
    .where(eq(contact.id, id))
    .returning();

  return updated;
}

export async function deleteContact(id: number) {
  const [deleted] = await db.delete(contact).where(eq(contact.id, id)).returning();
  return deleted;
}

// --- HERO SECTIONS ---

export async function createHeroSection(data: {
  userId: string;
  socialAccountId?: number;
  title: string;
  subtitle: string;
  description: string;
  email: string;
  cvUrl?: string;
  published?: boolean;
}) {
  const [heroSection] = await db
    .insert(heroSections)
    .values({
      userId: data.userId,
      socialAccountId: data.socialAccountId ?? null,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      email: data.email,
      cvUrl: data.cvUrl ?? null,
      published: data.published ?? true,
      createdAt: new Date(),
    })
    .returning();

  return heroSection;
}

export async function getHeroSectionsByUserId(userId: string) {
  return await db.select().from(heroSections).where(eq(heroSections.userId, userId));
}

// --- MAIN HEADERS ---

export async function createMainHeader(data: {
  userId: string;
  socialAccountId?: number;
  userName: string;
  email: string;
  published?: boolean;
}) {
  const [header] = await db
    .insert(mainHeaders)
    .values({
      userId: data.userId,
      socialAccountId: data.socialAccountId ?? null,
      userName: data.userName,
      email: data.email,
      published: data.published ?? true,
      createdAt: new Date(),
    })
    .returning();

  return header;
}

export async function getMainHeadersByUserId(userId: string) {
  return await db.select().from(mainHeaders).where(eq(mainHeaders.userId, userId));
}

// --- MAIN FOOTERS ---

export async function createMainFooter(data: {
  userId: string;
  socialAccountId?: number;
  userName: string;
  descriptionMyself: string;
  email: string;
  phone?: number;
  adress: string;
  published?: boolean;
}) {
  const [footer] = await db
    .insert(mainFooters)
    .values({
      userId: data.userId,
      socialAccountId: data.socialAccountId ?? null,
      userName: data.userName,
      descriptionMyself: data.descriptionMyself,
      email: data.email,
      phone: data.phone ?? null,
      adress: data.adress,
      published: data.published ?? true,
      createdAt: new Date(),
    })
    .returning();

  return footer;
}

export async function getMainFootersByUserId(userId: string) {
  return await db.select().from(mainFooters).where(eq(mainFooters.userId, userId));
}

export async function getUserWithSocialByUserId(id: string) {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      provider: users.provider,
      createdAt: users.createdAt,
      githubAccount: socialAccounts.githubAccount,
      linkedinAccount: socialAccounts.linkedinAccount,
      telegramAccount: socialAccounts.telegramAccount,
    })
    .from(users)
    .leftJoin(socialAccounts, eq(users.id, socialAccounts.userId))
    .where(eq(users.id, id))
    .limit(1)

  const user = result[0]

  if (!user) return null

  return {
    ...user,
    socialAccount: {
      githubAccount: user.githubAccount,
      linkedinAccount: user.linkedinAccount,
      telegramAccount: user.telegramAccount,
    },
  }
}