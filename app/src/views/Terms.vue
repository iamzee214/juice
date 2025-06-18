<template>
  <div class="w-full min-h-screen relative overflow-y-auto">
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Floating Top Navigation -->
    <div class="floating-nav">
      <div class="nav-content">
        <!-- Logo Section -->
        <div class="nav-logo">
          <div class="relative">
            <img
              class="h-10 w-10 object-contain filter drop-shadow-lg"
              src="/juicebox.png"
              alt="Logo"
            />
          </div>
          <img
            class="h-6 ml-3 w-auto object-contain"
            src="/juicetext.png"
            alt="Juice"
          />
        </div>

        <!-- Navigation Actions -->
        <div class="nav-actions">
          <button @click="goToLogin" class="nav-btn">
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Login
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content mt-6">
      <div class="content-container">
        <!-- Header Section -->
        <div class="header-section">
          <div class="header-card">
            <div class="header-content">
              <div class="header-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div class="header-text">
                <h1 class="header-title">Terms of Service</h1>
                <p class="header-subtitle">
                  Please read these terms carefully before using our service
                </p>
                <div class="header-meta">
                  <span class="meta-item">
                    <svg
                      class="meta-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Last Updated: June 3, 2025
                  </span>
                  <span class="meta-item">
                    <svg
                      class="meta-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1"
                      />
                    </svg>
                    Legal Agreement
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms Content -->
        <div class="terms-content">
          <div class="content-card">
            <div class="content-body">
              <!-- Table of Contents -->
              <div class="toc-section">
                <h3 class="toc-title">Table of Contents</h3>
                <div class="toc-grid">
                  <a href="#acceptance" class="toc-item"
                    >1. Acceptance of Terms</a
                  >
                  <a href="#service-description" class="toc-item"
                    >2. Description of Service</a
                  >
                  <a href="#user-accounts" class="toc-item">3. User Accounts</a>
                  <a href="#payments" class="toc-item"
                    >4. Payments and Subscriptions</a
                  >
                  <a href="#user-conduct" class="toc-item">5. User Conduct</a>
                  <a href="#intellectual-property" class="toc-item"
                    >6. Intellectual Property</a
                  >
                  <a href="#liability" class="toc-item"
                    >7. Limitation of Liability</a
                  >
                  <a href="#termination" class="toc-item">8. Termination</a>
                  <a href="#governing-law" class="toc-item">9. Governing Law</a>
                  <a href="#changes" class="toc-item">10. Changes to Terms</a>
                  <a href="#contact" class="toc-item">11. Contact Us</a>
                </div>
              </div>

              <!-- Terms Sections -->
              <div class="terms-sections">
                <section id="acceptance" class="terms-section">
                  <h2 class="section-title">1. Acceptance of Terms</h2>
                  <div class="section-content">
                    <p>
                      By accessing or using Juice AI, you agree to be bound by
                      these Terms of Service. If you do not agree to these
                      terms, please do not use our service.
                    </p>
                    <div class="highlight-box">
                      <div class="highlight-icon">
                        <svg
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
                      </div>
                      <div>
                        <strong>Important:</strong> By using our service, you
                        acknowledge that you have read, understood, and agree to
                        be bound by these terms.
                      </div>
                    </div>
                  </div>
                </section>

                <section id="service-description" class="terms-section">
                  <h2 class="section-title">2. Description of Service</h2>
                  <div class="section-content">
                    <p>
                      Juice AI provides AI-powered tools to enhance your
                      experience on crypto Twitter through automated
                      interaction, trend analysis, and personalized content
                      creation.
                    </p>
                    <ul class="feature-list">
                      <li class="feature-item">
                        <div class="feature-icon">
                          <svg
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
                        <span>AI-powered automated interactions</span>
                      </li>
                      <li class="feature-item">
                        <div class="feature-icon">
                          <svg
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
                        <span>Real-time trend analysis</span>
                      </li>
                      <li class="feature-item">
                        <div class="feature-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <span>Personalized content creation</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="user-accounts" class="terms-section">
                  <h2 class="section-title">3. User Accounts</h2>
                  <div class="section-content">
                    <p>
                      To use certain features of the Service, you must connect
                      your Solana wallet and Twitter account. You are
                      responsible for safeguarding your wallet and ensuring that
                      all activities conducted through your accounts are
                      authorized.
                    </p>
                    <div class="responsibility-grid">
                      <div class="responsibility-item">
                        <div class="responsibility-icon wallet">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4>Wallet Security</h4>
                          <p>
                            Keep your private keys secure and never share them
                            with anyone
                          </p>
                        </div>
                      </div>
                      <div class="responsibility-item">
                        <div class="responsibility-icon twitter">
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path
                              d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4>Twitter Account</h4>
                          <p>
                            Ensure your Twitter account complies with their
                            terms of service
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="payments" class="terms-section">
                  <h2 class="section-title">4. Payments and Subscriptions</h2>
                  <div class="section-content">
                    <p>
                      Juice AI offers subscription plans that may be purchased
                      with cryptocurrency. All payments are non-refundable
                      unless otherwise specified. We reserve the right to modify
                      our pricing at any time.
                    </p>
                    <div class="payment-info">
                      <div class="payment-item">
                        <div class="payment-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                        </div>
                        <span>Cryptocurrency payments accepted</span>
                      </div>
                      <div class="payment-item">
                        <div class="payment-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            />
                          </svg>
                        </div>
                        <span>All payments are non-refundable</span>
                      </div>
                      <div class="payment-item">
                        <div class="payment-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </div>
                        <span>Pricing subject to change</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="user-conduct" class="terms-section">
                  <h2 class="section-title">5. User Conduct</h2>
                  <div class="section-content">
                    <p>You agree not to use Juice AI to:</p>
                    <ul class="conduct-list">
                      <li class="conduct-item prohibited">
                        <div class="conduct-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            />
                          </svg>
                        </div>
                        <span>Violate any laws or regulations</span>
                      </li>
                      <li class="conduct-item prohibited">
                        <div class="conduct-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            />
                          </svg>
                        </div>
                        <span>Infringe on the rights of others</span>
                      </li>
                      <li class="conduct-item prohibited">
                        <div class="conduct-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            />
                          </svg>
                        </div>
                        <span>Distribute spam or malicious content</span>
                      </li>
                      <li class="conduct-item prohibited">
                        <div class="conduct-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            />
                          </svg>
                        </div>
                        <span>Abuse, harass, or threaten others</span>
                      </li>
                      <li class="conduct-item prohibited">
                        <div class="conduct-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            />
                          </svg>
                        </div>
                        <span>Interfere with the operation of the Service</span>
                      </li>
                      <li class="conduct-item prohibited">
                        <div class="conduct-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            />
                          </svg>
                        </div>
                        <span
                          >Attempt to gain unauthorized access to any part of
                          the Service</span
                        >
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="intellectual-property" class="terms-section">
                  <h2 class="section-title">6. Intellectual Property</h2>
                  <div class="section-content">
                    <p>
                      All content and technology provided by Juice AI is
                      protected by intellectual property laws. You may not copy,
                      modify, distribute, or create derivative works without our
                      express permission.
                    </p>
                  </div>
                </section>

                <section id="liability" class="terms-section">
                  <h2 class="section-title">7. Limitation of Liability</h2>
                  <div class="section-content">
                    <p>
                      Juice AI is provided "as is" without warranties of any
                      kind. In no event shall Juice AI be liable for any direct,
                      indirect, incidental, special, or consequential damages
                      arising from the use of our service.
                    </p>
                    <div class="disclaimer-box">
                      <div class="disclaimer-icon">
                        <svg
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
                      </div>
                      <div>
                        <strong>Disclaimer:</strong> Use of this service is at
                        your own risk. We provide no warranties or guarantees
                        regarding the performance or results of our AI tools.
                      </div>
                    </div>
                  </div>
                </section>

                <section id="termination" class="terms-section">
                  <h2 class="section-title">8. Termination</h2>
                  <div class="section-content">
                    <p>
                      We reserve the right to terminate or suspend your access
                      to Juice AI at our discretion, without notice, for conduct
                      that we believe violates these Terms of Service or is
                      harmful to other users, us, or third parties.
                    </p>
                  </div>
                </section>

                <section id="governing-law" class="terms-section">
                  <h2 class="section-title">9. Governing Law</h2>
                  <div class="section-content">
                    <p>
                      These Terms shall be governed by and construed in
                      accordance with the laws of the jurisdiction in which
                      Juice AI is incorporated, without regard to its conflict
                      of law provisions.
                    </p>
                  </div>
                </section>

                <section id="changes" class="terms-section">
                  <h2 class="section-title">10. Changes to Terms</h2>
                  <div class="section-content">
                    <p>
                      We reserve the right to modify these Terms at any time.
                      Your continued use of Juice AI after any changes indicates
                      your acceptance of the modified Terms.
                    </p>
                  </div>
                </section>

                <section id="contact" class="terms-section">
                  <h2 class="section-title">11. Contact Us</h2>
                  <div class="section-content">
                    <p>
                      If you have any questions about these Terms, please
                      contact us at:
                    </p>
                    <div class="contact-info">
                      <div class="contact-item">
                        <svg
                          class="contact-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>support@Juice.com</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Terms",
  methods: {
    goToLogin() {
      this.$router.push("/auth");
    },
  },
};
</script>

