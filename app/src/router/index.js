import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";
import Dashboard from "../views/Dashboard.vue";
import Home from "../components/Dashboard/Home.vue";
import Subscription from "../components/Dashboard/Subscription.vue";
import { useUserStore } from "../stores/user";
import { useTwitterStore } from "../stores/twitter";
import Automate from "../components/Dashboard/Automate.vue";
import AddKey from "../components/Dashboard/AddKey.vue";
import ConfigurationFlow from "../components/Dashboard/ConfigurationFlow.vue";
import Terms from "../views/Terms.vue";
import Privacy from "../views/Privacy.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/auth",
      name: "Auth",
      component: Auth,
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        if (userStore.isLoggedIn) {
          next({ name: "Home" });
        } else {
          next();
        }
      },
    },
    {
      path: "/terms",
      name: "Terms",
      component: Terms,
    },
    {
      path: "/privacy",
      name: "Privacy",
      component: Privacy,
    },
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          redirect: { name: "Home" },
        },
        {
          path: "home",
          name: "Home",
          component: Home,
          meta: { requiresTwitterAuth: true },
        },
        {
          path: "subscription",
          name: "Subscription",
          component: Subscription,
          meta: { requiresTwitterAuth: true },
        },
        {
          path: "configuration",
          name: "Configuration",
          component: ConfigurationFlow,
        },
        {
          path: "automate",
          name: "Automate",
          component: Automate,
          meta: { requiresTwitterAuth: true },
          beforeEnter: (to, from, next) => {
            const twitterStore = useTwitterStore();
            if (!twitterStore.apiKeyConnected) {
              next({ name: "AddKey" });
            } else {
              next();
            }
          },
        },
        {
          path: "addKey",
          name: "AddKey",
          component: AddKey,
          meta: { requiresTwitterAuth: true },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const twitterStore = useTwitterStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresTwitterAuth = to.matched.some(
    (record) => record.meta.requiresTwitterAuth
  );

  // If route requires authentication and user is not logged in, redirect to auth
  if (requiresAuth && !userStore.isLoggedIn) {
    next({ path: "/auth" });
    return;
  }

  // If user is logged in, make sure we have the latest user data
  // before making routing decisions
  if (userStore.isLoggedIn && to.name !== "Auth") {
    try {
      // Fetch fresh user data including configuration from database
      await userStore.refreshUserData();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // Continue with navigation even if refresh fails
    }
  }

  // Check if user needs to go through setup first
  console.log("Router guard check:", {
    toName: to.name,
    isLoggedIn: userStore.isLoggedIn,
    hasConfiguration: !!userStore.user?.configuration,
    configurationIsObject: typeof userStore.user?.configuration === "object",
    isComplete: userStore.user?.configuration?.isComplete,
    configuration: userStore.user?.configuration,
  });

  if (
    to.name !== "Configuration" &&
    to.name !== "Auth" &&
    to.name !== "Terms" &&
    to.name !== "Privacy" &&
    userStore.isLoggedIn &&
    (!userStore.user?.configuration ||
      typeof userStore.user.configuration !== "object" ||
      !userStore.user.configuration.isComplete)
  ) {
    console.log("Redirecting to Configuration due to incomplete setup");
    next({ name: "Configuration" });
    return;
  }

  // Since Twitter is now the only auth method, if Twitter auth is required
  // and Twitter is not connected, redirect to main auth page
  if (requiresTwitterAuth && !twitterStore.twitterConnected) {
    next({ path: "/auth" });
    return;
  }

  next();
});

export default router;
