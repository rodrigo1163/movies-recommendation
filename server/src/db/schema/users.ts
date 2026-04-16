import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from 'uuidv7'

export const users = pgTable("users", {
  id: text().primaryKey().$default(() => uuidv7()),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});