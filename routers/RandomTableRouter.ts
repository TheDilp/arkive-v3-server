import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "..";
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
        return allTables;
      } catch (error) {
        rep.code(500);
        console.log(error);
        return false;
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
        return doc;
      } catch (error) {
        rep.code(500);
        console.log(error);
        return false;
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

        return newTable;
      } catch (error) {
        rep.status(500);
        console.log(error);
        return false;
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

        return true;
      } catch (error) {
        rep.status(500);

        console.log(error);
        return false;
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

        return true;
      } catch (error) {
        rep.code(500);
        console.log(error);
        return false;
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
        return newOption;
      } catch (error) {
        rep.code(500);
        console.log(error);
        return false;
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

        return true;
      } catch (error) {
        rep.code(500);
        console.log(error);
        return false;
      }
    }
  );
  server.delete(
    "/deleterandomtable",
    async (
      req: FastifyRequest<{
        Body: string;
      }>
    ) => {
      try {
        const data = JSON.parse(req.body) as { id: string };

        await prisma.random_tables.delete({
          where: {
            id: data.id,
          },
        });
        return true;
      } catch (error) {
        console.log(error);
        return false;
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
        return true;
      } catch (error) {
        rep.code(500);
        console.log(error);
        return false;
      }
    }
  );
  done();
};
