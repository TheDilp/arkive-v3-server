import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../client";
import { extractDocumentText } from "../utils/transform";
import tiny from "tiny-json-http";

export const publicRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/getpublicdocument",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const doc = await prisma.documents.findUnique({
          where: { id: data.id, isPublic: true },
          include: {
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        rep.send(doc);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getpublicmap",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const map = await prisma.maps.findUnique({
          where: { id: data.id, isPublic: true },
          include: {
            map_layers: {
              where: {
                isPublic: true,
              },
            },
            map_pins: {
              where: {
                isPublic: true,
              },
            },
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        rep.send(map);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getpublicboard",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const board = await prisma.boards.findUnique({
          where: { id: data.id, isPublic: true },
          include: {
            nodes: true,
            edges: true,
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
        rep.send(board);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getpubliccalendar",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const word = await prisma.calendars.findUnique({
          where: { id: data.id },
          include: {
            eras: {
              orderBy: {
                start_year: "asc",
              },
            },
            months: {
              orderBy: {
                sort: "asc",
              },
            },
            events: {
              where: {
                isPublic: true,
              },
            },
          },
        });
        rep.send(word);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getpublicword",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const word = await prisma.words.findUnique({
          where: { id: data.id },
          include: {
            dictionary: {
              select: {
                title: true,
              },
            },
          },
        });
        rep.send(word);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.get(
    "/publicuser/:user_id",
    async (
      req: FastifyRequest<{ Params: { user_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: req.params.user_id,
          },
          select: {
            image: true,
            nickname: true,
          },
        });
        rep.send(user);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  server.post(
    "/sendpublicitem",
    async (req: FastifyRequest<{ Body: string }>, rep) => {
      try {
        const data = JSON.parse(req.body) as {
          id: string;
          item_type: "documents" | "maps" | "boards";
          project_id: string;
        };
        let item = null;
        if (data.item_type === "documents") {
          const doc = await prisma.documents.findUnique({
            where: { id: data.id },
            select: {
              isPublic: true,
              title: true,
              content: true,
            },
          });
          if (doc && doc.isPublic) {
            const messageText = extractDocumentText(doc.content);
            if (!messageText) return rep.send(false);
            await tiny
              .post({
                url: "https://discord.com/api/webhooks/1090605555330076684/95dfzGJlM8JGSuax7PFm4aghknkKftpdQfq7ohqm-GKiMPZ2r8uJ3P_Hpw_tiokB9DNk",

                headers: {
                  "Content-type": "application/json",
                },
                data: {
                  embeds: [{ title: doc.title, description: messageText }],
                },
              })
              .catch((err: string) => console.log(err));
          } else rep.send(false);
        } else if (data.item_type === "maps") {
          item = await prisma.maps.findUnique({
            where: { id: data.id },
            select: {
              title: true,
            },
          });
        } else if (data.item_type === "boards") {
          item = await prisma.boards.findUnique({
            where: { id: data.id },
            select: {
              title: true,
            },
          });
        }

        if (item) {
          rep.send(item);
        } else rep.send(false);
        return;
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  done();
};
