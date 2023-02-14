import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { hasValueDeep } from "../utils/transform";

export const searchRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/fullsearch/:project_id/:type",
    async (
      req: FastifyRequest<{
        Params: { project_id: string; type: "tags" | "namecontent" };
        Body: string;
      }>
    ) => {
      const { project_id, type } = req.params;
      const { query } = JSON.parse(req.body) as { query: string | string[] };

      if (type === "namecontent") {
        const searches = [
          prisma.$queryRaw`
          select id,title,content,icon from documents where (project_id::text = ${project_id} and ( lower(content->>'content'::text) like lower(${`%${query}%`}) or (lower(title) like lower(${`%${query}%`}) ) ) and folder = false)
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
        return {
          documents: final,
          maps,
          pins,
          boards,
          nodes,
          edges,
          screens,
          sections,
          calendars,
          events,
        };
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
            select: {
              id: true,
              title: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.maps.findMany({
            ...whereTagsClause,
            select: {
              id: true,
              title: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.map_pins.findMany({
            ...whereTagsClause,
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
            select: {
              id: true,
              title: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.nodes.findMany({
            ...whereTagsClause,
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
            select: {
              id: true,
              parentId: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.cards.findMany({
            ...whereTagsClause,
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
            select: {
              id: true,
              parentId: true,
            },
          }),
          prisma.calendars.findMany({
            ...whereTagsClause,
            select: {
              id: true,
              parentId: true,
            },
          }),
          prisma.events.findMany({
            ...whereTagsClause,
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
        return {
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
        };
      }
      return {};
    }
  );

  server.post("/search", async (req: FastifyRequest<{ Body: string }>) => {
    try {
      const data = JSON.parse(req.body) as {
        query: string;
        project_id: string;
        type: "documents" | "maps" | "boards" | "words";
      };
      if (data.type === "documents")
        return prisma.documents.findMany({
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

      if (data.type === "maps")
        return prisma.maps.findMany({
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
      if (data.type === "boards")
        return prisma.boards.findMany({
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
      if (data.type === "words")
        return prisma.words.findMany({
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
    } catch (error) {
      console.log(error);
      return false;
    }
  });

  done();
};
