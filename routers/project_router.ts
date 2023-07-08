import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { and, asc, eq } from "drizzle-orm";
import { images, projects, swatches } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import {
  db,
  formatOneToManyResult,
  insertProjectSchema,
  updateProjectSchema,
} from "../utils";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  // #region create_routes
  server.post(
    "/create",
    async (
      req: FastifyRequest<{ Body: { data: typeof insertProjectSchema } }>,
      rep
    ) => {
      const requestData = insertProjectSchema.parse(req.body.data);
      if (requestData) {
        const data = await db.insert(projects).values(requestData).returning();
        rep.send({ data, message: ResponseEnum.created("Project"), ok: true });
      }
    }
  );
  // #endregion create_routes

  // #region read_routes
  server.post(
    "/",
    async (
      req: FastifyRequest<{
        Body: { data: { userId: string }; relations?: { images?: boolean } };
      }>,
      rep
    ) => {
      const result = db
        .select({
          id: projects.id,
          title: projects.title,
          owner_id: projects.ownerId,
          ...(req.body?.relations?.images
            ? {
                image: {
                  id: images.id,
                  title: images.title,
                },
              }
            : {}),
        })
        .from(projects)
        .where(eq(projects.ownerId, req.body.data.userId))
        .orderBy(asc(projects.title));

      if (req.body?.relations?.images) {
        result.leftJoin(images, eq(projects.id, images.projectsId));
      }

      const data = formatOneToManyResult(await result, "image");

      if (data) {
        rep.send({ data, message: ResponseEnum.generic(), ok: true });
      }
    }
  );

  server.get(
    "/:id",
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      rep: FastifyReply
    ) => {
      const data = await db
        .select({
          id: projects.id,
          title: projects.title,
          image: {
            id: images.id,
            title: images.title,
          },
          swatches: {
            id: swatches.id,
            title: swatches.title,
            color: swatches.color,
          },
        })
        .from(projects)
        .where(eq(projects.id, req.params.id))
        .leftJoin(images, eq(projects.id, images.projectImageId))
        .leftJoin(swatches, eq(swatches.projectId, projects.id));

      rep.send({ data: data[0], message: ResponseEnum.generic(), ok: true });
    }
  );

  // #endregion read_routes

  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
        Body: { data: typeof updateProjectSchema };
      }>,
      rep: FastifyReply
    ) => {
      const requestdata = updateProjectSchema.parse(req.body.data);
      if (requestdata) {
        await db.update(projects).set(requestdata);
        rep.send({ ok: true });
      }
    }
  );
  // #endregion update_routes

  // server.get(
  //   "/exportproject/:id",
  //   async (
  //     req: FastifyRequest<{ Params: { id: string } }>,
  //     rep: FastifyReply
  //   ) => {
  //     // export the project and all of its related items
  //     try {
  //       const project = await prisma.projects.findUnique({
  //         where: {
  //           id: req.params.id,
  //         },
  //         include: {
  //           documents: {
  //             include: {
  //               alter_names: true,
  //             },
  //           },
  //           maps: {
  //             include: {
  //               map_layers: true,
  //               map_pins: true,
  //             },
  //           },
  //           boards: {
  //             include: {
  //               nodes: true,
  //               edges: true,
  //             },
  //           },
  //           calendars: {
  //             include: {
  //               months: true,
  //               events: true,
  //               eras: true,
  //             },
  //           },
  //           screens: {
  //             include: {
  //               sections: {
  //                 include: {
  //                   cards: true,
  //                 },
  //               },
  //             },
  //           },
  //           timelines: true,
  //           dictionaries: {
  //             include: {
  //               words: true,
  //             },
  //           },
  //           random_tables: {
  //             include: {
  //               random_table_options: true,
  //             },
  //           },
  //           swatches: true,
  //         },
  //       });
  //       rep.send(project);
  //       return;
  //     } catch (error) {
  //       rep.code(500);
  //       console.error(error);
  //       rep.send(false);
  //       return;
  //     }
  //   }
  // );

  // #region delete_routes
  server.delete(
    "/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
        Body: { user_id: string };
      }>,
      rep: FastifyReply
    ) => {
      await db
        .delete(projects)
        .where(
          and(
            eq(projects.id, req.params.id),
            eq(projects.ownerId, req.body.user_id)
          )
        );
      rep.send({ message: ResponseEnum.deleted("Project"), ok: true });
    }
  );
  // #endregion delete_routes

  done();
};
