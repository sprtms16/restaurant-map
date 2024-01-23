<template>
  <kakao-map />
</template>

<script>
import { defineComponent } from "vue";

// Components
import KakaoMap from "@/components/KakaoMap.vue";

export default defineComponent({
  name: "HomeView",

  components: {
    KakaoMap,
  },
});
</script>
