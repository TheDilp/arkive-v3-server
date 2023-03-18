import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import prisma from "../client";
import { removeNull } from "../utils/transform";

export const randomTableRouter = (
  server: FastifyInstance,
  _: any,
  done: any
) => {
  server.get(
    "/getallrandomtables/:project_id",
    async (
      req: FastifyRequest<{ Params: { project_id: string } }>,
      rep: FastifyReply
    ) => {
      try {
        const allTables = await prisma.random_tables.findMany({
          where: {
            project_id: req.params.project_id,
          },
          orderBy: {
            sort: "asc",
          },
        });
        rep.send(allTables);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/getsinglerandomtable",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data = JSON.parse(req.body) as { id: string };
        const doc = await prisma.random_tables.findUnique({
          where: { id: data.id },
          include: {
            random_table_options: true,
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
    "/createrandomtable",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newTable = await prisma.random_tables.create({
          data,
        });

        rep.send(newTable);
      } catch (error) {
        rep.status(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updaterandomtable",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        await prisma.random_tables.update({
          where: {
            id: data.id,
          },
          data,
        });

        rep.send(true);
      } catch (error) {
        rep.status(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/sortrandomtables",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const indexes: { id: string; parent: string; sort: number }[] =
          JSON.parse(req.body);
        const updates = indexes.map((idx) =>
          prisma.random_tables.update({
            data: {
              parentId: idx.parent,
              sort: idx.sort,
            },
            where: { id: idx.id },
          })
        );
        await prisma.$transaction(updates);

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );

  // TABLE OPTION ROUTES

  server.post(
    "/createrandomtableoption",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        const newOption = await prisma.random_table_options.create({
          data,
        });
        rep.send(newOption);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.post(
    "/updaterandomtableoption",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = removeNull(JSON.parse(req.body)) as any;
        await prisma.random_table_options.update({
          where: {
            id: data.id,
          },
          data,
        });

        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deleterandomtable",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const data = JSON.parse(req.body) as { id: string };

        await prisma.random_tables.delete({
          where: {
            id: data.id,
          },
        });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  server.delete(
    "/deleterandomtableoption",
    async (
      req: FastifyRequest<{
        Body: string;
      }>,
      rep: FastifyReply
    ) => {
      try {
        const ids = JSON.parse(req.body) as string[];
        if (ids)
          await prisma.random_table_options.deleteMany({
            where: {
              id: {
                in: ids,
              },
            },
          });
        rep.send(true);
      } catch (error) {
        rep.code(500);
        console.log(error);
        rep.send(false);
      }
    }
  );
  done();
};
