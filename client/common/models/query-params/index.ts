export type IBaseQueryParams<TFilter = any, TOrder = any> = {
  paginate: {
    perPage: number;
    page?: number;
  };
  filter?: TFilter;
  order?: TOrder & {
    createdAt?: 'asc' | 'desc';
  };
};
