import { FastifyInstance, FastifyRequest } from "fastify";
import { AvailableDiscordTypes } from "../types/dataTypes";
import {
  documents,
  graphs,
  images,
  maps,
  randomTableOptions,
  randomTables,
} from "../drizzle/schema";
import {
  db,
  extractDocumentText,
  formatImage,
  getRandomIntInclusive,
  sendPublicItem,
} from "../utils";
import { and, eq, sql } from "drizzle-orm";
import { ResponseEnum } from "../enums/ResponseEnums";

export const assetRouter = (server: FastifyInstance, _: any, done: any) => {
  // #region discord
  server.post(
    "/send_public/:type",
    async (
      req: FastifyRequest<{
        Params: {
          type: AvailableDiscordTypes;
        };
        Body: {
          data: {
            id: string;
            project_id: string;
            webhook_url: string;
            image?: string;
          };
        };
      }>,
      rep
    ) => {
      const { type } = req.params;
      const { data } = req.body;
      if (type === "documents") {
        const [doc] = await db
          .select({
            isPublic: documents.isPublic,
            title: documents.title,
            content: documents.content,
            image: sql<string>`"assets/images/${data.project_id}/"${images.title}`,
          })
          .from(documents)
          .where(and(eq(documents.id, data.id), eq(documents.isPublic, true)))
          .leftJoin(images, eq(images.id, documents.imageId));

        if (doc) {
          const messageText = extractDocumentText(doc.content);
          sendPublicItem(
            data.id,
            doc.title,
            type,
            data.webhook_url,
            rep,
            doc?.image,
            messageText || ""
          );
          rep.send({ message: ResponseEnum.generic(), ok: true });
        }
      } else if (type === "maps") {
        const [map] = await db
          .select({
            title: maps.title,
            isPublic: maps.isPublic,
            image: sql<string>`"assets/maps/${data.project_id}/"${images.title}`,
          })
          .from(maps)
          .where(and(eq(maps.id, data.id), eq(maps.isPublic, true)))
          .leftJoin(images, eq(images.id, maps.imageId));

        if (map) {
          sendPublicItem(
            data.id,
            map.title,
            type,
            data.webhook_url,
            rep,
            map.image
          );
          rep.send({ message: ResponseEnum.generic(), ok: true });
        }
      } else if (type === "boards") {
        const [graph] = await db
          .select({
            isPublic: graphs.isPublic,
            title: graphs.title,
          })
          .from(graphs)
          .where(and(eq(graphs.id, data.id), eq(graphs.isPublic, true)));

        if (graph) {
          sendPublicItem(data.id, graph.title, type, data.webhook_url, rep);
          rep.send({ message: ResponseEnum.generic(), ok: true });
        }
      }

      // else if (type === "random_tables") {
      //   const [randomTable] = await db
      //     .select({
      //       description: randomTables.description,
      //       title: randomTables.title,
      //       options: {
      //         title: randomTableOptions.title,
      //       },
      //     })
      //     .from(randomTables)
      //     .where(eq(randomTables.id, data.id))
      //     .leftJoin(
      //       randomTableOptions,
      //       eq(randomTableOptions.parentId, randomTables.id)
      //     );

      //   if (randomTable) {
      //     const selectedOptionIdx = getRandomIntInclusive(
      //       1,
      //       randomTable.options || 1
      //     );
      //     const selectedOption =
      //       publicTable.random_table_options[selectedOptionIdx - 1];
      //     sendPublicItem(
      //       data.id,
      //       randomTable.title,
      //       type,
      //       data.webhook_url,
      //       rep
      //     );
      //     rep.send({ message: ResponseEnum.generic(), ok: true });
      //   }
      // } else if (type === "random_table_options") {
      //   const tableOption = await prisma.random_table_options.findUnique({
      //     where: { id: data.id },
      //     select: {
      //       title: true,
      //       description: true,
      //     },
      //   });
      //   if (tableOption) {
      //     sendPublicItem(
      //       data.id,
      //       tableOption.title,
      //       "random_table_options",
      //       data.webhook_url,
      //       rep,
      //       null,
      //       tableOption.description || ""
      //     );
      //     rep.send(true);
      //   }
      // }
      else if (type === "images") {
        if (data?.image) {
          const imageName = data.image.split("/").pop();
          if (imageName)
            sendPublicItem(
              data.id,
              imageName,
              "images",
              data.webhook_url,
              rep,
              formatImage(data.image),
              ""
            );

          rep.send({ message: ResponseEnum.generic(), ok: true });
        } else {
          rep.send({ message: ResponseEnum.error.discord, ok: false });
        }
      } else {
        rep.send({ message: ResponseEnum.error.discord, ok: false });
      }
      return;
    }
  );
  done();
};
