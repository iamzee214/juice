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
            <div
              class="absolute inset-0 bg-juice-green/20 rounded-full blur-xl animate-pulse"
            ></div>
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
    <div class="main-content">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div class="header-text">
                <h1 class="header-title">Privacy Policy</h1>
                <p class="header-subtitle">
                  Your privacy and data protection are our top priorities
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Legal Document
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Content -->
        <div class="privacy-content mt-6">
          <div class="content-card">
            <div class="content-body">
              <!-- Table of Contents -->
              <div class="toc-section">
                <h3 class="toc-title">Table of Contents</h3>
                <div class="toc-grid">
                  <a href="#introduction" class="toc-item">1. Introduction</a>
                  <a href="#information-collection" class="toc-item"
                    >2. Information We Collect</a
                  >
                  <a href="#information-usage" class="toc-item"
                    >3. How We Use Your Information</a
                  >
                  <a href="#information-sharing" class="toc-item"
                    >4. Information Sharing</a
                  >
                  <a href="#data-security" class="toc-item">5. Data Security</a>
                  <a href="#your-rights" class="toc-item"
                    >6. Your Rights and Choices</a
                  >
                  <a href="#cookies" class="toc-item"
                    >7. Cookies and Similar Technologies</a
                  >
                  <a href="#international-transfers" class="toc-item"
                    >8. International Data Transfers</a
                  >
                  <a href="#children-privacy" class="toc-item"
                    >9. Children's Privacy</a
                  >
                  <a href="#policy-changes" class="toc-item"
                    >10. Changes to This Privacy Policy</a
                  >
                  <a href="#contact" class="toc-item">11. Contact Us</a>
                </div>
              </div>

              <!-- Privacy Sections -->
              <div class="privacy-sections">
                <section id="introduction" class="privacy-section">
                  <h2 class="section-title">1. Introduction</h2>
                  <div class="section-content">
                    <p>
                      Juice AI ("we", "our", or "us") is committed to protecting
                      your privacy. This Privacy Policy explains how we collect,
                      use, and share your personal information when you use our
                      service.
                    </p>
                  </div>
                </section>

                <section id="information-collection" class="privacy-section">
                  <h2 class="section-title">2. Information We Collect</h2>
                  <div class="section-content">
                    <p>
                      We collect information that you provide directly to us,
                      including:
                    </p>
                    <ul class="info-list">
                      <li class="info-item">
                        <div class="item-icon">
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
                        <span
                          >Wallet address and public blockchain
                          information</span
                        >
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg fill="currentColor" viewBox="0 0 24 24">
                            <path
                              d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                            />
                          </svg>
                        </div>
                        <span
                          >Twitter account information (when you connect your
                          account)</span
                        >
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
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
                        <span>Communication preferences and settings</span>
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
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
                        <span
                          >Information about your interactions with our
                          service</span
                        >
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
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
                        </div>
                        <span>Customer support communications</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="information-usage" class="privacy-section">
                  <h2 class="section-title">3. How We Use Your Information</h2>
                  <div class="section-content">
                    <p>We use the information we collect to:</p>
                    <ul class="info-list">
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
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
                        <span>Provide, maintain, and improve our services</span>
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        </div>
                        <span
                          >Process transactions and manage your account</span
                        >
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span
                          >Send you technical notices and support messages</span
                        >
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
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
                        </div>
                        <span>Respond to your comments and questions</span>
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
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
                        <span>Develop new products and services</span>
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
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
                        <span>Monitor and analyze trends and usage</span>
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
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
                        <span
                          >Prevent fraudulent transactions and monitor for
                          suspicious activities</span
                        >
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
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
                        <span>Personalize and improve your experience</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <!-- Continue with remaining sections... -->
                <section id="information-sharing" class="privacy-section">
                  <h2 class="section-title">4. Information Sharing</h2>
                  <div class="section-content">
                    <p>
                      We do not sell your personal information. We may share
                      your information with:
                    </p>
                    <ul class="info-list">
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <span
                          >Service providers who perform services on our
                          behalf</span
                        >
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 9l3 3-3 3m13 0h-6m-2-5a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <span
                          >Third-party APIs necessary for service
                          functionality</span
                        >
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
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
                        </div>
                        <span>Legal authorities when required by law</span>
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                            />
                          </svg>
                        </div>
                        <span>Business partners with your consent</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <!-- Add remaining sections with similar structure -->
                <section id="data-security" class="privacy-section">
                  <h2 class="section-title">5. Data Security</h2>
                  <div class="section-content">
                    <p>
                      We implement appropriate security measures to protect your
                      personal information. However, no method of transmission
                      over the Internet or electronic storage is 100% secure. We
                      cannot guarantee absolute security of your data.
                    </p>
                  </div>
                </section>

                <section id="your-rights" class="privacy-section">
                  <h2 class="section-title">6. Your Rights and Choices</h2>
                  <div class="section-content">
                    <p>
                      Depending on your location, you may have certain rights
                      regarding your personal information, including:
                    </p>
                    <ul class="info-list">
                      <li class="info-item">
                        <div class="item-icon">
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
                        <span>Accessing and updating your information</span>
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </div>
                        <span>Deleting your account and associated data</span>
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
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
                          >Restricting or objecting to certain processing</span
                        >
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                        </div>
                        <span>Data portability</span>
                      </li>
                      <li class="info-item">
                        <div class="item-icon">
                          <svg
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
                        <span>Withdrawing consent</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <!-- Continue with remaining sections -->
                <section id="cookies" class="privacy-section">
                  <h2 class="section-title">
                    7. Cookies and Similar Technologies
                  </h2>
                  <div class="section-content">
                    <p>
                      We use cookies and similar technologies to collect
                      information about your activity, browser, and device. You
                      can manage your cookie preferences through your browser
                      settings.
                    </p>
                  </div>
                </section>

                <section id="international-transfers" class="privacy-section">
                  <h2 class="section-title">8. International Data Transfers</h2>
                  <div class="section-content">
                    <p>
                      Your information may be transferred to and processed in
                      countries other than your country of residence. These
                      countries may have different data protection laws.
                    </p>
                  </div>
                </section>

                <section id="children-privacy" class="privacy-section">
                  <h2 class="section-title">9. Children's Privacy</h2>
                  <div class="section-content">
                    <p>
                      Our service is not directed to children under 18. We do
                      not knowingly collect information from children under 18.
                      If we learn we have collected information from a child
                      under 18, we will delete that information.
                    </p>
                  </div>
                </section>

                <section id="policy-changes" class="privacy-section">
                  <h2 class="section-title">
                    10. Changes to This Privacy Policy
                  </h2>
                  <div class="section-content">
                    <p>
                      We may update this Privacy Policy from time to time. We
                      will notify you of any changes by posting the new Privacy
                      Policy on this page and updating the "Last Updated" date.
                    </p>
                  </div>
                </section>

                <section id="contact" class="privacy-section">
                  <h2 class="section-title">11. Contact Us</h2>
                  <div class="section-content">
                    <p>
                      If you have any questions about this Privacy Policy,
                      please contact us at:
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
                        <span>privacy@Juice.com</span>
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
  name: "Privacy",
  methods: {
    goToLogin() {
      this.$router.push("/auth");
    },
  },
};
</script>

