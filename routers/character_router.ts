import { FastifyInstance, FastifyRegister, FastifyRequest } from "fastify";
import { db, insertCharacterSchema } from "../utils";
import { characters } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";

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
  done();
};
