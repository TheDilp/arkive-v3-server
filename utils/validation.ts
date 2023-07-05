import { createInsertSchema } from "drizzle-zod";
import { projects, swatches, users } from "../drizzle/schema";
import { z } from "zod";

// #region users
export const insertUserSchema = createInsertSchema(users);
// #endregion users

// #region projects
export const insertProjectSchema = createInsertSchema(projects);
export const updateProjectSchema = z.object({
  title: z.string().optional(),
  image: z.string().optional(),
});
// #endregion projects

// #region swatches
export const insertSwatchSchema = createInsertSchema(swatches);
export const updateSwatchSchema = z.object({
  color: z.string().optional(),
});
// #endregion swatches
