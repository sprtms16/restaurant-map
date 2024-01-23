<template>
  <div id="map"></div>
</template>

<script>
import { toRaw } from "vue";

export default {
  name: "KakaoMap",
  data() {
    return {
      markers: [],
      infowindow: null,
    };
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=3f7b3c46ac6ac1e3bcc4d43bfbeda228";
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const container = document.getElementById("map");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const options = {
            center: new kakao.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            ),
            level: 5,
          };
          //지도 객체를 등록합니다.
          //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
          this.map = new kakao.maps.Map(container, options);
          const markerPosition = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          const iwContent = "내 위치";
          // 커스텀 오버레이를 생성합니다
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(this.map);
          const infowindow = new kakao.maps.InfoWindow({
            position: markerPosition,
            content: iwContent,
          });

          // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
          infowindow.open(this.map, marker);
        },
        () => {
          // 주소-좌표 변환 객체를 생성합니다
          const geocoder = new kakao.maps.services.Geocoder();
          // 주소로 좌표를 검색합니다
          geocoder.addressSearch(
            "서울특별시 중구 세종대로 110",
            function (result, status) {
              // 정상적으로 검색이 완료됐으면
              if (status === kakao.maps.services.Status.OK) {
                const markerPosition = new kakao.maps.LatLng(
                  result[0].y,
                  result[0].x
                );

                const options = {
                  center: markerPosition,
                  level: 5,
                };
                //지도 객체를 등록합니다.
                //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
                this.map = new kakao.maps.Map(container, options);
                const iwContent = "내 위치를 알 수 없습니다.ㅠㅠ";
                // 커스텀 오버레이를 생성합니다
                const marker = new kakao.maps.Marker({
                  position: markerPosition,
                });
                marker.setMap(this.map);
                const infowindow = new kakao.maps.InfoWindow({
                  position: markerPosition,
                  content: iwContent,
                });
                // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
                infowindow.open(this.map, marker);
              }
            }
          );
        },
        {
          maximumAge: 0,
          enableHighAccuracy: true,
        }
      );
    },
    changeSize() {
      toRaw(this.map).relayout();
    },
    displayMarker(markerPositions) {
      if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      if (positions.length > 0) {
        this.markers = positions.map(
          (position) =>
            new kakao.maps.Marker({
              map: toRaw(this.map),
              position,
            })
        );

        const bounds = positions.reduce(
          (bounds, latlng) => bounds.extend(latlng),
          new kakao.maps.LatLngBounds()
        );

        toRaw(this.map).setBounds(bounds);
      }
    },
    displayInfoWindow() {
      if (this.infowindow && this.infowindow.getMap()) {
        //이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
        toRaw(this.map).setCenter(this.infowindow.getPosition());
        return;
      }

      const iwContent = `<div style="padding:5px;">Hello World!</div>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwPosition = new kakao.maps.LatLng(33.450701, 126.570667), //인포윈도우 표시 위치입니다
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      this.infowindow = new kakao.maps.InfoWindow({
        map: toRaw(this.map), // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
      });

      toRaw(this.map).setCenter(iwPosition);
    },
  },
};
</script>

<style scoped>
#map {
  width: 100vw;
  height: calc(100vh - 64px);
}
</style>
