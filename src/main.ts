import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from './router';

// Import fonts for Naive UI
import 'vfonts/Lato.css';
import 'vfonts/FiraCode.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
