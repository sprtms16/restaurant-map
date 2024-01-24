<template>
  <div id="map"></div>
</template>

<script>
import { toRaw } from "vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "KakaoMap",
  data() {
    return {
      map: null,
      geocoder: null,
    };
  },
  computed: {
    ...mapGetters({ addressInfoList: "getInfo" }),
  },
  async created() {
    await this.fetchRestaurantInfo();
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=3f7b3c46ac6ac1e3bcc4d43bfbeda228&libraries=services,clusterer";
      document.head.appendChild(script);
    }
  },
  methods: {
    ...mapActions(["fetchRestaurantInfo", "fetchLocationInfo"]),
    initMap() {
      this.geocoder = new kakao.maps.services.Geocoder();
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            function result(result, status) {
              if (status === kakao.maps.services.Status.OK) {
                resolve({
                  lat: result[0].y,
                  lng: result[0].x,
                });
              } else {
                reject();
              }
            }
            //위치정보를 찾을 수 없을 경우 서울역을 기준으로 탐색
            this.geocoder.addressSearch(
              "서울특별시 용산구 한강대로 405",
              result
            );
          },
          {
            maximumAge: 0,
            enableHighAccuracy: true,
          }
        );
      })
        .then(({ lat, lng }) => {
          const options = {
            center: new kakao.maps.LatLng(lat, lng),
            level: 5,
          };

          //지도 객체를 등록합니다.
          //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
          const container = document.getElementById("map");
          this.map = new kakao.maps.Map(container, options);
          const markerPosition = new kakao.maps.LatLng(lat, lng);
          const iwContent = "내 위치";
          // 커스텀 오버레이를 생성합니다
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(toRaw(this.map));
          const infowindow = new kakao.maps.InfoWindow({
            position: markerPosition,
            content: iwContent,
          });

          // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
          infowindow.open(this.map, marker);
        })
        .catch(() => {
          alert(
            "위치정보를 가져올 수 없습니다. 인터넷이나 위치정보를 확인 해 주시기 바랍니다."
          );
        })
        .then(this.addMarker);
    },
    async addressSearch(address) {
      return new Promise((resolve, reject) => {
        this.geocoder.addressSearch(address, function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            resolve({
              lat: result[0].y,
              lng: result[0].x,
            });
          } else {
            reject(status);
          }
        });
      });
    },
    async addMarker() {
      try {
        const map = toRaw(this.map);
        this.fetchLocationInfo({ fnAddressSearch: this.addressSearch }).then(
          () => {
            const markers = this.addressInfoList.map(function (info) {
              const markerPosition = new kakao.maps.LatLng(info.lat, info.lng);
              let img = document.createElement("img");
              img.className = "marker";
              img.src = "https://t1.daumcdn.net/mapjsapi/images/2x/marker.png";
              img.setAttribute("data-address", info.address);
              const overlay = new kakao.maps.CustomOverlay({
                clickable: true,
                content: img,
                position: markerPosition,
                map: map,
                yAnchor: 1,
              });
              const infowindow = new kakao.maps.CustomOverlay({
                position: markerPosition,
                yAnchor: 1,
                content: `<div style="font-size: 0.8em; background-color: white; margin-bottom: 42px;"><div>상호명: ${info.storeName}</div><div>메뉴: ${info.menu}</div><div>추천 메뉴: ${info.popMenu}</div><div>작성자: ${info.writer}</div><div>작성자 리뷰: ${info.review}</div><div>방문자리뷰: ${info.visitorReview}</div></div>`,
              });
              img.addEventListener("touchstart", () => {
                infowindow.setMap(map);
                clearTimeout(window["timeout"]);
                if (window["selectedAddress"] === info.address) {
                  navigator.clipboard
                    .writeText(`${info.address}(${info.storeName})`)
                    .then(() => {
                      alert("주소가 복사되었습니다!");
                      delete window["selectedAddress"];
                    });
                } else {
                  window["selectedAddress"] = info.address;
                  window["timeout"] = setTimeout(() => {
                    delete window["selectedAddress"];
                  }, 3000);
                }
              });
              img.addEventListener("mouseover", () => {
                infowindow.setMap(map);
              });
              img.addEventListener("click", () => {
                clearTimeout(window["timeout"]);
                if (window["selectedAddress"] === info.address) {
                  navigator.clipboard
                    .writeText(`${info.address}(${info.storeName})`)
                    .then(() => {
                      alert("주소가 복사되었습니다!");
                      delete window["selectedAddress"];
                    });
                } else {
                  window["selectedAddress"] = info.address;
                  window["timeout"] = setTimeout(() => {
                    delete window["selectedAddress"];
                  }, 3000);
                }
              });

              img.addEventListener("touchend", () => {
                infowindow.setMap(null);
              });

              img.addEventListener("mouseout", () => {
                infowindow.setMap(null);
              });
              return overlay;
            });
            // 클러스터러에 마커들을 추가합니다
            const clusterer = new kakao.maps.MarkerClusterer({
              map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
              averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
              minLevel: 5, // 클러스터 할 최소 지도 레벨
            });
            return clusterer.addMarkers(markers);
          }
        );
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
#map {
  width: 100vw;
  height: calc(100vh - 64px);
}

#map /deep/ .marker {
  display: block;
  width: 29px;
  height: 42px;
}
</style>
