import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import "./styles/main.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");

// Scroll to top on every route change
router.afterEach(() => {
  window.scrollTo(0, 0);
  // Also reset scroll on any .page container if it exists
  const pageElement = document.querySelector(".page");
  if (pageElement) {
    pageElement.scrollTop = 0;
  }
});
