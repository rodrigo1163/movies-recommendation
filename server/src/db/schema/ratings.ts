import {
  index,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { users } from "./users";
import { movies } from "./movies";

export const ratings = pgTable(
  "ratings",
  {
    id: text("id").primaryKey().$default(() => uuidv7()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    movieId: text("movie_id")
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    stars: real("stars").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("ratings_user_id_movie_id_uidx").on(t.userId, t.movieId),
    index("ratings_user_id_idx").on(t.userId),
    index("ratings_movie_id_idx").on(t.movieId),
  ]
);