import axiosInstance from "@/plugins/proxyHandler";

const sheetId = process.env.VUE_APP_SHEET_ID;
const sheetName = process.env.VUE_APP_SHEET_NAME;
const apiKey = process.env.VUE_APP_API_KEY;

export default {
  async fetchRestaurantInfo() {
    try {
      return await axiosInstance.get(`${sheetId}/values/${sheetName}`, {
        params: {
          key: apiKey,
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};