<style scoped>
/* Modern Green/Juice Theme Terms Styles */

/* Ensure proper scrolling */
html,
body {
  overflow-x: hidden;
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}

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

/* Floating Navigation */
.floating-nav {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 50;
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 20px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(85, 212, 63, 0.1);
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
    rgba(85, 212, 63, 0.5),
    transparent
  );
  border-radius: 20px 20px 0 0;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}

.nav-logo {
  display: flex;
  align-items: center;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(85, 212, 63, 0.1);
  border: 1px solid rgba(85, 212, 63, 0.3);
  border-radius: 12px;
  color: #01a044;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-btn:hover {
  background: rgba(85, 212, 63, 0.2);
  border-color: rgba(85, 212, 63, 0.5);
  transform: translateY(-1px);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Main Content */
.main-content {
  padding-top: 100px;
  padding-bottom: 60px;
  min-height: 100vh;
  position: relative;
  z-index: 10;
}

.content-container {
  margin: 0 auto;
  padding: 0px 20px;
}

/* Header Section */
.header-section {
  margin-bottom: 32px;
}

.header-card {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 20px;
  padding: 32px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(85, 212, 63, 0.1);
  position: relative;
}

.header-card::before {
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

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #55d43f, #01a044);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 25px rgba(85, 212, 63, 0.3);
}

.header-icon svg {
  width: 40px;
  height: 40px;
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 36px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.98) !important;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #55d43f 0%, #01a044 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9) !important;
  margin-bottom: 16px;
  line-height: 1.6;
}

