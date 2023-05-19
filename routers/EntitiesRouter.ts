import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { EntityFieldType } from "../types/dataTypes";
import prisma from "../client";
import set from "lodash.set";

export const entitiesRouter = (server: FastifyInstance, _: any, done: any) => {
  server.get(
    "/getallentities/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      res: FastifyReply
    ) => {
      try {
        const data = await prisma.entities.findMany({
          where: {
            project_id: req.params.project_id,
          },
          select: {
            id: true,
            title: true,
          },
        });
        res.send(data);
        return;
      } catch (error) {
        res.code(500);
        console.log(error);
        res.send(false);
        return;
      }
    }
  );
  server.get(
    "/getallentityinstances/:entity_id",
    async (
      req: FastifyRequest<{ Params: { entity_id: string } }>,
      res: FastifyReply
    ) => {
      try {
        const data = await prisma.entity_instances.findMany({
          where: {
            entity_id: req.params.entity_id,
          },
          include: {
            field_values: true,
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
        });
        res.send(data);
        return;
      } catch (error) {
        res.code(500);
        console.log(error);
        res.send(false);
        return;
      }
    }
  );
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
            fields: true,
          },
        });
        rep.send(data);
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
          const fieldsToCreate = fields.map((field) => {
            if (field.document_id) {
            }

            return prisma.fields.create({
              data: {
                title: field.title,
                type: field.type,
                entity: {
                  connect: {
                    id: entity.id,
                  },
                },
                options: field.options,
              },
            });
          });

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
  server.post(
    "/getsingleentityinstance",
    async (
      req: FastifyRequest<{ Body: { id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const data = await prisma.entity_instances.findUnique({
          where: {
            id: req.body.id,
          },
          include: {
            field_values: true,
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
                parentId: true,
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
            events: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        rep.send(data);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/createentityinstance",
    async (
      req: FastifyRequest<{
        Body: {
          entity_id: string;
          field_values: {
            field_id: string;
            value?: string | string[];
            document_id?: string[];
            map_id?: string[];
            map_pin_id?: string[];
            board_id?: string[];
            node_id?: string[];
            event_id?: string[];
            dictionary_id?: string[];
            word_id?: string[];
          }[];
        };
      }>,
      rep
    ) => {
      try {
        const { entity_id, field_values } = req.body;

        const relations = field_values.map((val) => {
          if (val?.document_id)
            return {
              documents: {
                connect: val.document_id.map((id) => {
                  id;
                }),
              },
            };
          if (val?.map_id)
            return {
              documents: {
                connect: val.map_id.map((id) => {
                  id;
                }),
              },
            };
          if (val?.map_pin_id)
            return {
              documents: {
                connect: val.map_pin_id.map((id) => {
                  id;
                }),
              },
            };
          if (val?.board_id)
            return {
              documents: {
                connect: val.board_id.map((id) => {
                  id;
                }),
              },
            };
          if (val?.node_id)
            return {
              documents: {
                connect: val.node_id.map((id) => {
                  id;
                }),
              },
            };
          if (val?.dictionary_id)
            return {
              documents: {
                connect: val.dictionary_id.map((id) => {
                  id;
                }),
              },
            };
          if (val?.word_id)
            return {
              documents: {
                connect: val.word_id.map((id) => {
                  id;
                }),
              },
            };
          if (val?.event_id)
            return {
              documents: {
                connect: val.event_id.map((id) => {
                  id;
                }),
              },
            };
        });

        const entityInstance = await prisma.entity_instances.create({
          data: {
            entity: {
              connect: {
                id: entity_id,
              },
            },
            documents: {
              connect: [{ id: "ABC" }],
            },
          },
        });

        if (entityInstance) {
          const transactions = [];
          for (let i = 0; i < field_values.length; i++) {
            const baseField = {
              data: {
                field: {
                  connect: {
                    id: field_values[i].field_id,
                  },
                },
                entity_instances: {
                  connect: {
                    id: entityInstance.id,
                  },
                },
              },
            };
            if (field_values?.[i]?.value) {
              if (Array.isArray(field_values?.[i]?.value)) {
                const val = (field_values[i].value as string[]).join(", ");
                set(baseField.data, "value", val);
              } else {
                set(baseField.data, "value", field_values[i].value);
              }
            }

            transactions.push(
              prisma.field_values.create({
                data: baseField.data,
              })
            );
          }
          await prisma.$transaction(transactions);
          rep.send(entityInstance);
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
