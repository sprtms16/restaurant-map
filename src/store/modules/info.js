import googleSheetApi from "@/api/googleSheetApi.js";

// state
const state = {
  info: [],
};

// mutations
const mutations = {
  setInfo(state, { info = [] }) {
    let tempInfoList = [];
    for (let i = 0; i < info.length; i++) {
      if (state.info[i]?.address === info[i].address) {
        tempInfoList.push({
          ...state.info[i],
          ...info[i],
        });
      } else {
        tempInfoList.push(info[i]);
      }
    }
    state.info = tempInfoList;
    return state.info;
  },
};

// actions
const actions = {
  async fetchRestaurantInfo({ commit }) {
    try {
      const {
        data: { values },
      } = await googleSheetApi.fetchRestaurantInfo();
      const info = values
        .splice(3)
        .map(
          ([
            no,
            city,
            region,
            storeName,
            address = "",
            menu,
            popMenu,
            writer,
            review,
            visitorReview,
          ]) => ({
            no,
            city,
            region,
            storeName,
            address,
            menu,
            popMenu,
            writer,
            review,
            visitorReview,
          })
        );
      commit("setInfo", { info: info });
    } catch (e) {
      console.log(e);
      commit("setInfo", {});
    }
  },
  async fetchLocationInfo({ state, commit }, { fnAddressSearch }) {
    const addLocationList = await Promise.all(
      state.info.map(async (info) => {
        try {
          if ((!info.lat || !info.lng) && info.address) {
            const result = await fnAddressSearch(info.address);
            return {
              ...info,
              ...result,
            };
          } else if (info.lat && info.lng) {
            return info;
          } else {
            return null;
          }
        } catch (e) {
          return null;
        }
      })
    );
    return commit("setInfo", {
      info: addLocationList.filter(Boolean),
    });
  },
};

// getters
const getters = {
  getInfo(state) {
    return state.info;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
