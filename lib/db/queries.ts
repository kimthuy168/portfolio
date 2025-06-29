import 'server-only';

import { and, asc, desc, eq, gt, gte, inArray, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { contact, experiences, projects, SkillInsert, skills, users } from './schema';

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client,{schema});

export async function createUser(
  email: string,
  password: string | null,
  provider: string,
  name: string,
  role: string = "user"
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

interface GetProjectsFilters {
  published?: boolean;
  featured?: boolean;
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
    .limit(1)

  return result[0] || null
}
export async function getProjects(filters: GetProjectsFilters) {
  const conditions = [];

  if (filters.published === true) {
    conditions.push(eq(projects.published, true));
  }

  if (filters.featured === true) {
    conditions.push(eq(projects.featured, true));
  }

  return await db
    .select()
    .from(projects)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(projects.createdAt));
}

export async function getProjectById(id: number) {
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
  return result[0]
}

export async function updateProject(id: number, data: {
  title: string
  description: string
  longDescription: string
  imageUrl: string
  demoUrl: string
  githubUrl: string
  technologies: string[]
  featured: boolean
  published: boolean
}) {
  const result = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning()

  return result[0]
}

export async function createProject(data: {
  title: string
  description: string
  longDescription: string
  imageUrl: string
  demoUrl: string
  githubUrl: string
  technologies: string[]
  featured: boolean
  published: boolean
}) {
  const result = await db
    .insert(projects)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  return result[0]
}


export async function deleteProject(id: number) {
  const result = await db.delete(projects).where(eq(projects.id, id)).returning()
  return result[0]
}

export async function getAllContacts() {
  return await db.select().from(contact).orderBy(desc(contact.createdAt))
}

export async function createContact(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  return await db
    .insert(contact)
    .values({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      read: false,
    })
    .returning()
}


export async function updateContactReadStatus(id: number, read: boolean) {
  const result = await db
    .update(contact)
    .set({ read })
    .where(eq(contact.id, id))
    .returning()

  return result[0]
}

export async function deleteContact(id: number) {
  const result = await db.delete(contact).where(eq(contact.id, id)).returning()
  return result[0]
}

export async function getAllSkills() {
  return db.select().from(skills).orderBy(desc(skills.createdAt))
}

export async function updateSkill(id: number, data: {
  name: string
  category: string
  level: number
  icon: string
  published: boolean
}) {
  const [updated] = await db
    .update(skills)
    .set({
      name: data.name,
      category: data.category,
      icon: data.icon,
      published: data.published,
      level: data.level
    })
    .where(eq(skills.id, id))
    .returning()

  return updated
}

export async function createSkill(data: SkillInsert) {
  const result = await db
    .insert(skills)
    .values({
      ...data,
      level: Number(data.level),
      createdAt: new Date(),
    })
    .returning()

  return result[0]
}

export async function deleteSkill(id: number) {
  const [deleted] = await db.delete(skills).where(eq(skills.id, id)).returning()
  return deleted
}


export async function getExperiences(publishedOnly: boolean = false) {
  if (publishedOnly) {
    return await db
      .select()
      .from(experiences)
      .where(eq(experiences.published, true))
      .orderBy(desc(experiences.startDate))
  }

  return await db
    .select()
    .from(experiences)
    .orderBy(desc(experiences.startDate))
}

export async function createExperience(data: {
  company: string
  position: string
  description: string
  startDate: Date | string
  endDate?: Date | string | null
  current?: boolean
  published?: boolean
}) {
  return await db
    .insert(experiences)
    .values({
      company: data.company,
      position: data.position,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current ?? false,
      published: data.published ?? true,
    })
    .returning()
}


export async function updateExperience(id: number, data: {
  company: string
  position: string
  description: string
  startDate: Date | string
  endDate?: Date | string | null
  current: boolean
  published: boolean
}) {
  const result = await db
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
    .returning()

  return result[0]
}

export async function deleteExperience(id: number) {
  const result = await db.delete(experiences).where(eq(experiences.id, id)).returning()
  return result[0]
}

