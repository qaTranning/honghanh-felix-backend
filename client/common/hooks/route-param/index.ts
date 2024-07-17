export function useRouteParam(param: string, useFirstIfArray = true): Ref<string | string[]> {
  const route = useRoute();

  return computed(() => {
    let paramValue = route.params[param];

    if (useFirstIfArray && Array.isArray(paramValue) && paramValue.length) {
      [paramValue] = paramValue;
    }

    return paramValue;
  });
}
