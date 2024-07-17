import { useAuthStore } from '../features/auth/stores/index.store';

export default defineNuxtRouteMiddleware((to, from) => {
  const { auth } = useAuthStore();
  // console.log(from);
  // console.log(to);

  // console.log(auth.user);

  const isAuthRoute = !!from.matched.find((item) => item.name === 'auth');

  if (isAuthRoute && auth.user) {
    if (to.name !== 'index') {
      return navigateTo({ name: 'index' }, { redirectCode: 301 });
    }
  }

  if (!isAuthRoute && !auth.user) {
    if (to.name !== 'auth-login') {
      return navigateTo({ name: 'auth-login' }, { redirectCode: 301 });
    }
  }
});
