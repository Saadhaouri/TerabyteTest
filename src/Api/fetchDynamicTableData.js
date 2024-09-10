import axios from "axios";

const API_URL = "https://66dd75fcf7bcc0bbdcde2a03.mockapi.io/view/";

export async function fetchDynamicTableData(apiId) {
  try {
    if (!apiId) {
      throw new Error("API ID is required");
    }

    const response = await axios.get(`${API_URL}${apiId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
