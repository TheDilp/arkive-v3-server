import {
  pgTable,
  pgEnum,
  pgSchema,
  AnyPgColumn,
  uniqueIndex,
  index,
  foreignKey,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  doublePrecision,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const characterFieldsTocharacterFieldsTemplates = pgTable(
  "_character_fieldsTocharacter_fields_templates",
  {
    a: uuid("A")
      .notNull()
      .references(() => characterFields.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => characterFieldsTemplates.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex(
        "_character_fieldsTocharacter_fields_templates_AB_unique"
      ).on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    authId: text("auth_id").notNull(),
    nickname: text("nickname").notNull(),
    email: text("email").notNull(),
    image: text("image"),
  },
  (table) => {
    return {
      authIdKey: uniqueIndex("users_auth_id_key").on(table.authId),
      emailKey: uniqueIndex("users_email_key").on(table.email),
    };
  }
);

export const characterFieldsTemplates = pgTable("character_fields_templates", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: text("title").notNull(),
  value: text("value").notNull(),
});

export const mapLayers = pgTable("map_layers", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: text("title").default("New Layer").notNull(),
  image: text("image"),
  parentId: uuid("parent_id")
    .notNull()
    .references(() => maps.id, { onDelete: "cascade", onUpdate: "cascade" }),
  isPublic: boolean("isPublic"),
});