.header-meta {
  display: flex;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.95) !important;
  font-size: 14px;
  font-weight: 500;
}

.meta-icon {
  width: 16px;
  height: 16px;
}

/* Terms Content */
.terms-content {
  margin-bottom: 60px;
}

.content-card {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 20px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(85, 212, 63, 0.1);
  position: relative;
}

.content-card::before {
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

.content-body {
  padding: 32px;
}

/* Table of Contents */
.toc-section {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(85, 212, 63, 0.1);
}

.toc-title {
  font-size: 24px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.98) !important;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #55d43f 0%, #01a044 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.toc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.toc-item {
  display: block;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.95) !important;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.toc-item:hover {
  background: rgba(85, 212, 63, 0.15) !important;
  border-color: rgba(85, 212, 63, 0.4) !important;
  transform: translateY(-1px);
}

/* Terms Sections */
.terms-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.terms-section {
  scroll-margin-top: 120px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.98) !important;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #55d43f 0%, #01a044 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-content {
  color: rgba(255, 255, 255, 0.95) !important;
  line-height: 1.7;
  font-size: 16px;
}

.section-content p {
  margin-bottom: 16px;
}

/* Highlight Boxes */
.highlight-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 12px;
  margin-top: 16px;
  color: #eab308;
}

.highlight-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.highlight-icon svg {
  width: 100%;
  height: 100%;
}

