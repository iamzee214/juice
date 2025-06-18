import axios from "axios";
import router from "../router/index";
import { useUserStore } from "../stores/user";
import { useTwitterStore } from "../stores/twitter";
import { useAlertStore } from "../stores/alert";
import { getActivePinia } from "pinia";
import { signOut } from "../functions/twitterFunctions";

const axios_instance = axios.create({
  baseURL: __API_URL__,
  withCredentials: true,
  credentials: "include",
});

// Utility function to clear all cookies
export const clearCookies = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  }
};

axios_instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.log("Received 401 error, user needs to re-authenticate");

      try {
        // Clear user session
        await signOut();
      } catch (signOutError) {
        console.error("Error during automatic sign out:", signOutError);
      }

      // Redirect to auth page
      if (router.currentRoute.value.path !== "/auth") {
        router.push("/auth");
      }
    }

    return Promise.reject(error);
  }
);

export default axios_instance;
