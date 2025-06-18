<template>
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-semibold mb-4 text-center text-Juice-white">
      Choose Your Juiceing Plan
    </h1>
    <p class="text-center text-lg text-Juice-white mb-8">
      Once Juiceed, all your tweets will receive the below treatment.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
      <!-- Bronze Tier -->
      <div
        class="cardContainer flex flex-col text-Juice-white hover:bronze-glow group relative"
      >
        <div class="flex flex-col p-2 h-full">
          <h2 class="text-2xl font-bold mb-4 text-center">Bronze Tier 🥉</h2>
          <ul class="flex-grow mb-2">
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>1-2% Target Engagement Rate</span>
            </li>
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>30% Increase in Impressions</span>
            </li>
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>Likes, Comments, Retweets</span>
            </li>
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="times" class="text-red-400 mr-2" />
              <span>No Detail Expands or Profile Views</span>
            </li>
            <!-- <li class="flex items-center">
              <font-awesome-icon icon="times" class="text-red-400 mr-2" />
              <span>No Quote Tweets</span>
            </li> -->
          </ul>
          <div class="text-center mb-6 flex items-center justify-center">
            <div>
              <p class="text-2xl font-bold">100 USDC</p>
              <p class="text-sm">Monthly</p>
            </div>
            <span class="text-5xl font-normal mx-4">/</span>
            <div>
              <p class="text-2xl font-bold">1000 USDC</p>
              <p class="text-sm">Yearly</p>
            </div>
          </div>
          <p class="text-sm text-gray-300 mb-4">
            Ideal For: Users wanting a basic engagement Juice, with light media
            engagement.
          </p>
          <button
            @click="showOverlay('bronze')"
            class="mt-auto bg-yellow-600 text-Juice-white font-bold py-2 px-4 rounded transition duration-300 button group-hover:bg-yellow-700"
          >
            Select Bronze
          </button>
        </div>
        <div v-if="activeOverlay === 'bronze'" class="overlay">
          <font-awesome-icon
            icon="times"
            class="absolute top-2 right-2 text-2xl cursor-pointer text-gray-300 hover:text-white"
            @click="closeOverlay"
          />
          <button @click="selectPlan('bronze', 'monthly')" class="button">
            Monthly (100 USDC)
          </button>
          <button @click="selectPlan('bronze', 'yearly')" class="button">
            Yearly (1000 USDC)
          </button>
        </div>
      </div>

      <!-- Silver Tier -->
      <div
        class="cardContainer flex flex-col text-Juice-white hover:silver-glow group relative"
      >
        <div class="flex flex-col p-2 h-full">
          <h2 class="text-2xl font-bold mb-4 text-center">Silver Tier 🥈</h2>
          <ul class="flex-grow mb-2">
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>2-3% Target Engagement Rate</span>
            </li>
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>30% Increase in Impressions</span>
            </li>
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>Likes, Comments, Retweets</span>
            </li>
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>2-3% Detail Expands & Profile Views</span>
            </li>
            <!-- <li class="flex items-center mb-2">
              <font-awesome-icon icon="times" class="text-red-400 mr-2" />
              <span>No Quote Tweets</span>
            </li> -->
          </ul>
          <div class="text-center mb-6 flex items-center justify-center">
            <div>
              <p class="text-2xl font-bold">200 USDC</p>
              <p class="text-sm">Monthly</p>
            </div>
            <span class="text-5xl font-normal mx-4">/</span>
            <div>
              <p class="text-2xl font-bold">2000 USDC</p>
              <p class="text-sm">Yearly</p>
            </div>
          </div>
          <p class="text-sm text-gray-300 mb-4">
            Ideal For: Users wanting medium-level engagement, including interest
            signals like profile views.
          </p>
          <button
            @click="showOverlay('silver')"
            class="mt-auto bg-gray-400 text-Juice-white font-bold py-2 px-4 rounded transition duration-300 button group-hover:bg-gray-500"
          >
            Select Silver
          </button>
        </div>
        <div v-if="activeOverlay === 'silver'" class="overlay">
          <font-awesome-icon
            icon="times"
            class="absolute top-2 right-2 text-2xl cursor-pointer text-gray-300 hover:text-white"
            @click="closeOverlay"
          />
          <button @click="selectPlan('silver', 'monthly')" class="button">
            Monthly (200 USDC)
          </button>
          <button @click="selectPlan('silver', 'yearly')" class="button">
            Yearly (2000 USDC)
          </button>
        </div>
      </div>

      <!-- Gold Tier -->
      <div
        class="cardContainer flex flex-col text-Juice-white hover:gold-glow group relative"
      >
        <div class="flex flex-col p-2 h-full">
          <h2 class="text-2xl font-bold mb-4 text-center">Gold Tier 🥇</h2>
          <ul class="flex-grow mb-2">
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>3-5% Target Engagement Rate</span>
            </li>
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>30% Increase in Impressions</span>
            </li>
            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>Likes, Comments, Retweets</span>
            </li>

            <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>3-5% Detail Expands & Profile Views</span>
            </li>
            <!-- <li class="flex items-center mb-2">
              <font-awesome-icon icon="check" class="text-blue-400 mr-2" />
              <span>Quote Tweets</span>
            </li> -->
          </ul>
          <div class="text-center mb-6 flex items-center justify-center">
            <div>
              <p class="text-2xl font-bold">300 USDC</p>
              <p class="text-sm">Monthly</p>
            </div>
            <span class="text-5xl font-normal mx-4">/</span>
            <div>
              <p class="text-2xl font-bold">3000 USDC</p>
              <p class="text-sm">Yearly</p>
            </div>
          </div>
          <p class="text-sm text-gray-300 mb-4">
            Ideal For: Users aiming for high engagement across the board with
            the most visibility and interaction.
          </p>
          <button
            @click="showOverlay('gold')"
            class="mt-auto bg-yellow-400 text-Juice-white font-bold py-2 px-4 rounded transition duration-300 button group-hover:bg-yellow-500"
          >
            Select Gold
          </button>
        </div>
        <div v-if="activeOverlay === 'gold'" class="overlay">
          <font-awesome-icon
            icon="times"
            class="absolute top-2 right-2 text-2xl cursor-pointer text-gray-300 hover:text-white"
            @click="closeOverlay"
          />
          <button @click="selectPlan('gold', 'monthly')" class="button">
            Monthly (300 USDC)
          </button>
          <button @click="selectPlan('gold', 'yearly')" class="button">
            Yearly (3000 USDC)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Juiceing",
  data() {
    return {
      activeOverlay: null,
    };
  },
  methods: {
    showOverlay(tier) {
      this.activeOverlay = tier;
    },
    selectPlan(tier, duration) {
      // Handle plan selection here
      console.log(`Selected ${tier} tier for ${duration} duration`);
      this.activeOverlay = null;
    },
    closeOverlay() {
      this.activeOverlay = null;
    },
  },
};
</script>

<style scoped>
.cardContainer {
  transition: box-shadow 0.3s ease-in-out;
}

.hover\:bronze-glow:hover {
  box-shadow: 0 0 15px 5px rgba(205, 127, 50, 0.7);
}

.hover\:silver-glow:hover {
  box-shadow: 0 0 15px 5px rgba(192, 192, 192, 0.7);
}

.hover\:gold-glow:hover {
  box-shadow: 0 0 15px 5px rgba(255, 215, 0, 0.7);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  @apply gap-y-4;
}
</style>
