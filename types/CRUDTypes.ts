export type RequestFilterTypes =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "isNull"
  | "isNotNull"
  | "inArray"
  | "notInArray"
  // | "exists"
  // | "notExists"
  | "between"
  | "notBetween"
  | "like"
  | "ilike"
  | "notIlike";

export interface RequestFilterType {
  field: string;
  value: string | number | string[] | number[];
  type: RequestFilterTypes;
}
export type SortType = "asc" | "desc" | null;
export interface RequestOrderByType {
  field: string;
  sort: SortType;
}

export interface RequestPaginationType {
  limit?: number;
  page?: number;
}

export type RequestColumnsType = {
  [key: string]: boolean;
};

export type RequestRelationsType = {
  [key: string]:
    | boolean
    | {
        with: {
          [key: string]: boolean | { columns: RequestColumnsType };
        };
      };
};

export interface ResponseType<DataType = []> {
  data?: DataType;
  messsage: string;
  ok: boolean;
}

export interface RequestBodyType {
  data: {
    [key: string]: any;
  };
  orderBy?: RequestOrderByType;
  filters?: {
    and?: RequestFilterType[];
    or?: RequestFilterType[];
  } | null;
  pagination?: RequestPaginationType;
  relations?: RequestRelationsType;
  columns?: RequestColumnsType;
  archived?: boolean;
}
