import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { EntityFieldType } from "../types/dataTypes";
import prisma from "../client";
export const entitiesRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/getsingleentity",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = await prisma.entities.findUnique({
          where: {
            id: req.body.id,
          },
          include: {
            fields: {
              include: {
                documents: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
                maps: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
                map_pins: {
                  select: {
                    id: true,
                    text: true,
                  },
                },
                boards: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
                nodes: {
                  select: {
                    id: true,
                    label: true,
                  },
                },
                dictionaries: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
                words: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        });
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createentity",
    async (
      req: FastifyRequest<{
        Body: {
          title: string;
          description?: string;
          project_id: string;
          fields: EntityFieldType[];
        };
      }>,
      rep: FastifyReply
    ) => {
      try {
        const { title, description, project_id, fields } = req.body;

        const entity = await prisma.entities.create({
          data: {
            title,
            description,
            project_id,
          },
        });

        if (entity) {
          const fieldsToCreate = fields.map((field) =>
            prisma.fields.create({
              data: {
                title: field.title,
                type: field.type,
                entityId: entity.id,
                documents: {
                  connect: {
                    id: field.document_id,
                  },
                },
                maps: {
                  connect: {
                    id: field.map_id,
                  },
                },
                map_pins: {
                  connect: {
                    id: field.map_pin_id,
                  },
                },
                boards: {
                  connect: {
                    id: field.board_id,
                  },
                },
                nodes: {
                  connect: {
                    id: field.node_id,
                  },
                },
                dictionaries: {
                  connect: {
                    id: field.dictionary_id,
                  },
                },
                words: {
                  connect: {
                    id: field.word_id,
                  },
                },
              },
            })
          );

          await prisma.$transaction(fieldsToCreate);

          rep.send(entity);
        } else {
          rep.code(500);
          rep.send(false);
        }
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  done();
};
