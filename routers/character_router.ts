import { and, asc, eq } from "drizzle-orm";
import { FastifyInstance, FastifyRequest } from "fastify";
import {
  characterFieldsTemplatesTocharacters,
  characters,
  images,
} from "../drizzle/schema";
import { ResponseEnum } from "../enums/ResponseEnums";
import { RequestBodyType } from "../types/CRUDTypes";
import { db, insertCharacterSchema } from "../utils";
import { getFilters } from "../utils/filterConstructor";
import { getEntityOrderBy } from "../utils/orderByConstructor";

export const characterRouter = (server: FastifyInstance, _: any, done: any) => {
  // #region create_routes
  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: {
          data: typeof insertCharacterSchema;
          relations: {
            characterFieldTemplates?: {
              [key: string]: { [key: string]: string };
            };
          };
        };
      }>,
      rep
    ) => {
      const data = insertCharacterSchema.parse(req.body.data);
      if (data) {
        await db.transaction(async (tx) => {
          const [newChar] = await tx
            .insert(characters)
            .values(data)
            .returning({ id: characters.id });
          await tx.insert(characterFieldsTemplatesTocharacters).values(
            Object.entries(
              req.body.relations.characterFieldTemplates || {}
            ).map(([templateId, values]) => {
              return {
                a: templateId,
                b: newChar.id,
                values,
              };
            })
          );
        });
        rep.send({ message: ResponseEnum.created("Character"), ok: true });
      }
    }
  );
  // #endregion create_routes

  // #region read_routes
  server.post(
    "/:projectId",
    async (
      req: FastifyRequest<{
        Params: { projectId: string };
        Body: RequestBodyType;
      }>,
      rep
    ) => {
      let filters;
      let orderBy;
      if (req.body.filters) {
        filters = getFilters(req.body.filters, characters);
      }
      if (req.body.orderBy) {
        orderBy = getEntityOrderBy(req.body.orderBy, characters);
      }
      const data = await db
        .select({
          id: characters.id,
          firstName: characters.firstName,
          lastName: characters.lastName,
          nickname: characters.nickname,
          projectId: characters.projectId,
          age: characters.age,
          image: {
            id: images.id,
            title: images.title,
          },
        })
        .from(characters)
        .where(
          and(
            eq(characters.projectId, req.params.projectId),
            ...(filters || [])
          )
        )
        // @ts-ignore
        .orderBy(...(orderBy || [asc(characters.firstName)]))
        .leftJoin(images, eq(images.id, characters.imageId));
      rep.send({ data, message: ResponseEnum.generic, ok: true });
    }
  );
  server.get(
    "/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
      rep
    ) => {
      const character = await db
        .select({
          id: characters.id,
          firstName: characters.firstName,
          lastName: characters.lastName,
          nickname: characters.nickname,
          projectId: characters.projectId,
          age: characters.age,
          image: {
            id: images.id,
            title: images.title,
          },
          characterFieldTemplates: {
            id: characterFieldsTemplatesTocharacters.a,
            values: characterFieldsTemplatesTocharacters.values,
          },
        })
        .from(characters)
        .where(eq(characters.id, req.params.id))
        .leftJoin(
          characterFieldsTemplatesTocharacters,
          eq(characterFieldsTemplatesTocharacters.b, characters.id)
        )
        // @ts-ignore
        .leftJoin(images, eq(images.id, characters.imageId));

      const data = character.reduce<
        Record<
          string,
          {
            [key: string]: any;
          }
        >
      >((acc, row) => {
        const { characterFieldTemplates, id, ...rest } = row;

        if (!acc[id]) {
          acc[id] = { id, ...rest, characterFieldTemplates: {} };
        }

        if (characterFieldTemplates) {
          acc[id].characterFieldTemplates[characterFieldTemplates.id] =
            characterFieldTemplates.values;
        }

        return acc;
      }, {});
      rep.send({
        data: Object.values(data)[0],
        message: ResponseEnum.generic,
        ok: true,
      });
    }
  );
  // #endregion read_routes

  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
        Body: {
          data: Partial<typeof insertCharacterSchema>;
          relations: {
            characterFieldTemplates?: {
              [key: string]: { [key: string]: string };
            };
          };
        };
      }>,
      rep
    ) => {
      const data = insertCharacterSchema.partial().parse(req.body.data);
      if (data) {
        await db.transaction(async (tx) => {
          await tx
            .update(characters)
            .set(data)
            .where(eq(characters.id, req.params.id));

          if (req.body?.relations) {
            if (req.body.relations?.characterFieldTemplates) {
              const existingTemplatesRelations = await tx
                .select()
                .from(characterFieldsTemplatesTocharacters)
                .where(
                  eq(characterFieldsTemplatesTocharacters.b, req.params.id)
                );

              const existingTemplateIds = existingTemplatesRelations.map(
                (templateRelation) => templateRelation.a
              );

              const toUpdateTemplateIds = Object.keys(
                req.body.relations.characterFieldTemplates
              );

              await Promise.all(
                existingTemplateIds.map((templateId) => {
                  if (!toUpdateTemplateIds.includes(templateId)) {
                    return tx
                      .delete(characterFieldsTemplatesTocharacters)
                      .where(
                        and(
                          eq(
                            characterFieldsTemplatesTocharacters.a,
                            templateId
                          ),
                          eq(
                            characterFieldsTemplatesTocharacters.b,
                            req.params.id
                          )
                        )
                      );
                  }
                })
              );

              await Promise.all(
                Object.entries(
                  req.body.relations.characterFieldTemplates || {}
                ).map(([templateId, values]) => {
                  return tx
                    .insert(characterFieldsTemplatesTocharacters)
                    .values({
                      a: templateId,
                      b: req.params.id,
                      values,
                    })
                    .onConflictDoUpdate({
                      target: [
                        characterFieldsTemplatesTocharacters.a,
                        characterFieldsTemplatesTocharacters.b,
                      ],
                      set: { values },
                    });
                })
              );
            }
          }
        });
        rep.send({ message: ResponseEnum.updated("Character"), ok: true });
      }
    }
  );
  // #endregion update_routes

  done();
};
