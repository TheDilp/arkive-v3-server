import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "..";
import { hasValueDeep } from "../utils/transform";

export const searchRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/fullsearch/:project_id/:type",
    async (
      req: FastifyRequest<{
        Params: { project_id: string; type: "tags" | "namecontent" };
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      const { project_id, type } = req.params;
      const { query } = JSON.parse(req.body) as { query: string | string[] };

      if (type === "namecontent") {
        // lower(content->>'content'::text) like lower(${`%${query}%`}) or
        const searches = [
          prisma.$queryRaw`
          select id,title,icon from documents where (project_id::text = ${project_id} and ((lower(title) like lower(${`%${query}%`}) ) ) and folder = false)
          ;`,
          prisma.maps.findMany({
            where: {
              title: {
                contains: query as string,
                mode: "insensitive",
              },
              project_id,
              folder: false,
            },
            take: 5,
            select: {
              id: true,
              title: true,
              icon: true,
            },
          }),
          prisma.map_pins.findMany({
            where: {
              text: {
                contains: query as string,
                mode: "insensitive",
              },
              parent: {
                project_id,
              },
            },
            take: 5,
            select: {
              id: true,
              text: true,
              parent: {
                select: {
                  title: true,
                },
              },
            },
          }),
          prisma.boards.findMany({
            where: {
              title: {
                contains: query as string,
                mode: "insensitive",
              },
              folder: false,
              project_id,
            },
            take: 5,
            select: {
              id: true,
              title: true,
              icon: true,
            },
          }),
          prisma.nodes.findMany({
            where: {
              label: {
                contains: query as string,
                mode: "insensitive",
              },
              board: {
                project_id,
              },
            },
            take: 5,
            select: {
              id: true,
              label: true,
              parentId: true,
              board: {
                select: {
                  title: true,
                },
              },
            },
          }),
          prisma.edges.findMany({
            take: 5,
            where: {
              label: {
                contains: query as string,
                mode: "insensitive",
              },
              board: {
                project_id,
              },
            },
            select: {
              id: true,
              label: true,
              parentId: true,
              board: {
                select: {
                  title: true,
                },
              },
              source: {
                select: {
                  id: true,
                  label: true,
                },
              },
              target: {
                select: {
                  id: true,
                  label: true,
                },
              },
            },
          }),
          prisma.screens.findMany({
            take: 5,
            where: {
              title: {
                contains: query as string,
                mode: "insensitive",
              },
              folder: false,
              project_id,
            },
            select: {
              id: true,
              title: true,
              icon: true,
            },
          }),
          prisma.sections.findMany({
            take: 5,
            where: {
              OR: [
                {
                  title: {
                    contains: query as string,
                    mode: "insensitive",
                  },
                },
                {
                  cards: {
                    some: {
                      document: {
                        title: {
                          contains: query as string,
                          mode: "insensitive",
                        },
                      },
                    },
                  },
                },
              ],
              screens: {
                project_id,
              },
            },
            select: {
              id: true,
              title: true,
              cards: true,
              parentId: true,
            },
          }),
          prisma.calendars.findMany({
            take: 5,
            where: {
              title: {
                contains: query as string,
                mode: "insensitive",
              },
              project_id,
            },
            select: {
              id: true,
              title: true,
              icon: true,
            },
          }),
          prisma.timelines.findMany({
            take: 5,
            where: {
              title: {
                contains: query as string,
                mode: "insensitive",
              },
              project_id,
            },
            select: {
              id: true,
              title: true,
              icon: true,
            },
          }),
          prisma.events.findMany({
            take: 5,
            where: {
              title: {
                contains: query as string,
                mode: "insensitive",
              },

              calendar: {
                project_id,
              },
            },
            select: {
              id: true,
              title: true,
              calendarsId: true,
            },
          }),
        ];

        const [
          titleDocuments,
          maps,
          pins,
          boards,
          nodes,
          edges,
          screens,
          sections,
          calendars,
          timelines,
          events,
        ] = await prisma.$transaction(async () => {
          const results = await Promise.all(searches);
          return results;
        });
        const contentSearchedDocuments = [...(titleDocuments as any[])].filter(
          (doc: any) =>
            doc.title.toLowerCase().includes((query as string).toLowerCase()) ||
            hasValueDeep(doc.content, query as string)
        );

        // Remove and do not return content
        const final = contentSearchedDocuments.map((doc) => ({
          id: doc.id,
          title: doc.title,
          icon: doc.icon,
        }));
        rep.send({
          documents: final,
          maps,
          pins,
          boards,
          nodes,
          edges,
          screens,
          sections,
          calendars,
          timelines,
          events,
        });
      }
      if (type === "tags" && Array.isArray(query) && query.length) {
        const whereTagsClause = {
          where: {
            AND: query.map((tagTitle) => ({
              tags: {
                some: {
                  title: {
                    contains: tagTitle,
                  },
                },
              },
            })),
          },
        };
        const searches = [
          prisma.documents.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              title: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.maps.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              title: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.map_pins.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              text: true,
              icon: true,
              parent: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          }),
          prisma.boards.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              title: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.nodes.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              label: true,
              parentId: true,
              board: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          }),
          prisma.edges.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              label: true,
              parentId: true,
              board: {
                select: {
                  id: true,
                  title: true,
                },
              },
              source: {
                select: {
                  id: true,
                  label: true,
                },
              },
              target: {
                select: {
                  id: true,
                  label: true,
                },
              },
            },
          }),
          prisma.screens.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              title: true,
              parentId: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.cards.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              parentId: true,
              sections: {
                select: {
                  id: true,
                  title: true,
                },
              },
              document: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          }),
          prisma.dictionaries.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              parentId: true,
            },
          }),
          prisma.calendars.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              parentId: true,
            },
          }),
          prisma.events.findMany({
            ...whereTagsClause,
            take: 5,
            select: {
              id: true,
              title: true,
              calendarsId: true,
              calendar: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          }),
        ];
        const [
          titleDocuments,
          maps,
          map_pins,
          boards,
          nodes,
          edges,
          screens,
          cards,
          dictionaries,
          calendars,
          events,
        ] = await prisma.$transaction(async () => {
          const results = await Promise.all(searches);
          return results;
        });
        rep.send({
          documents: titleDocuments,
          maps,
          map_pins,
          boards,
          nodes,
          edges,
          screens,
          cards,
          dictionaries,
          calendars,
          events,
        });
      }
      rep.send({});
    }
  );

  server.post(
    "/search",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as {
          query: string;
          project_id: string;
          type: "documents" | "maps" | "boards" | "words";
        };
        if (data.type === "documents") {
          const items = prisma.documents.findMany({
            where: {
              project_id: data.project_id,
              folder: false,
              template: false,
              OR: [
                {
                  title: {
                    contains: data.query,
                    mode: "insensitive",
                  },
                },
              ],
            },
            select: {
              id: true,
              title: true,
            },
          });
          rep.send(items);
        }

        if (data.type === "maps") {
          const items = prisma.maps.findMany({
            where: {
              folder: false,
              project_id: data.project_id,
              title: {
                contains: data.query,
                mode: "insensitive",
              },
            },
            select: {
              id: true,
              title: true,
            },
          });
          rep.send(items);
        }
        if (data.type === "boards") {
          const items = prisma.boards.findMany({
            where: {
              folder: false,
              project_id: data.project_id,
              title: {
                contains: data.query,
                mode: "insensitive",
              },
            },
            select: {
              id: true,
              title: true,
            },
          });
          rep.send(items);
        }
        if (data.type === "words") {
          const items = prisma.words.findMany({
            where: {
              dictionary: {
                project_id: data.project_id,
              },
              translation: {
                contains: data.query,
                mode: "insensitive",
              },
            },
            select: {
              id: true,
              title: true,
              translation: true,
              dictionary: {
                select: {
                  title: true,
                },
              },
            },
          });
          rep.send(items);
        }

        rep.send([]);
      } catch (error) {
        rep.code(500);
        console.log(error);
        return false;
      }
    }
  );

  done();
};
