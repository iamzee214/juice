<template>
  <div class="min-h-screen w-full relative overflow-hidden">
    <!-- Main Content Container -->
    <div
      class="relative z-10 min-h-screen flex items-center justify-center p-6"
    >
      <div
        class="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-end"
      >
        <!-- Left Side - Branding & Info -->
        <div class="space-y-8 text-center lg:text-left">
          <!-- Logo Section -->
          <div
            class="flex items-center justify-center lg:justify-start space-x-4"
          >
            <div class="relative">
              <img
                class="h-20 w-20 object-contain filter drop-shadow-lg"
                src="/juicebox.png"
                alt="Logo"
              />
            </div>
            <div class="space-y-1">
              <img
                class="h-14 mt-3 w-auto object-contain"
                src="/juicetext.png"
                alt="Juice"
              />
            </div>
          </div>

          <!-- Hero Text -->
          <div class="space-y-6">
            <h1 class="text-4xl lg:text-6xl font-bold leading-tight">
              <span class="modern-gradient-text">Grow with Juice</span>
            </h1>
            <p
              class="text-xl text-juice-green-dark/80 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Harness the power of your own personal AI agent, to amplify your
              twitter presence &amp; reach.
            </p>
          </div>

          <!-- Feature Cards -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0"
          >
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-juice-green-dark">
                  Personalised Agent
                </h3>
                <p class="text-sm text-juice-green-dark">
                  Full memory of all your tweets
                </p>
              </div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-juice-green-dark">
                  Self-learning
                </h3>
                <p class="text-sm text-juice-green-dark">
                  Tracks engagement, and adjusts tweets accordingly
                </p>
              </div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-juice-green-dark">
                  Trend Analysis
                </h3>
                <p class="text-sm text-juice-green-dark">
                  Real time engagement insights
                </p>
              </div>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-juice-green-dark">
                  Unified dashboard
                </h3>
                <p class="text-sm text-juice-green-dark">
                  Everything you need, in one place
                </p>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div
            class="flex items-center justify-center lg:justify-start space-x-6"
          >
            <a
              href="https://x.com/growwithjuice"
              class="social-link"
              target="_blank"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
              Twitter
            </a>
            <a class="social-link" target="_blank">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Docs
            </a>
            <a
              href="https://twitter.com/messages/compose?recipient_id=1928035920550248448"
              class="social-link"
              target="_blank"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Support
            </a>
          </div>
        </div>

        <!-- Right Side - Twitter Connection -->
        <div class="flex justify-center lg:justify-end">
          <div class="twitter-connection-card">
            <div class="card-header">
              <div class="flex items-center space-x-3 mb-6">
                <div class="connection-indicator"></div>
                <h2 class="text-2xl font-bold text-juice-green-dark">
                  Connect with X
                </h2>
              </div>
              <p class="text-juice-green-dark mb-8 leading-relaxed">
                Connect your X (Twitter) account to access your personalized AI
                dashboard.
              </p>
            </div>

            <!-- Twitter Connection Area -->
            <div class="twitter-connect-section">
              <!-- Loading State -->
              <template v-if="loading">
                <div class="twitter-visual mb-6">
                  <div class="twitter-loader mx-auto"></div>
                </div>
                <h3
                  class="text-xl font-semibold text-white/98 mb-2 text-center"
                >
                  Connecting to X
                </h3>
                <p class="text-white/85 text-center mb-6">
                  Please wait while we establish a secure connection...
                </p>
              </template>

              <!-- Error State -->
              <template v-else-if="error">
                <div class="twitter-visual mb-6">
                  <div class="error-icon-container">
                    <svg
                      class="w-12 h-12 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 19.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
                <h3
                  class="text-xl font-semibold text-white/98 mb-2 text-center"
                >
                  Connection Failed
                </h3>
                <p class="text-white/85 mb-6 text-center">{{ errorMessage }}</p>
                <button @click="connectTwitter" class="twitter-connect-button">
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Try Again
                </button>
              </template>

              <!-- Connect State -->
              <template v-else>
                <div class="twitter-visual">
                  <div class="twitter-icon-container">
                    <svg
                      class="w-12 h-12 text-juice-green"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      />
                    </svg>
                  </div>
                  <div class="connection-lines">
                    <div class="line line-1"></div>
                    <div class="line line-2"></div>
                    <div class="line line-3"></div>
                  </div>
                </div>

                <div class="twitter-button-container">
                  <button
                    @click="connectTwitter"
                    class="twitter-connect-button"
                  >
                    <svg
                      class="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      />
                    </svg>
                    Connect with X
                  </button>
                </div>
              </template>
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
              <div class="flex items-start space-x-3">
                <svg
                  class="w-5 h-5 text-juice-green mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div class="text-sm text-juice-green-dark">
                  <p class="font-medium text-juice-green-dark mb-0">
                    Secure OAuth 2.0 Connection
                  </p>
                  <p class="text-xs text-juice-green-dark/80 mt-1">
                    We never post without your explicit permission
                  </p>
                </div>
              </div>
            </div>

            <!-- Terms -->
            <div class="terms-section">
              <p class="text-xs text-juice-green-dark text-center">
                By connecting, you agree to our
                <router-link
                  to="/terms"
                  class="text-juice-green hover:text-juice-green-dark underline transition-colors"
                  >Terms of Service</router-link
                >
                and
                <router-link
                  to="/privacy"
                  class="text-juice-green hover:text-juice-green-dark underline transition-colors"
                  >Privacy Policy</router-link
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "../stores/user";
import { useTwitterStore } from "../stores/twitter";
import axios from "../utils/axios.instance";
import { useAlertStore } from "../stores/alert";
import { mapStores } from "pinia";

