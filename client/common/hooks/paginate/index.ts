const DEFAULT_PAGE_SIZE = 20;

export function usePaginateReq() {
  const paginate = reactive({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const page = toRef(paginate, 'page');

  const pageSize = toRef(paginate, 'pageSize');

  const nextPage = () => {
    paginate.page++;
  };

  const prevPage = () => {
    paginate.page = Math.max(paginate.page - 1, 1);
  };

  const setPageSize = (size: number) => {
    paginate.pageSize = Math.max(size, DEFAULT_PAGE_SIZE);
  };

  return { paginate, page, pageSize, nextPage, prevPage, setPageSize };
}
