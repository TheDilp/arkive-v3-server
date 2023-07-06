import { FastifyInstance, FastifyRegister, FastifyRequest } from "fastify";
import { db, insertCharacterSchema } from "../utils";
import { characters } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import { eq } from "drizzle-orm";

export const characterRouter = (server: FastifyInstance, _: any, done: any) => {
  // #region create_routes
  server.post(
    "/create",
    async (
      req: FastifyRequest<{ Body: { data: typeof insertCharacterSchema } }>,
      rep
    ) => {
      const data = insertCharacterSchema.parse(req.body.data);
      if (data) {
        await db.insert(characters).values(data);
        rep.send({ message: ResponseEnum.created("Character"), ok: true });
      }
    }
  );
  // #endregion create_routes

  // #region read_routes
  server.get(
    "/:projectId",
    async (req: FastifyRequest<{ Params: { projectId: string } }>, rep) => {
      const data = await db
        .select({
          id: characters.id,
          firstName: characters.firstName,
          lastName: characters.lastName,
          nickname: characters.nickname,
          age: characters.age,
          imageId: characters.imageId,
        })
        .from(characters)
        .where(eq(characters.projectId, req.params.projectId));
      rep.send({ data, message: ResponseEnum.generic, ok: true });
    }
  );
  // #endregion read_routes
  done();
};
