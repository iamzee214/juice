<template>
  <div class="dashboard-home">
    <!-- Hero Section -->
    <div class="hero-section">
      <!-- Profile Hero Card -->
      <div class="profile-hero-card glass-container">
        <button @click="logout" class="signout-btn">
          <svg
            class="btn-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-11V4m-6 1h.01M7 19h.01"
            />
          </svg>
          Sign Out
        </button>
        <div class="profile-background">
          <img
            v-if="twitterStore.twitterBanner"
            :src="twitterStore.twitterBanner"
            class="banner-image"
            alt="Twitter Banner"
            @error="handleBannerError"
          />
          <div v-else class="default-banner">
            <div class="banner-orb orb-1"></div>
            <div class="banner-orb orb-2"></div>
            <div class="banner-orb orb-3"></div>
          </div>
          <div class="profile-overlay"></div>
        </div>

        <div class="profile-content">
          <div class="profile-info">
            <div class="profile-avatar">
              <img
                :src="twitterStore.twitterPhoto"
                alt="Profile Photo"
                @error="handleProfilePhotoError"
              />
            </div>

            <div class="profile-text">
              <h1 class="profile-name">{{ twitterStore.twitterName }}</h1>
              <p class="profile-username">
                @{{ twitterStore.twitterUsername }}
              </p>
            </div>
          </div>

          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">{{
                formatCount(twitterStore.twitterFollowersCount)
              }}</span>
              <span class="stat-label">Followers</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{
                formatCount(twitterStore.twitterFollowingCount)
              }}</span>
              <span class="stat-label">Following</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{
                formatCount(twitterStore.twitterPostsCount)
              }}</span>
              <span class="stat-label">Posts</span>
            </div>
          </div>
        </div>

        <!-- Action buttons positioned absolutely like signout -->
        <div class="profile-actions">
          <button @click="showConfiguration" class="action-btn configure">
            <svg
              class="btn-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Configure
          </button>

          <button
            v-if="canRefreshTimeline && !refreshLimitReached"
            @click="refreshAll"
            class="action-btn refresh"
            :disabled="isRefreshing"
          >
            <svg
              v-if="isRefreshing"
              class="btn-icon animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="btn-icon"
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
            {{ isRefreshing ? "Updating..." : "Update" }}
          </button>

          <!-- Enable 24/7 Mode Button (Experimental) -->
          <div class="relative">
            <button
              class="action-btn enable-mode"
              @mouseenter="show24Tooltip = true"
              @mouseleave="show24Tooltip = false"
            >
              <svg
                class="btn-icon"
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
              Enable 24/7 Mode (Experimental)
            </button>
            <div v-if="show24Tooltip" class="tooltip-24">
              You are not currently whitelisted for this feature.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Section -->
    <div v-if="postMetricsLoading" class="analytics-loading glass-card">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading analytics…</div>
    </div>

    <div class="analytics-section" v-if="!postMetricsLoading && postMetrics">
      <div class="section-header">
        <h2>Engagement Analytics</h2>
        <div class="analytics-badge glass-effect-subtle">
          <svg class="badge-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
            />
          </svg>
          Analytics Active
        </div>
      </div>

      <div class="analytics-grid">
        <div
          v-for="(value, key) in displayedMetrics"
          :key="key"
          class="analytics-card glass-card"
        >
          <div class="analytics-header">
            <h3>{{ formatMetricName(key) }}</h3>
            <div
              v-if="metricChanges[key] !== undefined"
              class="change-indicator glass-effect-subtle"
              :class="[metricChanges[key] >= 0 ? 'positive' : 'negative']"
            >
              <svg
                v-if="metricChanges[key] > 0"
                class="change-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <svg
                v-else-if="metricChanges[key] < 0"
                class="change-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                />
              </svg>
              <svg
                v-else
                class="change-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14"
                />
              </svg>
              <span
                >{{ metricChanges[key] > 0 ? "+" : ""
                }}{{ metricChanges[key] }}%</span
              >
            </div>
          </div>

          <div class="analytics-content">
            <div class="metric-comparison">
              <div class="current-metric glass-effect-subtle">
                <div class="metric-value">{{ value }}</div>
                <div class="metric-label">Recent Average</div>
              </div>
              <div class="previous-metric glass-effect-subtle">
                <div class="metric-value">
                  {{ previous10TweetsAvg[key] || 0 }}
                </div>
                <div class="metric-label">Previous Average</div>
              </div>
            </div>

            <div class="progress-container glass-effect-subtle">
              <div
                class="progress-bar"
                :style="{
                  width: `${Math.min(Math.max((value / (Math.max(value, previous10TweetsAvg[key] || 1) * 1.5)) * 100, 5), 100)}%`,
                  background:
                    metricChanges[key] >= 0
                      ? 'linear-gradient(90deg, rgba(85, 212, 63, 0.8), rgba(1, 160, 68, 0.9))'
                      : 'linear-gradient(90deg, rgba(239, 68, 68, 0.8), rgba(248, 113, 113, 0.9))',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Timeline Section -->
    <div class="timeline-section">
      <div class="section-header">
        <h2>Your Timeline</h2>
        <div class="timeline-badge glass-effect-subtle">
          <svg class="badge-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0011.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z"
            />
          </svg>
          Timeline Active
        </div>
      </div>

      <Timeline
        :tweets="timelineTweets"
        :timelineCacheInfo="timelineCacheInfo"
        v-if="!isLoading && timelineTweets"
      />

      <div v-if="isLoading" class="timeline-loading glass-card">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading your timeline...</div>
      </div>

      <div v-else-if="timelineError" class="timeline-error glass-card">
        <svg
          class="error-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div class="error-title">Failed to load timeline</div>
        <button @click="loadTwitterData" class="retry-btn glass-button-primary">
          <svg
            class="btn-icon"
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
          Retry
        </button>

        <div v-if="twitterAuthError" class="auth-error glass-effect-subtle">
          <div class="auth-error-text">Twitter authorization expired</div>
          <button
            @click="reconnectTwitter"
            class="reconnect-btn glass-button-primary"
          >
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
              />
            </svg>
            Reconnect Twitter
          </button>
        </div>
      </div>

      <div
        v-else-if="
          !timelineTweets ||
          (timelineTweets.data && timelineTweets.data.length === 0)
        "
        class="timeline-empty glass-card"
      >
        <svg
          class="empty-icon"
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
        <div class="empty-title">No tweets found in your timeline</div>
        <p class="empty-description">
          Try posting some tweets or following more accounts
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Timeline from "./Timeline.vue";
import TweetSuggestions from "./TweetSuggestions.vue";
import * as twitterFunctions from "../../functions/twitterFunctions";
import { useTwitterStore } from "../../stores/twitter";
import { useAlertStore } from "../../stores/alert";
import { useUserStore } from "../../stores/user";
import { clearCookies } from "../../utils/axios.instance";
import { mapStores } from "pinia";
import { Line as LineChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default {
  name: "Home",
  components: {
    LineChart,
    Timeline,
    TweetSuggestions,
  },
  data() {
    return {
      timelineTweets: [],
      isLoading: true,
      isRefreshing: false,
      timelineError: false,
      timelineCacheInfo: null,
      timelineRefreshTime: null,
      postMetrics: null,
      postMetricsLoading: true,
      postMetricsError: false,
      postMetricsCacheInfo: null,
      metricsRefreshTime: null,
      last10TweetsAvg: {},
      previous10TweetsAvg: {},
      metricChanges: {},
      last10Tweets: [],
      previous10Tweets: [],
      dailyRefreshRemaining: 5,
      dailyRefreshLimit: 5,
      refreshLimitReached: false,
      refreshTimerInterval: null,
      twitterAuthError: false,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
            beginAtZero: true,
            min: 0,
            max: 100,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
      show24Tooltip: false,
    };
  },
  computed: {
    ...mapStores(useTwitterStore, useAlertStore, useUserStore),
    canRefreshTimeline() {
      if (!this.timelineRefreshTime) return true;
      const now = new Date();
      const refreshTime = new Date(this.timelineRefreshTime);
      console.log("Comparing times:", now, refreshTime);
      return now >= refreshTime;
    },
    canRefreshMetrics() {
      if (!this.metricsRefreshTime) return true;
      return new Date() >= new Date(this.metricsRefreshTime);
    },
    timelineRefreshTimeFormatted() {
      if (!this.timelineRefreshTime) return "";
      return this.formatRefreshTime(this.timelineRefreshTime);
    },
    metricsRefreshTimeFormatted() {
      if (!this.metricsRefreshTime) return "";
      return this.formatRefreshTime(this.metricsRefreshTime);
    },
    displayedMetrics() {
      // Filter out bookmark_count from the metrics
      const filtered = {};
      for (const [key, value] of Object.entries(this.last10TweetsAvg)) {
        if (key !== "bookmark_count" && key !== "quote_count") {
          filtered[key] = value;
        }
      }
      return filtered;
    },
    chartData() {
      if (!this.followerGrowthData || this.followerGrowthData.length === 0) {
        return null;
      }

      // Create default data if we don't have enough points
      if (this.followerGrowthData.length === 1) {
        const currentCount = this.followerGrowthData[0].followerCount;
        const defaultData = [];

        // Create 7 days of flat data
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);

          defaultData.push({
            date: date,
            followerCount: currentCount,
          });
        }

        // Use the default data for visualization
        return this.createChartData(defaultData);
      }

      // Use real data when available
      return this.createChartData(this.followerGrowthData);
    },
    currentWeekPosts() {
      if (!this.postMetrics || !this.postMetrics.posts) return [];
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      return this.postMetrics.posts.filter((post) => {
        const postDate = new Date(post.created_at);
        return postDate >= oneWeekAgo;
      });
    },
    previousWeekPosts() {
      if (!this.postMetrics || !this.postMetrics.posts) return [];
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      return this.postMetrics.posts.filter((post) => {
        const postDate = new Date(post.created_at);
        return postDate >= twoWeeksAgo && postDate < oneWeekAgo;
      });
    },
  },
  methods: {
    handleBannerError(event) {
      // Set fallback gradient background by removing the image
      console.error("Failed to load Twitter banner");
      // Remove the banner from the DOM
      event.target.style.display = "none";
    },

    handleProfilePhotoError(event) {
      // Set default profile image
      console.error("Failed to load Twitter profile photo");
      // Set a default placeholder avatar
      event.target.src =
        "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png";
    },

    // Add method to check and update refresh availability
    checkRefreshAvailability() {
      if (this.timelineRefreshTime) {
        const now = new Date();
        const refreshTime = new Date(this.timelineRefreshTime);

        // If current time has passed refresh time, clear the timer
        if (now >= refreshTime) {
          console.log(
            "Refresh timer has expired, clearing timelineRefreshTime"
          );
          this.timelineRefreshTime = null;

          // Force reactivity update
          this.$forceUpdate();
        }
      }
    },

    async loadTwitterData(forceRefresh = false) {
      this.isLoading = true;
      this.isRefreshing = forceRefresh;
      this.timelineError = false;

      try {
        // Load timeline with refresh parameter if needed
        const timelineResponse =
          await twitterFunctions.getTimeline(forceRefresh);
        console.log("Timeline response:", timelineResponse);

        if (timelineResponse && timelineResponse.data) {
          // Reset to ensure we start fresh
          this.timelineTweets = null;

          // Check if we have full response structure or just data array
          if (timelineResponse.data.data) {
            // This is the full Twitter API response format
            this.timelineTweets = timelineResponse.data;
          } else {
            // This might be just the data array
            this.timelineTweets = { data: timelineResponse.data };
          }

          console.log("Processed timeline data:", this.timelineTweets);

          // Store cache info
          if (timelineResponse.data.cacheInfo) {
            this.timelineCacheInfo = timelineResponse.data.cacheInfo;
            this.timelineRefreshTime =
              timelineResponse.data.cacheInfo.canRefreshAt;
            console.log("Refresh time set to:", this.timelineRefreshTime);
          } else {
            this.timelineCacheInfo = null;
            this.timelineRefreshTime = null;
          }

          // Store refresh limit info
          if (timelineResponse.data.refreshInfo) {
            console.log(
              "Updating refresh count from timeline:",
              timelineResponse.data.refreshInfo
            );
            this.dailyRefreshRemaining =
              timelineResponse.data.refreshInfo.remaining;
            this.dailyRefreshLimit = timelineResponse.data.refreshInfo.limit;
            this.refreshLimitReached = this.dailyRefreshRemaining <= 0;

            if (timelineResponse.data.refreshInfo.error) {
              this.alertStore.setWarningMessage(
                timelineResponse.data.refreshInfo.error
              );
            }
          }
        } else {
          this.timelineTweets = { data: [] };
        }
      } catch (error) {
        console.error("Error loading timeline:", error);
        this.timelineError = true;
        this.alertStore.setErrorMessage("Failed to load your Twitter timeline");

        // Check for 401 Unauthorized error and disconnect Twitter
        if (error.response && error.response.status === 401) {
          console.log(
            "Twitter authentication expired, disconnecting Twitter account only"
          );
          this.alertStore.setWarningMessage(
            "Twitter authentication expired. Please reconnect your account."
          );
          // Set flag for auth error
          this.twitterAuthError = true;
          // Instead of disconnecting completely, just clear Twitter data in the store
          this.twitterStore.clearAccountInfo();
          // Stay on the current page and show the error
          return;
        }

        // Check for rate limit info in error response
        if (
          error.response &&
          error.response.data &&
          error.response.data.canRefreshAt
        ) {
          this.timelineRefreshTime = error.response.data.canRefreshAt;
          console.log(
            "Rate limit: Refresh time set to:",
            this.timelineRefreshTime
          );
        }

        // Check for refresh limit info in error response
        if (
          error.response &&
          error.response.data &&
          error.response.data.refreshInfo
        ) {
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
      }

      this.isLoading = false;
      this.isRefreshing = false;
    },

    createChartData(dataPoints) {
      // Extract follower counts from data
      const followerCounts = dataPoints.map((item) => item.followerCount);

      // Generate labels (dates)
      const labels = dataPoints.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      });

      return {
        labels,
        datasets: [
          {
            data: followerCounts,
            borderColor: this.followerGrowth >= 0 ? "#0f9b0f" : "#e53e3e",
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 200);
              if (this.followerGrowth >= 0) {
                gradient.addColorStop(0, "rgba(15, 155, 15, 0.5)");
                gradient.addColorStop(1, "rgba(15, 155, 15, 0)");
              } else {
                gradient.addColorStop(0, "rgba(229, 62, 62, 0.5)");
                gradient.addColorStop(1, "rgba(229, 62, 62, 0)");
              }
              return gradient;
            },
            fill: "start",
            tension: 0.4,
          },
        ],
      };
    },

    async loadPostMetrics(forceRefresh = false) {
      this.postMetricsLoading = true;
      this.postMetricsError = false;
      if (forceRefresh) this.isRefreshing = true;

      try {
        const response = await twitterFunctions.getPostMetrics(forceRefresh);
        if (response && response.data) {
          if (response.data.data) {
            this.postMetrics = response.data.data;
            // Store cache info
            if (response.data.cacheInfo) {
              this.postMetricsCacheInfo = response.data.cacheInfo;
              this.metricsRefreshTime = response.data.cacheInfo.canRefreshAt;
            }

            // Store refresh limit info
            if (response.data.refreshInfo) {
              console.log(
                "Updating refresh count from metrics:",
                response.data.refreshInfo
              );
              this.dailyRefreshRemaining = response.data.refreshInfo.remaining;
              this.dailyRefreshLimit = response.data.refreshInfo.limit;
              this.refreshLimitReached = this.dailyRefreshRemaining <= 0;

              if (response.data.refreshInfo.error) {
                this.alertStore.setWarningMessage(
                  response.data.refreshInfo.error
                );
              }
            }

            // Calculate last 10 tweets averages
            this.calculateLast10TweetsAverages();
          } else {
            this.postMetrics = response.data;
          }
        } else {
          this.postMetricsError = true;
          this.alertStore.setErrorMessage("Failed to load post metrics");
        }
      } catch (error) {
        console.error("Error loading post metrics:", error);
        this.postMetricsError = true;
        this.alertStore.setErrorMessage("Failed to load post metrics");

        // Check for 401 Unauthorized error and disconnect Twitter
        if (error.response && error.response.status === 401) {
          console.log(
            "Twitter authentication expired, disconnecting Twitter account only"
          );
          this.alertStore.setWarningMessage(
            "Twitter authentication expired. Please reconnect your account."
          );
          // Set flag for auth error
          this.twitterAuthError = true;
          // Instead of disconnecting completely, just clear Twitter data in the store
          this.twitterStore.clearAccountInfo();
          // Stay on the current page and show the error
          return;
        }

        // Check for rate limit info in error response
        if (
          error.response &&
          error.response.data &&
          error.response.data.canRefreshAt
        ) {
          this.metricsRefreshTime = error.response.data.canRefreshAt;
        }

        // Check for refresh limit info in error response
        if (
          error.response &&
          error.response.data &&
          error.response.data.refreshInfo
        ) {
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
      }

      this.postMetricsLoading = false;
      this.isRefreshing = false;
    },

    formatCacheDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleString();
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

    refreshTimeline() {
      if (this.isRefreshing) return;
      this.loadTwitterData(true);
    },

    refreshPostMetrics() {
      if (this.isRefreshing) return;
      this.loadPostMetrics(true);
    },

    refreshAll() {
      if (this.isRefreshing || this.refreshLimitReached) return;
      this.isRefreshing = true;
      console.log(
        "Starting refreshAll using combined endpoint, current count:",
        this.dailyRefreshRemaining
      );

      // Refresh using the combined endpoint
      this.loadCombinedData(true)
        .then(() => {
          console.log(
            "refreshAll completed, new count:",
            this.dailyRefreshRemaining
          );
        })
        .finally(() => {
          this.isRefreshing = false;
        });
    },

    formatMetricName(key) {
      // Convert snake_case to Title Case
      return key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },

    formatTweetDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    calculateLast10TweetsAverages() {
      if (!this.postMetrics || !this.postMetrics.posts) return;

      // Sort posts by date (newest first)
      const sortedPosts = [...this.postMetrics.posts].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      // Take the 20 most recent tweets (if available)
      const recentTweets = sortedPosts.slice(0, 20);

      // Split into last 10 and previous 10
      this.last10Tweets = recentTweets.slice(0, 10);
      this.previous10Tweets = recentTweets.slice(10, 20);

      // Calculate averages for last 10 tweets
      if (this.last10Tweets.length > 0) {
        this.last10TweetsAvg = {};
        this.last10Tweets.forEach((post) => {
          if (post.metrics) {
            Object.entries(post.metrics).forEach(([key, value]) => {
              this.last10TweetsAvg[key] =
                (this.last10TweetsAvg[key] || 0) + value;
            });
          }
        });

        // Calculate averages
        Object.entries(this.last10TweetsAvg).forEach(([key, total]) => {
          this.last10TweetsAvg[key] = Math.round(
            total / this.last10Tweets.length
          );
        });
      } else {
        this.last10TweetsAvg = {};
      }

      // Calculate averages for previous 10 tweets
      if (this.previous10Tweets.length > 0) {
        this.previous10TweetsAvg = {};
        this.previous10Tweets.forEach((post) => {
          if (post.metrics) {
            Object.entries(post.metrics).forEach(([key, value]) => {
              this.previous10TweetsAvg[key] =
                (this.previous10TweetsAvg[key] || 0) + value;
            });
          }
        });

        // Calculate averages
        Object.entries(this.previous10TweetsAvg).forEach(([key, total]) => {
          this.previous10TweetsAvg[key] = Math.round(
            total / this.previous10Tweets.length
          );
        });

        // Calculate percentage changes
        this.metricChanges = {};
        Object.keys(this.last10TweetsAvg).forEach((key) => {
          if (this.previous10TweetsAvg[key]) {
            const prevValue = this.previous10TweetsAvg[key];
            const currValue = this.last10TweetsAvg[key];

            if (prevValue > 0) {
              // Calculate percentage change
              const change = ((currValue - prevValue) / prevValue) * 100;
              this.metricChanges[key] = Math.round(change);
            } else {
              this.metricChanges[key] = currValue > 0 ? 100 : 0;
            }
          } else {
            this.metricChanges[key] = 100; // If no previous data, consider it 100% increase
          }
        });
      } else {
        this.previous10TweetsAvg = {};
        this.metricChanges = {};
      }
    },

    // Add method to reconnect Twitter
    reconnectTwitter() {
      // Sign out completely since Twitter is the only auth method
      twitterFunctions.signOut();
      // Navigate to the auth page
      this.$router.push("/auth");
    },

    formatCount(count) {
      if (!count) return "0";
      if (count < 1000) return count;
      if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
      return `${(count / 1000000).toFixed(1)}M`;
    },

    // Add a new method to load combined data
    async loadCombinedData(forceRefresh = false) {
      this.isLoading = true;
      this.postMetricsLoading = true;
      this.isRefreshing = forceRefresh;
      this.timelineError = false;
      this.postMetricsError = false;

      try {
        // Call the combined endpoint
        const response = await twitterFunctions.getCombinedData(forceRefresh);
        console.log("Combined data response:", response);

        if (response && response.data) {
          // Process timeline data
          if (response.data.timeline) {
            // Reset to ensure we start fresh
            this.timelineTweets = null;
            this.timelineTweets = response.data.timeline;
            console.log("Processed timeline data:", this.timelineTweets);
          }

          // Process metrics data
          if (response.data.metrics) {
            this.postMetrics = response.data.metrics;
            // Calculate last 10 tweets averages
            this.calculateLast10TweetsAverages();
          }

          // Store cache info
          if (response.data.cacheInfo) {
            this.timelineCacheInfo = response.data.cacheInfo;
            this.postMetricsCacheInfo = response.data.cacheInfo;
            this.timelineRefreshTime = response.data.cacheInfo.canRefreshAt;
            this.metricsRefreshTime = response.data.cacheInfo.canRefreshAt;
            console.log("Refresh time set to:", this.timelineRefreshTime);
          }

          // Store refresh limit info
          if (response.data.refreshInfo) {
            console.log("Updating refresh count:", response.data.refreshInfo);
            this.dailyRefreshRemaining = response.data.refreshInfo.remaining;
            this.dailyRefreshLimit = response.data.refreshInfo.limit;
            this.refreshLimitReached = this.dailyRefreshRemaining <= 0;

            if (response.data.refreshInfo.error) {
              this.alertStore.setWarningMessage(
                response.data.refreshInfo.error
              );
            }
          }
        } else {
          // Set empty data if no response
          this.timelineTweets = { data: [] };
          this.postMetrics = { posts: [], averages: {} };
        }
      } catch (error) {
        console.error("Error loading combined data:", error);
        this.timelineError = true;
        this.postMetricsError = true;
        this.alertStore.setErrorMessage("Failed to load Twitter data");

        // Check for 401 Unauthorized error and disconnect Twitter
        if (error.response && error.response.status === 401) {
          console.log(
            "Twitter authentication expired, disconnecting Twitter account only"
          );
          this.alertStore.setWarningMessage(
            "Twitter authentication expired. Please reconnect your account."
          );
          // Set flag for auth error
          this.twitterAuthError = true;
          // Instead of disconnecting completely, just clear Twitter data in the store
          this.twitterStore.clearAccountInfo();
          // Stay on the current page and show the error
          return;
        }

        // Check for rate limit info in error response
        if (
          error.response &&
          error.response.data &&
          error.response.data.canRefreshAt
        ) {
          this.timelineRefreshTime = error.response.data.canRefreshAt;
          this.metricsRefreshTime = error.response.data.canRefreshAt;
          console.log(
            "Rate limit: Refresh time set to:",
            this.timelineRefreshTime
          );
        }

        // Check for refresh limit info in error response
        if (
          error.response &&
          error.response.data &&
          error.response.data.refreshInfo
        ) {
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
      }

      this.isLoading = false;
      this.postMetricsLoading = false;
      this.isRefreshing = false;
    },

    logout() {
      clearCookies();
      this.userStore.$reset();
      this.$router.push("/auth");
    },

    // Configuration methods
    showConfiguration() {
      console.log(
        "Configure button clicked - navigating to configuration flow"
      );
      this.$router.push("/configuration");
    },

    isUserConfigured() {
      const hasConfiguredFlag = localStorage.getItem("dashboardConfigured");
      return hasConfiguredFlag === "true";
    },

    showFirstTimeConfiguration() {
      console.log("First time user - navigating to configuration flow");
      this.$router.push("/configuration");
    },
  },
  async mounted() {
    console.log("Component is mounted");

    // Check if user has configured before
    if (!this.isUserConfigured()) {
      console.log("First time user, showing configuration...");
      // Navigate to configuration flow after a short delay
      setTimeout(() => {
        this.showFirstTimeConfiguration();
      }, 1000);
    }

    try {
      // Load data sequentially to avoid access token errors

      // 1. First load Twitter profile data
      // console.log("Loading Twitter profile data");
      // await this.twitterStore.loadProfile();

      // 2. Then load both timeline and metrics data in a single call
      console.log("Loading combined timeline and metrics data");
      await this.loadCombinedData();
    } catch (error) {
      console.error("Error loading Twitter data:", error);
      this.alertStore.setErrorMessage("Failed to load Twitter data");
    }

    // Set up refresh timer checker that runs every 10 seconds
    this.refreshTimerInterval = setInterval(() => {
      this.checkRefreshAvailability();
    }, 10000);
  },

  beforeUnmount() {
    // Clear the interval when component is destroyed
    if (this.refreshTimerInterval) {
      clearInterval(this.refreshTimerInterval);
    }
  },
};
</script>

