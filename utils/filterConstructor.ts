import {
  and,
  between,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  notBetween,
  notIlike,
  notInArray,
  or,
  SQL,
} from "drizzle-orm";
import { RequestFilterType, RequestFilterTypes } from "../types/CRUDTypes";
import { characters, documents } from "../drizzle/schema";

function getFilter(filterType: RequestFilterTypes) {
  switch (filterType) {
    case "eq":
      return eq;
    case "ne":
      return ne;
    case "gt":
      return gt;
    case "gte":
      return gte;
    case "lt":
      return lt;
    case "lte":
      return lte;
    case "isNull":
      return isNull;
    case "isNotNull":
      return isNotNull;
    case "inArray":
      return inArray;
    case "notInArray":
      return notInArray;
    case "between":
      return between;
    case "notBetween":
      return notBetween;
    case "like":
      return like;
    case "ilike":
      return ilike;
    case "notIlike":
      return notIlike;
    default:
      return null;
  }
}

// #region specific_filter_functions

function betweenFilter(column: any, value: number[], filterFn: any) {
  if (value[0] && value[1]) {
    return filterFn(column, value[0], value[1]);
  }
  return null;
}

function likeFilter(column: any, value: string, filterFn: any) {
  if (value) {
    const filterValue = `%${value}%`;
    return filterFn(column, filterValue);
  }
  return null;
}

// #endregion specific_filter_functions

export function getEntityFilter(
  filters: RequestFilterType[],
  schema: typeof characters | typeof documents
): any {
  const finalFilters = [];

  for (let index = 0; index < filters.length; index += 1) {
    const { field, value, type } = filters[index];
    const filterFn = getFilter(type);

    if (filterFn) {
      if (type === "between" || type === "notBetween") {
        const bwFilter = betweenFilter(
          // @ts-ignore
          schema[field],
          value as number[],
          filterFn
        );
        if (bwFilter) {
          finalFilters.push(bwFilter);
        }
      } else if (type === "like" || type === "ilike") {
        const ilikeOrLikeFilter = likeFilter(
          // @ts-ignore
          schema[field],
          value as string,
          filterFn
        );
        if (ilikeOrLikeFilter) {
          finalFilters.push(ilikeOrLikeFilter);
        }
      } else if (type === "isNull" || type === "isNotNull") {
        // @ts-ignore
        finalFilters.push(filterFn(schema[field]));
      } else {
        // @ts-ignore
        finalFilters.push(filterFn(schema[field], value));
      }
    }
  }
  return finalFilters;
}

export function getFilters(
  {
    and: andFilters = [],
    or: orFilters = [],
  }: {
    and?: RequestFilterType[];
    or?: RequestFilterType[];
  },
  schema: typeof characters | typeof documents
) {
  let andFiltersFinal: SQL[] | undefined;
  let orFiltersFinal: SQL[] | undefined;

  if (andFilters?.length) {
    andFiltersFinal = getEntityFilter(andFilters, schema);
  }
  if (orFilters?.length) {
    orFiltersFinal = getEntityFilter(orFilters, schema);
  }
  const final: SQL[] = [];
  if (andFiltersFinal) final.push(and(...andFiltersFinal) as SQL);
  if (orFiltersFinal) final.push(or(...orFiltersFinal) as SQL);
  return final;
}
