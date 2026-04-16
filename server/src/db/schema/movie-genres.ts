import { pgTable, text, primaryKey } from "drizzle-orm/pg-core";
import { genres } from "./genres";
import { movies } from "./movies";

export const movieGenres = pgTable(
  "movie_genres",
  {
    movieId: text()
      .notNull()
      .references(() => movies.id, { onDelete: "cascade" }),
    genreId: text()
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.movieId, table.genreId] })]
);