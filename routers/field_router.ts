import { eq } from "drizzle-orm";
import { FastifyInstance, FastifyRequest } from "fastify";
import { db, insertFieldSchema, insertFieldTemplateSchema } from "../utils";
import {
  characterFields,
  characterFieldsTemplates,
  characterFieldsTocharacterFieldsTemplates,
} from "../drizzle/schema";

export function fieldRouter(server: FastifyInstance, _: any, done: any) {
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
              const fieldData = insertFieldSchema.parse(f);
              return fieldData;
            })
          )
          .returning({ id: characterFields.id });
        if (!newFields.length) {
          await tx.rollback();
          return;
        }
        await tx.insert(characterFieldsTocharacterFieldsTemplates).values(
          newFields.map((field) => ({
            a: field.id,
            b: template.id,
          }))
        );
      });
      rep.send({ message: "Template created successfully.", ok: true });
    }
  );

  server.post(
    "/:projectId",
    async (
      req: FastifyRequest<{
        Params: { projectId: string };
      }>,
      rep
    ) => {
      const templates = await db
        .select()
        .from(characterFieldsTemplates)
        .where(eq(characterFieldsTemplates.projectId, req.params.projectId));

      rep.send({ data: templates });
    }
  );

  done();
}