<style scoped>
/* Modern Green/Juice Theme Privacy Styles */

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
  padding: 20px 20px;
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
  color: #01a044;
  font-size: 14px;
  font-weight: 500;
}

.meta-icon {
  width: 16px;
  height: 16px;
}

/* Privacy Content */
.privacy-content {
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
  color: #01a044;
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
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(85, 212, 63, 0.2);
  border-radius: 12px;
  color: #01a044;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.toc-item:hover {
  background: rgba(85, 212, 63, 0.1);
  border-color: rgba(85, 212, 63, 0.4);
  transform: translateY(-1px);
}

/* Privacy Sections */
.privacy-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.privacy-section {
  scroll-margin-top: 120px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #01a044;
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

/* Info Lists */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(85, 212, 63, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(85, 212, 63, 0.1);
  border-color: rgba(85, 212, 63, 0.4);
  transform: translateY(-1px);
}

.item-icon {
  width: 24px;
  height: 24px;
  color: #55d43f;
  flex-shrink: 0;
  margin-top: 2px;
}

.item-icon svg {
  width: 100%;
  height: 100%;
}

.info-item span {
  color: rgba(255, 255, 255, 0.95) !important;
  font-size: 15px;
  line-height: 1.6;
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

  .info-item {
    padding: 12px;
  }
}
</style>
