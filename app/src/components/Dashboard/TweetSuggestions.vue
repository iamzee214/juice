<template>
  <div class="tweet-suggestions h-full">
    <div v-if="loading" class="w-full flex justify-center h-full items-center">
      <div class="loading-animation"></div>
    </div>
    <div v-else class="flex flex-col">
      <textarea
        class="w-full h-full resize-none focus:outline-none bg-transparent recomendationContainer"
        placeholder="What kind of thing do you want to tweet about?"
        v-model="newMessage"
        @keydown.enter.prevent="sendMessage"
      ></textarea>
      <button class="button mt-2 mb-4">Generate Tweets</button>
      <div
        v-for="(tweet, index) in displayedTweets"
        :key="index"
        class="recomendationContainer flex items-center justify-center mt-2"
      >
        <div class="w-4/5">
          <p class="text-sm text-gray-300 font-medium">AI Generated Tweet:</p>
          <p class="text-Juice-white">"{{ tweet }}"</p>
        </div>
        <div class="flex w-1/5 flex-col items-end">
          <OutlineArrowPathIcon @click="refreshTweet(tweet)" class="w-6 h-6" />
          <button @click="postTweet(tweet)" class="button mt-4">Tweet</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    suggestedTweets: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      displayedTweets: [],
    };
  },
  methods: {
    refreshTweets() {
      this.displayedTweets = this.getRandomTweets(3);
    },
    getRandomTweets(count) {
      const shuffled = [...this.suggestedTweets].sort(
        () => 0.5 - Math.random()
      );
      return shuffled.slice(0, count);
    },
    postTweet(tweet) {
      // Implement the logic to post the tweet
      console.log("Posting tweet:", tweet);
    },
    refreshSingleTweet(index) {
      const newTweet = this.getRandomTweets(1)[0];
      this.$set(this.displayedTweets, index, newTweet);
    },
  },
  created() {
    this.refreshTweets();
  },
};
</script>

<style scoped>
.tweet-suggestions {
  display: flex;
  flex-direction: column;
}

.text-Juice-white {
  color: white;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
