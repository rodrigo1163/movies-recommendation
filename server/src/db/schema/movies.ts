import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from 'uuidv7'

export const movies = pgTable("movies", {
  id: text().primaryKey().$default(() => uuidv7()),
  title: varchar({ length: 512 }).notNull(),
  year: integer(),
  synopsis: text(),
  posterUrl: varchar({ length: 1024 }),
});