export const maps = pgTable(
  "maps",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    title: text("title").default("New Map").notNull(),
    isFolder: boolean("isFolder").notNull(),
    isPublic: boolean("isPublic").notNull(),
    clusterPins: boolean("clusterPins").notNull(),
    icon: text("icon"),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentId: uuid("parent_id"),
    imagesId: uuid("images_id").references(() => images.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  },
  (table) => {
    return {
      mapsParentIdFkey: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);

export const alterNames = pgTable(
  "alter_names",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    title: text("title").default("New Document").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentId: uuid("parent_id")
      .notNull()
      .references(() => documents.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      titleParentIdKey: uniqueIndex("alter_names_title_parent_id_key").on(
        table.title,
        table.parentId
      ),
    };
  }
);

export const boards = pgTable(
  "boards",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    title: text("title").default("New Board").notNull(),
    isFolder: boolean("isFolder"),
    isPublic: boolean("isPublic"),
    sort: integer("sort").notNull(),
    icon: text("icon"),
    defaultNodeShape: text("defaultNodeShape").default("rectangle").notNull(),
    defaultNodeColor: text("defaultNodeColor").default("#595959").notNull(),
    defaultEdgeColor: text("defaultEdgeColor").default("#595959").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentId: uuid("parent_id"),
  },
  (table) => {
    return {
      boardsParentIdFkey: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);

export const screens = pgTable(
  "screens",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    title: text("title").default("New Screen").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentId: uuid("parent_id"),
    icon: text("icon"),
    isFolder: boolean("isFolder"),
    isPublic: boolean("isPublic"),
    sectionSize: text("sectionSize").default("md").notNull(),
  },
  (table) => {
    return {
      screensParentIdFkey: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);

export const characters = pgTable("characters", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName"),
  nickname: text("nickname"),
  age: integer("age"),
  imagesId: uuid("images_id").references(() => images.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const edges = pgTable(
  "edges",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    label: text("label"),
    curveStyle: text("curveStyle"),
    lineStyle: text("lineStyle"),
    lineColor: text("lineColor"),
    lineFill: text("lineFill"),
    lineOpacity: doublePrecision("lineOpacity"),
    width: integer("width"),
    controlPointDistances: integer("controlPointDistances"),
    controlPointWeights: doublePrecision("controlPointWeights"),
    taxiDirection: text("taxiDirection"),
    taxiTurn: integer("taxiTurn"),
    arrowScale: integer("arrowScale"),
    targetArrowShape: text("targetArrowShape"),
    targetArrowFill: text("targetArrowFill"),
    targetArrowColor: text("targetArrowColor"),
    sourceArrowShape: text("sourceArrowShape"),
    sourceArrowFill: text("sourceArrowFill"),
    sourceArrowColor: text("sourceArrowColor"),
    midTargetArrowShape: text("midTargetArrowShape"),
    midTargetArrowFill: text("midTargetArrowFill"),
    midTargetArrowColor: text("midTargetArrowColor"),
    midSourceArrowShape: text("midSourceArrowShape"),
    midSourceArrowFill: text("midSourceArrowFill"),
    midSourceArrowColor: text("midSourceArrowColor"),
    fontSize: integer("fontSize"),
    fontColor: text("fontColor"),
    fontFamily: text("fontFamily"),
    zIndex: integer("zIndex"),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade", onUpdate: "cascade" }),
    targetId: uuid("target_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade", onUpdate: "cascade" }),
    parentId: uuid("parent_id")
      .notNull()
      .references(() => boards.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      sourceIdTargetIdKey: uniqueIndex("edges_source_id_target_id_key").on(
        table.sourceId,
        table.targetId
      ),
    };
  }
);

export const prismaMigrations = pgTable("_prisma_migrations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  checksum: varchar("checksum", { length: 64 }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true, mode: "string" }),
  migrationName: varchar("migration_name", { length: 255 }).notNull(),
  logs: text("logs"),
  rolledBackAt: timestamp("rolled_back_at", {
    withTimezone: true,
    mode: "string",
  }),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer("applied_steps_count").notNull(),
});

export const sections = pgTable("sections", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: text("title").notNull(),
  sort: integer("sort").notNull(),
  cardSize: text("cardSize").default("md").notNull(),
  parentId: uuid("parent_id").references(() => screens.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  title: text("title").default("New Project").notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const characterFieldsTemplatesTocharacters = pgTable(
  "_character_fields_templatesTocharacters",
  {
    a: uuid("A")
      .notNull()
      .references(() => characterFieldsTemplates.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => characters.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex(
        "_character_fields_templatesTocharacters_AB_unique"
      ).on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const events = pgTable("events", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  isPublic: boolean("isPublic").notNull(),
  backgroundColor: text("backgroundColor"),
  textColor: text("textColor"),
  year: integer("year").notNull(),
  day: integer("day").notNull(),
  hours: integer("hours"),
  minutes: integer("minutes"),
  calendarsId: uuid("calendarsId").references(() => calendars.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  documentsId: uuid("documentsId").references(() => documents.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  monthsId: uuid("monthsId")
    .notNull()
    .references(() => months.id, { onDelete: "cascade", onUpdate: "cascade" }),
  imagesId: uuid("images_id").references(() => images.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const mapPins = pgTable("map_pins", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  text: text("text"),
  parentId: uuid("parent_id")
    .notNull()
    .references(() => maps.id, { onDelete: "cascade", onUpdate: "cascade" }),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  color: text("color").default("#ffffff").notNull(),
  borderColor: text("borderColor").default("#ffffff").notNull(),
  backgroundColor: text("backgroundColor").default("#000000").notNull(),
  icon: text("icon"),
  showBackground: boolean("showBackground").default(true).notNull(),
  showBorder: boolean("showBorder").default(true).notNull(),
  isPublic: boolean("isPublic"),
  mapLink: uuid("map_link"),
  docId: uuid("doc_id"),
  imagesId: uuid("images_id").references(() => images.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const characterToCharacterField = pgTable(
  "character_to_character_field",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    charactersId: uuid("characters_id")
      .notNull()
      .references(() => characters.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    characterFieldsId: uuid("character_fields_id")
      .notNull()
      .references(() => characterFields.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  }
);

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  resourceType: text("resource_type").notNull(),
  resourceId: uuid("resource_id"),
  permission: text("permission").notNull(),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    title: text("title").default("New Document").notNull(),
    content: jsonb("content"),
    icon: text("icon"),
    isFolder: boolean("isFolder"),
    isPublic: boolean("isPublic"),
    isTemplate: boolean("isTemplate"),
    properties: jsonb("properties"),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentId: uuid("parent_id"),
    imagesId: uuid("images_id").references(() => images.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  },
  (table) => {
    return {
      documentsParentIdFkey: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);

export const characterFields = pgTable("character_fields", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: text("title").notNull(),
  fieldType: text("field_type").notNull(),
  options: text("options").array(),
});

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    viewDocuments: boolean("view_documents").notNull(),
    editDocuments: boolean("edit_documents").notNull(),
    viewMaps: boolean("view_maps").notNull(),
    editMaps: boolean("edit_maps").notNull(),
    viewBoards: boolean("view_boards").notNull(),
    editBoards: boolean("edit_boards").notNull(),
    viewCalendars: boolean("view_calendars").notNull(),
    editCalendars: boolean("edit_calendars").notNull(),
    viewTimelines: boolean("view_timelines").notNull(),
    editTimelines: boolean("edit_timelines").notNull(),
    viewScreens: boolean("view_screens").notNull(),
    editScreens: boolean("edit_screens").notNull(),
    viewDictionaries: boolean("view_dictionaries").notNull(),
    editDictionaries: boolean("edit_dictionaries").notNull(),
    viewRandomTables: boolean("view_random_tables").notNull(),
    editRandomTables: boolean("edit_random_tables").notNull(),
    editTags: boolean("edit_tags").notNull(),
    editAlterNames: boolean("edit_alter_names").notNull(),
    uploadAssets: boolean("upload_assets").notNull(),
    deleteAssets: boolean("delete_assets").notNull(),
  },
  (table) => {
    return {
      titleProjectIdKey: uniqueIndex("roles_title_project_id_key").on(
        table.title,
        table.projectId
      ),
    };
  }
);

export const timelines = pgTable(
  "timelines",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    title: text("title").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentId: uuid("parent_id"),
    icon: text("icon"),
    isFolder: boolean("isFolder"),
    isPublic: boolean("isPublic"),
  },
  (table) => {
    return {
      timelinesParentIdFkey: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);

export const images = pgTable(
  "images",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    title: text("title").default("New image").notNull(),
    link: text("link").notNull(),
    projectImageId: uuid("projectImageId")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    projectsId: uuid("projectsId")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      projectImageIdKey: uniqueIndex("images_projectImageId_key").on(
        table.projectImageId
      ),
    };
  }
);

export const rolesTousers = pgTable(
  "_rolesTousers",
  {
    a: uuid("A")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    b: uuid("B")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_rolesTousers_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const documentsTotags = pgTable(
  "_documentsTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => documents.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_documentsTotags_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const dictionaries = pgTable(
  "dictionaries",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    title: text("title").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    icon: text("icon"),
    isFolder: boolean("isFolder"),
    isPublic: boolean("isPublic"),
    parentId: uuid("parent_id"),
  },
  (table) => {
    return {
      projectIdTitleKey: uniqueIndex("dictionaries_project_id_title_key").on(
        table.title,
        table.projectId
      ),
      dictionariesParentIdFkey: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);

export const cards = pgTable(
  "cards",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    sort: integer("sort").notNull(),
    documentsId: uuid("documentsId")
      .notNull()
      .references(() => documents.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentId: uuid("parent_id").references(() => sections.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  },
  (table) => {
    return {
      parentIdDocumentsIdKey: uniqueIndex("cards_parent_id_documentsId_key").on(
        table.documentsId,
        table.parentId
      ),
    };
  }
);

export const edgesTotags = pgTable(
  "_edgesTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => edges.id, { onDelete: "cascade", onUpdate: "cascade" }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_edgesTotags_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const mapsTotags = pgTable(
  "_mapsTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => maps.id, { onDelete: "cascade", onUpdate: "cascade" }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_mapsTotags_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const mapPinsTotags = pgTable(
  "_map_pinsTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => mapPins.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_map_pinsTotags_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const cardsTotags = pgTable(
  "_cardsTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade", onUpdate: "cascade" }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_cardsTotags_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const projectMembers = pgTable(
  "_project_members",
  {
    a: uuid("A")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_project_members_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const randomTables = pgTable(
  "random_tables",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    title: text("title").notNull(),
    description: text("description"),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentId: uuid("parent_id"),
    isShared: boolean("isShared").notNull(),
    icon: text("icon"),
    isFolder: boolean("isFolder"),
    isPublic: boolean("isPublic"),
  },
  (table) => {
    return {
      randomTablesParentIdFkey: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);

export const webhooks = pgTable(
  "webhooks",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      idUserIdKey: uniqueIndex("webhooks_id_user_id_key").on(
        table.id,
        table.userId
      ),
    };
  }
);

export const nodes = pgTable("nodes", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  label: text("label"),
  type: text("type"),
  width: integer("width"),
  height: integer("height"),
  x: doublePrecision("x"),
  y: doublePrecision("y"),
  fontSize: integer("fontSize"),
  fontColor: text("fontColor"),
  fontFamily: text("fontFamily"),
  textValign: text("textVAlign"),
  textHalign: text("textHAlign"),
  backgroundColor: text("backgroundColor"),
  backgroundOpacity: doublePrecision("backgroundOpacity"),
  locked: boolean("locked"),
  isTemplate: boolean("isTemplate"),
  zIndex: integer("zIndex"),
  docId: uuid("doc_id").references(() => documents.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  parentId: uuid("parent_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade", onUpdate: "cascade" }),
  imagesId: uuid("images_id").references(() => images.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    title: text("title").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      titleProjectIdKey: uniqueIndex("tags_title_project_id_key").on(
        table.title,
        table.projectId
      ),
    };
  }
);

export const months = pgTable("months", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: text("title").notNull(),
  days: integer("days").notNull(),
  sort: integer("sort").notNull(),
  parentId: uuid("parent_id")
    .notNull()
    .references(() => calendars.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const nodesTotags = pgTable(
  "_nodesTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade", onUpdate: "cascade" }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_nodesTotags_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const boardsTotags = pgTable(
  "_boardsTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => boards.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_boardsTotags_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const calendarsTotimelines = pgTable(
  "_calendarsTotimelines",
  {
    a: uuid("A")
      .notNull()
      .references(() => calendars.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => timelines.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_calendarsTotimelines_AB_unique").on(
        table.a,
        table.b
      ),
      bIdx: index().on(table.b),
    };
  }
);

export const calendars = pgTable(
  "calendars",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("created_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    title: text("title").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    parentId: uuid("parent_id"),
    icon: text("icon"),
    isFolder: boolean("isFolder"),
    isPublic: boolean("isPublic"),
    offset: integer("offset").notNull(),
    hours: integer("hours"),
    minutes: integer("minutes"),
    days: text("days").array(),
  },
  (table) => {
    return {
      calendarsParentIdFkey: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
      })
        .onUpdate("cascade")
        .onDelete("cascade"),
    };
  }
);

export const words = pgTable(
  "words",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    translation: text("translation").notNull(),
    parentId: uuid("parent_id")
      .notNull()
      .references(() => dictionaries.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      titleTranslationParentIdKey: uniqueIndex(
        "words_title_translation_parent_id_key"
      ).on(table.title, table.translation, table.parentId),
    };
  }
);

export const dictionariesTotags = pgTable(
  "_dictionariesTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => dictionaries.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_dictionariesTotags_AB_unique").on(
        table.a,
        table.b
      ),
      bIdx: index().on(table.b),
    };
  }
);

export const calendarsTotags = pgTable(
  "_calendarsTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => calendars.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_calendarsTotags_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const randomTableOptions = pgTable("random_table_options", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  parentId: uuid("parent_id")
    .notNull()
    .references(() => randomTables.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  icon: text("icon"),
  iconColor: text("iconColor"),
});

export const swatches = pgTable(
  "swatches",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    title: text("title"),
    color: text("color").default("#595959").notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => {
    return {
      colorProjectIdKey: uniqueIndex("swatches_color_project_id_key").on(
        table.color,
        table.projectId
      ),
    };
  }
);

export const screensTotags = pgTable(
  "_screensTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => screens.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_screensTotags_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);

export const eventsTotags = pgTable(
  "_eventsTotags",
  {
    a: uuid("A")
      .notNull()
      .references(() => events.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    b: uuid("B")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => {
    return {
      abUnique: uniqueIndex("_eventsTotags_AB_unique").on(table.a, table.b),
      bIdx: index().on(table.b),
    };
  }
);
