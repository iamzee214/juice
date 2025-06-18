import axios from "../utils/axios.instance";

/**
 * Get wallet balance and token holdings from the API
 */
export async function getWalletBalance() {
  try {
    const response = await axios.get("/api/wallet/balance", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    throw error;
  }
}
