import Vue from "vue";
import VueRouter from "vue-router";

import App from "./App.vue";
import Home from "./views/home";

import "@/common/base.css";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
  ],
});

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
