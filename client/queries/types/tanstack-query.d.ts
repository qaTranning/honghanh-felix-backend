import '@tanstack/vue-query'

declare module '@tanstack/vue-query'{
  type QueryKey = ReadonlyArray<any>;
}
