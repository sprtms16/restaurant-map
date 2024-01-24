<template>
  <v-app>
    <v-app-bar :elevation="13" rounded>
      <template #prepend>
        <h5>마커를 더블클릭시 주소가 클립보드에 복사됩니다.</h5>
      </template>
      <template v-slot:append>
        <v-btn icon="mdi-refresh" @click="refresh()"></v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <kakao-map />
    </v-main>
  </v-app>
</template>

<script>
import KakaoMap from "@/components/KakaoMap.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "App",
  components: { KakaoMap },
  data: () => ({
    //
  }),
  methods: {
    ...mapActions(["fetchRestaurantInfo"]),
    ...mapMutations(["initInfo"]),
    async refresh() {
      await this.initInfo();
      await this.fetchRestaurantInfo();
      await this.$router.go(0);
    },
  },
};
</script>