<style scoped>
/* Modern Green/Juice Theme Styles */

/* Modern Gradient Text */
.modern-gradient-text {
  background: linear-gradient(135deg, #55d43f 0%, #01a044 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(85, 212, 63, 0.5);
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

/* Dashboard Home Container */
.dashboard-home {
  min-height: 100vh;
  padding: 24px;
}

/* Hero Section */
.hero-section {
  margin-bottom: 24px;
}

/* Profile Hero Card */
.profile-hero-card {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(85, 212, 63, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 32px;
}

.profile-hero-card::before {
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
  z-index: 5;
}

.profile-background {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-banner {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #55d43f 0%, #01a044 100%);
  overflow: hidden;
}

.banner-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.6;
}

.banner-orb.orb-1 {
  width: 150px;
  height: 150px;
  background: #7de068;
  top: -50px;
  left: 20%;
}

.banner-orb.orb-2 {
  width: 100px;
  height: 100px;
  background: #55d43f;
  bottom: -30px;
  right: 30%;
}

.banner-orb.orb-3 {
  width: 120px;
  height: 120px;
  background: #01a044;
  top: 50%;
  left: 60%;
  transform: translateY(-50%);
}

.profile-overlay {
  position: absolute;
  inset: 0;
  /* Much darker gradient to make overlay text pop */
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.85) 100%
  );
  z-index: 1;
}

.profile-content {
  position: absolute;
  bottom: 24px;
  left: 32px;
  right: 32px;
  padding: 0;
  margin: 0;
  z-index: 2;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.profile-text {
  flex: 1;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.98) !important;
  margin-bottom: 4px;
}

.profile-username {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9) !important;
  margin-bottom: 2px;
}

