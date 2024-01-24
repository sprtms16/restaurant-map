<template>
  <v-app>
    <v-app-bar :elevation="13" rounded>
      <template #prepend>
        <v-app-bar-title
          >마커를 더블클릭시 주소가 클립보드에 복사됩니다.</v-app-bar-title
        >
      </template>
      <template v-slot:append>
        <v-btn icon="mdi-refresh" @click="$router.go(0)"></v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <kakao-map />
    </v-main>
  </v-app>
</template>

<script>
import KakaoMap from "@/components/KakaoMap.vue";

export default {
  name: "App",
  components: { KakaoMap },

  data: () => ({
    //
  }),
};
</script>
