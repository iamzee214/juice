<template>
  <div class="min-h-screen w-full relative overflow-hidden">
    <!-- Main Content Area with Glass Background -->
    <router-view />
  </div>
</template>

<script>
import { useUserStore } from "../stores/user";
import { useWalletStore } from "../stores/wallet";
import { useAlertStore } from "../stores/alert";
import { useTwitterStore } from "../stores/twitter";
import { mapStores } from "pinia";
import string from "../mixins/string";
import { tweetStyles } from "../constants/tweetStyles";
import * as twitterFunctions from "../functions/twitterFunctions";
import * as walletFunctions from "../functions/walletFunctions";
import { clearCookies } from "../utils/axios.instance";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default {
  data() {
    return {
      newBundle: false,
      ca: null,
      refreshingMetrics: false,
      metricsRefreshTime: null,
      canRefreshMetrics: true,
      dailyRefreshRemaining: 5,
      dailyRefreshLimit: 5,
      refreshLimitReached: false,
      solBalance: "0.00",
    };
  },
  components: {},
  computed: {
    ...mapStores(useUserStore, useAlertStore, useWalletStore, useTwitterStore),
    hasCompletedConfiguration() {
      return (
        this.userStore.user &&
        this.userStore.user.configuration &&
        Object.keys(this.userStore.user.configuration).length > 0 &&
        this.$route.path !== "/configuration" &&
        this.$route.path !== "/initial"
      );
    },
  },
  mixins: [string],
  methods: {
    viewDetails(ca) {
      this.ca = ca;
      this.newBundle = true;
    },
    clickBack() {
      this.newBundle = false;
    },
    showNewBundle() {
      this.ca = null;
      this.newBundle = true;
    },
    async logout() {
      clearCookies();
      this.userStore.$reset();
      this.$router.push("/auth");
    },
    getStyleColor(styleId) {
      const style = tweetStyles.find((s) => s.id === styleId);
      return style ? style.color : "";
    },
    getStyleEmoji(styleId) {
      const style = tweetStyles.find((s) => s.id === styleId);
      return style ? style.emoji : "";
    },
    getStyleName(styleId) {
      const style = tweetStyles.find((s) => s.id === styleId);
      return style ? style.name : "";
    },
    async refreshMetrics() {
      if (!this.canRefreshMetrics || this.refreshLimitReached) return;

      this.refreshingMetrics = true;
      try {
        const response = await twitterFunctions.getPostMetrics(true);

        // Update refresh limit info if available
        if (response?.data?.refreshInfo) {
          this.dailyRefreshRemaining = response.data.refreshInfo.remaining;
          this.dailyRefreshLimit = response.data.refreshInfo.limit;
          this.refreshLimitReached = this.dailyRefreshRemaining <= 0;

          if (response.data.refreshInfo.error) {
            this.alertStore.setWarningMessage(response.data.refreshInfo.error);
          }
        }
      } catch (error) {
        console.error("Error refreshing metrics:", error);

        // Check for rate limit
        if (error.response?.data?.canRefreshAt) {
          this.metricsRefreshTime = error.response.data.canRefreshAt;
          this.canRefreshMetrics = false;

          // Set a timer to re-enable the refresh button
          const refreshTime = new Date(this.metricsRefreshTime);
          const now = new Date();
          const timeToWait = Math.max(0, refreshTime - now);

          setTimeout(() => {
            this.canRefreshMetrics = true;
          }, timeToWait);
        }

        // Check for refresh limit
        if (error.response?.data?.refreshInfo) {
          this.dailyRefreshRemaining =
            error.response.data.refreshInfo.remaining;
          this.dailyRefreshLimit = error.response.data.refreshInfo.limit;
          this.refreshLimitReached = this.dailyRefreshRemaining <= 0;

          if (this.refreshLimitReached) {
            this.alertStore.setWarningMessage(
              "Daily refresh limit reached (5 refreshes per day)"
            );
          }
        }
      } finally {
        this.refreshingMetrics = false;
      }
    },
    formatRefreshTime(dateString) {
      if (!dateString) return "";
      const now = new Date();
      const refreshTime = new Date(dateString);
      const diff = refreshTime - now;

      if (diff <= 0) return "now";

      const minutes = Math.floor(diff / 60000);
      if (minutes < 60) return `in ${minutes} min`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `in ${hours} hr`;

      const days = Math.floor(hours / 24);
      if (days === 1) return "tomorrow";
      if (days < 7) return `in ${days} days`;

      return `on ${refreshTime.toLocaleDateString()}`;
    },
    async getSolBalance() {
      if (!this.userStore.authSolanaWalletAddress) return;

      try {
        // Use our new backend API endpoint instead of direct Solana RPC call
        const walletData = await walletFunctions.getWalletBalance();

        // Find SOL token in the tokens array
        const solToken = walletData.tokens.find(
          (token) => token.symbol === "SOL" || token.name === "Solana"
        );

        if (solToken) {
          // Format SOL balance to 2 decimal places
          this.solBalance = parseFloat(solToken.amount).toFixed(2);
        } else {
          // If no SOL token found in the response, use the native SOL balance
          // Convert from lamports to SOL if needed
          this.solBalance = parseFloat(
            walletData.nativeSolBalance || 0
          ).toFixed(2);
        }

        // Store all tokens in wallet store for use elsewhere in the app
        this.walletStore.setTokens(walletData.tokens);
        this.walletStore.setTotalValue(walletData.totalValue);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        this.alertStore.setErrorMessage("Failed to load wallet data");
        this.solBalance = "0.00";
      }
    },
  },
  async mounted() {
    // Get SOL balance
    await this.getSolBalance();

    // Set up a timer to refresh the SOL balance every minute
    this.balanceInterval = setInterval(this.getSolBalance, 60000);
  },
  beforeUnmount() {
    // Clear intervals when component is unmounted
    if (this.balanceInterval) {
      clearInterval(this.balanceInterval);
    }
  },
};
</script>