.disconnect-link {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin: 0;
  margin-top: 2px;
  transition: color 0.3s ease;
}

.disconnect-link:hover {
  color: rgba(239, 68, 68, 0.9) !important;
}

.profile-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
  /* Remove background around Followers / Following / Posts stats */
  background: transparent !important;
  border: none !important;
  backdrop-filter: none !important;
  box-shadow: none !important;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.98) !important;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9) !important;
  margin-top: 2px;
}

/* Position action buttons absolutely at bottom-right aligned with signout */
.profile-actions {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
  z-index: 3;
}

.action-btn,
.signout-btn {
  height: 40px;
  line-height: 24px;
  padding: 0 20px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  opacity: 1;
  transform: translateY(0);
  backdrop-filter: blur(12px);
}

.action-btn.disconnect {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.5);
  color: #ffffff;
}

.action-btn.disconnect:hover {
  background: rgba(59, 130, 246, 0.35);
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transform: translateY(-2px) scale(1.02);
}

.action-btn.disconnect:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.action-btn.refresh {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.action-btn.refresh:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px) scale(1.02);
}

.action-btn.refresh:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Analytics Section */
.analytics-section {
  margin: 24px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.98) !important;
}

.analytics-badge,
.timeline-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(85, 212, 63, 0.1);
  border: 1px solid rgba(85, 212, 63, 0.3);
  border-radius: 12px;
  color: #01a044;
  font-size: 12px;
  font-weight: 600;
}

