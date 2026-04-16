import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { EMBEDDING_DIMENSIONS } from "./embedding-dimensions";
import { users } from "./users";
export const userEmbeddings = pgTable(
  "user_embeddings",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    model: varchar("model", { length: 128 }).notNull(),
    embedding: vector("embedding", {
      dimensions: EMBEDDING_DIMENSIONS,
    }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.model] }),
    index("user_emb_hnsw").using("hnsw", t.embedding.op("vector_cosine_ops")),
  ]
);