export default {
  computed: {
    ...mapStores(useAlertStore, useUserStore, useTwitterStore),
  },
  async mounted() {
    // Check if we have OAuth parameters in the URL - this means we're receiving a callback from Twitter
    const urlParams = new URLSearchParams(window.location.search);

    // Check for OAuth 2.0 parameters
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    // Add debugging to verify parameter extraction
    console.log("URL search params:", window.location.search);
    console.log("Extracted parameters:", {
      code: code || "null",
      state: state || "null",
    });

    // Handle OAuth 2.0 callback
    if (code && state) {
      this.loading = true;
      console.log("Processing Twitter OAuth 2.0 callback:", {
        code,
        state,
        codeLength: code.length,
        stateLength: state.length,
      });

      try {
        // Handle the Twitter OAuth 2.0 callback
        const response = await axios.post("/api/auth/twitter/callback", {
          code,
          state,
        });

        console.log("Twitter OAuth callback success:", response.data);

        // Store user data in the store
        this.userStore.setIsLoggedIn(true);
        this.userStore.setUser(response.data.userData);

        // Store Twitter data in the Twitter store
        const userData = response.data.userData;
        this.twitterStore.setTwitterConnected(userData.twitterConnected);
        this.twitterStore.setTwitterUsername(userData.twitterUsername);
        this.twitterStore.setTwitterName(userData.twitterName);
        this.twitterStore.setTwitterPhoto(userData.twitterPhoto);
        this.twitterStore.setTwitterBanner(userData.twitterBanner);
        this.twitterStore.setIsVerified(userData.isVerified);
        this.twitterStore.setTwitterPostsCount(userData.twitterPostsCount);
        this.twitterStore.setTwitterFollowersCount(
          userData.twitterFollowersCount
        );
        this.twitterStore.setTwitterFollowingCount(
          userData.twitterFollowingCount
        );

        // Check if user has completed configuration
        console.log("User data:", userData);
        console.log("Configuration:", userData.configuration);

        const hasCompletedConfig =
          userData.configuration && userData.configuration.isComplete;

        console.log("Has completed config:", hasCompletedConfig);

        // Redirect based on configuration status
        if (hasCompletedConfig) {
          console.log("Redirecting to /home");
          this.$router.push("/home");
        } else {
          console.log("Redirecting to /configuration");
          this.$router.push("/configuration");
        }
      } catch (error) {
        console.error("Twitter OAuth 2.0 callback error:", error);
        this.loading = false;
        this.error = true;
        this.errorMessage =
          error.response?.data?.error ||
          "Failed to authenticate with Twitter. Please try again.";
      }
    } else {
      console.log("No OAuth callback parameters found");
    }
  },
  data() {
    return {
      loading: false,
      error: false,
      errorMessage: "",
      API_URL: __API_URL__,
    };
  },
  methods: {
    async connectTwitter() {
      try {
        this.loading = true;
        this.error = false;

        // Get the Twitter OAuth URL from the backend
        const response = await axios.get("/api/auth/twitter/oauth-url");
        const { authUrl } = response.data;

        // Redirect to Twitter OAuth
        window.location.href = authUrl;
      } catch (error) {
        console.error("Error connecting to Twitter:", error);
        this.loading = false;
        this.error = true;
        this.errorMessage =
          error.response?.data?.error ||
          "Failed to connect to Twitter. Please try again.";
      }
    },
  },
};
</script>

