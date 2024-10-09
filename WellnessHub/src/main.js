import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

const app = createApp(App);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB89JL6wRd6Of_L1lLi1Awxx51gfK9qJGY",
  authDomain: "fit5032-wellnesshub.firebaseapp.com",
  projectId: "fit5032-wellnesshub",
  storageBucket: "fit5032-wellnesshub.appspot.com",
  messagingSenderId: "991670726884",
  appId: "1:991670726884:web:9f77e3308236299f1dfcf1",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// PrimeVue config
app.use(PrimeVue, {
  theme: {
      preset: Aura,
      options: {
          prefix: 'p',
          darkModeSelector: 'light',
          cssLayer: false
      }
  }
});
app.use(router);
app.mount("#app");
