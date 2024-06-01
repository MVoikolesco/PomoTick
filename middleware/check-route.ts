export default defineNuxtRouteMiddleware((to, from) => {
    const router = useRouter();
    const matchedRoute = router.resolve(to.path);

    if (!matchedRoute.matched.length) {
        return navigateTo('/');
    }
});