.badge-icon {
  width: 16px;
  height: 16px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.analytics-card {
  background: rgba(255, 255, 255, 0.06) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.analytics-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border-color: rgba(85, 212, 63, 0.4);
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.analytics-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95) !important;
}

.change-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.change-indicator.positive {
  background: rgba(85, 212, 63, 0.1);
  border: 1px solid rgba(85, 212, 63, 0.3);
  color: #01a044;
}

.change-indicator.negative {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.change-icon {
  width: 16px;
  height: 16px;
}

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.current-metric,
.previous-metric {
  text-align: center;
  padding: 16px 12px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.98) !important;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9) !important;
}

.progress-container {
  height: 8px;
  background: rgba(85, 212, 63, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Timeline Section */
.timeline-section {
  margin-top: 24px;
}

/* Loading, Error, and Empty States */
.timeline-loading,
.timeline-error,
.timeline-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: #01a044;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(85, 212, 63, 0.2);
  border-top: 4px solid #55d43f;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9) !important;
}

.error-icon,
.empty-icon {
  width: 48px;
  height: 48px;
  color: #55d43f;
  margin-bottom: 16px;
}

.error-title,
.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95) !important;
  margin-bottom: 8px;
}

.empty-description {
  color: rgba(255, 255, 255, 0.7) !important;
}

