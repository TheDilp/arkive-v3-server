import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma from "../client";
import { AvailableDiscordTypes, RolePermissionsType } from "../types/dataTypes";
import { checkIfLocal } from "../utils/auth";
import { getRandomIntInclusive, sendPublicItem } from "../utils/discord";
import { emptyS3Directory } from "../utils/storage";
import { extractDocumentText, formatImage } from "../utils/transform";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/getallprojects",
    async (
      req: FastifyRequest<{ Body: { user_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const auth_id = checkIfLocal(req, rep);
        if (auth_id === null) return;
        const data = req.body;
        const projects = await prisma.projects.findMany({
          where: {
            OR: [
              {
                owner: {
                  id: data.user_id,
                },
              },
              {
                members: {
                  some: {
                    id: data.user_id,
                  },
                },
              },
            ],
          },
          select: {
            id: true,
            title: true,
            image: true,
            owner_id: true,
            roles: {
              where: {
                users: {
                  some: {
                    id: data.user_id,
                  },
                },
              },
            },
          },
          orderBy: {
            title: "asc",
          },
        });
        rep.send(projects);
        return;
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/getprojectdetails",
    async (
      req: FastifyRequest<{ Body: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const user_id = checkIfLocal(req, rep);

        if (user_id === null) return;

        const data = await prisma.projects.findUnique({
          where: {
            id: req.body.project_id,
          },
          select: {
            id: true,
            title: true,
            image: true,
            owner: {
              select: {
                nickname: true,
                image: true,
              },
            },
            members: {
              select: {
                id: true,
                nickname: true,
                image: true,
              },
            },
            _count: {
              select: {
                documents: true,
                maps: true,
                boards: true,
                calendars: true,
                screens: true,
                timelines: true,
                dictionaries: true,
                random_tables: true,
              },
            },
            documents: {
              where: {
                folder: false,
              },
              orderBy: {
                updatedAt: "desc",
              },
              select: {
                id: true,
                title: true,
              },
              take: -3,
            },
            maps: {
              where: {
                folder: false,
              },
              orderBy: {
                updatedAt: "desc",
              },
              select: {
                id: true,
                title: true,
              },
              take: -3,
            },
            boards: {
              where: {
                folder: false,
              },
              orderBy: {
                updatedAt: "desc",
              },
              select: {
                id: true,
                title: true,
              },
              take: -3,
            },
            calendars: {
              where: {
                folder: false,
              },
              orderBy: {
                updatedAt: "desc",
              },
              select: {
                id: true,
                title: true,
              },
              take: -3,
            },
            timelines: {
              where: {
                folder: false,
              },
              orderBy: {
                updatedAt: "desc",
              },
              select: {
                id: true,
                title: true,
              },
              take: -3,
            },
            screens: {
              where: {
                folder: false,
              },
              orderBy: {
                updatedAt: "desc",
              },
              select: {
                id: true,
                title: true,
              },
              take: -3,
            },
            dictionaries: {
              where: {
                folder: false,
              },
              orderBy: {
                updatedAt: "desc",
              },
              select: {
                id: true,
                title: true,
              },
              take: -3,
            },
            random_tables: {
              where: {
                folder: false,
              },
              orderBy: {
                updatedAt: "desc",
              },
              select: {
                id: true,
                title: true,
              },
              take: -3,
            },
          },
        });
        rep.send(data);
        return;
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
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
                id: true,
                nickname: true,
                image: true,
                roles: true,
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
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post("/createproject", async (req, rep: FastifyReply) => {
    try {
      const user_id = checkIfLocal(req, rep);

      if (user_id === null) return;

      const user = await prisma.user.findUnique({
        where: {
          auth_id: user_id,
        },
      });
      if (user) {
        const newProject = await prisma.projects.create({
          data: {
            owner_id: user.id,
          },
        });
        rep.send(newProject);
      }
      return;
    } catch (error) {
      rep.code(500);
      console.error(error);
      rep.send(false);
      return;
    }
  });
  server.post(
    "/updateproject",
    async (
      req: FastifyRequest<{
        Body: { id: string; user_id: string; [key: string]: string };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const user_id = checkIfLocal(req, rep);

        if (user_id === null) return;

        const { id, user_id: owner_id, ...data } = req.body;
        const updatedProject = await prisma.projects.update({
          where: {
            id,
            owner_id: owner_id,
          },
          data,
        });
        rep.send(updatedProject);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/getprojectmembers",
    async (
      req: FastifyRequest<{ Body: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = req.body;
        const members = await prisma.user.findMany({
          where: {
            projects: {
              some: {
                id: data.project_id,
              },
            },
          },
          select: {
            id: true,
            nickname: true,
            roles: {
              where: {
                project_id: data.project_id,
              },
            },
            permissions: {
              where: {
                project_id: data.project_id,
              },
            },
          },
        });
        rep.send(members);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
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
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
  server.delete(
    "/deleteproject",
    async (
      req: FastifyRequest<{ Body: { id: string; user_id: string } }>,
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
            owner_id: data.user_id,
          },
        });
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
  server.post(
    "/getuserrolespermissions",
    async (
      req: FastifyRequest<{ Body: { user_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const roles = await prisma.roles.findMany({
          where: {
            users: {
              some: {
                id: req.body.user_id,
              },
            },
          },
        });
        const permissions = await prisma.permissions.findMany({
          where: {
            user_id: req.body.user_id,
          },
        });
      } catch (error) {}
    }
  );
  server.post(
    "/getprojectroles",
    async (
      req: FastifyRequest<{ Body: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const roles = await prisma.roles.findMany({
          where: { project_id: req.body.project_id },
        });
        rep.send(roles);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createrole",
    async (
      req: FastifyRequest<{
        Body: {
          project_id: string;
          title: string;
          description?: string;
          [key: string]: string | undefined | boolean;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const newRole = await prisma.roles.create({
          data: req.body,
        });
        rep.send(newRole);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updaterole",
    async (
      req: FastifyRequest<{
        Body: {
          id: string;
          title?: string;
          description?: string;
          [key: string]: string | undefined | boolean;
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        await prisma.roles.update({
          where: {
            id: req.body.id,
          },
          data: req.body,
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
      }
    }
  );

  // #region discord
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
        console.error(error);
        rep.send(false);
      }
    }
  );
  // #endregion discord

  // SWATCHES
  // #region swatches
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
        console.error(error);
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
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );
  server.delete(
    "/deleteswatch",
    async (
      req: FastifyRequest<{ Body: { id: string; user_id: string } }>,
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
              owner_id: data.user_id,
            },
          },
        });
        rep.send(true);
        return;
      } catch (error) {
        rep.code(500);
        console.error(error);
        rep.send(false);
        return;
      }
    }
  );

  // #endregion swatches

  done();
};
