import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma from "../client";
import { AvailableDiscordTypes } from "../types/dataTypes";
import { checkIfLocal } from "../utils/auth";
import { getRandomIntInclusive, sendPublicItem } from "../utils/discord";
import { emptyS3Directory } from "../utils/storage";
import { extractDocumentText, formatImage } from "../utils/transform";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get("/getallprojects", async (req, rep: FastifyReply) => {
    try {
      const user_id = checkIfLocal(req, rep);

      if (user_id === null) return;
      const data = await prisma.projects.findMany({
        where: {
          OR: [
            {
              owner: {
                auth_id: user_id,
              },
            },
            {
              members: {
                some: {
                  member: {
                    auth_id: user_id,
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          image: true,
          ownerId: true,
          members: {
            select: {
              user_id: true,
            },
          },
        },
        orderBy: {
          title: "asc",
        },
      });
      rep.send(data);
      return;
    } catch (error) {
      rep.code(500);
      console.log(error);
      rep.send(false);
      return;
    }
  });
  server.post(
    "/getsingleproject",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const singleProject = await prisma.projects.findUnique({
          where: {
            id: data.id,
          },
          include: {
            members: {
              select: {
                permissions: {
                  where: {
                    project_id: data.id,
                  },
                },
                member: {
                  select: {
                    id: true,
                    nickname: true,
                    image: true,
                  },
                },
                user_id: true,
              },
            },
            swatches: {
              select: {
                id: true,
                title: true,
                color: true,
              },
            },
          },
        });
        rep.send(singleProject);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post("/createproject", async (req, rep: FastifyReply) => {
    try {
      const user_id = checkIfLocal(req, rep);

      if (user_id === null) return;

      const newProject = await prisma.projects.create({
        data: {
          ownerId: user_id,
        },
      });
      rep.send(newProject);
      return;
    } catch (error) {
      rep.code(500);
      console.log(error);
      rep.send(false);
      return;
    }
  });
  server.post(
    "/updateproject",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const user_id = checkIfLocal(req, rep);

        if (user_id === null) return;

        const data = req.body;
        const updatedProject = await prisma.projects.update({
          where: {
            id: data.id,
            ownerId: user_id,
          },
          data,
        });
        rep.send(updatedProject);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.get(
    "/exportproject/:id",
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      rep: FastifyReply
    ) => {
      // export the project and all of its related items
      try {
        const project = await prisma.projects.findUnique({
          where: {
            id: req.params.id,
          },
          include: {
            documents: {
              include: {
                alter_names: true,
              },
            },
            maps: {
              include: {
                map_layers: true,
                map_pins: true,
              },
            },
            boards: {
              include: {
                nodes: true,
                edges: true,
              },
            },
            calendars: {
              include: {
                months: true,
                events: true,
                eras: true,
              },
            },
            screens: {
              include: {
                sections: {
                  include: {
                    cards: true,
                  },
                },
              },
            },
            timelines: true,
            dictionaries: {
              include: {
                words: true,
              },
            },
            random_tables: {
              include: {
                random_table_options: true,
              },
            },
            swatches: true,
          },
        });
        rep.send(project);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.delete(
    "/deleteproject",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const user_id = checkIfLocal(req, rep);
        if (user_id === null) return;

        const data = req.body;
        await emptyS3Directory(data.id);
        await prisma.projects.delete({
          where: {
            id: data.id,
            ownerId: user_id,
          },
        });
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );

  // SEND TO DISCORD
  server.post(
    "/sendpublicitem",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          item_type: AvailableDiscordTypes;
          project_id: string;
          webhook_url: string;
          image?: string;
        };
      }>,
      rep
    ) => {
      try {
        const data = req.body;
        if (data.item_type === "documents") {
          const doc = await prisma.documents.findUnique({
            where: { id: data.id },
            select: {
              isPublic: true,
              title: true,
              image: true,
              content: true,
            },
          });
          if (doc && doc.isPublic) {
            const messageText = extractDocumentText(doc.content);
            sendPublicItem(
              data.id,
              doc.title,
              "documents",
              data.webhook_url,
              rep,
              doc?.image,
              messageText || ""
            );
            rep.send(true);
            return;
          } else {
            rep.code(500);
            rep.send(false);
          }
        } else if (data.item_type === "maps") {
          const publicMap = await prisma.maps.findUnique({
            where: { id: data.id },
            select: {
              title: true,
              isPublic: true,
              image: true,
            },
          });
          if (publicMap && publicMap.isPublic) {
            sendPublicItem(
              data.id,
              publicMap.title,
              "maps",
              data.webhook_url,
              rep,
              publicMap?.image
            );
            rep.send(true);
          } else rep.send(false);
        } else if (data.item_type === "boards") {
          const publicBoard = await prisma.boards.findUnique({
            where: { id: data.id },
            select: {
              title: true,
              isPublic: true,
            },
          });
          if (publicBoard && publicBoard.isPublic) {
            sendPublicItem(
              data.id,
              publicBoard.title,
              "boards",
              data.webhook_url,
              rep
            );
            rep.send(true);
          }
        } else if (data.item_type === "random_tables") {
          const publicTable = await prisma.random_tables.findUnique({
            where: { id: data.id },
            select: {
              random_table_options: {
                select: {
                  title: true,
                  description: true,
                },
              },
              title: true,
              isPublic: true,
            },
          });
          if (publicTable) {
            const selectedOptionIdx = getRandomIntInclusive(
              1,
              publicTable.random_table_options.length || 1
            );
            const selectedOption =
              publicTable.random_table_options[selectedOptionIdx - 1];
            sendPublicItem(
              data.id,
              selectedOption.title,
              "random_tables",
              data.webhook_url,
              rep,
              null,
              selectedOption.description || ""
            );
            rep.send(true);
          }
        } else if (data.item_type === "random_table_options") {
          const tableOption = await prisma.random_table_options.findUnique({
            where: { id: data.id },
            select: {
              title: true,
              description: true,
            },
          });
          if (tableOption) {
            sendPublicItem(
              data.id,
              tableOption.title,
              "random_table_options",
              data.webhook_url,
              rep,
              null,
              tableOption.description || ""
            );
            rep.send(true);
          }
        } else if (data.item_type === "images") {
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

            rep.send(true);
          } else {
            rep.code(500);
            rep.send(false);
            return false;
          }
        } else {
          rep.code(500);
          rep.send(false);
          return;
        }
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  // SWATCHES
  server.post(
    "/createswatch",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          title: string;
          color: string;
          project_id: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const user_id = checkIfLocal(req, rep);

        if (user_id === null) return;

        const data = req.body;
        const newSwatch = await prisma.swatches.create({
          data,
        });
        rep.send(newSwatch);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/updateswatch",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          title: string;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const user_id = checkIfLocal(req, rep);

        if (user_id === null) return;

        const data = req.body;
        await prisma.swatches.update({
          where: {
            id: data.id,
          },
          data,
        });
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );
  server.delete(
    "/deleteswatch",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const user_id = checkIfLocal(req, rep);

        if (user_id === null) return;

        const data = req.body;
        await prisma.swatches.delete({
          where: {
            id: data.id,
            project: {
              ownerId: user_id,
            },
          },
        });
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
        return;
      }
    }
  );

  done();
};
