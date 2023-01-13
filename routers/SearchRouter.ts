import { documents } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";

import { prisma } from "..";
import { hasValueDeep } from "../utils/transform";

export const searchRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/fullsearch/:project_id/:type",
    async (req: FastifyRequest<{ Params: { project_id: string; type: "tags" | "namecontent" }; Body: string }>) => {
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
              maps: {
                project_id,
              },
            },
            select: {
              id: true,
              text: true,
              parent: true,
              maps: {
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
              parent: true,
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
              parent: true,
              board: {
                select: {
                  title: true,
                },
              },
            },
          }),
        ];
        const [titleDocuments, maps, pins, boards, nodes, edges] = await prisma.$transaction(searches);
        const contentSearchedDocuments = [...(titleDocuments as documents[])].filter(
          (doc: documents) =>
            doc.title.toLowerCase().includes((query as string).toLowerCase()) || hasValueDeep(doc.content, query as string),
        );

        // Remove and do not return content
        const final = contentSearchedDocuments.map((doc) => ({
          id: doc.id,
          title: doc.title,
          icon: doc.icon,
        }));
        return { documents: final, maps, pins, boards, nodes, edges };
      }
      if (type === "tags" && Array.isArray(query) && query.length) {
        const searches = [
          prisma.documents.findMany({
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
            select: {
              id: true,
              title: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.maps.findMany({
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
            select: {
              id: true,
              title: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.map_pins.findMany({
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
            select: {
              id: true,
              text: true,
              icon: true,
            },
          }),

          prisma.boards.findMany({
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
            select: {
              id: true,
              title: true,
              icon: true,
              folder: true,
            },
          }),
          prisma.nodes.findMany({
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
            select: {
              id: true,
              label: true,
              parent: true,
            },
          }),
          prisma.edges.findMany({
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
            select: {
              id: true,
              label: true,
              parent: true,
            },
          }),
        ];
        const [titleDocuments, maps, map_pins, boards, nodes, edges] = await prisma.$transaction(searches);
        return { documents: titleDocuments, maps, map_pins, boards, nodes, edges };
      }
      return {};
    },
  );

  done();
};
