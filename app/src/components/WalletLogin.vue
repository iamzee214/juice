<template>
  <div>
    <button
      v-if="!walletConnected"
      @click="connectWallet"
      class="connect-wallet-btn"
      :disabled="loading"
    >
      <div class="btn-content">
        <span v-if="loading" class="loading-spinner"></span>
        <span
          v-else
          style="
            color: white !important;
            text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
          "
          >Connect Solana Wallet</span
        >
      </div>
    </button>
    <button v-else @click="disconnectWallet" class="disconnect-wallet-btn">
      <div class="btn-content">
        <span
          style="
            color: white !important;
            text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
          "
          >Disconnect Wallet</span
        >
      </div>
    </button>
  </div>
</template>
<script>
import { useUserStore } from "../stores/user";
import { useAlertStore } from "../stores/alert";
import { mapStores } from "pinia";
import { getSolanaNonce, verifySolanaUser } from "../functions/authFunctions";
import bs58 from "bs58";

export default {
  data() {
    return {
      wallet: null,
      walletConnected: false,
      loading: false,
    };
  },
  async mounted() {
    // Check if Phantom wallet extension exists
    this.checkPhantomWalletExists();
  },
  computed: {
    ...mapStores(useUserStore, useAlertStore),
  },
  methods: {
    checkPhantomWalletExists() {
      const isPhantomInstalled = window.phantom?.solana?.isPhantom;

      if (!isPhantomInstalled) {
        this.alertStore.setErrorMessage(
          "Please install Phantom wallet extension"
        );
      }
    },

    async connectWallet() {
      try {
        this.loading = true;
        // Connect to Phantom wallet
        const provider = window.phantom?.solana;

        if (!provider?.isPhantom) {
          this.alertStore.setErrorMessage("Phantom wallet not installed!");
          this.loading = false;
          return;
        }

        // Connect to wallet
        const resp = await provider.connect();
        const publicKey = resp.publicKey.toString();

        // Get nonce from server
        const message = await getSolanaNonce(publicKey);
        const messageContent = message.data.msg;

        // Sign the message
        const encodedMessage = new TextEncoder().encode(messageContent);
        const signatureData = await provider.signMessage(
          encodedMessage,
          "utf8"
        );

        // Convert Uint8Array signature to base64 string
        const signature = Buffer.from(signatureData.signature).toString(
          "base64"
        );

        // Verify signature on server
        const res = await verifySolanaUser(publicKey, signature);

        // Only after everything succeeds, set the wallet address
        this.wallet = publicKey;
        this.walletConnected = true;

        this.userStore.setUserId(res.data.id);
        this.userStore.setAuthSolanaWalletAddress(res.data.walletAddress);
        this.userStore.setIsLoggedIn(true);
        this.userStore.setSessionId(res.data.sessionId);
        this.userStore.setStyle(res.data.style);

        // Set user data
        this.userStore.setUser(res.data);

        // Check if configuration is complete
        if (res.data.configuration && res.data.configuration.isComplete) {
          // If configuration is already complete, go to home
          this.$router.push("/");
        } else {
          // If configuration is not complete, redirect to configuration
          this.$router.push("/configuration");
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        this.wallet = null;
        this.walletConnected = false;
        this.alertStore.setErrorMessage("Error connecting to wallet");
      } finally {
        this.loading = false;
      }
    },

    async disconnectWallet() {
      try {
        this.wallet = null;
        this.walletConnected = false;
        this.userStore.setIsLoggedIn(false);
        this.userStore.setAuthSolanaWalletAddress(null);
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
      }
    },
  },
};
</script>
<style>
.connect-wallet-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #55d43f, #01a044);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer !important;
  transition: all 0.3s ease;
  width: 100%;
  position: relative;
  z-index: 30 !important;
  font-size: 16px;
  height: auto;
  min-height: 48px;
  min-width: 200px;
  pointer-events: auto !important;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
  text-transform: none;
  letter-spacing: 0.025em;
}

.connect-wallet-btn:hover {
  background: linear-gradient(135deg, #4bc736, #019a3d);
  transform: translateY(-2px);
  box-shadow:
    0 7px 14px rgba(0, 0, 0, 0.1),
    0 3px 6px rgba(0, 0, 0, 0.08);
}

.connect-wallet-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.disconnect-wallet-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  cursor: pointer !important;
  transition: all 0.3s ease;
  width: 100%;
  position: relative;
  z-index: 30 !important;
  height: auto;
  min-height: 48px;
  min-width: 200px;
  pointer-events: auto !important;
}

.disconnect-wallet-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
}

.btn-content {
  width: 100%;
  text-align: center;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sol-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="%2300FFA3" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zM19.2 68.6c0-1.3 1-2.3 2.3-2.3h44.6c1.3 0 2.3 1 2.3 2.3v10.8c0 1.3-1 2.3-2.3 2.3H21.5c-1.3 0-2.3-1-2.3-2.3V68.6zm69.8 20.2c-8.8 0-15.9-7.1-15.9-15.9s7.1-15.9 15.9-15.9 15.9 7.1 15.9 15.9-7.1 15.9-15.9 15.9z"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}

.disconnect-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>');
  background-size: contain;
  background-repeat: no-repeat;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(85, 212, 63, 0.3);
  border-radius: 50%;
  border-top-color: #55d43f;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.connect-wallet-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
