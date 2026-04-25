import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertContact, contacts, Contact } from "../drizzle/schema";
import { logger } from "./logger";

let _db: ReturnType<typeof drizzle> | null = null;

// In-memory fallback when no database is available
let memoryStore: Contact[] = [];
let nextId = 1;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      logger.warn(`[Database] Failed to connect: ${error}`);
      _db = null;
    }
  }
  return _db;
}

export async function createContact(data: InsertContact): Promise<Contact | null> {
  const db = await getDb();
  if (!db) {
    logger.warn("[Database] No DB — using in-memory store");
    const entry: Contact = { ...data, id: nextId++, createdAt: new Date() };
    memoryStore.unshift(entry);
    logger.info(`[Contact] Created in-memory contact id=${entry.id} name=${entry.name}`);
    return entry;
  }

  try {
    await db.insert(contacts).values(data);
    const insertedContact = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt))
      .limit(1);
    return insertedContact.length > 0 ? insertedContact[0] : null;
  } catch (error) {
    logger.error(`[Database] Failed to create contact: ${error}`);
    throw error;
  }
}

export async function getContacts(): Promise<Contact[]> {
  const db = await getDb();
  if (!db) {
    return memoryStore;
  }

  try {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  } catch (error) {
    logger.error(`[Database] Failed to get contacts: ${error}`);
    return [];
  }
}

export async function deleteContact(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    const len = memoryStore.length;
    memoryStore = memoryStore.filter((c) => c.id !== id);
    return memoryStore.length < len;
  }

  try {
    await db.delete(contacts).where(eq(contacts.id, id));
    return true;
  } catch (error) {
    logger.error(`[Database] Failed to delete contact: ${error}`);
    return false;
  }
}
