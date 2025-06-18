<template>
  <div class="min-h-screen w-full relative overflow-hidden">
    <!-- Sign Out Button - Top Right - Fixed Position -->
    <button
      @click="signOut"
      class="fixed top-6 right-6 z-50 glass-button flex items-center gap-2 shadow-lg"
      style="min-width: auto; white-space: nowrap"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      Sign Out
    </button>

    <!-- Main Content Container -->
    <div class="relative w-full z-10 min-h-screen flex">
      <!-- Left Side Panel - Description, Navigation & Progress -->
      <div class="w-1/2 glass-container flex flex-col relative overflow-hidden">
        <!-- Top Navigation Button -->
        <div class="relative z-10 p-6">
          <button
            v-if="twitterStore.twitterConnected"
            @click="backToDashboard"
            class="glass-button flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
          <div v-else class="text-white/70 text-sm font-medium">
            Complete setup to access dashboard
          </div>
        </div>

        <!-- Description Content Area -->
        <div class="relative z-10 flex-1 p-8 flex flex-col justify-center">
          <div class="max-w-md mx-auto">
            <!-- Step 1: Personality Traits Description -->
            <div v-if="currentStep === 1" class="step-info">
              <div class="step-badge">
                <span class="step-number">01</span>
                <span class="step-total">/ 04</span>
              </div>

              <h2 class="step-heading">Define Your AI Personality</h2>

              <p class="step-text">
                Choose personality traits that shape how your AI assistant will
                communicate and engage with your audience on social platforms.
                <span class="requirement-text"
                  >Select at least 1 trait to continue.</span
                >
              </p>

              <div class="feature-grid">
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>Curated trait library</span>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <span>Custom additions</span>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span>Authentic voice</span>
                </div>
              </div>
            </div>

            <!-- Step 2: Interests and Rules Description -->
            <div v-if="currentStep === 2" class="step-info">
              <div class="step-badge">
                <span class="step-number">02</span>
                <span class="step-total">/ 04</span>
              </div>

              <h2 class="step-heading">Set Interests & Guidelines</h2>

              <p class="step-text">
                Define what topics your AI should focus on and establish
                behavioral rules to ensure appropriate and targeted responses.
                <span class="requirement-text"
                  >Add at least 1 interest and 1 rule to continue.</span
                >
              </p>

              <div class="feature-grid">
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span>Topic expertise</span>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span>Smart guidelines</span>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <span>Context awareness</span>
                </div>
              </div>
            </div>

            <!-- Step 3: Token Preferences Description -->
            <div v-if="currentStep === 3" class="step-info">
              <div class="step-badge">
                <span class="step-number">03</span>
                <span class="step-total">/ 04</span>
              </div>

              <h2 class="step-heading">Configure Token Sentiment</h2>

              <p class="step-text">
                Set your market position on specific tokens to guide your AI's
                sentiment in trading discussions and market commentary.
                <span class="requirement-text"
                  >Add at least 1 bullish token to continue.</span
                >
              </p>

              <div class="feature-grid">
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <span>Bullish positions</span>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  </div>
                  <span>Bearish outlook</span>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <span>Market insights</span>
                </div>
              </div>
            </div>

            <!-- Step 4: Banned Words Description -->
            <div v-if="currentStep === 4" class="step-info">
              <div class="step-badge">
                <span class="step-number">04</span>
                <span class="step-total">/ 04</span>
              </div>

              <h2 class="step-heading">Content Safety Filters</h2>

              <p class="step-text">
                Define words and phrases your AI should avoid to maintain your
                preferred communication style and brand safety.
                <span class="requirement-text">This step is optional.</span>
              </p>

              <div class="feature-grid">
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </div>
                  <span>Word filtering</span>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span>Brand protection</span>
                </div>
                <div class="feature-card">
                  <div class="feature-icon">
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                    </svg>
                  </div>
                  <span>Custom control</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modern Progress Bar at Bottom -->
        <div class="relative z-10 p-6">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-medium text-white/95"
              >Configuration Progress</span
            >
            <span class="text-sm font-semibold text-white/98"
              >{{ currentStep }} of 4</span
            >
          </div>
          <div class="progress-bar-modern">
            <div
              class="progress-fill-modern"
              :style="{ width: `${(currentStep / 4) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Right Side Panel - Configuration Forms -->
      <div class="w-1/2 p-8 flex items-center justify-center bg-transparent">
        <div class="w-full max-w-xl">
          <div class="glass-card p-8" :class="`step-${currentStep}`">
            <!-- Configuration content will be added here -->
            <div v-if="currentStep === 1" class="config-step">
              <h2 class="step-title">Select Personality Traits</h2>
              <p class="step-description">
                Choose traits that define your AI's communication style.
              </p>

              <div class="trait-grid">
                <div
                  v-for="trait in availableTraits"
                  :key="trait"
                  @click="toggleTrait(trait)"
                  :class="[
                    'trait-card',
                    personalityTraits.includes(trait) ? 'active' : '',
                  ]"
                >
                  <div class="trait-checkbox">
                    <svg
                      v-if="personalityTraits.includes(trait)"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span class="trait-label">{{ trait }}</span>
                </div>
              </div>

              <div class="step-navigation">
                <div></div>
                <button
                  @click="nextStep"
                  :class="[
                    'config-button',
                    canProceedFromCurrentStep ? 'primary' : 'disabled',
                  ]"
                  :disabled="!canProceedFromCurrentStep"
                >
                  {{ nextButtonText }}
                </button>
              </div>
            </div>

            <!-- Step 2: Interests and Rules -->
            <div v-if="currentStep === 2" class="config-step">
              <h2 class="step-title">Interests & Rules</h2>
              <p class="step-description">
                Define your interests and behavioral guidelines.
              </p>

              <!-- Interests Section -->
              <div class="input-section">
                <label class="section-label">Interests</label>
                <div class="input-wrapper">
                  <input
                    type="text"
                    v-model="interestInput"
                    @keyup.enter="addInterest"
                    placeholder="Add an interest (e.g., DeFi, NFTs)"
                    class="compact-input"
                  />
                  <button @click="addInterest" class="add-btn">+</button>
                </div>
                <div class="chip-container">
                  <div
                    v-for="(interest, index) in interests"
                    :key="`interest-${index}`"
                    class="chip interest-chip"
                  >
                    <span>{{ interest }}</span>
                    <button @click="removeInterest(index)" class="chip-remove">
                      ×
                    </button>
                  </div>
                </div>
              </div>

              <!-- Rules Section -->
              <div class="input-section">
                <label class="section-label">Rules</label>
                <div class="input-wrapper">
                  <input
                    type="text"
                    v-model="ruleInput"
                    @keyup.enter="addRule"
                    placeholder="Add a rule (e.g., Be technical, Avoid FUD)"
                    class="compact-input"
                  />
                  <button @click="addRule" class="add-btn">+</button>
                </div>
                <div class="chip-container">
                  <div
                    v-for="(rule, index) in rules"
                    :key="`rule-${index}`"
                    class="chip rule-chip"
                  >
                    <span>{{ rule }}</span>
                    <button @click="removeRule(index)" class="chip-remove">
                      ×
                    </button>
                  </div>
                </div>
              </div>

              <div class="step-navigation">
                <button @click="prevStep" class="config-button secondary">
                  Back
                </button>
                <button
                  @click="nextStep"
                  :class="[
                    'config-button',
                    canProceedFromCurrentStep ? 'primary' : 'disabled',
                  ]"
                  :disabled="!canProceedFromCurrentStep"
                >
                  {{ nextButtonText }}
                </button>
              </div>
            </div>

            <!-- Step 3: Token Preferences -->
            <div v-if="currentStep === 3" class="config-step">
              <h2 class="step-title">Token Sentiment</h2>
              <p class="step-description">
                Select tokens you're bullish or bearish on.
              </p>

              <!-- Bullish Tokens -->
              <div class="input-section">
                <label class="section-label bullish">Bullish Tokens</label>
                <div class="token-input-container">
                  <div class="input-wrapper">
                    <input
                      type="text"
                      v-model="bullishInput"
                      @input="onBullishInputChange"
                      @focus="onBullishInputFocus"
                      @keyup.enter="addBullishToken"
                      @keydown.down.prevent="
                        () => {
                          /* TODO: handle arrow down */
                        }
                      "
                      @keydown.up.prevent="
                        () => {
                          /* TODO: handle arrow up */
                        }
                      "
                      @keydown.escape="hideDropdowns"
                      placeholder="Add bullish token (e.g., SOL, BTC)"
                      class="compact-input"
                    />
                    <button @click="addBullishToken" class="add-btn">
                      <span v-if="!isSearchingBullish">+</span>
                      <div v-else class="loading-spinner"></div>
                    </button>
                  </div>

                  <!-- Dropdown for token suggestions -->
                  <div v-if="showBullishDropdown" class="token-dropdown">
                    <div
                      v-for="token in tokenSuggestions"
                      :key="token.address"
                      @click="selectTokenFromDropdown(token, 'bullish')"
                      class="token-dropdown-item"
                    >
                      <div class="token-dropdown-content">
                        <div class="token-image-container">
                          <img
                            v-if="token.imageUrl"
                            :src="token.imageUrl"
                            :alt="token.symbol"
                            class="token-image"
                            @error="$event.target.style.display = 'none'"
                          />
                          <div v-else class="token-image-placeholder">
                            {{ token.symbol.charAt(0) }}
                          </div>
                        </div>
                        <div class="token-info">
                          <div class="token-main-info">
                            <span class="token-symbol">{{ token.symbol }}</span>
                            <span class="token-market-cap">{{
                              formatMarketCap(token.marketCap)
                            }}</span>
                          </div>
                          <span class="token-name">{{ token.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="chip-container">
                  <div
                    v-for="(token, index) in bullishTokens"
                    :key="`bullish-${index}`"
                    class="chip bullish-chip"
                  >
                    <div class="chip-image-container">
                      <img
                        v-if="bullishMeta[token]?.imageUrl"
                        :src="bullishMeta[token].imageUrl"
                        :alt="token"
                        class="chip-image"
                        @error="$event.target.style.display = 'none'"
                      />
                      <div v-else class="chip-image-placeholder">
                        {{ token.charAt(0) }}
                      </div>
                    </div>
                    <span class="chip-label">{{ token }}</span>
                    <span
                      v-if="bullishMeta[token]?.marketCap"
                      class="chip-market-cap"
                    >
                      {{ formatMarketCap(bullishMeta[token].marketCap) }}
                    </span>
                    <button
                      @click="removeBullishToken(index)"
                      class="chip-remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              <!-- Bearish Tokens -->
              <div class="input-section">
                <label class="section-label bearish"
                  >Bearish Tokens (Optional)</label
                >
                <div class="token-input-container">
                  <div class="input-wrapper">
                    <input
                      type="text"
                      v-model="bearishInput"
                      @input="onBearishInputChange"
                      @focus="onBearishInputFocus"
                      @keyup.enter="addBearishToken"
                      @keydown.down.prevent="
                        () => {
                          /* TODO: handle arrow down */
                        }
                      "
                      @keydown.up.prevent="
                        () => {
                          /* TODO: handle arrow up */
                        }
                      "
                      @keydown.escape="hideDropdowns"
                      placeholder="Add bearish token (optional)"
                      class="compact-input"
                    />
                    <button @click="addBearishToken" class="add-btn">
                      <span v-if="!isSearchingBearish">+</span>
                      <div v-else class="loading-spinner"></div>
                    </button>
                  </div>

                  <!-- Dropdown for token suggestions -->
                  <div v-if="showBearishDropdown" class="token-dropdown">
                    <div
                      v-for="token in tokenSuggestions"
                      :key="token.address"
                      @click="selectTokenFromDropdown(token, 'bearish')"
                      class="token-dropdown-item"
                    >
                      <div class="token-dropdown-content">
                        <div class="token-image-container">
                          <img
                            v-if="token.imageUrl"
                            :src="token.imageUrl"
                            :alt="token.symbol"
                            class="token-image"
                            @error="$event.target.style.display = 'none'"
                          />
                          <div v-else class="token-image-placeholder">
                            {{ token.symbol.charAt(0) }}
                          </div>
                        </div>
                        <div class="token-info">
                          <div class="token-main-info">
                            <span class="token-symbol">{{ token.symbol }}</span>
                            <span class="token-market-cap">{{
                              formatMarketCap(token.marketCap)
                            }}</span>
                          </div>
                          <span class="token-name">{{ token.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="chip-container">
                  <div
                    v-for="(token, index) in bearishTokens"
                    :key="`bearish-${index}`"
                    class="chip bearish-chip"
                  >
                    <div class="chip-image-container">
                      <img
                        v-if="bearishMeta[token]?.imageUrl"
                        :src="bearishMeta[token].imageUrl"
                        :alt="token"
                        class="chip-image"
                        @error="$event.target.style.display = 'none'"
                      />
                      <div v-else class="chip-image-placeholder">
                        {{ token.charAt(0) }}
                      </div>
                    </div>
                    <span class="chip-label">{{ token }}</span>
                    <span
                      v-if="bearishMeta[token]?.marketCap"
                      class="chip-market-cap"
                    >
                      {{ formatMarketCap(bearishMeta[token].marketCap) }}
                    </span>
                    <button
                      @click="removeBearishToken(index)"
                      class="chip-remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              <div class="step-navigation">
                <button @click="prevStep" class="config-button secondary">
                  Back
                </button>
                <button
                  @click="nextStep"
                  :class="[
                    'config-button',
                    canProceedFromCurrentStep ? 'primary' : 'disabled',
                  ]"
                  :disabled="!canProceedFromCurrentStep"
                >
                  {{ nextButtonText }}
                </button>
              </div>
            </div>

            <!-- Step 4: Banned Words -->
            <div v-if="currentStep === 4" class="config-step">
              <h2 class="step-title">Content Filtering</h2>
              <p class="step-description">
                Add words your AI should avoid using.
              </p>

              <div class="input-section">
                <label class="section-label">Banned Words</label>
                <div class="input-wrapper">
                  <input
                    type="text"
                    v-model="bannedWordInput"
                    @keyup.enter="addBannedWord"
                    placeholder="Add word to ban"
                    class="compact-input"
                  />
                  <button @click="addBannedWord" class="add-btn">+</button>
                </div>
                <div class="chip-container">
                  <div
                    v-for="(word, index) in bannedWords"
                    :key="`banned-${index}`"
                    class="chip banned-chip"
                  >
                    <span>{{ word }}</span>
                    <button
                      @click="removeBannedWord(index)"
                      class="chip-remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              <div class="step-navigation">
                <button @click="prevStep" class="config-button secondary">
                  Back
                </button>
                <button
                  @click="completeConfiguration"
                  :class="[
                    'config-button',
                    canProceedFromCurrentStep ? 'primary' : 'disabled',
                  ]"
                  :disabled="!canProceedFromCurrentStep"
                >
                  {{ nextButtonText }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Info Modal -->
    <div v-if="currentStep === 1" class="info-modal-global">
      These traits are in addition to the AI agent's custom personality derived
      from your account's historical activity.
    </div>
  </div>
</template>

<script>
import { useUserStore } from "../../stores/user";
import { useAlertStore } from "../../stores/alert";
import { useTwitterStore } from "../../stores/twitter";
import axios_instance from "../../utils/axios.instance";

export default {
  name: "ConfigurationFlow",
  data() {
    return {
      currentStep: 1,
      personalityTraits: [],
      availableTraits: [
        "Sarcastic",
        "Witty",
        "Technical",
        "Casual",
        "Professional",
        "Humorous",
        "Direct",
        "Analytical",
        "Creative",
      ],
      // Step 2 data
      interestInput: "",
      interests: [],
      ruleInput: "",
      rules: [],
      // Step 3 data
      bullishInput: "",
      bullishTokens: [],
      bearishInput: "",
      bearishTokens: [],
      // Step 4 data
      bannedWordInput: "",
      bannedWords: [],
      // Token dropdown data
      tokenSuggestions: [],
      showBullishDropdown: false,
      showBearishDropdown: false,
      // Separate loading flags for each token type
      isSearchingBullish: false,
      isSearchingBearish: false,
      // Token metadata maps to enhance chips
      bullishMeta: {},
      bearishMeta: {},
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    alertStore() {
      return useAlertStore();
    },
    twitterStore() {
      return useTwitterStore();
    },
    canProceedFromCurrentStep() {
      switch (this.currentStep) {
        case 1:
          return this.personalityTraits.length > 0;
        case 2:
          return this.interests.length > 0 && this.rules.length > 0;
        case 3:
          return this.bullishTokens.length > 0;
        case 4:
          return true; // Banned words are optional
        default:
          return false;
      }
    },
    nextButtonText() {
      switch (this.currentStep) {
        case 1:
          return this.personalityTraits.length === 0
            ? "Select at least 1 trait"
            : "Next";
        case 2:
          if (this.interests.length === 0) return "Add at least 1 interest";
          if (this.rules.length === 0) return "Add at least 1 rule";
          return "Next";
        case 3:
          return this.bullishTokens.length === 0
            ? "Add at least 1 token"
            : "Next";
        case 4:
          return "Complete Setup";
        default:
          return "Next";
      }
    },
  },
  mounted() {
    // Set up debounced token search
    this.debounceTokenSearch = this.debounce((query, type) => {
      this.searchTokens(query, type);
    }, 300);

    // Add click outside listener to close dropdowns
    document.addEventListener("click", this.handleClickOutside);

    // Load existing configuration values
    this.loadExistingConfiguration();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    // Utility methods
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    handleClickOutside(event) {
      // Check if click is outside dropdown areas
      if (!event.target.closest(".token-input-container")) {
        this.hideDropdowns();
      }
    },
    signOut() {
      this.userStore.setIsLoggedIn(false);
      this.userStore.setAuthSolanaWalletAddress(null);
      this.userStore.$reset();
      this.alertStore.setSuccessMessage("Successfully signed out");
      this.$router.push("/auth");
    },
    backToDashboard() {
      this.$router.push("/");
    },
    toggleTrait(trait) {
      const index = this.personalityTraits.indexOf(trait);
      if (index === -1) {
        this.personalityTraits.push(trait);
      } else {
        this.personalityTraits.splice(index, 1);
      }
    },
    nextStep() {
      // Validate current step before proceeding
      if (!this.validateCurrentStep()) {
        return;
      }

      if (this.currentStep < 4) {
        this.currentStep++;
      }
    },
    validateCurrentStep() {
      switch (this.currentStep) {
        case 1:
          if (this.personalityTraits.length === 0) {
            this.alertStore.setErrorMessage(
              "Please select at least one personality trait to continue."
            );
            return false;
          }
          break;
        case 2:
          if (this.interests.length === 0) {
            this.alertStore.setErrorMessage(
              "Please add at least one interest to continue."
            );
            return false;
          }
          if (this.rules.length === 0) {
            this.alertStore.setErrorMessage(
              "Please add at least one rule to continue."
            );
            return false;
          }
          break;
        case 3:
          if (this.bullishTokens.length === 0) {
            this.alertStore.setErrorMessage(
              "Please add at least one bullish token to continue."
            );
            return false;
          }
          break;
        case 4:
          // Banned words are optional, so no validation needed
          break;
      }
      return true;
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    // Step 2 methods
    addInterest() {
      if (this.interestInput.trim()) {
        const interest = this.interestInput.trim();
        if (!this.interests.includes(interest)) {
          this.interests.push(interest);
        }
        this.interestInput = "";
      }
    },
    removeInterest(index) {
      this.interests.splice(index, 1);
    },
    addRule() {
      if (this.ruleInput.trim()) {
        const rule = this.ruleInput.trim();
        if (!this.rules.includes(rule)) {
          this.rules.push(rule);
        }
        this.ruleInput = "";
      }
    },
    removeRule(index) {
      this.rules.splice(index, 1);
    },
    // Step 3 methods
    addBullishToken() {
      if (this.bullishInput.trim()) {
        const token = this.bullishInput.trim().toUpperCase();
        if (!this.bullishTokens.includes(token)) {
          // Validate token with DexScreener API before adding
          this.validateAndAddToken(token, "bullish");
        } else {
          this.alertStore.setErrorMessage(
            "Token already added to bullish list"
          );
        }
        this.bullishInput = "";
      }
    },
    removeBullishToken(index) {
      const removed = this.bullishTokens.splice(index, 1)[0];
      delete this.bullishMeta[removed];
    },
    addBearishToken() {
      if (this.bearishInput.trim()) {
        const token = this.bearishInput.trim().toUpperCase();
        if (!this.bearishTokens.includes(token)) {
          // Validate token with DexScreener API before adding
          this.validateAndAddToken(token, "bearish");
        } else {
          this.alertStore.setErrorMessage(
            "Token already added to bearish list"
          );
        }
        this.bearishInput = "";
      }
    },
    removeBearishToken(index) {
      const removed = this.bearishTokens.splice(index, 1)[0];
      delete this.bearishMeta[removed];
    },
    async validateAndAddToken(token, type) {
      try {
        // Call DexScreener API to validate token
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/search/?q=${token}`
        );
        const data = await response.json();

        // Filter for Solana tokens
        const solanaTokens =
          data.pairs?.filter(
            (pair) =>
              pair.chainId === "solana" &&
              (pair.baseToken.symbol.toUpperCase() === token ||
                pair.baseToken.address === token)
          ) || [];

        if (solanaTokens.length > 0) {
          // Token found and validated
          const validatedToken = solanaTokens[0];
          const tokenSymbol = validatedToken.baseToken.symbol.toUpperCase();

          if (type === "bullish") {
            this.bullishTokens.push(tokenSymbol);
            this.bullishMeta[tokenSymbol] = {
              imageUrl: validatedToken.info?.imageUrl || null,
              marketCap: validatedToken.marketCap || 0,
            };
          } else {
            this.bearishTokens.push(tokenSymbol);
            this.bearishMeta[tokenSymbol] = {
              imageUrl: validatedToken.info?.imageUrl || null,
              marketCap: validatedToken.marketCap || 0,
            };
          }

          this.alertStore.setSuccessMessage(
            `${tokenSymbol} validated and added to ${type} tokens`
          );
        } else {
          // Token not found on DexScreener
          this.alertStore.setErrorMessage(
            `Token "${token}" not found on DexScreener. Please verify the symbol.`
          );
        }
      } catch (error) {
        // If API fails, still add the token but show a warning
        if (type === "bullish") {
          this.bullishTokens.push(token);
          this.bullishMeta[token] = { imageUrl: null, marketCap: 0 };
        } else {
          this.bearishTokens.push(token);
          this.bearishMeta[token] = { imageUrl: null, marketCap: 0 };
        }
        this.alertStore.setErrorMessage(
          `Warning: Could not validate "${token}" with DexScreener API. Token added anyway.`
        );
      }
    },
    // Token search and dropdown methods
    async searchTokens(query, type) {
      if (!query || query.length < 2) {
        this.tokenSuggestions = [];
        this.hideDropdowns();
        return;
      }

      if (type === "bullish") {
        this.isSearchingBullish = true;
      } else {
        this.isSearchingBearish = true;
      }
      try {
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/search/?q=${query}`
        );
        const data = await response.json();

        // Filter for Solana tokens
        const solanaTokens =
          data.pairs?.filter(
            (pair) =>
              pair.chainId === "solana" &&
              pair.baseToken.symbol.toLowerCase().includes(query.toLowerCase())
          ) || [];

        // Group by token address to avoid duplicates
        const tokenMap = new Map();

        solanaTokens.forEach((pair) => {
          const tokenAddress = pair.baseToken.address;
          const existing = tokenMap.get(tokenAddress);

          // Keep the pair with highest liquidity (best representative)
          if (
            !existing ||
            (pair.liquidity?.usd || 0) > (existing.liquidity?.usd || 0)
          ) {
            tokenMap.set(tokenAddress, pair);
          }
        });

        // Convert map to array and limit to 8 results
        const uniqueTokens = Array.from(tokenMap.values()).slice(0, 8);

        this.tokenSuggestions = uniqueTokens.map((pair) => ({
          symbol: pair.baseToken.symbol,
          name: pair.baseToken.name,
          address: pair.baseToken.address,
          imageUrl: pair.info?.imageUrl || null,
          marketCap: pair.marketCap || 0,
          priceUsd: pair.priceUsd || 0,
          liquidity: pair.liquidity?.usd || 0,
        }));

        if (type === "bullish") {
          this.showBullishDropdown = this.tokenSuggestions.length > 0;
          this.showBearishDropdown = false;
        } else {
          this.showBearishDropdown = this.tokenSuggestions.length > 0;
          this.showBullishDropdown = false;
        }
      } catch (error) {
        console.error("Error searching tokens:", error);
        this.tokenSuggestions = [];
        this.hideDropdowns();
      } finally {
        if (type === "bullish") {
          this.isSearchingBullish = false;
        } else {
          this.isSearchingBearish = false;
        }
      }
    },
    selectTokenFromDropdown(token, type) {
      const symbol = token.symbol.toUpperCase();
      if (type === "bullish") {
        if (!this.bullishTokens.includes(symbol)) {
          this.bullishTokens.push(symbol);
        }
        this.bullishMeta[symbol] = {
          imageUrl: token.imageUrl || null,
          marketCap: token.marketCap || 0,
        };
        this.showBullishDropdown = false;
        this.bullishInput = "";
      } else {
        if (!this.bearishTokens.includes(symbol)) {
          this.bearishTokens.push(symbol);
        }
        this.bearishMeta[symbol] = {
          imageUrl: token.imageUrl || null,
          marketCap: token.marketCap || 0,
        };
        this.showBearishDropdown = false;
        this.bearishInput = "";
      }
      this.tokenSuggestions = [];
    },
    hideDropdowns() {
      this.showBullishDropdown = false;
      this.showBearishDropdown = false;
    },
    onBullishInputFocus() {
      if (this.bullishInput.length >= 2) {
        this.searchTokens(this.bullishInput, "bullish");
      }
    },
    onBearishInputFocus() {
      if (this.bearishInput.length >= 2) {
        this.searchTokens(this.bearishInput, "bearish");
      }
    },
    onBullishInputChange() {
      this.debounceTokenSearch(this.bullishInput, "bullish");
    },
    onBearishInputChange() {
      this.debounceTokenSearch(this.bearishInput, "bearish");
    },
    // Step 4 methods
    addBannedWord() {
      if (this.bannedWordInput.trim()) {
        const word = this.bannedWordInput.trim().toLowerCase();
        if (!this.bannedWords.includes(word)) {
          this.bannedWords.push(word);
        }
        this.bannedWordInput = "";
      }
    },
    removeBannedWord(index) {
      this.bannedWords.splice(index, 1);
    },
    // Load existing configuration values
    async loadExistingConfiguration() {
      try {
        // Check if user already has configuration in store first
        let config = this.userStore.user?.configuration;

        // If no config in store or config is incomplete, try to refresh from API
        if (!config || !config.isComplete) {
          try {
            await this.userStore.refreshUserData();
            config = this.userStore.user?.configuration;
          } catch (error) {
            console.error("Error refreshing user data:", error);
            // Continue with existing store data if API call fails
          }
        }

        if (config) {
          // Use Vue.nextTick to ensure smooth UI updates
          await this.$nextTick();

          // Load personality traits
          if (
            config.personalityTraits &&
            Array.isArray(config.personalityTraits)
          ) {
            this.personalityTraits = [...config.personalityTraits];
          }

          // Load interests
          if (config.interests && Array.isArray(config.interests)) {
            this.interests = [...config.interests];
          }

          // Load rules
          if (config.rules && Array.isArray(config.rules)) {
            this.rules = [...config.rules];
          }

          // Load bullish tokens
          if (config.bullishTokens && Array.isArray(config.bullishTokens)) {
            this.bullishTokens = [...config.bullishTokens];
            // Initialize metadata for existing tokens
            config.bullishTokens.forEach((token) => {
              if (!this.bullishMeta[token]) {
                this.bullishMeta[token] = { imageUrl: null, marketCap: 0 };
              }
            });
          }

          // Load bearish tokens
          if (config.bearishTokens && Array.isArray(config.bearishTokens)) {
            this.bearishTokens = [...config.bearishTokens];
            // Initialize metadata for existing tokens
            config.bearishTokens.forEach((token) => {
              if (!this.bearishMeta[token]) {
                this.bearishMeta[token] = { imageUrl: null, marketCap: 0 };
              }
            });
          }

          // Load banned words
          if (config.bannedWords && Array.isArray(config.bannedWords)) {
            this.bannedWords = [...config.bannedWords];
          }

          console.log("Loaded existing configuration:", config);
        }
      } catch (error) {
        console.error("Error in loadExistingConfiguration:", error);
        // Continue with empty configuration if loading fails
      }
    },

    // Complete configuration
    async completeConfiguration() {
      // Final validation before completing
      if (!this.validateCurrentStep()) {
        return;
      }

      try {
        // Prepare configuration data
        const configurationData = {
          personalityTraits: this.personalityTraits,
          interests: this.interests,
          rules: this.rules,
          bullishTokens: this.bullishTokens,
          bearishTokens: this.bearishTokens,
          bannedWords: this.bannedWords,
          isComplete: true,
        };

        // Save configuration via API
        const response = await axios_instance.post(
          "/api/auth/update-configuration",
          {
            configuration: configurationData,
          },
          {
            withCredentials: true,
            credentials: "include",
          }
        );

        if (response.status === 200) {
          // Update local user store with saved configuration
          this.userStore.updateConfiguration(response.data.configuration);

          // Mark configuration as complete in localStorage
          localStorage.setItem("dashboardConfigured", "true");

          this.alertStore.setSuccessMessage(
            "Configuration saved successfully!"
          );

          // Check if Twitter is already connected
          if (this.twitterStore.twitterConnected) {
            // If Twitter is already connected, go straight to dashboard
            this.$router.push("/home");
          } else {
            // If Twitter is not connected, sign out and go to auth screen
            this.$router.push("/auth");
          }
        }
      } catch (error) {
        console.error("Error saving configuration:", error);
        this.alertStore.setErrorMessage(
          "Failed to save configuration. Please try again."
        );
      }
    },
    formatMarketCap(marketCap) {
      if (!marketCap || marketCap === 0) return "N/A";

      if (marketCap >= 1e9) {
        return `$${(marketCap / 1e9).toFixed(1)}B`;
      } else if (marketCap >= 1e6) {
        return `$${(marketCap / 1e6).toFixed(1)}M`;
      } else if (marketCap >= 1e3) {
        return `$${(marketCap / 1e3).toFixed(1)}K`;
      } else {
        return `$${marketCap.toFixed(0)}`;
      }
    },
  },
};
</script>

<style scoped>
/* Modern Dark Glass Morphism Configuration Styles */

/* Left Panel Navigation Buttons */
.nav-button-modern {
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.25) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.98) !important;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.nav-button-modern:hover {
  background: rgba(0, 0, 0, 0.35) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* Modern Step Information Design */
.step-info {
  text-align: center;
}

.step-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #55d43f, #01a044);
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(85, 212, 63, 0.3);
}

.step-number {
  color: white;
  font-size: 16px;
  font-weight: 700;
}

.step-total {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
}

.step-heading {
  font-size: 28px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.98) !important;
  margin-bottom: 16px;
  line-height: 1.2;
  background: linear-gradient(135deg, #55d43f 0%, #01a044 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.step-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9) !important;
  line-height: 1.6;
  margin-bottom: 32px;
  font-weight: 500;
}

.requirement-text {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: rgba(85, 212, 63, 0.9) !important;
  font-weight: 600;
  font-style: italic;
}

/* Modern Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.feature-card:hover {
  background: rgba(0, 0, 0, 0.3) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border-color: rgba(85, 212, 63, 0.4) !important;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #55d43f, #01a044);
  border-radius: 8px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(85, 212, 63, 0.25);
}

/* Modern Progress Bar */
.progress-bar-modern {
  height: 6px;
  background: rgba(0, 0, 0, 0.2) !important;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15);
}

.progress-fill-modern {
  height: 100%;
  background: linear-gradient(135deg, #55d43f, #01a044, #15803d);
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.progress-fill-modern::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer-modern 2.5s infinite;
}

@keyframes shimmer-modern {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.98) !important;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #55d43f 0%, #01a044 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.step-description {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 24px;
}

/* Compact Trait Grid */
.trait-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  margin-bottom: 20px;
}

.trait-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
}