.retry-btn,
.reconnect-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #55d43f, #01a044);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover,
.reconnect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(85, 212, 63, 0.3);
}

.auth-error {
  margin-top: 16px;
}

.auth-error-text {
  color: #ef4444 !important;
  font-weight: 500;
  margin-bottom: 12px;
}

/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(85, 212, 63, 0.1) 25%,
    rgba(85, 212, 63, 0.2) 50%,
    rgba(85, 212, 63, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Animate Spin */
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-home {
    padding: 16px;
  }

  .profile-content {
    padding: 0 24px 24px;
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-home {
    padding: 12px;
  }

  .profile-hero-card {
    border-radius: 16px;
  }

  .profile-content {
    padding: 0 16px 16px;
  }

  .profile-name {
    font-size: 20px;
  }

  .profile-stats {
    gap: 16px;
  }

  .stat-value {
    font-size: 18px;
  }

  .profile-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .action-buttons {
    justify-content: stretch;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .section-header h2 {
    font-size: 24px;
  }
}

.signout-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  height: 40px;
  line-height: 24px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(239, 68, 68, 0.25);
  border: 1px solid rgba(239, 68, 68, 0.5);
  color: #ffffff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    box-shadow 0.25s ease,
    background-color 0.25s ease;
  z-index: 3;
  opacity: 1;
}

.signout-btn:hover {
  background: rgba(239, 68, 68, 0.35);
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.action-btn.refresh:active,
.signout-btn:active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.analytics-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  margin-bottom: 32px;
}

/* Configure button (blue) */
.action-btn.configure {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.5);
  color: #ffffff;
}

