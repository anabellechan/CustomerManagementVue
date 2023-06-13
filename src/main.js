import { createApp } from "vue";
import JsonCSV from "vue-json-csv";
import App from "./App.vue";
import router from "./router";
import { VueCsvImportPlugin } from "vue-csv-import";
import { globalCookiesConfig } from "vue3-cookies";
import "./assets/main.css";

//PrimeVue
import PrimeVue from "primevue/config";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/themes/fluent-light/theme.css";
import "primevue/resources/themes/lara-light-indigo/theme.css";
// primevue components that get used multiple times throughout app
import Button from "primevue/button";

//core
globalCookiesConfig({
  expireTimes: "1d",
  path: "/",
  domain: "",
  secure: true,
  sameSite: "None",
});
// treat all tags starting with 'ion-' as custom elements
const app = createApp(App).use(VueCsvImportPlugin);
app.component("Button", Button);
app.component("downloadCsv", JsonCSV);
app.use(router);
app.use(PrimeVue);
app.mount("#app");
