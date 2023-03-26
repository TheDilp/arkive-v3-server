import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma, { s3Client } from "../client";

export const projectRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallprojects",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = await prisma.projects.findMany({
          where: {
            OR: [
              {
                owner: {
                  auth_id: req.auth_id,
                },
              },
              {
                members: {
                  some: {
                    member: {
                      auth_id: req.auth_id,
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
    }
  );
  server.post(
    "/getsingleproject",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const singleProject = await prisma.projects.findUnique({
          where: {
            id: data.id,
          },
          include: {
            members: {
              select: {
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
  server.post(
    "/createproject",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      if (req.auth_id) {
        try {
          const newProject = await prisma.projects.create({
            data: {
              ownerId: req.auth_id,
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
      }
    }
  );
  server.post(
    "/updateproject",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as any;
        const updatedProject = await prisma.projects.update({
          where: {
            id: data.id,
            ownerId: req.auth_id,
          },
          data,
        });
        rep.send(updatedProject);
        return;
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
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.DO_SPACES_NAME,
            Key: `assets/${data.id}/`,
          })
        );
        await prisma.projects.delete({
          where: {
            id: data.id,
            ownerId: req.auth_id,
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

  // SWATCHES
  server.post(
    "/createswatch",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      if (req.auth_id) {
        try {
          const data = JSON.parse(req.body) as {
            id: string;
            title: string;
            color: string;
            project_id: string;
          };
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
    }
  );
  server.post(
    "/updateswatch",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      if (req.auth_id) {
        try {
          const data = JSON.parse(req.body) as {
            id: string;
            title: string;
          };
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
    }
  );
  server.delete(
    "/deleteswatch",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        await prisma.swatches.delete({
          where: {
            id: data.id,
            project: {
              ownerId: req.auth_id,
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