<style>
/* Modern Green/Juice Theme Styles */

/* Floating Background Orbs */
.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #55d43f, #01a044);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #7de068, #55d43f);
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #01a044, #55d43f);
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
    linear-gradient(rgba(85, 212, 63, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(85, 212, 63, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
}

/* Modern Gradient Text */
.modern-gradient-text {
  background: linear-gradient(135deg, #55d43f 0%, #01a044 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2);
  }
}

/* Feature Cards */
.feature-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(85, 212, 63, 0.4) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(85, 212, 63, 0.15);
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #55d43f, #01a044);
  border-radius: 10px;
  color: white;
  flex-shrink: 0;
}

.feature-card .text-sm {
  color: rgba(255, 255, 255, 0.95) !important;
}

.feature-card h3 {
  color: rgba(255, 255, 255, 0.98) !important;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Social Links */
.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.95) !important;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(85, 212, 63, 0.15) !important;
  border-color: rgba(85, 212, 63, 0.4) !important;
  color: rgba(255, 255, 255, 0.98) !important;
  transform: translateY(-1px);
}

/* Twitter Connection Card */
.twitter-connection-card {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 24px;
  padding: 32px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(85, 212, 63, 0.1);
  position: relative;
  overflow: hidden;
}

.twitter-connection-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(85, 212, 63, 0.5),
    transparent
  );
}

/* Connection Indicator */
.connection-indicator {
  width: 12px;
  height: 12px;
  background: linear-gradient(45deg, #55d43f, #01a044);
  border-radius: 50%;
  position: relative;
  animation: pulse-indicator 2s infinite;
}

.connection-indicator::after {
  content: "";
  position: absolute;
  inset: -4px;
  border: 2px solid rgba(85, 212, 63, 0.3);
  border-radius: 50%;
  animation: ping 2s infinite;
}

@keyframes pulse-indicator {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Twitter Visual */
.twitter-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}

.twitter-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    rgba(85, 212, 63, 0.2),
    rgba(1, 160, 68, 0.1)
  );
  border: 2px solid rgba(85, 212, 63, 0.3);
  border-radius: 20px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.twitter-icon-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(85, 212, 63, 0.1),
    transparent
  );
  animation: shimmer 3s infinite;
}

.error-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.2),
    rgba(220, 38, 38, 0.1)
  );
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 20px;
  margin: 0 auto;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Connection Lines */
.connection-lines {
  display: flex;
  gap: 4px;
  align-items: center;
}

.line {
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, #55d43f, #7de068);
  border-radius: 1px;
  animation: pulse-line 2s infinite;
}

.line-1 {
  animation-delay: 0s;
}

.line-2 {
  animation-delay: 0.3s;
}