<style scoped>
/* Enhanced Glass Morphism Navigation Styles for Future Use */

/* Floating Background Orbs */
.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.2;
  animation: float 6s ease-in-out infinite;
  background: linear-gradient(
    45deg,
    rgba(85, 212, 63, 0.3),
    rgba(1, 160, 68, 0.2)
  );
}

.orb-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(20px) rotate(240deg);
  }
}

/* Grid Overlay */
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
}

/* Enhanced Glass Navigation Bar */
.floating-nav {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 50;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 20px !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-nav::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  border-radius: 20px 20px 0 0;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  gap: 24px;
}

/* Logo Section */
.nav-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* Navigation Links with Glass Effect */
.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 12px !important;
  color: rgba(255, 255, 255, 0.9) !important;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 1) !important;
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

.nav-item-active {
  background: rgba(85, 212, 63, 0.15) !important;
  border: 1px solid rgba(85, 212, 63, 0.3) !important;
  color: rgba(255, 255, 255, 0.95) !important;
  box-shadow:
    0 4px 16px rgba(85, 212, 63, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

.nav-item-active::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(85, 212, 63, 0.8),
    rgba(1, 160, 68, 0.8)
  );
  border-radius: 0 0 12px 12px;
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* User Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

/* Wallet Info with Glass Effect */
.wallet-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.wallet-balance {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(85, 212, 63, 0.12) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(85, 212, 63, 0.25) !important;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 12px;
  font-weight: 600;
}

.wallet-address {
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 11px;
  font-weight: 500;
}

/* Logout Button with Glass Effect */
.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: rgba(239, 68, 68, 0.15) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(239, 68, 68, 0.3) !important;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.9) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.25) !important;
  border: 1px solid rgba(239, 68, 68, 0.4) !important;
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(239, 68, 68, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .floating-nav {
    top: 16px;
    left: 16px;
    right: 16px;
  }

  .nav-content {
    padding: 12px 20px;
    gap: 16px;
  }

  .nav-links {
    gap: 6px;
  }

  .nav-item {
    padding: 8px 12px;
    font-size: 13px;
  }

  .nav-item span {
    display: none;
  }

  .nav-icon {
    width: 16px;
    height: 16px;
  }

  .wallet-info {
    display: none;
  }
}

@media (max-width: 768px) {
  .floating-nav {
    top: 12px;
    left: 12px;
    right: 12px;
    border-radius: 16px;
  }

  .nav-content {
    padding: 10px 16px;
    gap: 12px;
  }

  .nav-links {
    gap: 4px;
  }

  .nav-item {
    padding: 8px;
  }

  .nav-logo img:last-child {
    display: none;
  }
}
</style>
