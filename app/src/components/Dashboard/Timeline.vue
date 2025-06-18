<template>
  <div class="timeline-container h-full w-full">
    <!-- Removed internal header to avoid duplicate timeline titles -->

    <!-- Twitter auth error message -->
    <div
      v-if="authError"
      class="auth-error-container mb-4 p-4 rounded-lg border border-red-400 bg-red-900 bg-opacity-20"
    >
      <div class="flex items-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-red-400 mr-3 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h3 class="text-lg font-medium text-red-300">
            Twitter Authentication Error
          </h3>
          <p class="text-juice-green-dark mt-1">
            Your Twitter connection has expired or been revoked. Please
            disconnect and reconnect your Twitter account to continue viewing
            your timeline.
          </p>
          <button
            @click="reconnectTwitter"
            class="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
          >
            Reconnect Twitter
          </button>
        </div>
      </div>
    </div>

    <div v-show="isLoading && !authError" class="w-full h-full">
      <!-- Header skeleton -->
      <div class="flex items-center justify-between mb-4 animate-pulse">
        <div class="h-7 w-48 bg-gray-800 rounded-md"></div>
        <div class="h-7 w-32 bg-gray-800 rounded-md"></div>
      </div>

      <div class="timeline-content">
        <!-- First column of skeleton tweets -->
        <div class="tweet-column">
          <div v-for="i in 3" :key="i" class="tweet-card mb-6 animate-pulse">
            <!-- Tweet header skeleton -->
            <div class="p-3 flex items-center">
              <div class="w-10 h-10 rounded-full bg-gray-700 mr-3"></div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div class="h-5 w-32 bg-gray-700 rounded-md"></div>
                  <div class="h-4 w-24 bg-gray-700 rounded-md"></div>
                </div>
                <div class="h-4 w-24 bg-gray-700 rounded-md mt-1"></div>
              </div>
            </div>

            <!-- Tweet content skeleton -->
            <div class="p-3 pt-0">
              <div class="h-4 w-full bg-gray-700 rounded-md"></div>
              <div class="h-4 w-5/6 bg-gray-700 rounded-md mt-1"></div>
              <div class="h-4 w-4/6 bg-gray-700 rounded-md mt-1"></div>

              <!-- Tweet metrics skeleton -->
              <div class="flex space-x-4 mt-3">
                <div class="h-4 w-16 bg-gray-700 rounded-md"></div>
                <div class="h-4 w-16 bg-gray-700 rounded-md"></div>
                <div class="h-4 w-16 bg-gray-700 rounded-md"></div>
              </div>
            </div>

            <!-- Tweet response skeleton -->
            <div
              class="p-3 bg-gray-800 bg-opacity-40 border-t border-gray-700 rounded-b-lg"
            >
              <div class="flex items-start">
                <div class="w-4/5">
                  <div class="h-4 w-40 bg-gray-700 rounded-md mb-2"></div>
                  <div class="h-4 w-full bg-gray-700 rounded-md"></div>
                  <div class="h-4 w-5/6 bg-gray-700 rounded-md mt-1"></div>
                </div>
                <div class="w-1/5 flex flex-col items-end">
                  <div class="w-8 h-8 rounded-full bg-gray-700"></div>
                  <div class="w-20 h-8 bg-gray-700 rounded-md mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Second column of skeleton tweets -->
        <div class="tweet-column">
          <div v-for="i in 2" :key="i" class="tweet-card mb-6 animate-pulse">
            <!-- Tweet header skeleton -->
            <div class="p-3 flex items-center">
              <div class="w-10 h-10 rounded-full bg-gray-700 mr-3"></div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div class="h-5 w-32 bg-gray-700 rounded-md"></div>
                  <div class="h-4 w-24 bg-gray-700 rounded-md"></div>
                </div>
                <div class="h-4 w-24 bg-gray-700 rounded-md mt-1"></div>
              </div>
            </div>

            <!-- Tweet content skeleton -->
            <div class="p-3 pt-0">
              <div class="h-4 w-full bg-gray-700 rounded-md"></div>
              <div class="h-4 w-5/6 bg-gray-700 rounded-md mt-1"></div>
              <div class="h-4 w-4/6 bg-gray-700 rounded-md mt-1"></div>

              <!-- Tweet metrics skeleton -->
              <div class="flex space-x-4 mt-3">
                <div class="h-4 w-16 bg-gray-700 rounded-md"></div>
                <div class="h-4 w-16 bg-gray-700 rounded-md"></div>
                <div class="h-4 w-16 bg-gray-700 rounded-md"></div>
              </div>
            </div>

            <!-- Tweet response skeleton -->
            <div
              class="p-3 bg-gray-800 bg-opacity-40 border-t border-gray-700 rounded-b-lg"
            >
              <div class="flex items-start">
                <div class="w-4/5">
                  <div class="h-4 w-40 bg-gray-700 rounded-md mb-2"></div>
                  <div class="h-4 w-full bg-gray-700 rounded-md"></div>
                  <div class="h-4 w-5/6 bg-gray-700 rounded-md mt-1"></div>
                </div>
                <div class="w-1/5 flex flex-col items-end">
                  <div class="w-8 h-8 rounded-full bg-gray-700"></div>
                  <div class="w-20 h-8 bg-gray-700 rounded-md mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="!isLoading && columns.length > 0" class="timeline-content">
      <div class="tweet-column" v-for="(column, index) in columns" :key="index">
        <div v-for="tweet in column" :key="tweet.id" class="tweet-card mb-6">
          <a
            :href="getTweetUrl(tweet)"
            target="_blank"
            rel="noopener noreferrer"
            class="tweet-link"
          >
            <div class="tweet-header p-3 flex items-center">
              <img
                :src="tweet.author_profile_image || '/default-avatar.png'"
                class="w-10 h-10 rounded-full mr-3 object-cover border border-gray-700"
                alt="Profile"
              />
              <div class="flex-1">
                <div class="flex items-center">
                  <div class="font-medium text-white">
                    {{ tweet.author_name || "Twitter User" }}
                  </div>
                  <div v-if="tweet.author_verified" class="verified-badge ml-1">
                    <svg
                      class="w-4 h-4 text-[#55d43f]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
                      />
                    </svg>
                  </div>
                  <div class="text-gray-400 text-sm ml-auto">
                    {{ formatTweetDate(tweet.created_at) }}
                  </div>
                </div>
                <div class="text-gray-400 text-sm">
                  @{{ tweet.author_username || tweet.author_id }}
                </div>
                <div class="flex text-xs text-gray-500 mt-1">
                  <!-- Followers count - Person icon -->
                  <div class="flex items-center">
                    <svg
                      class="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.806-4.392-.38-2.825-2.117-4.512-4.646-4.512S7.734 3.343 7.354 6.17c-.272 2.022-.008 3.46.806 4.39.968 1.107 2.485 1.256 3.84 1.256zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.743-2.71.743s-2.255-.223-2.71-.743c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.242.017.48-.12.654z"
                      ></path>
                    </svg>
                    <span>{{
                      formatCount(tweet.author_metrics?.followers_count) || "-"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="tweet-content p-3 pt-0">
              <p class="text-gray-100">
                {{ cleanTweetText(tweet.text, tweet.entities) }}
              </p>
              <div
                v-if="tweet.media && tweet.media.length > 0"
                class="tweet-media mt-2"
              >
                <template v-if="tweet.media.length === 1">
                  <img
                    :src="tweet.media[0].url"
                    class="rounded-lg w-full max-h-96 object-cover"
                    alt="Tweet media"
                    @error="handleImageError"
                  />
                </template>
                <div
                  v-else
                  class="grid gap-2"
                  :class="{
                    'grid-cols-2': tweet.media.length >= 2,
                    'grid-rows-2': tweet.media.length >= 3,
                  }"
                >
                  <img
                    v-for="(media, index) in tweet.media"
                    :key="index"
                    :src="media.url"
                    class="rounded-lg w-full h-48 object-cover"
                    alt="Tweet media"
                    @error="handleImageError"
                  />
                </div>
              </div>
              <div
                v-if="tweet.public_metrics"
                class="flex justify-start space-x-4 mt-3 text-gray-400 text-sm"
              >
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"
                    />
                  </svg>
                  {{ tweet.public_metrics.reply_count }}
                </div>
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"
                    />
                  </svg>
                  {{ tweet.public_metrics.retweet_count }}
                </div>
                <div class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"
                    />
                  </svg>
                  {{ tweet.public_metrics.like_count }}
                </div>
              </div>
            </div>
          </a>
          <div
            class="p-3 bg-gray-800 bg-opacity-40 border-t border-gray-700 rounded-b-lg backdrop-filter backdrop-blur-sm"
          >
            <div class="flex items-start">
              <div class="w-4/5 ai-response-container">
                <p class="ai-response-title mb-1">AI Response</p>
                <p class="ai-response-text">
                  {{ getRecommendedResponse(tweet) }}
                </p>
              </div>
              <div class="flex w-1/5 flex-col items-end">
                <button
                  @click="refreshTweet(tweet)"
                  class="p-2 hover:rotate-90 active:scale-90 transition-all duration-200 bg-gray-800 bg-opacity-60 hover:bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center"
                  :disabled="aiLoading[tweet.id]"
                  title="Generate new response"
                >
                  <svg
                    v-if="!aiLoading[tweet.id]"
                    class="w-5 h-5 text-[#55d43f]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.023 9.348h4.992M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 5.174v4.99"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5 animate-spin text-[#55d43f]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </button>

                <!-- Success notification shown temporarily after reply -->
                <div
                  v-if="successNotifications[tweet.id]"
                  class="success-notification animate-bounce-fade"
                >
                  <svg
                    class="w-5 h-5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span>Posted!</span>
                </div>

                <!-- Show Reply button if not replied, otherwise show Replied with link -->
                <template v-if="!hasReplied(tweet)">
                  <button
                    @click="directReply(tweet)"
                    class="reply-button mt-4 hover:scale-105 active:scale-95 transition-transform duration-150"
                    :disabled="repliedTweets[tweet.id]?.status === 'loading'"
                  >
                    <svg
                      v-if="repliedTweets[tweet.id]?.status === 'loading'"
                      class="w-4 h-4 mr-2 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
                    <span v-if="repliedTweets[tweet.id]?.status === 'loading'"
                      >Posting…</span
                    >
                    <span v-else>Reply</span>
                  </button>
                </template>
                <template v-else>
                  <a
                    :href="getReplyUrl(tweet)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="replied-link mt-4 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Replied
                  </a>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!isLoading && columns.length === 0"
      class="w-full h-auto py-8 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="text-xl mb-2">No tweets to display</div>
        <p class="text-gray-400">
          Your timeline is empty or we couldn't fetch your tweets
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as twitterFunctions from "../../functions/twitterFunctions";
import axios from "../../utils/axios.instance";
import { useTwitterStore } from "../../stores/twitter";
import { useAlertStore } from "../../stores/alert";
import { mapStores } from "pinia";

export default {
  name: "Timeline",
  props: {
    tweets: {
      type: Array,
      required: true,
    },
    timelineCacheInfo: {
      type: Object,
      default: null,
    },
  },
  computed: {
    ...mapStores(useTwitterStore, useAlertStore),
  },
  data() {
    return {
      columns: [],
      isLoading: true,
      aiResponses: {},
      aiLoading: {},
      authError: false,
      repliedTweets: {},
      successNotifications: {},
    };
  },
  mounted() {
    this.initializeTimeline();
  },
  watch: {
    tweets: {
      handler: "initializeTimeline",
      deep: true,
    },
  },
  methods: {
    formatRelativeTime(dateString) {
      if (!dateString) return "just now";

      const now = new Date();
      const date = new Date(dateString);
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) {
        return "just now";
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
      } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? "day" : "days"} ago`;
      }
    },
    formatTweetDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);

      // Check if it's today
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      if (isToday) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // Format date as "May 12, 2:30 PM"
      return (
        date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }) +
        ", " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    },
    initializeTimeline() {
      this.isLoading = true;
      this.authError = false;
      console.log("Initializing timeline with data:", this.tweets);

      // Check if we have an authentication error
      if (
        this.tweets &&
        this.tweets.error &&
        (this.tweets.error.statusCode === 401 || this.tweets.requiresReconnect)
      ) {
        console.error("Twitter authentication error:", this.tweets.error);
        this.authError = true;
        this.isLoading = false;

        // Just reset the Twitter store, don't disconnect Twitter from the backend
        if (this.tweets.error.statusCode === 401) {
          console.log(
            "Twitter authentication expired, resetting Twitter store"
          );
          this.twitterStore.$reset();
        }

        return;
      }

      // Check if we have valid tweet data
      if (!this.tweets) {
        this.columns = [];
        this.isLoading = false;
        return;
      }

      // Process tweets to add author info and media
      const processedTweets = this.processTweets(this.tweets);

      // Only proceed if we have tweets to display
      if (processedTweets && processedTweets.length > 0) {
        this.divideTweetsIntoColumns(processedTweets);
        this.generateAIResponses(processedTweets);
      } else {
        this.columns = [];
      }

      this.isLoading = false;
    },

    processTweets(tweets) {
      // Handle the case where tweets might be the complete Twitter API response object
      let tweetData = [];
      let usersData = [];
      let mediaData = [];

      console.log("Processing tweets input:", tweets);

      // Handle nested data structure from Twitter API
      if (
        tweets &&
        tweets.data &&
        tweets.data.data &&
        Array.isArray(tweets.data.data)
      ) {
        // Handle the nested structure: tweets.data.data
        tweetData = tweets.data.data;

        // Extract user and media data from nested includes
        if (tweets.data.includes) {
          usersData = tweets.data.includes.users || [];
          mediaData = tweets.data.includes.media || [];
          console.log("Found user data:", usersData.length, "users");
          console.log("Found media data:", mediaData.length, "items");
        }
      }
      // Check if tweets is directly the full Twitter API response structure
      else if (tweets && tweets.data && Array.isArray(tweets.data)) {
        tweetData = tweets.data;

        // Extract user and media data from includes
        if (tweets.includes) {
          usersData = tweets.includes.users || [];
          mediaData = tweets.includes.media || [];
          console.log("Found user data:", usersData.length, "users");
          console.log("Found media data:", mediaData.length, "items");
        }
      } else if (Array.isArray(tweets)) {
        // If tweets is already an array, use it directly
        tweetData = tweets;
      } else {
        console.error("Unable to process tweet data:", tweets);
        return []; // Return empty array to prevent errors
      }

      // Process each tweet to add author and media information
      return tweetData.map((tweet) => {
        // Check if the tweet already has the needed information embedded directly (from backend processing)
        if (
          tweet.author_name &&
          tweet.author_username &&
          tweet.author_profile_image
        ) {
          // Tweet already has author info embedded from backend
          return {
            ...tweet,
            media: tweet.media || [],
          };
        }

        // Otherwise, find the author information in the users data
        const author =
          usersData.find((user) => user.id === tweet.author_id) || {};

        // Process media attachments if not already done by backend
        let tweetMedia = [];
        if (tweet.media) {
          // Media already processed by backend
          tweetMedia = tweet.media;
        } else if (tweet.attachments && tweet.attachments.media_keys) {
          // Need to process media from attachments
          tweet.attachments.media_keys.forEach((mediaKey) => {
            const media = mediaData.find((m) => m.media_key === mediaKey);
            if (media) {
              tweetMedia.push({
                url: media.url || media.preview_image_url,
                type: media.type,
              });
            }
          });
        }

        // Return the enhanced tweet with author and media information
        return {
          ...tweet,
          author_name: author.name || tweet.author_name || "Twitter User",
          author_username:
            author.username || tweet.author_username || tweet.author_id,
          author_profile_image:
            author.profile_image_url ||
            tweet.author_profile_image ||
            "/default-avatar.png",
          author_verified: author.verified || tweet.author_verified || false,
          author_metrics: {
            followers_count:
              author.public_metrics?.followers_count ||
              tweet.author_metrics?.followers_count,
            following_count:
              author.public_metrics?.following_count ||
              author.public_metrics?.friends_count ||
              tweet.author_metrics?.following_count,
            statuses_count:
              author.public_metrics?.tweet_count ||
              author.public_metrics?.statuses_count ||
              tweet.author_metrics?.statuses_count,
          },
          media: tweetMedia,
        };
      });
    },

    divideTweetsIntoColumns(tweets) {
      const columnCount = 3;
      this.columns = Array.from({ length: columnCount }, () => []);

      tweets.forEach((tweet, index) => {
        const columnIndex = index % columnCount;
        this.columns[columnIndex].push(tweet);
      });
    },

    generateAIResponses(tweets) {
      // We'll just initialize the aiResponses object,
      // as the real responses now come from the backend
      tweets.forEach((tweet) => {
        if (!tweet.ai_response) {
          // Only set a default if no AI response exists
          this.aiResponses[tweet.id] = "Loading AI response...";
        } else {
          // Store the existing AI response
          this.aiResponses[tweet.id] = tweet.ai_response;
        }
      });
    },

    getRecommendedResponse(tweet) {
      return (
        tweet.ai_response ||
        this.aiResponses[tweet.id] ||
        "I completely agree with your point. Let's discuss this more!"
      );
    },

    async refreshTweet(tweet) {
      // Make an API call to refresh the AI response for this tweet
      const tweetId = tweet.id;
      const tweetText = tweet.text;
      const imageUrl =
        tweet.media && tweet.media.length > 0 ? tweet.media[0].url : null;

      // Indicate loading on button and placeholder text
      this.aiLoading[tweet.id] = true;
      this.aiResponses[tweet.id] = "Generating new response...";

      // Call the backend to generate a new response
      axios
        .post(
          "/twitter/generate-response",
          {
            tweetId,
            tweetText,
            imageUrl,
          },
          {
            timeout: 30000,
            withCredentials: true,
            credentials: "include",
          }
        )
        .then((response) => {
          if (response.data.response) {
            // Update the tweet's AI response in the UI
            this.aiResponses[tweet.id] = response.data.response;
            this.aiLoading[tweet.id] = false;

            // Find the tweet in columns and update it
            for (let i = 0; i < this.columns.length; i++) {
              const tweetIndex = this.columns[i].findIndex(
                (t) => t.id === tweet.id
              );
              if (tweetIndex !== -1) {
                this.columns[i][tweetIndex].ai_response =
                  response.data.response;
                break;
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error refreshing AI response:", error);
          // Fallback to a random response on error
          const responseTemplates = [
            "I love your perspective! Let's connect and discuss this further.",
            "Great point! I've been thinking about this topic a lot recently.",
            "This is fascinating. Have you considered the implications for our industry?",
            "I appreciate you sharing this. It's given me some new ideas to explore.",
            "Interesting take! I'd love to hear more about your thoughts on this.",
          ];
          const randomIndex = Math.floor(
            Math.random() * responseTemplates.length
          );
          this.aiResponses[tweet.id] = responseTemplates[randomIndex];
          this.aiLoading[tweet.id] = false;
        });
    },

    async directReply(tweet) {
      if (!tweet) return;

      const tweetId = tweet.id;
      // Get the AI-generated response
      const replyText = this.getRecommendedResponse(tweet);

      if (!replyText.trim()) {
        this.alertStore.setErrorMessage(
          "Cannot post empty reply. Please generate a new response first."
        );
        return;
      }

      try {
        // Show loading state
        this.repliedTweets[tweetId] = {
          status: "loading",
          message: "Posting reply...",
        };

        // Call the API to post the reply
        const response = await twitterFunctions.postReply(tweetId, replyText);

        // Update state to show this tweet has been replied to
        this.repliedTweets[tweetId] = {
          status: "success",
          message: "Reply posted successfully!",
          replyId: response.tweet.id,
        };

        // Show temporary success notification on the tweet card
        this.successNotifications[tweetId] = true;
        setTimeout(() => {
          this.successNotifications[tweetId] = false;
        }, 3000);

        // Show prominent success message with more info
        this.alertStore.setSuccessMessage(
          `Successfully replied to ${tweet.author_name}'s tweet! Your reply has been posted.`
        );
      } catch (error) {
        console.error("Error replying to tweet:", error);

        // Update state to show the reply failed
        this.repliedTweets[tweetId] = {
          status: "error",
          message: "Failed to post reply",
        };

        // Show detailed error message
        const errorMsg =
          error.response?.data?.error || "An unexpected error occurred";
        this.alertStore.setErrorMessage(
          `Failed to post reply: ${errorMsg}. Please try again.`
        );
      }
    },

    hasReplied(tweet) {
      return (
        this.repliedTweets[tweet.id] &&
        this.repliedTweets[tweet.id].status === "success"
      );
    },

    getReplyUrl(tweet) {
      if (this.hasReplied(tweet) && this.repliedTweets[tweet.id].replyId) {
        const replyId = this.repliedTweets[tweet.id].replyId;
        return `https://twitter.com/${this.twitterStore.username}/status/${replyId}`;
      }
      return null;
    },

    handleImageError(event) {
      // Handle image loading error by setting a fallback image
      event.target.src = "/default-media.png";
      event.target.classList.add("image-error");
    },

    getTweetUrl(tweet) {
      return `https://twitter.com/${tweet.author_username || tweet.author_id}/status/${tweet.id}`;
    },

    reconnectTwitter() {
      // Sign out completely since Twitter is the only auth method
      this.twitterStore.$reset();

      // Emit an event that parent components can listen for
      this.$emit("reconnect-twitter");

      // Show a message to the user
      this.alertStore.setInfoMessage("Please sign in again");

      // Redirect to auth page
      this.$router.push("/auth");
    },

    // Format large numbers with K, M for thousands and millions
    formatCount(count) {
      if (!count) return "-";
      if (count < 1000) return count;
      if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
      return `${(count / 1000000).toFixed(1)}M`;
    },

    // Remove t.co links from tweet text, especially for media attachments
    cleanTweetText(text, entities) {
      if (!text) return "";

      // If there are no entities, just return the text
      if (!entities || !entities.urls) return text;

      let cleanedText = text;

      // Remove each URL from the text
      entities.urls.forEach((urlEntity) => {
        // Remove the t.co link, especially if it appears at the end of the tweet
        cleanedText = cleanedText.replace(urlEntity.url, "");
      });

      // Clean up any extra whitespace that might be left
      return cleanedText.trim();
    },
  },
};
</script>

