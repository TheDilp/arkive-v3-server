import { RequestOrderByType } from "../types/CRUDTypes";
import { SQL, asc, desc } from "drizzle-orm";
import { AvailableEntityType } from "../types/dataTypes";
import { AllSchemasType } from "../types/entityTypes";

export function getEntityOrderBy(
  order: RequestOrderByType,
  schema: AllSchemasType
) {
  const finalSort: SQL[] = [];
  const sort =
    // @ts-ignore
    order.sort === "asc" ? asc(schema[order.field]) : desc(schema[order.field]);
  finalSort.push(sort);

  return finalSort;
}
