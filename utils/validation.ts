import { createInsertSchema } from "drizzle-zod";
import {
  characterFields,
  characterFieldsTemplates,
  characters,
  documents,
  projects,
  swatches,
  users,
} from "../drizzle/schema";
import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];

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

// #region characters
export const insertCharacterSchema = createInsertSchema(characters);

// #endregion characters

// #region documents
export const insertDocumentSchema = createInsertSchema(documents);
export const updateDocumentSchema = z.object({
  title: z.string().optional(),
  content: literalSchema.optional(),
  icon: z.string().optional(),
  isFolder: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  parentId: z.string().optional(),
  imageId: z.string().optional(),
});
// #endregion documents

// #region fields
export const insertFieldTemplateSchema = createInsertSchema(
  characterFieldsTemplates
);
export const updateFieldTemplateSchema = z.object({
  title: z.string().optional(),
});
export const updateFieldSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  fieldType: z.string().optional(),
  options: z.string().array().optional(),
});
export const insertFieldSchema = createInsertSchema(characterFields);
// #endregion fields

// #region swatches
export const insertSwatchSchema = createInsertSchema(swatches);
export const updateSwatchSchema = z.object({
  color: z.string().optional(),
});
// #endregion swatches
