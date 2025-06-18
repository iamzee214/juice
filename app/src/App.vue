<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAlertStore } from "./stores/alert";
import { ref, onMounted, onUnmounted } from "vue";

let alertStore = useAlertStore();
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<template>
  <div>
    <!-- Main Content -->
    <div
      class="w-full flex-col h-full relative font-urbanist font-light flex min-h-screen"
    >
      <div
        v-if="!isMobile"
        class="w-screen min-h-screen flex items-center justify-center flex-col lg:flex-row relative text-white"
      >
        <router-view v-slot="{ Component }">
          <transition name="page-transition" mode="out-in">
            <component :is="Component" class="w-screen h-full relative" />
          </transition>
        </router-view>
      </div>
      <div v-else class="mobile-not-available">
        <!-- Dark overlay for better readability -->
        <div class="mobile-dark-overlay"></div>

        <div class="mobile-content">
          <!-- Logo Section (same as auth) -->
          <div class="mobile-logo-section">
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

          <!-- Simple Message -->
          <div class="mobile-message">
            <h1 class="mobile-title">
              <span class="modern-gradient-text">Not Available on Mobile</span>
            </h1>
            <p class="mobile-description">
              Please visit us on desktop to access all features.
            </p>
          </div>

          <!-- Simple Social Links -->
          <div class="mobile-social-simple">
            <a
              href="https://x.com/growwithjuice"
              class="social-link-simple"
              target="_blank"
            >
              Twitter
            </a>
            <a
              href="https://juice3.gitbook.io/"
              class="social-link-simple"
              target="_blank"
            >
              Docs
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Container - Completely Separate from Main Layout -->
    <div class="alert-container">
      <Transition name="alert">
        <div
          v-if="alertStore.successMessage"
          class="successMessageWrapper glass-effect"
        >
          <div class="successMessage">
            <font-awesome-icon icon="triangle-exclamation" class="mr-3" />
            <span>{{ alertStore.successMessage }}</span>
          </div>
        </div>
      </Transition>
      <Transition name="alert">
        <div
          v-if="alertStore.errorMessage"
          class="errorMessageWrapper glass-effect"
        >
          <div class="errorMessage">
            <font-awesome-icon class="mr-3" icon="triangle-exclamation" />
            <span> {{ alertStore.errorMessage }}</span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.5s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.alert-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* Page transition effects */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-transition-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
  filter: blur(5px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: scale(1.03);
  filter: blur(5px);
}

.errorMessageWrapper {
  background: rgba(239, 68, 68, 0.15) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(239, 68, 68, 0.3) !important;
  border-radius: 16px !important;
  box-shadow:
    0 8px 32px rgba(239, 68, 68, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.errorMessage {
  @apply w-full px-4 py-3 text-base text-white tracking-wide flex justify-center items-center;
}

.successMessageWrapper {
  background: rgba(34, 197, 94, 0.15) !important;
  backdrop-filter: blur(16px) !important;
  border: 1px solid rgba(34, 197, 94, 0.3) !important;
  border-radius: 16px !important;
  box-shadow:
    0 8px 32px rgba(34, 197, 94, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.successMessage {
  @apply w-full px-4 py-3 text-white flex justify-center items-center;
}

.alert-img {
  height: 50px;
}

.alert-container {
  @apply fixed w-auto z-[10000] top-6 right-6 max-w-md;
}

/* Mobile Not Available Styles */
.mobile-not-available {
  @apply w-full h-screen flex items-center justify-center p-4;
  background-image: url("/juice-background-website.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
}

/* Dark overlay for better readability */
.mobile-dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
  pointer-events: none;
}

.mobile-content {
  @apply w-full flex flex-col items-center justify-center text-center;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

/* Logo Section (same as auth) */
.mobile-logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  space-x: 4;
  margin-bottom: 48px;
}

/* Simple Message */
.mobile-message {
  margin-bottom: 32px;
}

.mobile-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.mobile-description {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Modern Gradient Text (same as auth) */
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

/* Simple Social Links */
.mobile-social-simple {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.social-link-simple {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.social-link-simple:hover {
  color: white;
  border-color: rgba(85, 212, 63, 0.6);
  background: rgba(85, 212, 63, 0.2);
  transform: translateY(-1px);
}

/* Floating Background Orbs */
.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.4;
  animation: float 8s ease-in-out infinite;
  z-index: 1;
}

.orb-1 {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #55d43f, #01a044);
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 180px;
  height: 180px;
  background: linear-gradient(45deg, #7de068, #55d43f);
  top: 65%;
  right: 15%;
  animation-delay: 3s;
}

.orb-3 {
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #01a044, #55d43f);
  bottom: 25%;
  left: 65%;
  animation-delay: 6s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  33% {
    transform: translateY(-30px) rotate(120deg) scale(1.1);
  }
  66% {
    transform: translateY(30px) rotate(240deg) scale(0.9);
  }
}

/* Grid Overlay */
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(85, 212, 63, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(85, 212, 63, 0.08) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.4;
  z-index: 1;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(
    circle,
    rgba(85, 212, 63, 0.3) 0%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(20px);
  animation: logo-glow-pulse 4s ease-in-out infinite;
  z-index: -1;
}

@keyframes logo-glow-pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

/* Enhanced pulse animations for mobile elements */
@keyframes animate-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: animate-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