<style scoped>
/* Modern Green/Juice Theme Styles */

/* Timeline Container */
.timeline-container {
  width: 100%;
  height: 100%;
}

.timeline-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(85, 212, 63, 0.3) transparent;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.timeline-content::-webkit-scrollbar {
  width: 6px;
}

.timeline-content::-webkit-scrollbar-track {
  background: transparent !important;
}

.timeline-content::-webkit-scrollbar-thumb {
  background: rgba(85, 212, 63, 0.3);
  border-radius: 10px;
}

.timeline-content::-webkit-scrollbar-thumb:hover {
  background: rgba(85, 212, 63, 0.5);
}

/* Tweet Columns */
.tweet-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Tweet Cards */
.tweet-card {
  background: rgba(255, 255, 255, 0.06) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.08),
    0 2px 5px rgba(85, 212, 63, 0.1);
  position: relative;
}

.tweet-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(85, 212, 63, 0.4),
    transparent
  );
  z-index: 1;
}

.tweet-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.12),
    0 4px 8px rgba(85, 212, 63, 0.2);
  border-color: rgba(85, 212, 63, 0.4);
}

.tweet-card:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #55d43f, #01a044);
  opacity: 0.8;
  z-index: 2;
}

/* Tweet Link */
.tweet-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

/* Tweet Header */
.tweet-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04) !important;
}