.line-3 {
  animation-delay: 0.6s;
}

@keyframes pulse-line {
  0%,
  100% {
    opacity: 0.3;
    transform: scaleX(1);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.2);
  }
}

/* Twitter Button Container */
.twitter-button-container {
  margin: 24px 0;
}

/* Twitter Connect Button */
.twitter-connect-button {
  width: 100%;
  background: linear-gradient(135deg, #55d43f, #01a044);
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.twitter-connect-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(85, 212, 63, 0.3);
}

.twitter-connect-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(254, 249, 232, 0.3),
    transparent
  );
  transition: left 0.5s;
}

.twitter-connect-button:hover::before {
  left: 100%;
}

/* Twitter Loader */
.twitter-loader {
  --s: 30px;
  --g: 6px;
  width: calc(3 * (1.353 * var(--s) + var(--g)));
  display: grid;
  justify-items: end;
  aspect-ratio: 3;
  overflow: hidden;
  --_m: linear-gradient(90deg, #0000, #000 15px calc(100% - 15px), #0000);
  -webkit-mask: var(--_m);
  mask: var(--_m);
}

.twitter-loader:before {
  content: "";
  width: 200%;
  background:
    linear-gradient(90deg, #55d43f 50%, #0000 0),
    conic-gradient(
      from -90deg at var(--s) calc(0.353 * var(--s)),
      #fff 135deg,
      #666 0 270deg,
      #aaa 0
    );
  background-blend-mode: multiply;
  --_m:
    linear-gradient(
      to bottom right,
      #0000 calc(0.25 * var(--s)),
      #000 0 calc(100% - calc(0.25 * var(--s)) - 1.414 * var(--g)),
      #0000 0
    ),
    conic-gradient(
      from -90deg at right var(--g) bottom var(--g),
      #000 90deg,
      #0000 0
    );
  -webkit-mask: var(--_m);
  mask: var(--_m);
  background-size:
    calc(100% / 3) 100%,
    calc(100% / 6) 100%;
  -webkit-mask-size: calc(100% / 6) 100%;
  mask-size: calc(100% / 6) 100%;
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
  animation: load 1s infinite linear;
}

@keyframes load {
  to {
    transform: translate(calc(100% / 3));
  }
}

/* Security Notice */
.security-notice {
  background: rgba(85, 212, 63, 0.05);
  border: 1px solid rgba(85, 212, 63, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin: 24px 0;
}

/* Terms Section */
.terms-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(85, 212, 63, 0.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .modern-gradient-text {
    font-size: 3rem;
  }

  .twitter-connection-card {
    max-width: 400px;
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .modern-gradient-text {
    font-size: 2.5rem;
  }

  .feature-card {
    padding: 12px;
  }

  .twitter-connection-card {
    padding: 20px;
  }

  .orb-1,
  .orb-2,
  .orb-3 {
    opacity: 0.2;
  }
}

/* Legacy styles cleanup */
.SolSpy-gif {
  @apply border-juice-green-dark border-2 rounded-xl;
  box-shadow:
    3px 3px 0px 0px #01a044,
    6px 6px 0px 0px #01a044;
}

.ca {
  @apply text-xs md:text-2xl font-bold border-2 rounded-xl border-juice-green-dark px-3 py-2;
  box-shadow:
    3px 3px 0px 0px #01a044,
    6px 6px 0px 0px #01a044;
}

.results-dropdown {
  @apply absolute bg-white bg-opacity-90 w-full top-14 rounded-lg left-0 max-h-40 overflow-y-scroll;
}

@screen lg {
  .results-dropdown {
    @apply absolute bg-white bg-opacity-90 w-full top-20 rounded-lg left-0 max-h-40 overflow-y-scroll;
  }
}

/* Update specific selectors for better glass morphism visibility */
.text-juice-green-dark {
  color: rgba(255, 255, 255, 0.98) !important;
}

.text-juice-green {
  color: rgba(85, 212, 63, 0.95) !important;
}
</style>
