import { FastifyInstance, FastifyRequest } from "fastify";
import { insertSwatchSchema, updateSwatchSchema } from "../utils/validation";
import { db } from "../utils";
import { swatches } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import { eq } from "drizzle-orm";

export const swatchesRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: {
          data: {
            id: string;
            title: string;
            color: string;
            project_id: string;
          };
        };
      }>,
      rep
    ) => {
      const data = insertSwatchSchema.parse(req.body.data);

      if (data) {
        await db.insert(swatches).values(data);
        rep.send({ message: ResponseEnum.created("Swatch"), ok: true });
      }
    }
  );
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Body: {
          data: {
            color: string;
          };
        };
      }>,
      rep
    ) => {
      const data = updateSwatchSchema.parse(req.body.data);
      if (data) {
        await db.update(swatches).set(data);
        rep.send({ message: ResponseEnum.updated("Swatch"), ok: true });
      }
    }
  );
  server.delete(
    "/delete/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, rep) => {
      await db.delete(swatches).where(eq(swatches.id, req.params.id));
      rep.send({ message: ResponseEnum.deleted("Swatch"), ok: true });
    }
  );

  done();
};
