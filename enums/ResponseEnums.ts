export const ResponseEnum = {
  generic: () => "Success",
  created: (entity: string) => `${entity} successfully created.`,
  updated: (entity: string) => `${entity} successfully updated.`,
  deleted: (entity: string) => `${entity} deleted successfully.`,
};