/* Tweet Content */
.tweet-content {
  padding: 16px 20px;
  line-height: 1.6;
}

.tweet-content p {
  margin-bottom: 12px;
  font-size: 15px;
  line-height: 1.6;
  word-break: break-word;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  color: rgba(255, 255, 255, 0.95) !important;
}

/* Tweet Media */
.tweet-media img {
  width: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(85, 212, 63, 0.1);
  border-radius: 12px;
  margin-top: 12px;
}

.tweet-media img:hover {
  transform: scale(1.02);
  border-color: rgba(85, 212, 63, 0.3);
  box-shadow: 0 4px 12px rgba(85, 212, 63, 0.15);
}

/* Verified Badge */
.verified-badge {
  color: #55d43f;
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

/* Tweet Metrics */
.tweet-content .flex.justify-start {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(85, 212, 63, 0.1);
}

.tweet-content .flex.justify-start > div {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.95) !important;
  transition: all 0.3s ease;
}

.tweet-content .flex.justify-start > div:hover {
  background: rgba(85, 212, 63, 0.15) !important;
  border-color: rgba(85, 212, 63, 0.3) !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

/* AI Response Section */
.tweet-card .p-3.bg-gray-800 {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.06) 100%
  ) !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s ease;
  padding: 20px;
}

.tweet-card:hover .p-3.bg-gray-800 {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.08) 100%
  ) !important;
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(90deg, #55d43f, #01a044);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Action Buttons */
.button {
  background: linear-gradient(135deg, #55d43f, #01a044);
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  letter-spacing: 0.3px;
  cursor: pointer;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1);
  filter: brightness(1.05);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  filter: grayscale(0.5);
}

/* Replied Link */
.replied-link {
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 10px;
  background: rgba(85, 212, 63, 0.15);
  border: 1px solid rgba(85, 212, 63, 0.3);
  transition: all 0.2s ease;
  color: #01a044;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.replied-link:hover {
  background: rgba(85, 212, 63, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(85, 212, 63, 0.15);
}

/* Refresh Button */
.tweet-card .p-2 {
  transition: all 0.2s ease;
  transform: scale(1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
}

.tweet-card .p-2:hover {
  background: rgba(85, 212, 63, 0.15) !important;
  transform: scale(1.1);
  border-color: rgba(85, 212, 63, 0.4) !important;
}

.tweet-card .p-2:active {
  transform: scale(0.95);
}

/* Loading Animation */
.loadingAnimation {
  border: 3px solid rgba(85, 212, 63, 0.3);
  border-radius: 50%;
  border-top: 3px solid #55d43f;
  width: 30px;
  height: 30px;
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

/* Image Error State */
.image-error {
  opacity: 0.6;
  border: 1px dashed rgba(255, 255, 255, 0.3) !important;
  background: rgba(255, 255, 255, 0.04) !important;
}

/* Skeleton Animations */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  position: relative;
  overflow: hidden;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
}

/* Shimmer Effect for Skeletons */
.tweet-card.animate-pulse::before {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  width: 150%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(85, 212, 63, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2.5s infinite;
  transform: skewX(-20deg);
  z-index: 1;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    left: -150%;
  }
  100% {
    left: 150%;
  }
}

/* Enhanced Skeleton Styling */
.tweet-card.animate-pulse .h-4,
.tweet-card.animate-pulse .h-5,
.tweet-card.animate-pulse .h-7,
.tweet-card.animate-pulse .w-10,
.tweet-card.animate-pulse .rounded-full {
  background: linear-gradient(
    90deg,
    rgba(85, 212, 63, 0.1) 0%,
    rgba(85, 212, 63, 0.2) 50%,
    rgba(85, 212, 63, 0.1) 100%
  ) !important;
  backdrop-filter: blur(5px);
  border-radius: 6px;
}

.tweet-card.animate-pulse .rounded-full {
  border-radius: 50% !important;
}

/* Success Notification */
.success-notification {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 16px;
  background: rgba(85, 212, 63, 0.9);
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  backdrop-filter: blur(10px);
}

.animate-bounce-fade {
  animation: bounce-fade 3s ease-out forwards;
}

@keyframes bounce-fade {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0;
  }
  10% {
    transform: translateY(-10px);
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
}

/* Auth Error Container */
.auth-error-container {
  animation: fadeIn 0.3s ease-out;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Timeline Header */
.timeline-container .flex.items-center.justify-between {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(85, 212, 63, 0.1);
}

.timeline-container .gradient-text {
  font-size: 24px;
  font-weight: 700;
}

.timeline-container .ai-chip {
  background: rgba(85, 212, 63, 0.1);
  border: 1px solid rgba(85, 212, 63, 0.3);
  border-radius: 12px;
  color: #01a044;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

/* Empty State */
.timeline-container .w-full.h-auto.py-8 {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  backdrop-filter: blur(10px) !important;
}

/* Profile Styling */
.text-white {
  color: rgba(255, 255, 255, 0.98) !important;
}

.text-gray-100 {
  color: rgba(255, 255, 255, 0.98) !important;
}

.text-gray-300 {
  color: rgba(255, 255, 255, 0.9) !important;
}

.text-gray-400 {
  color: rgba(255, 255, 255, 0.85) !important;
}

.text-gray-500 {
  color: rgba(255, 255, 255, 0.8) !important;
}

.text-blue-400 {
  color: rgba(85, 212, 63, 0.95) !important;
}

.bg-gray-700 {
  background-color: rgba(85, 212, 63, 0.1) !important;
}

.bg-gray-800 {
  background-color: rgba(254, 249, 232, 0.4) !important;
}

.border-gray-700 {
  border-color: rgba(85, 212, 63, 0.2) !important;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .timeline-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .tweet-card {
    border-radius: 12px;
  }

  .tweet-header,
  .tweet-content {
    padding: 12px 16px;
  }
}

@media (max-width: 768px) {
  .timeline-content {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .tweet-card {
    margin-bottom: 16px;
  }

  .tweet-header,
  .tweet-content,
  .tweet-card .p-3.bg-gray-800 {
    padding: 12px 16px;
  }

  .button {
    padding: 10px 16px;
    font-size: 13px;
  }
}

/* AI Response Styling */
.ai-response-container {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px;
  padding: 12px 14px;
  transition: background 0.25s ease;
}

.tweet-card:hover .ai-response-container {
  background: rgba(85, 212, 63, 0.08) !important;
  border-color: rgba(85, 212, 63, 0.25) !important;
}

.ai-response-title {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9) !important;
  display: flex;
  align-items: center;
}

.ai-response-text {
  font-size: 14px;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.95) !important;
  line-height: 1.5;
}

.reply-button {
  background: linear-gradient(
    135deg,
    rgba(85, 212, 63, 0.85),
    rgba(1, 160, 68, 0.85)
  ) !important;
  border: none;
  padding: 10px 18px;
  color: #ffffff;
  font-weight: 600;
  border-radius: 10px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
}

.reply-button:hover {
  filter: brightness(1.07);
}

.reply-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
