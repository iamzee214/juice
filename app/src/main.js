import "./assets/main.css";
import SolanaWallets from "solana-wallets-vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "solana-wallets-vue/styles.css";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
// Setup wallet options for your app
const walletOptions = {
  wallets: [new PhantomWalletAdapter()],
  autoConnect: true,
};

import { createApp } from "vue";
import { createPinia } from "pinia";
if (typeof global === "undefined") {
  var global = window;
}
let pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
import App from "./App.vue";
import router from "./router";
import "animate.css";
import AOS from "aos";
AOS.init();
import "aos/dist/aos.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

// Import Heroicons
import {
  LinkIcon as OutlineLinkIcon,
  CircleStackIcon as OutlineCircleStackIcon,
  HomeIcon as OutlineHomeIcon,
  Square3Stack3DIcon as OutlineSquare3Stack3DIcon,
  CreditCardIcon as OutlineCreditCardIcon,
  CogIcon as OutlineCogIcon,
  ArrowPathIcon as OutlineArrowPathIcon,
  DocumentTextIcon as OutlineDocumentTextIcon,
  ChatBubbleLeftRightIcon as OutlineChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon as OutlineArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";

library.add(fas, far, fab);

const app = createApp(App);

import VueSmoothScroll from "vue3-smooth-scroll";
app.component("font-awesome-icon", FontAwesomeIcon);

// First register pinia to ensure stores are available before router is used
app.use(pinia);

// Import stores to fully initialize them before using the router
import { useUserStore } from "./stores/user";
import { useTwitterStore } from "./stores/twitter";

// Initialize stores to avoid hydration issues
const userStore = useUserStore();
const twitterStore = useTwitterStore();

// Log initial store state for debugging
console.log("Initial store state:", {
  isLoggedIn: userStore.isLoggedIn,
  hasConfig: userStore?.user?.configuration?.isComplete,
  twitterConnected: twitterStore.twitterConnected,
});

// Then use router after stores are initialized
app.use(router);
// // Register Heroicons globally
app.component("OutlineLinkIcon", OutlineLinkIcon);
app.component("OutlineCircleStackIcon", OutlineCircleStackIcon);
app.component("OutlineHomeIcon", OutlineHomeIcon);
app.component("OutlineSquare3Stack3DIcon", OutlineSquare3Stack3DIcon);
app.component("OutlineCreditCardIcon", OutlineCreditCardIcon);
app.component("OutlineCogIcon", OutlineCogIcon);
app.component("OutlineArrowPathIcon", OutlineArrowPathIcon);
app.component("OutlineDocumentTextIcon", OutlineDocumentTextIcon);
app.component("OutlineChatBubbleLeftRightIcon", OutlineChatBubbleLeftRightIcon);
app.component(
  "OutlineArrowRightOnRectangleIcon",
  OutlineArrowRightOnRectangleIcon
);
app.use(VueSmoothScroll);
app.use(SolanaWallets, walletOptions);
app.mount("#app");
