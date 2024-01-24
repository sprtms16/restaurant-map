import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import info from "@/store/modules/info";

export default createStore({
  modules: {
    info: info,
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      paths: ["info"],
    }),
  ],
});
