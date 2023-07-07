export type AvailableEntityType =
  | "project"
  | "characters"
  | "documents"
  | "maps"
  | "graphs"
  | "screens"
  | "dictionarys"
  | "calendars"
  | "timelines"
  | "randomTables"
  | "additionalFieldTemplates";
export type AvailableSubEntityType =
  | "alterNames"
  | "mapPins"
  | "mapLayers"
  | "nodes"
  | "edges"
  | "sections"
  | "cards"
  | "words"
  | "months"
  | "events"
  | "randomTableOptions"
  | "additionalFields";

export type AllAvailableEntities = AvailableEntityType | AvailableSubEntityType;

export type AvailableDiscordTypes =
  | "documents"
  | "maps"
  | "boards"
  | "random_tables"
  | "random_table_options"
  | "images";
export type TextType = {
  type: "text";
  text: string;
};
export type MentionAtomType = {
  type: "mentionAtom";
  attrs: {
    id: string;
    name: "documents" | "maps" | "boards" | "words";
    label: string;
    alterId: string | null;
    projectId?: string;
  };
};
export type ImageType = {
  type: "image";
  attrs: {
    alt: string;
    src: string;
    width: number;
    height: number;
  };
};

export type ParagraphType = {
  type: "paragraph";
  attrs: {
    style: string;
    nodeIndent: null | "left" | "right";
    nodeLineHeight: null | "single" | "double";
    nodeTextAlignment: "left" | "center" | "right";
    content: (TextType | MentionAtomType | ImageType)[];
  };
  content?: (TextType | MentionAtomType | ImageType)[];
};

export type HeadingType = {
  type: "heading";
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    style: string;
  };
  content: TextType[];
};

export type DocumentContentType = {
  type: "doc";
  content?: (ParagraphType | HeadingType)[];
};

export type EntityFieldType = {
  title: string;
  type: string;
  options?: string[];
  document_id?: string;
  map_id?: string;
  map_pin_id?: string;
  board_id?: string;
  node_id?: string;
  dictionary_id?: string;
  word_id?: string;
};

export type RolePermissionsType =
  | "view_documents"
  | "edit_documents"
  | "view_maps"
  | "edit_maps"
  | "view_boards"
  | "edit_boards"
  | "view_screens"
  | "edit_screens"
  | "view_calendars"
  | "edit_calendars"
  | "view_timelines"
  | "edit_timelines"
  | "view_dictionaries"
  | "edit_dictionaries"
  | "view_random_tables"
  | "edit_random_tables"
  | "edit_tags"
  | "edit_alter_names";
