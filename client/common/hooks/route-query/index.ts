export function useRouteQuery(query: string, useFirstIfArray = true): Ref<string | string[]> {
  const route = useRoute();

  return computed(() => {
    let paramValue = route.query[query];

    if (useFirstIfArray && Array.isArray(paramValue) && paramValue.length) {
      [paramValue] = paramValue;
    }

    return paramValue as string | string[];
  });
}
