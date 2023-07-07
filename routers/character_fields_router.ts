import { FastifyInstance, FastifyRequest } from "fastify";
import {
  characterFields,
  characterFieldsTocharacterFieldsTemplates,
} from "../drizzle/schema";
import { db } from "../utils";
import { eq } from "drizzle-orm";
import { ResponseEnum } from "../enums/ResponseEnums";

export function characterFieldsRouter(
  server: FastifyInstance,
  _: any,
  done: any
) {
  server.get(
    "/:projectId/:templateId",
    async (
      req: FastifyRequest<{
        Params: {
          projectId: string;
          templateId: string;
        };
      }>,
      rep
    ) => {
      const fields = await db
        .select()
        .from(characterFieldsTocharacterFieldsTemplates)
        .where(
          eq(characterFieldsTocharacterFieldsTemplates.b, req.params.templateId)
        )
        .leftJoin(
          characterFields,
          eq(characterFields.id, characterFieldsTocharacterFieldsTemplates.a)
        );
      const data = fields.map((f) => f.character_fields);
      rep.send({ data, message: ResponseEnum.generic, ok: true });
    }
  );

  done();
}
