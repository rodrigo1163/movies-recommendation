import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from 'uuidv7'
  
export const genres = pgTable("genres", {
  id: text().primaryKey().$default(() => uuidv7()),
  name: varchar({ length: 128 }).notNull().unique(),
});
