<template>
  <v-app>
    <v-app-bar :elevation="13" rounded>
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