.action-btn.configure:hover {
  background: rgba(59, 130, 246, 0.35);
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transform: translateY(-2px) scale(1.02);
}

.action-btn.configure:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

/* Enable 24/7 Mode button (green) */
.action-btn.enable-mode {
  background: rgba(85, 212, 63, 0.25);
  border-color: rgba(85, 212, 63, 0.5);
  color: #ffffff;
}

.action-btn.enable-mode:hover {
  background: rgba(85, 212, 63, 0.35);
  border-color: rgba(85, 212, 63, 0.6);
}

/* Tooltip for 24/7 button */
.tooltip-24 {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.2;
  pointer-events: none;
  opacity: 0;
  animation: fadeIn 0.2s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Configuration Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.configuration-modal {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.98) !important;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.95);
}

.welcome-text {
  padding: 0 24px 16px;
  text-align: center;
}

.welcome-text p {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
}

.config-section {
  margin-bottom: 32px;
}

.config-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95) !important;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.config-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(85, 212, 63, 0.3);
}

.config-item label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9) !important;
  flex: 1;
}

.config-item select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  min-width: 140px;
}

.config-item select:focus {
  outline: none;
  border-color: rgba(85, 212, 63, 0.5);
  box-shadow: 0 0 0 2px rgba(85, 212, 63, 0.2);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  transition: all 0.3s ease;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  top: 3px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-switch input:checked + .toggle-label {
  background: linear-gradient(135deg, #55d43f, #01a044);
}

.toggle-switch input:checked + .toggle-label:before {
  transform: translateX(26px);
  background: white;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.btn-secondary {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.95);
}

.btn-primary {
  padding: 10px 20px;
  background: linear-gradient(135deg, #55d43f, #01a044);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(85, 212, 63, 0.3);
}
</style>
