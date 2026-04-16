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
import { movies } from "./movies";

export const movieEmbeddings = pgTable(
  "movie_embeddings",
  {
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    model: varchar("model", { length: 128 }).notNull(),
    embedding: vector("embedding", {
      dimensions: EMBEDDING_DIMENSIONS,
    }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.movieId, t.model] }),
    index("movie_emb_hnsw").using("hnsw", t.embedding.op("vector_cosine_ops")),
  ]
);