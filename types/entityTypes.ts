import {
  calendars,
  characters,
  documents,
  graphs,
  maps,
} from "../drizzle/schema";

export type AllSchemasType =
  | typeof characters
  | typeof documents
  | typeof maps
  | typeof graphs
  | typeof calendars;