/* Feature Lists */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(85, 212, 63, 0.1);
  border: 1px solid rgba(85, 212, 63, 0.3);
  border-radius: 12px;
  color: #01a044;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(85, 212, 63, 0.15);
  transform: translateY(-1px);
}

.feature-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.feature-icon svg {
  width: 100%;
  height: 100%;
}

/* Responsibility Grid */
.responsibility-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.responsibility-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.responsibility-item:hover {
  background: rgba(85, 212, 63, 0.15) !important;
  border-color: rgba(85, 212, 63, 0.4) !important;
  transform: translateY(-2px);
}

.responsibility-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.responsibility-icon.wallet {
  background: linear-gradient(135deg, #55d43f, #01a044);
  color: white;
}

.responsibility-icon.twitter {
  background: linear-gradient(135deg, #1da1f2, #0d8bd9);
  color: white;
}

.responsibility-icon svg {
  width: 24px;
  height: 24px;
}

.responsibility-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.98) !important;
  margin-bottom: 4px;
}

.responsibility-item p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9) !important;
  line-height: 1.5;
}

/* Payment Info */
.payment-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.95) !important;
  transition: all 0.3s ease;
}

.payment-item:hover {
  background: rgba(85, 212, 63, 0.15) !important;
  border-color: rgba(85, 212, 63, 0.4) !important;
  transform: translateY(-1px);
}

.payment-icon {
  width: 24px;
  height: 24px;
  color: #55d43f;
  flex-shrink: 0;
}

.payment-icon svg {
  width: 100%;
  height: 100%;
}

/* Conduct Lists */
.conduct-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.conduct-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.conduct-item.prohibited {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.conduct-item.prohibited:hover {
  background: rgba(239, 68, 68, 0.15);
  transform: translateY(-1px);
}

.conduct-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.conduct-icon svg {
  width: 100%;
  height: 100%;
}

/* Disclaimer Box */
.disclaimer-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  margin-top: 16px;
  color: #f87171;
}

.disclaimer-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.disclaimer-icon svg {
  width: 100%;
  height: 100%;
}

/* Contact Info */
.contact-info {
  margin-top: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(85, 212, 63, 0.1);
  border: 1px solid rgba(85, 212, 63, 0.3);
  border-radius: 12px;
  color: #01a044;
  font-weight: 500;
}

.contact-icon {
  width: 20px;
  height: 20px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .floating-nav {
    top: 16px;
    left: 16px;
    right: 16px;
  }

  .main-content {
    padding-top: 80px;
    padding-bottom: 40px;
  }

  .content-container {
    padding: 0 16px;
  }

  .header-card,
  .content-body {
    padding: 24px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .header-title {
    font-size: 28px;
  }

  .toc-grid {
    grid-template-columns: 1fr;
  }

  .responsibility-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .floating-nav {
    top: 12px;
    left: 12px;
    right: 12px;
  }

  .nav-content {
    padding: 12px 16px;
  }

  .nav-btn span {
    display: none;
  }

  .main-content {
    padding-top: 70px;
    padding-bottom: 40px;
  }

  .content-container {
    padding: 0 12px;
  }

  .header-card,
  .content-body {
    padding: 20px;
  }

  .header-title {
    font-size: 24px;
  }

  .header-subtitle {
    font-size: 16px;
  }

  .header-meta {
    flex-direction: column;
    gap: 12px;
  }

  .section-title {
    font-size: 20px;
  }

  .responsibility-item {
    padding: 16px;
  }
}
</style>
