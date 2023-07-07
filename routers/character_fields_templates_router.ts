import { Subquery, and, eq, sql } from "drizzle-orm";
import { FastifyInstance, FastifyRequest } from "fastify";
import { db, insertFieldSchema, insertFieldTemplateSchema } from "../utils";
import { characterFields, characterFieldsTemplates } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import { RequestBodyType } from "../types/CRUDTypes";
import groupBy from "lodash.groupby";

export function characterFieldsTemplatesRouter(
  server: FastifyInstance,
  _: any,
  done: any
) {
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

  server.post(
    "/:projectId",
    async (
      req: FastifyRequest<{
        Params: { projectId: string };
        Body: RequestBodyType;
      }>,
      rep
    ) => {
      const rows = await db
        .select({
          template: characterFieldsTemplates,
          field: characterFields,
        })
        .from(characterFieldsTemplates)
        .leftJoin(
          characterFields,
          eq(characterFields.parentId, characterFieldsTemplates.id)
        );
      const result = rows.reduce<
        Record<string, { template: { id: string }; fields: any[] }>
      >((acc, row) => {
        const { template, field } = row;

        if (!acc[template.id]) {
          acc[template.id] = { template, fields: [] };
        }

        if (field) {
          acc[template.id].fields.push(field);
        }

        return acc;
      }, {});
      const data = Object.values(result).map((val) => ({
        ...val.template,
        fields: val.fields,
      }));
      rep.send({ data, message: ResponseEnum.generic, ok: true });
    }
  );

  done();
}
