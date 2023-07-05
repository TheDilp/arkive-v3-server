import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { and, asc, eq } from "drizzle-orm";
import { images, projects, swatches } from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import { db, insertProjectSchema, updateProjectSchema } from "../utils";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  // #region create_routes
  server.post(
    "/create",
    async (
      req: FastifyRequest<{ Body: { data: typeof insertProjectSchema } }>,
      rep
    ) => {
      console.log(req.body.data);
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
      req: FastifyRequest<{ Body: { data: { userId: string } } }>,
      rep: FastifyReply
    ) => {
      const data = await db
        .select({
          id: projects.id,
          title: projects.title,
          owner_id: projects.ownerId,
          image: {
            id: images.id,
            title: images.title,
          },
        })
        .from(projects)
        .where(eq(projects.ownerId, req.body.data.userId))
        .orderBy(asc(projects.title))
        .leftJoin(images, eq(projects.id, images.projectsId));
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

      rep.send({ data, message: ResponseEnum.generic(), ok: true });
    }
  );

  // #endregion read_routes

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

  // #region discord
  // server.post(
  //   "/sendpublicitem",
  //   async (
  //     req: FastifyRequest<{
  //       Body: {
  //         id: string;
  //         item_type: AvailableDiscordTypes;
  //         project_id: string;
  //         webhook_url: string;
  //         image?: string;
  //       };
  //     }>,
  //     rep
  //   ) => {
  //     try {
  //       const data = req.body;
  //       if (data.item_type === "documents") {
  //         const doc = await prisma.documents.findUnique({
  //           where: { id: data.id },
  //           select: {
  //             isPublic: true,
  //             title: true,
  //             image: true,
  //             content: true,
  //           },
  //         });
  //         if (doc && doc.isPublic) {
  //           const messageText = extractDocumentText(doc.content);
  //           sendPublicItem(
  //             data.id,
  //             doc.title,
  //             "documents",
  //             data.webhook_url,
  //             rep,
  //             doc?.image,
  //             messageText || ""
  //           );
  //           rep.send(true);
  //           return;
  //         } else {
  //           rep.code(500);
  //           rep.send(false);
  //         }
  //       } else if (data.item_type === "maps") {
  //         const publicMap = await prisma.maps.findUnique({
  //           where: { id: data.id },
  //           select: {
  //             title: true,
  //             isPublic: true,
  //             image: true,
  //           },
  //         });
  //         if (publicMap && publicMap.isPublic) {
  //           sendPublicItem(
  //             data.id,
  //             publicMap.title,
  //             "maps",
  //             data.webhook_url,
  //             rep,
  //             publicMap?.image
  //           );
  //           rep.send(true);
  //         } else rep.send(false);
  //       } else if (data.item_type === "boards") {
  //         const publicBoard = await prisma.boards.findUnique({
  //           where: { id: data.id },
  //           select: {
  //             title: true,
  //             isPublic: true,
  //           },
  //         });
  //         if (publicBoard && publicBoard.isPublic) {
  //           sendPublicItem(
  //             data.id,
  //             publicBoard.title,
  //             "boards",
  //             data.webhook_url,
  //             rep
  //           );
  //           rep.send(true);
  //         }
  //       } else if (data.item_type === "random_tables") {
  //         const publicTable = await prisma.random_tables.findUnique({
  //           where: { id: data.id },
  //           select: {
  //             random_table_options: {
  //               select: {
  //                 title: true,
  //                 description: true,
  //               },
  //             },
  //             title: true,
  //             isPublic: true,
  //           },
  //         });
  //         if (publicTable) {
  //           const selectedOptionIdx = getRandomIntInclusive(
  //             1,
  //             publicTable.random_table_options.length || 1
  //           );
  //           const selectedOption =
  //             publicTable.random_table_options[selectedOptionIdx - 1];
  //           sendPublicItem(
  //             data.id,
  //             selectedOption.title,
  //             "random_tables",
  //             data.webhook_url,
  //             rep,
  //             null,
  //             selectedOption.description || ""
  //           );
  //           rep.send(true);
  //         }
  //       } else if (data.item_type === "random_table_options") {
  //         const tableOption = await prisma.random_table_options.findUnique({
  //           where: { id: data.id },
  //           select: {
  //             title: true,
  //             description: true,
  //           },
  //         });
  //         if (tableOption) {
  //           sendPublicItem(
  //             data.id,
  //             tableOption.title,
  //             "random_table_options",
  //             data.webhook_url,
  //             rep,
  //             null,
  //             tableOption.description || ""
  //           );
  //           rep.send(true);
  //         }
  //       } else if (data.item_type === "images") {
  //         if (data?.image) {
  //           const imageName = data.image.split("/").pop();
  //           if (imageName)
  //             sendPublicItem(
  //               data.id,
  //               imageName,
  //               "images",
  //               data.webhook_url,
  //               rep,
  //               formatImage(data.image),
  //               ""
  //             );

  //           rep.send(true);
  //         } else {
  //           rep.code(500);
  //           rep.send(false);
  //           return false;
  //         }
  //       } else {
  //         rep.code(500);
  //         rep.send(false);
  //         return;
  //       }
  //       return;
  //     } catch (error) {
  //       rep.code(500);
  //       console.error(error);
  //       rep.send(false);
  //     }
  //   }
  // );
  // #endregion discord

  // SWATCHES
  // #region swatches

  // #endregion swatches

  done();
};
