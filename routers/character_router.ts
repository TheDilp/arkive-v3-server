import { and, eq } from "drizzle-orm";
import { FastifyInstance, FastifyRequest } from "fastify";
import { characters, images } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import { db, insertCharacterSchema } from "../utils";
import { RequestBodyType } from "../types/CRUDTypes";
import { getFilters } from "../utils/filterConstructor";

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
  server.post(
    "/:projectId",
    async (
      req: FastifyRequest<{
        Params: { projectId: string };
        Body: RequestBodyType;
      }>,
      rep
    ) => {
      let filters;
      if (req.body.filters) {
        filters = getFilters(req.body.filters, characters);
      }
      const data = await db
        .select({
          id: characters.id,
          firstName: characters.firstName,
          lastName: characters.lastName,
          nickname: characters.nickname,
          projectId: characters.projectId,
          age: characters.age,
          image: {
            id: images.id,
            title: images.title,
          },
        })
        .from(characters)
        .where(
          and(
            eq(characters.projectId, req.params.projectId),
            ...(filters || [])
          )
        )
        .leftJoin(images, eq(images.id, characters.imageId));
      rep.send({ data, message: ResponseEnum.generic, ok: true });
    }
  );
  // #endregion read_routes
  done();
};
