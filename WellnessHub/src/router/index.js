import DashboardView from "@/views/DashboardView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RatingView from "@/views/RatingView.vue";
import SignUpView from "@/views/SignUpView.vue";
import FirebaseSignUpView from "@/views/FirebaseSignUpView.vue";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignUpView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/review",
    name: "Review",
    component: RatingView,
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/firebase-signup",
    name: "FirebaseSignUp",
    component: FirebaseSignUpView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
