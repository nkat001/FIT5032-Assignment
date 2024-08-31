import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RatingView from "@/views/RatingView.vue";
import SignUpView from "@/views/SignUpView.vue";
import { createRouter, createWebHistory, RouterView } from "vue-router";
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
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
