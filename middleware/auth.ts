export default defineNuxtRouteMiddleware((to) => {
  const token = useState("auth-token");
  const user = useUser();

  // Allow access to login and signup pages
  if (to.path === "/login" || to.path === "/signup") {
    if (token.value && user.value) {
      return navigateTo("/dashboard");
    }
    return;
  }

  // Check auth for other pages
  if (!token.value || !user.value) {
    return navigateTo("/login");
  }
});
