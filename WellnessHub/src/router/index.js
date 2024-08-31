import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import SignUpView from "@/views/SignUpView.vue";
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
    component: SignUpView
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