.trait-card:hover {
  background: rgba(0, 0, 0, 0.25) !important;
  border-color: rgba(85, 212, 63, 0.4) !important;
  transform: translateY(-1px);
}

.trait-card.active {
  background: rgba(85, 212, 63, 0.15) !important;
  border-color: rgba(85, 212, 63, 0.6) !important;
  box-shadow: 0 2px 8px rgba(85, 212, 63, 0.15);
}

.trait-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.trait-card.active .trait-checkbox {
  background: linear-gradient(135deg, #55d43f, #01a044);
  border-color: #55d43f;
}

.trait-label {
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 500;
  font-size: 13px;
}

/* Navigation */
.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.config-button {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.config-button.primary {
  background: linear-gradient(135deg, #55d43f, #01a044);
  color: white;
  box-shadow: 0 3px 10px rgba(85, 212, 63, 0.3);
}

.config-button.primary:hover {
  background: linear-gradient(135deg, #4bc736, #019a3d);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(85, 212, 63, 0.4);
}

.config-button.secondary {
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

.config-button.secondary:hover {
  background: rgba(0, 0, 0, 0.3) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
  transform: translateY(-1px);
}

.config-button.complete {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
  box-shadow: 0 3px 10px rgba(5, 150, 105, 0.3);
}

.config-button.complete:hover {
  background: linear-gradient(135deg, #047857, #065f46);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4);
}

.config-button.disabled {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.4) !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.config-button.disabled:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.4) !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Enhanced Separation with Subtle Shadows */
.w-1\/2:first-child {
  box-shadow:
    inset -1px 0 0 rgba(255, 255, 255, 0.1),
    2px 0 8px rgba(0, 0, 0, 0.1);
}

.w-1\/2:last-child {
  box-shadow:
    inset 1px 0 0 rgba(255, 255, 255, 0.1),
    -2px 0 8px rgba(0, 0, 0, 0.1);
}

/* Compact Input Sections */
.input-section {
  margin-bottom: 20px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.95) !important;
  display: block;
}

.section-label.bullish {
  color: rgba(85, 212, 63, 0.95) !important;
}

.section-label.bearish {
  color: rgba(239, 68, 68, 0.95) !important;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.compact-input {
  flex: 1;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.25) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.98) !important;
  font-size: 13px;
  transition: all 0.3s ease;
}

.compact-input:focus {
  outline: none;
  background: rgba(0, 0, 0, 0.35) !important;
  border-color: rgba(85, 212, 63, 0.4) !important;
  box-shadow: 0 0 0 2px rgba(85, 212, 63, 0.1);
}

.compact-input::placeholder {
  color: rgba(255, 255, 255, 0.6) !important;
}

.add-btn {
  padding: 10px 16px;
  background: linear-gradient(135deg, #55d43f, #01a044);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(85, 212, 63, 0.25);
}

.add-btn:hover {
  background: linear-gradient(135deg, #4bc736, #019a3d);
  transform: translateY(-1px);
  box-shadow: 0 3px 12px rgba(85, 212, 63, 0.35);
}

/* Token Input Container */
.token-input-container {
  position: relative;
}

/* Loading Spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
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

/* Token Dropdown */
.token-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-height: 280px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;
}

.token-dropdown-item {
  padding: 14px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.token-dropdown-item:last-child {
  border-bottom: none;
}

.token-dropdown-item:hover {
  background: rgba(85, 212, 63, 0.15) !important;
  border-color: rgba(85, 212, 63, 0.3);
}

.token-dropdown-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.token-image-container {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.token-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.token-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(85, 212, 63, 0.2),
    rgba(1, 160, 68, 0.2)
  );
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.token-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.token-main-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.token-symbol {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95) !important;
}

.token-market-cap {
  font-size: 11px;
  color: rgba(85, 212, 63, 0.8) !important;
  font-weight: 500;
  background: rgba(85, 212, 63, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.token-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7) !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Chip Container and Chips */
.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 32px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.interest-chip {
  background: rgba(85, 212, 63, 0.15) !important;
  border: 1px solid rgba(85, 212, 63, 0.3) !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

.rule-chip {
  background: rgba(251, 191, 36, 0.15) !important;
  border: 1px solid rgba(251, 191, 36, 0.3) !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

.bullish-chip {
  background: rgba(16, 185, 129, 0.15) !important;
  border: 1px solid rgba(16, 185, 129, 0.3) !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

.bearish-chip {
  background: rgba(239, 68, 68, 0.15) !important;
  border: 1px solid rgba(239, 68, 68, 0.3) !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

.banned-chip {
  background: rgba(239, 68, 68, 0.15) !important;
  border: 1px solid rgba(239, 68, 68, 0.3) !important;
  color: rgba(255, 255, 255, 0.95) !important;
}

.chip-remove {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.chip-remove:hover {
  opacity: 1;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Chip enhancements */
.chip-image-container {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.chip-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chip-image-placeholder {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.chip-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95) !important;
  margin: 0 4px;
}

.chip-market-cap {
  font-size: 10px;
  color: rgba(85, 212, 63, 0.9) !important;
  font-weight: 500;
  background: rgba(85, 212, 63, 0.15);
  padding: 2px 4px;
  border-radius: 4px;
  white-space: nowrap;
  margin-right: 4px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .min-h-screen.flex {
    flex-direction: column;
  }

  .w-1\/2 {
    width: 100%;
  }

  .step-heading {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .p-6 {
    padding: 20px;
  }

  .step-heading {
    font-size: 20px;
  }

  .glass-card {
    padding: 20px;
  }
}

/* Info Modal */
.info-modal-global {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 120px; /* adjust as needed to sit above progress bar */
  max-width: 480px;
  width: 80%;
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 10px;
  padding: 16px 22px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9) !important;
  text-align: center;
}
</style>
