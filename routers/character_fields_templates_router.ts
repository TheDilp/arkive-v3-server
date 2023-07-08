import { eq } from "drizzle-orm";
import { FastifyInstance, FastifyRequest } from "fastify";
import { characterFields, characterFieldsTemplates } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import { RequestBodyType } from "../types/CRUDTypes";
import {
  db,
  formatOneToManyResult,
  insertFieldSchema,
  insertFieldTemplateSchema,
  updateFieldSchema,
  updateFieldTemplateSchema,
} from "../utils";

export function characterFieldsTemplatesRouter(
  server: FastifyInstance,
  _: any,
  done: any
) {
  // #region create_routes

  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: {
          data: {
            title: string;
            projectId: string;
            fields: (typeof insertFieldSchema)[];
          };
        };
      }>,
      rep
    ) => {
      const { fields, ...rest } = req.body.data;
      const templateData = insertFieldTemplateSchema.parse(rest);
      if (templateData) {
      }
      await db.transaction(async (tx) => {
        const [template] = await tx
          .insert(characterFieldsTemplates)
          .values(templateData)
          .returning({ id: characterFieldsTemplates.id });
        if (!template.id) {
          await tx.rollback();
          return;
        }
        const newFields = await tx
          .insert(characterFields)
          .values(
            fields.map((f) => {
              const newField = { ...f, parentId: template.id };
              const fieldData = insertFieldSchema.parse(newField);
              return fieldData;
            })
          )
          .returning({ id: characterFields.id });
        if (!newFields.length) {
          await tx.rollback();
          return;
        }
      });
      rep.send({ message: ResponseEnum.created("Template"), ok: true });
    }
  );
  // #endregion create_routes

  // #region read_routes

  server.get(
    "/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
      rep
    ) => {
      const result = await db
        .select({
          id: characterFieldsTemplates.id,
          title: characterFieldsTemplates.title,
          projectId: characterFieldsTemplates.projectId,
          fields: characterFields,
        })
        .from(characterFieldsTemplates)
        .where(eq(characterFieldsTemplates.id, req.params.id))
        .leftJoin(
          characterFields,
          eq(characterFields.parentId, characterFieldsTemplates.id)
        );
      const [data] = formatOneToManyResult(result, "fields");
      rep.send({ data, message: ResponseEnum.generic, ok: true });
    }
  );

  server.post(
    "/:projectId",
    async (
      req: FastifyRequest<{
        Params: { projectId: string };
        Body: RequestBodyType;
      }>,
      rep
    ) => {
      const rows = db
        .select({
          id: characterFieldsTemplates.id,
          title: characterFieldsTemplates.title,
          projectId: characterFieldsTemplates.projectId,
          ...(req.body?.relations?.characterFields
            ? { fields: characterFields }
            : {}),
        })
        .from(characterFieldsTemplates);

      if (req.body?.relations?.characterFields) {
        rows.leftJoin(
          characterFields,
          eq(characterFields.parentId, characterFieldsTemplates.id)
        );
      }

      const result = await rows;

      const data = formatOneToManyResult(result, "fields");
      rep.send({ data, message: ResponseEnum.generic, ok: true });
    }
  );
  // #endregion read_routes

  // #region update_routes

  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Params: {
          id: string;
        };
        Body: {
          data: typeof insertFieldTemplateSchema;
          relations?: { fields?: (typeof insertFieldSchema)[] };
        };
      }>,
      rep
    ) => {
      const data = updateFieldTemplateSchema.parse(req.body.data);

      if (data) {
        await db.transaction(async (tx) => {
          await tx
            .update(characterFieldsTemplates)
            .set(data)
            .where(eq(characterFieldsTemplates.id, req.params.id));

          if (req.body.relations?.fields?.length) {
            await Promise.all(
              req.body.relations?.fields.map((f) => {
                const field = { ...f, parentId: req.params.id };
                const parsedField = insertFieldSchema.parse(field);
                if (parsedField) {
                  return tx
                    .insert(characterFields)
                    .values(parsedField)
                    .onConflictDoUpdate({
                      target: characterFields.id,
                      set: parsedField,
                    });
                }
              })
            );
          }
        });
        rep.send({ message: ResponseEnum.updated("Template"), ok: true });
      }
    }
  );

  // #endregion update_routes

  // #region delete_routes
  server.delete(
    "/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, rep) => {
      await db
        .delete(characterFieldsTemplates)
        .where(eq(characterFieldsTemplates.id, req.params.id));

      rep.send({ message: ResponseEnum.deleted("Tempalte"), ok: true });
    }
  );
  // #endregion delete_routes

  done();
}
