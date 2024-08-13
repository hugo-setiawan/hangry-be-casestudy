import { PrismaClient } from "@prisma/client";

/**
 * Singleton instance of `PrismaClient` for interacting with the database.
 *
 * @type {PrismaClient}
 * @constant
 */
export const db = new PrismaClient();
