<template>
  <div class="profile-page">
    <PageHeader
      title="Profile"
      subtitle="Manage your account and preferences"
    />
    <div class="market-container profile-container">
      <!-- Sidebar Navigation -->
      <aside class="profile-sidebar">
        <div class="profile-header">
          <div class="avatar-section">
            <div class="user-avatar" @click="showProfileEditModal">
              <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="Profile Avatar">
              <div v-else class="avatar-placeholder">
                <i class="fas fa-user"></i>
              </div>
              <div class="avatar-edit-overlay">
                <i class="fas fa-camera"></i>
              </div>
            </div>
            <div class="user-info">
              <h3 class="user-name">{{ userProfile.name || 'Beauty Enthusiast' }}</h3>
              <p class="user-email">{{ userProfile.email || 'user@example.com' }}</p>
              <div class="member-badge">
                <i class="fas fa-crown"></i>
                <span>Premium Member</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav class="profile-navigation">
          <a 
            v-for="item in navigationItems" 
            :key="item.id"
            @click="activeSection = item.id"
            :class="['nav-item', { active: activeSection === item.id }]"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
            <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </a>
        </nav>
        
      </aside>

      <!-- Main Content Area -->
      <main class="profile-content">
        <!-- Personal Feed Section -->
        <div v-if="activeSection === 'feed'" class="content-section">
          <!-- Profile Update Section -->
          <div class="profile-update-section">
            <div class="update-header">
              <h2 class="update-title">
                <i class="fas fa-user-edit"></i>
                Profile Information
              </h2>
              <button @click="showProfileEditModal" class="btn-edit-profile">
                <i class="fas fa-edit"></i>
                Edit Profile
              </button>
            </div>

            <div class="profile-summary">
              <div class="summary-item">
                <span class="summary-label">Name:</span>
                <span class="summary-value">{{ userProfile.name || 'Not set' }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Email:</span>
                <span class="summary-value">{{ userProfile.email || 'Not set' }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Phone Number:</span>
                <span class="summary-value">{{ userProfile.phone || '9775637590' }}</span>
              </div>
            </div>
          </div>

          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-star"></i>
              Your Personalized Feed
            </h2>
            <p class="section-description">
              Curated products based on your preferences, skin profile, and purchase history
            </p>
          </div>
          
          <!-- AI Recommendations -->
          <div class="feed-section">
            <h3 class="feed-section-title">
              <i class="fas fa-magic"></i>
              AI-Powered Recommendations
            </h3>
            <div class="products-grid">
              <ProductCard 
                v-for="product in personalizedRecommendations" 
                :key="product.id"
                :product="product"
                :show-reason="true"
              />
            </div>
          </div>

          <!-- Recently Viewed -->
          <div class="feed-section" v-if="recentlyViewedItems.length">
            <h3 class="feed-section-title">
              <i class="fas fa-clock"></i>
              Recently Viewed
            </h3>
            <div class="recently-viewed-carousel">
              <div 
                v-for="item in recentlyViewedItems.slice(0, 6)" 
                :key="item.id"
                class="recently-viewed-item"
                @click="$router.push(`/product/${item.id}`)"
              >
                <img :src="item.image" :alt="item.name">
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <p class="price">${{ item.price }}</p>
                  <span class="viewed-time">{{ formatViewTime(item.viewedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Customer Support Section -->
        <div v-if="activeSection === 'customer-support'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-headset"></i>
              Customer Support
            </h2>
            <p class="section-description">
              Get help with your beauty questions, orders, and account issues
            </p>
          </div>

          <div class="support-options">
            <div class="support-card" @click="activeSection = 'faq-help'">
              <div class="support-icon">
                <i class="fas fa-question-circle"></i>
              </div>
              <div class="support-content">
                <h3>FAQ & Help Center</h3>
                <p>Find quick answers to common questions about beauty products, orders, and more</p>
                <div class="support-stats">
                  <span>📚 50+ Articles</span>
                  <span>⚡ Instant Search</span>
                </div>
              </div>
              <i class="fas fa-chevron-right support-arrow"></i>
            </div>

            <div class="support-card" @click="activeSection = 'ticketing'">
              <div class="support-icon">
                <i class="fas fa-ticket-alt"></i>
              </div>
              <div class="support-content">
                <h3>Submit a Ticket</h3>
                <p>Need personalized help? Create a support ticket and our beauty experts will assist you</p>
                <div class="support-stats">
                  <span>🎫 Track Status</span>
                  <span>📎 Attach Images</span>
                </div>
              </div>
              <i class="fas fa-chevron-right support-arrow"></i>
            </div>

          </div>

        </div>

        <!-- Notifications Section -->
        <div v-if="activeSection === 'notifications'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-bell"></i>
              Notifications
            </h2>
          </div>
          
          <div class="notifications-container">
            <!-- Notification Settings -->
            <div class="notification-settings">
              <h3>Notification Preferences</h3>
              <div class="setting-group">
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.orderUpdates"
                      @change="updateNotificationSettings"
                    >
                    <span class="checkmark"></span>
                    Order Updates
                  </label>
                  <p class="setting-description">Get notified about order status changes</p>
                </div>
                
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.promotions"
                      @change="updateNotificationSettings"
                    >
                    <span class="checkmark"></span>
                    Promotions & Offers
                  </label>
                  <p class="setting-description">Receive exclusive deals and discounts</p>
                </div>
                
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.newProducts"
                      @change="updateNotificationSettings"
                    >
                    <span class="checkmark"></span>
                    New Product Launches
                  </label>
                  <p class="setting-description">Be first to know about new arrivals</p>
                </div>
                
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      type="checkbox" 
                      v-model="notificationSettings.stockAlerts"
                      @change="updateNotificationSettings"
                    >
                    <span class="checkmark"></span>
                    Stock Alerts
                  </label>
                  <p class="setting-description">Get notified when wishlist items are back in stock</p>
                </div>
              </div>
            </div>

            <!-- Recent Notifications -->
            <div class="recent-notifications">
              <h3>Recent Notifications</h3>
              <div class="notification-list">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  :class="['notification-item', notification.type, { unread: !notification.read }]"
                >
                  <div class="notification-icon">
                    <i :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <h4>{{ notification.title }}</h4>
                    <p>{{ notification.message }}</p>
                    <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
                  </div>
                  <button 
                    v-if="!notification.read"
                    @click="markAsRead(notification.id)"
                    class="mark-read-btn"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Language Settings -->
        <div v-if="activeSection === 'language'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-globe"></i>
              Language & Region
            </h2>
          </div>
          
          <div class="language-settings">
            <div class="setting-group">
              <h3>Language Preference</h3>
              <div class="language-options">
                <div 
                  v-for="language in availableLanguages" 
                  :key="language.code"
                  :class="['language-option', { active: selectedLanguage === language.code }]"
                  @click="changeLanguage(language.code)"
                >
                  <div class="language-flag">
                    <img :src="language.flag" :alt="language.name">
                  </div>
                  <div class="language-info">
                    <h4>{{ language.name }}</h4>
                    <p>{{ language.nativeName }}</p>
                  </div>
                  <div class="language-check" v-if="selectedLanguage === language.code">
                    <i class="fas fa-check"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="setting-group">
              <h3>Currency & Region</h3>
              <div class="form-group">
                <label>Currency</label>
                <select v-model="selectedCurrency" @change="updateCurrency" class="form-select">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Country/Region</label>
                <select v-model="selectedCountry" @change="updateCountry" class="form-select">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy & Terms -->
        <div v-if="activeSection === 'privacy'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-shield-alt"></i>
              Privacy & Terms
            </h2>
          </div>
          
          <div class="privacy-content">
            <div class="privacy-section">
              <h3>Data & Privacy Controls</h3>
              <div class="privacy-controls">
                <div class="control-item">
                  <div class="control-info">
                    <h4>Personalization</h4>
                    <p>Allow us to personalize your experience based on your activity</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="privacySettings.personalization">
                    <span class="slider"></span>
                  </label>
                </div>
                
                <div class="control-item">
                  <div class="control-info">
                    <h4>Analytics</h4>
                    <p>Help us improve our service by sharing anonymous usage data</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="privacySettings.analytics">
                    <span class="slider"></span>
                  </label>
                </div>
                
                <div class="control-item">
                  <div class="control-info">
                    <h4>Marketing Communications</h4>
                    <p>Receive personalized marketing emails and recommendations</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="privacySettings.marketing">
                    <span class="slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="legal-links">
              <h3>Legal Information</h3>
              <div class="link-grid">
                <a href="/privacy-policy" class="legal-link">
                  <i class="fas fa-file-alt"></i>
                  <span>Privacy Policy</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="/terms-of-service" class="legal-link">
                  <i class="fas fa-gavel"></i>
                  <span>Terms of Service</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="/cookie-policy" class="legal-link">
                  <i class="fas fa-cookie-bite"></i>
                  <span>Cookie Policy</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="/data-request" class="legal-link">
                  <i class="fas fa-download"></i>
                  <span>Download My Data</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Deletion -->
        <div v-if="activeSection === 'account-deletion'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-user-times"></i>
              Account Deletion
            </h2>
          </div>
          
          <div class="deletion-content">
            <div class="warning-card">
              <div class="warning-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="warning-text">
                <h3>This action cannot be undone</h3>
                <p>Deleting your account will permanently remove all your data, including:</p>
                <ul>
                  <li>Order history and tracking information</li>
                  <li>Saved addresses and payment methods</li>
                  <li>Wishlist and recently viewed items</li>
                  <li>Beauty profile and quiz results</li>
                  <li>Reviews and ratings</li>
                </ul>
              </div>
            </div>
            
            <div class="deletion-form" v-if="!deletionRequested">
              <h3>Request Account Deletion</h3>
              <form @submit.prevent="requestAccountDeletion">
                <div class="form-group">
                  <label>Reason for leaving (optional)</label>
                  <select v-model="deletionReason" class="form-select">
                    <option value="">Select a reason</option>
                    <option value="privacy">Privacy concerns</option>
                    <option value="not-useful">Not useful anymore</option>
                    <option value="too-many-emails">Too many emails</option>
                    <option value="found-alternative">Found an alternative</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div class="form-group" v-if="deletionReason === 'other'">
                  <label>Please specify</label>
                  <textarea 
                    v-model="deletionComment" 
                    class="form-textarea"
                    placeholder="Tell us more about your reason for leaving..."
                  ></textarea>
                </div>
                
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="confirmDeletion" required>
                    <span class="checkmark"></span>
                    I understand that this action cannot be undone
                  </label>
                </div>
                
                <div class="form-actions">
                  <button type="button" @click="activeSection = 'feed'" class="btn btn-outline">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-danger"
                    :disabled="!confirmDeletion"
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            </div>
            
            <div class="deletion-requested" v-else>
              <div class="success-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <h3>Deletion Request Submitted</h3>
              <p>We've received your account deletion request. Your account will be deleted within 30 days. You can cancel this request anytime before the deletion date.</p>
              <button @click="cancelDeletionRequest" class="btn btn-primary">
                Cancel Deletion Request
              </button>
            </div>
          </div>
        </div>

        <!-- Refund History -->
        <div v-if="activeSection === 'refunds'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-money-bill-wave"></i>
              Refund History
            </h2>
          </div>
          
          <div class="refunds-container">
            <div class="refunds-summary">
              <div class="summary-card">
                <h3>Total Refunds</h3>
                <div class="summary-value">${{ totalRefunds }}</div>
              </div>
              <div class="summary-card">
                <h3>This Year</h3>
                <div class="summary-value">${{ yearlyRefunds }}</div>
              </div>
              <div class="summary-card">
                <h3>Pending</h3>
                <div class="summary-value">${{ pendingRefunds }}</div>
              </div>
            </div>
            
            <div class="refunds-list">
              <div 
                v-for="refund in refundHistory" 
                :key="refund.id"
                class="refund-item"
              >
                <div class="refund-header">
                  <div class="refund-info">
                    <h4>Order #{{ refund.orderId }}</h4>
                    <span class="refund-date">{{ formatDate(refund.date) }}</span>
                  </div>
                  <div class="refund-amount">${{ refund.amount }}</div>
                  <div :class="['refund-status', refund.status.toLowerCase()]">
                    {{ refund.status }}
                  </div>
                </div>
                
                <div class="refund-details">
                  <p><strong>Reason:</strong> {{ refund.reason }}</p>
                  <p><strong>Method:</strong> {{ refund.method }}</p>
                  <p v-if="refund.notes"><strong>Notes:</strong> {{ refund.notes }}</p>
                </div>
                
                <div class="refund-actions">
                  <button @click="viewRefundDetails(refund)" class="btn btn-outline btn-sm">
                    View Details
                  </button>
                  <button 
                    v-if="refund.status === 'Pending'"
                    @click="contactSupport(refund)"
                    class="btn btn-outline btn-sm"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ & Help Center Section -->
        <div v-if="activeSection === 'faq-help'" class="content-section">
          <div v-if="!selectedQuestion" class="section-header">
            <button @click="activeSection = 'customer-support'" class="back-btn">
              <i class="fas fa-arrow-left"></i>
              Back to Support
            </button>
            <h2 class="section-title">
              <i class="fas fa-question-circle"></i>
              FAQ & Help Center
            </h2>
            <p class="section-description">
              Find answers to your beauty and shopping questions
            </p>
          </div>

          <div v-if="!selectedQuestion" class="faq-search">
            <div class="search-container">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="faqSearchQuery"
                type="text"
                placeholder="Search for help articles..."
                class="search-input"
              >
              <div v-if="faqSearchQuery" class="search-clear" @click="faqSearchQuery = ''">
                <i class="fas fa-times"></i>
              </div>
            </div>
          </div>

          <div v-if="!faqSearchQuery && !selectedFAQCategory && !selectedQuestion" class="faq-categories">
            <div
              v-for="category in faqCategories"
              :key="category.id"
              class="faq-category-card"
              @click="selectedFAQCategory = category.id"
            >
              <div class="category-header">
                <div class="category-icon" :style="{ backgroundColor: category.color }">
                  <i :class="category.icon"></i>
                </div>
                <div class="category-info">
                  <h3>{{ category.title }}</h3>
                  <p>{{ category.questions.length }} articles</p>
                </div>
                <i class="fas fa-chevron-right"></i>
              </div>

              <div class="category-preview">
                <div
                  v-for="question in category.questions.slice(0, 3)"
                  :key="question.id"
                  class="preview-question"
                  :class="{ 'expanded': question.expanded }"
                  @click="selectIndividualQuestion(question)"
                >
                  <div class="question-text">
                    <span>{{ question.question }}</span>
                    <i class="fas fa-chevron-down expansion-icon" :class="{ 'rotated': question.expanded }"></i>
                  </div>
                  <div v-if="question.expanded" class="question-answer">
                    <p>{{ question.answer }}</p>
                    <div class="faq-actions">
                      <span class="helpful-text">Was this helpful?</span>
                      <button
                        @click.stop="markFAQHelpful(question.id, true)"
                        class="helpful-btn"
                        :class="{ active: question.helpful === true }"
                      >
                        <i class="fas fa-thumbs-up"></i>
                      </button>
                      <button
                        @click.stop="markFAQHelpful(question.id, false)"
                        class="helpful-btn"
                        :class="{ active: question.helpful === false }"
                      >
                        <i class="fas fa-thumbs-down"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Individual Question -->
          <div v-else-if="selectedQuestion" class="faq-single-question">
            <div class="question-header-back">
              <button @click="goBackFromQuestion()" class="back-btn">
                <i class="fas fa-arrow-left"></i>
                Back
              </button>
            </div>

            <div class="single-question-content">
              <h3>{{ selectedQuestion.categoryTitle }}</h3>
              <div class="faq-question-item">
                <div class="question-header">
                  <h4>{{ selectedQuestion.question }}</h4>
                </div>
                <div class="question-answer">
                  <p>{{ selectedQuestion.answer }}</p>
                  <div class="faq-actions">
                    <span class="helpful-text">Was this helpful?</span>
                    <button
                      @click="markFAQHelpful(selectedQuestion.id, true)"
                      class="helpful-btn"
                      :class="{ active: selectedQuestion.helpful === true }"
                    >
                      <i class="fas fa-thumbs-up"></i>
                    </button>
                    <button
                      @click="markFAQHelpful(selectedQuestion.id, false)"
                      class="helpful-btn"
                      :class="{ active: selectedQuestion.helpful === false }"
                    >
                      <i class="fas fa-thumbs-down"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Category Questions -->
          <div v-else-if="selectedFAQCategory && !faqSearchQuery" class="faq-category-questions">
            <div class="category-header-back">
              <button @click="selectedFAQCategory = null" class="back-btn">
                <i class="fas fa-arrow-left"></i>
                Back
              </button>
              <h3>{{ getSelectedCategoryTitle() }}</h3>
            </div>

            <div class="questions-list">
              <div
                v-for="question in getSelectedCategoryQuestions()"
                :key="question.id"
                class="faq-question-item"
                @click="selectIndividualQuestion(question)"
              >
                <div class="question-header">
                  <h4>{{ question.question }}</h4>
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Search Results -->
          <div v-else-if="faqSearchQuery" class="faq-search-results">
            <h3>Search Results for "{{ faqSearchQuery }}"</h3>
            <div
              v-for="result in filteredFAQResults"
              :key="result.id"
              class="faq-result-item"
            >
              <div class="result-header">
                <h4>{{ result.question }}</h4>
              </div>
              <div class="result-answer">
                <p>{{ result.answer }}</p>
                <div class="faq-actions">
                  <span class="helpful-text">Was this helpful?</span>
                  <button
                    @click="markFAQHelpful(result.id, true)"
                    class="helpful-btn"
                    :class="{ active: result.helpful === true }"
                  >
                    <i class="fas fa-thumbs-up"></i>
                  </button>
                  <button
                    @click="markFAQHelpful(result.id, false)"
                    class="helpful-btn"
                    :class="{ active: result.helpful === false }"
                  >
                    <i class="fas fa-thumbs-down"></i>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="filteredFAQResults.length === 0" class="no-results">
              <i class="fas fa-search"></i>
              <h4>No results found</h4>
              <p>Try different keywords or browse our categories</p>
              <button @click="faqSearchQuery = ''" class="btn btn-outline">
                Browse Categories
              </button>
            </div>
          </div>

          <div v-if="!selectedQuestion" class="contact-support-card">
            <div class="contact-icon">
              <i class="fas fa-headset"></i>
            </div>
            <div class="contact-content">
              <h3>Still need help?</h3>
              <p>Can't find what you're looking for? Our beauty experts are here to help!</p>
            </div>
            <button @click="activeSection = 'ticketing'" class="btn btn-primary">
              Contact Support
            </button>
          </div>
        </div>

        <!-- Ticketing Section -->
        <div v-if="activeSection === 'ticketing'" class="content-section">
          <div class="section-header">
            <button @click="activeSection = 'customer-support'" class="back-btn">
              <i class="fas fa-arrow-left"></i>
              Back to Support
            </button>
            <h2 class="section-title">
              <i class="fas fa-ticket-alt"></i>
              Support Tickets
            </h2>
            <p class="section-description">
              Create and track your support requests
            </p>
          </div>

          <div class="ticket-tabs">
            <button
              @click="activeTicketTab = 'create'"
              :class="['ticket-tab', { active: activeTicketTab === 'create' }]"
            >
              <i class="fas fa-plus"></i>
              Create Ticket
            </button>
            <button
              @click="activeTicketTab = 'existing'"
              :class="['ticket-tab', { active: activeTicketTab === 'existing' }]"
            >
              <i class="fas fa-list"></i>
              My Tickets
              <span v-if="existingTickets.length" class="tab-badge">{{ existingTickets.length }}</span>
            </button>
          </div>

          <!-- Create Ticket -->
          <div v-if="activeTicketTab === 'create'" class="ticket-form">
            <div class="form-steps">
              <div :class="['step', { active: currentTicketStep >= 1, completed: currentTicketStep > 1 }]">
                <div class="step-number">1</div>
                <span>Issue Details</span>
              </div>
              <div :class="['step', { active: currentTicketStep >= 2, completed: currentTicketStep > 2 }]">
                <div class="step-number">2</div>
                <span>Attachments</span>
              </div>
              <div :class="['step', { active: currentTicketStep >= 3 }]">
                <div class="step-number">3</div>
                <span>Submit</span>
              </div>
            </div>

            <!-- Step 1: Issue Details -->
            <div v-if="currentTicketStep === 1" class="ticket-step">
              <h3>Tell us about your issue</h3>

              <div class="form-group">
                <label>Issue Type</label>
                <select v-model="newTicket.issueType" class="form-select" required>
                  <option value="">Select an issue type</option>
                  <option value="order">Order & Shipping</option>
                  <option value="product">Product Questions</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="account">Account Issues</option>
                  <option value="technical">Technical Problems</option>
                  <option value="beauty-advice">Beauty Advice</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label>Subject</label>
                <input
                  v-model="newTicket.subject"
                  type="text"
                  placeholder="Brief description of your issue"
                  class="form-input"
                  required
                >
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea
                  v-model="newTicket.description"
                  placeholder="Please provide detailed information about your issue..."
                  class="form-textarea"
                  rows="6"
                  required
                ></textarea>
              </div>

              <div class="form-group">
                <label>Priority</label>
                <div class="priority-options">
                  <div
                    v-for="priority in priorityOptions"
                    :key="priority.value"
                    :class="['priority-option', priority.value, { selected: newTicket.priority === priority.value }]"
                    @click="newTicket.priority = priority.value"
                  >
                    <div class="priority-indicator"></div>
                    <div class="priority-text">
                      <strong>{{ priority.label }}</strong>
                      <span>{{ priority.description }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                @click="nextTicketStep"
                class="btn btn-primary"
                :disabled="!newTicket.issueType || !newTicket.subject || !newTicket.description"
              >
                Next: Add Attachments
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>

            <!-- Step 2: Attachments -->
            <div v-if="currentTicketStep === 2" class="ticket-step">
              <h3>Attach files (optional)</h3>
              <p>Add screenshots, photos, or documents that help explain your issue</p>

              <div class="file-upload-area" @click="$refs.fileInput.click()">
                <div class="upload-content">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <h4>Drop files here or click to browse</h4>
                  <p>PNG, JPG, PDF files up to 10MB each</p>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.gif"
                  @change="handleFileUpload"
                  style="display: none"
                >
              </div>

              <div v-if="newTicket.attachments.length" class="attached-files">
                <h4>Attached Files</h4>
                <div
                  v-for="(file, index) in newTicket.attachments"
                  :key="index"
                  class="attached-file"
                >
                  <div class="file-icon">
                    <i :class="getFileIcon(file.type)"></i>
                  </div>
                  <div class="file-info">
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size">{{ formatFileSize(file.size) }}</span>
                  </div>
                  <button @click="removeAttachment(index)" class="remove-file">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <div class="step-actions">
                <button @click="currentTicketStep = 1" class="btn btn-outline">
                  <i class="fas fa-arrow-left"></i>
                  Back
                </button>
                <button @click="nextTicketStep" class="btn btn-primary">
                  Next: Review & Submit
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- Step 3: Review & Submit -->
            <div v-if="currentTicketStep === 3" class="ticket-step">
              <h3>Review your ticket</h3>

              <div class="ticket-review">
                <div class="review-section">
                  <h4>Issue Details</h4>
                  <div class="review-item">
                    <strong>Type:</strong> {{ getIssueTypeLabel(newTicket.issueType) }}
                  </div>
                  <div class="review-item">
                    <strong>Subject:</strong> {{ newTicket.subject }}
                  </div>
                  <div class="review-item">
                    <strong>Priority:</strong>
                    <span :class="['priority-badge', newTicket.priority]">
                      {{ getPriorityLabel(newTicket.priority) }}
                    </span>
                  </div>
                  <div class="review-item">
                    <strong>Description:</strong>
                    <p>{{ newTicket.description }}</p>
                  </div>
                </div>

                <div v-if="newTicket.attachments.length" class="review-section">
                  <h4>Attachments ({{ newTicket.attachments.length }})</h4>
                  <div class="attachment-list">
                    <div
                      v-for="file in newTicket.attachments"
                      :key="file.name"
                      class="attachment-item"
                    >
                      <i :class="getFileIcon(file.type)"></i>
                      <span>{{ file.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="step-actions">
                <button @click="currentTicketStep = 2" class="btn btn-outline">
                  <i class="fas fa-arrow-left"></i>
                  Back
                </button>
                <button @click="submitTicket" class="btn btn-primary" :disabled="submittingTicket">
                  <i v-if="!submittingTicket" class="fas fa-paper-plane"></i>
                  <i v-else class="fas fa-spinner fa-spin"></i>
                  {{ submittingTicket ? 'Submitting...' : 'Submit Ticket' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Existing Tickets -->
          <div v-if="activeTicketTab === 'existing'" class="existing-tickets">
            <div v-if="existingTickets.length === 0" class="empty-state">
              <i class="fas fa-ticket-alt"></i>
              <h3>No tickets yet</h3>
              <p>You haven't created any support tickets. Need help?</p>
              <button @click="activeTicketTab = 'create'" class="btn btn-primary">
                Create Your First Ticket
              </button>
            </div>

            <div v-else class="tickets-list">
              <div
                v-for="ticket in existingTickets"
                :key="ticket.id"
                class="ticket-card"
                @click="viewTicketDetails(ticket)"
              >
                <div class="ticket-header">
                  <div class="ticket-info">
                    <h4>{{ ticket.subject }}</h4>
                    <span class="ticket-id">Ticket #{{ ticket.id }}</span>
                  </div>
                  <div :class="['ticket-status', ticket.status]">
                    {{ ticket.status }}
                  </div>
                </div>

                <div class="ticket-meta">
                  <div class="meta-item">
                    <i class="fas fa-tag"></i>
                    <span>{{ getIssueTypeLabel(ticket.category) }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>{{ formatDate(ticket.createdAt) }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-exclamation-circle"></i>
                    <span :class="['priority-text', ticket.priority]">
                      {{ getPriorityLabel(ticket.priority) }}
                    </span>
                  </div>
                </div>

                <div class="ticket-preview">
                  {{ ticket.messages[0]?.message || ticket.description }}
                </div>

                <div class="ticket-actions">
                  <span class="last-updated">
                    Last updated {{ formatTimeAgo(ticket.updatedAt) }}
                  </span>
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Management -->
        <div v-if="activeSection === 'delivery'" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-truck"></i>
              Delivery Management
            </h2>
          </div>
          
          <div class="delivery-container">
            <div class="active-orders">
              <h3>Active Orders</h3>
              <div 
                v-for="order in activeOrders" 
                :key="order.id"
                class="order-card"
              >
                <div class="order-header">
                  <div class="order-info">
                    <h4>Order #{{ order.id }}</h4>
                    <span class="order-date">Placed {{ formatDate(order.date) }}</span>
                  </div>
                  <div :class="['order-status', order.status.toLowerCase().replace(' ', '-')]">
                    {{ order.status }}
                  </div>
                </div>
                
                <div class="delivery-info">
                  <div class="delivery-timeline">
                    <div class="timeline-item">
                      <strong>Estimated Delivery:</strong>
                      <span>{{ formatDate(order.estimatedDelivery) }}</span>
                    </div>
                    <div class="timeline-item">
                      <strong>Delivery Address:</strong>
                      <span>{{ order.address }}</span>
                    </div>
                  </div>
                  
                  <div class="delivery-actions" v-if="order.canReschedule">
                    <button @click="rescheduleDelivery(order)" class="btn btn-outline btn-sm">
                      <i class="fas fa-calendar-alt"></i>
                      Reschedule Delivery
                    </button>
                    <button @click="trackOrder(order)" class="btn btn-primary btn-sm">
                      <i class="fas fa-map-marker-alt"></i>
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Delivery Preferences -->
            <div class="delivery-preferences">
              <h3>Delivery Preferences</h3>
              <div class="preference-group">
                <div class="preference-item">
                  <label class="preference-label">
                    <input 
                      type="checkbox" 
                      v-model="deliveryPreferences.contactless"
                    >
                    <span class="checkmark"></span>
                    Contactless Delivery
                  </label>
                </div>
                
                <div class="preference-item">
                  <label class="preference-label">
                    <input 
                      type="checkbox" 
                      v-model="deliveryPreferences.leaveAtDoor"
                    >
                    <span class="checkmark"></span>
                    Leave at Door
                  </label>
                </div>
                
                <div class="preference-item">
                  <label class="preference-label">
                    <input 
                      type="checkbox" 
                      v-model="deliveryPreferences.callOnArrival"
                    >
                    <span class="checkmark"></span>
                    Call on Arrival
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label>Preferred Delivery Time</label>
                <select v-model="deliveryPreferences.preferredTime" class="form-select">
                  <option value="">No preference</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                  <option value="evening">Evening (6 PM - 9 PM)</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Special Instructions</label>
                <textarea 
                  v-model="deliveryPreferences.instructions"
                  class="form-textarea"
                  placeholder="Any special delivery instructions..."
                ></textarea>
              </div>
              
              <button @click="saveDeliveryPreferences" class="btn btn-primary">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Reschedule Delivery Modal -->
    <div v-if="showRescheduleModal" class="modal-overlay" @click="closeRescheduleModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Reschedule Delivery</h3>
          <button @click="closeRescheduleModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="order-summary">
            <h4>Order #{{ selectedOrder?.id }}</h4>
            <p>Current delivery date: {{ formatDate(selectedOrder?.estimatedDelivery) }}</p>
          </div>
          
          <div class="calendar-section">
            <h4>Select New Date</h4>
            <div class="date-options">
              <div 
                v-for="date in availableDates" 
                :key="date.value"
                :class="['date-option', { selected: newDeliveryDate === date.value }]"
                @click="newDeliveryDate = date.value"
              >
                <div class="date-day">{{ date.day }}</div>
                <div class="date-date">{{ date.date }}</div>
              </div>
            </div>
          </div>
          
          <div class="time-section">
            <h4>Select Time Slot</h4>
            <div class="time-options">
              <div 
                v-for="time in availableTimeSlots" 
                :key="time.value"
                :class="['time-option', { selected: newDeliveryTime === time.value }]"
                @click="newDeliveryTime = time.value"
              >
                {{ time.label }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeRescheduleModal" class="btn btn-outline">
            Cancel
          </button>
          <button 
            @click="confirmReschedule" 
            class="btn btn-primary"
            :disabled="!newDeliveryDate || !newDeliveryTime"
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <EditProfileModal
      :isVisible="showProfileModal"
      :userProfile="userProfile"
      @close="showProfileModal = false"
      @save="handleProfileSave"
      @notify="handleProfileNotification"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProductCard from '../components/product/ProductCard.vue';
import PageHeader from '../components/ui/PageHeader.vue';
import EditProfileModal from '../components/profile/EditProfileModal.vue';

export default {
  name: 'Profile',
  components: {
    ProductCard,
    PageHeader,
    EditProfileModal
  },
  data() {
    return {
      activeSection: 'feed',
      showProfileModal: false,
      deletionRequested: false,
      deletionReason: '',
      deletionComment: '',
      confirmDeletion: false,
      showRescheduleModal: false,
      selectedOrder: null,
      newDeliveryDate: '',
      newDeliveryTime: '',
      selectedLanguage: 'en',
      selectedCurrency: 'USD',
      selectedCountry: 'US',
      notificationSettings: {
        orderUpdates: true,
        promotions: true,
        newProducts: false,
        stockAlerts: true
      },
      privacySettings: {
        personalization: true,
        analytics: true,
        marketing: false
      },
      deliveryPreferences: {
        contactless: false,
        leaveAtDoor: false,
        callOnArrival: true,
        preferredTime: '',
        instructions: ''
      },
      navigationItems: [
        { id: 'feed', label: 'Personal Feed', icon: 'fas fa-star' },
        { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell', badge: '3' },
        { id: 'customer-support', label: 'Customer Support', icon: 'fas fa-headset' },
        { id: 'language', label: 'Language & Region', icon: 'fas fa-globe' },
        { id: 'privacy', label: 'Privacy & Terms', icon: 'fas fa-shield-alt' },
        { id: 'account-deletion', label: 'Account Deletion', icon: 'fas fa-user-times' },
        { id: 'refunds', label: 'Refund History', icon: 'fas fa-money-bill-wave' },
        { id: 'delivery', label: 'Delivery Management', icon: 'fas fa-truck' }
      ],
      availableLanguages: [
        { code: 'en', name: 'English', nativeName: 'English', flag: 'https://flagcdn.com/w20/us.png' },
        { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'https://flagcdn.com/w20/es.png' },
        { code: 'fr', name: 'French', nativeName: 'Français', flag: 'https://flagcdn.com/w20/fr.png' },
        { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'https://flagcdn.com/w20/de.png' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: 'https://flagcdn.com/w20/it.png' }
      ],
      notifications: [
        {
          id: 1,
          type: 'order',
          title: 'Order Shipped',
          message: 'Your order #12345 has been shipped and is on its way!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false
        },
        {
          id: 2,
          type: 'promotion',
          title: 'Special Offer',
          message: '20% off on all skincare products this weekend!',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: false
        },
        {
          id: 3,
          type: 'stock',
          title: 'Back in Stock',
          message: 'The Vitamin C Serum from your wishlist is now available!',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          read: true
        }
      ],
      refundHistory: [
        {
          id: 1,
          orderId: '12345',
          amount: 45.99,
          status: 'Completed',
          reason: 'Product damaged',
          method: 'Original payment method',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          notes: 'Refund processed successfully'
        },
        {
          id: 2,
          orderId: '12340',
          amount: 29.99,
          status: 'Pending',
          reason: 'Wrong item received',
          method: 'Store credit',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          notes: 'Processing refund...'
        }
      ],
      activeOrders: [
        {
          id: '12346',
          status: 'In Transit',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          address: '123 Beauty St, Glamour City, GC 12345',
          canReschedule: true
        }
      ],
      // Customer Support Data
      faqSearchQuery: '',
      selectedFAQCategory: null,
      selectedQuestion: null,
      activeTicketTab: 'create',
      currentTicketStep: 1,
      submittingTicket: false,
      newTicket: {
        issueType: '',
        subject: '',
        description: '',
        priority: 'medium',
        attachments: []
      },
      faqCategories: [
        {
          id: 'beauty-tips',
          title: 'Beauty Tips & Advice',
          icon: 'fas fa-magic',
          color: '#ec4899',
          questions: [
            {
              id: 1,
              question: 'How do I choose the right foundation shade?',
              answer: 'To find your perfect foundation match, test shades on your jawline in natural light. Consider your undertone: cool (pink/red), warm (yellow/golden), or neutral (mix of both). Our virtual try-on tool can also help you find the perfect match!',
              helpful: null,
              expanded: false
            },
            {
              id: 2,
              question: 'What\'s the best skincare routine for beginners?',
              answer: 'Start with the basics: gentle cleanser, moisturizer, and SPF during the day. Once your skin adjusts, you can add treatments like serums or exfoliants. Remember to introduce new products gradually and patch test first.',
              helpful: null,
              expanded: false
            },
            {
              id: 3,
              question: 'How often should I replace my makeup brushes?',
              answer: 'Clean your brushes weekly with gentle soap or brush cleaner. Replace them when bristles start shedding excessively, become rough, or lose their shape - typically every 1-2 years for quality brushes.',
              helpful: null,
              expanded: false
            }
          ]
        },
        {
          id: 'orders-shipping',
          title: 'Orders & Shipping',
          icon: 'fas fa-shipping-fast',
          color: '#8b5cf6',
          questions: [
            {
              id: 4,
              question: 'How can I track my order?',
              answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order in the "My Orders" section of your account or contact us for assistance.',
              helpful: null,
              expanded: false
            },
            {
              id: 5,
              question: 'What are your shipping options?',
              answer: 'We offer free standard shipping (5-7 business days), express shipping (2-3 business days), and same-day delivery in select areas. Shipping costs and times may vary based on your location.',
              helpful: null,
              expanded: false
            },
            {
              id: 6,
              question: 'Can I change my shipping address after placing an order?',
              answer: 'You can change your shipping address within 2 hours of placing your order if it hasn\'t been processed yet. Contact our support team immediately for assistance.',
              helpful: null,
              expanded: false
            }
          ]
        },
        {
          id: 'returns-refunds',
          title: 'Returns & Refunds',
          icon: 'fas fa-undo-alt',
          color: '#10b981',
          questions: [
            {
              id: 7,
              question: 'What is your return policy?',
              answer: 'We accept returns within 30 days of purchase. Items must be unopened and in original packaging for hygiene reasons. Some items like lipstick testers or opened mascaras cannot be returned.',
              helpful: null,
              expanded: false
            },
            {
              id: 8,
              question: 'How do I start a return?',
              answer: 'Go to "My Orders" in your account, select the order, and click "Return Items". Follow the guided process to select items and print your return label. Returns are free for orders over $35.',
              helpful: null,
              expanded: false
            }
          ]
        },
        {
          id: 'account-payment',
          title: 'Account & Payment',
          icon: 'fas fa-credit-card',
          color: '#f59e0b',
          questions: [
            {
              id: 9,
              question: 'How do I update my payment information?',
              answer: 'Go to your account settings, select "Payment Methods", and add or update your credit card information. We accept all major credit cards, PayPal, Apple Pay, and Google Pay.',
              helpful: null,
              expanded: false
            },
            {
              id: 10,
              question: 'Is my payment information secure?',
              answer: 'Yes! We use industry-standard SSL encryption and never store your full credit card details. All payments are processed through secure, PCI-compliant payment processors.',
              helpful: null,
              expanded: false
            }
          ]
        }
      ],
      priorityOptions: [
        {
          value: 'low',
          label: 'Low',
          description: 'General questions, not urgent'
        },
        {
          value: 'medium',
          label: 'Medium',
          description: 'Standard issues, response within 24 hours'
        },
        {
          value: 'high',
          label: 'High',
          description: 'Urgent issues, response within 4 hours'
        }
      ],
      existingTickets: [
        {
          id: 'BT-2024-001',
          subject: 'Foundation shade recommendation needed',
          category: 'beauty-advice',
          status: 'open',
          priority: 'medium',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          messages: [
            {
              id: 1,
              message: 'I bought the wrong foundation shade and need help finding the right one for my skin tone.',
              sender: 'user',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters('user', [
      'userProfile', 
      'recentlyViewedItems', 
      'personalizedProducts'
    ]),
    ...mapGetters('products', ['allProducts']),
    personalizedRecommendations() {
      // Enhanced AI-powered recommendations based on multiple factors
      if (!this.allProducts || !Array.isArray(this.allProducts)) {
        return [];
      }

      const userProfile = this.userProfile || {};
      const preferences = userProfile.preferences || { brands: [], categories: [] };

      return this.allProducts.filter(product => {
        // Factor in skin type, preferences, and purchase history
        const skinTypeMatch = userProfile.skinType &&
          product.suitableFor?.includes(userProfile.skinType);
        const brandPreference = preferences.brands.length === 0 ||
          preferences.brands.includes(product.brand);
        const categoryPreference = preferences.categories.length === 0 ||
          preferences.categories.includes(product.category);

        return skinTypeMatch || brandPreference || categoryPreference;
      }).slice(0, 8);
    },
    skinTypeRecommendations() {
      const userProfile = this.userProfile || {};
      if (!userProfile.skinType || !this.allProducts || !Array.isArray(this.allProducts)) return [];
      return this.allProducts.filter(product =>
        product.suitableFor?.includes(userProfile.skinType)
      ).slice(0, 6);
    },
    totalRefunds() {
      return this.refundHistory.reduce((sum, refund) => sum + refund.amount, 0).toFixed(2);
    },
    yearlyRefunds() {
      const thisYear = new Date().getFullYear();
      return this.refundHistory
        .filter(refund => refund.date.getFullYear() === thisYear)
        .reduce((sum, refund) => sum + refund.amount, 0)
        .toFixed(2);
    },
    pendingRefunds() {
      return this.refundHistory
        .filter(refund => refund.status === 'Pending')
        .reduce((sum, refund) => sum + refund.amount, 0)
        .toFixed(2);
    },
    availableDates() {
      const dates = [];
      for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push({
          value: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en', { weekday: 'short' }),
          date: date.getDate()
        });
      }
      return dates;
    },
    availableTimeSlots() {
      return [
        { value: 'morning', label: '9:00 AM - 12:00 PM' },
        { value: 'afternoon', label: '12:00 PM - 6:00 PM' },
        { value: 'evening', label: '6:00 PM - 9:00 PM' }
      ];
    },
    filteredFAQResults() {
      if (!this.faqSearchQuery) return [];

      const query = this.faqSearchQuery.toLowerCase();
      const results = [];

      this.faqCategories.forEach(category => {
        category.questions.forEach(question => {
          if (question.question.toLowerCase().includes(query) ||
              question.answer.toLowerCase().includes(query)) {
            results.push({
              ...question,
              categoryTitle: category.title,
              expanded: true
            });
          }
        });
      });

      return results;
    }
  },
  mounted() {
    // Check for settings tab in query params
    if (this.$route.query.tab === 'settings') {
      this.activeSection = 'notifications'; // Map settings to notifications
    }
  },
  methods: {
    ...mapActions('user', ['updateNotificationSettings']),
    ...mapActions('ui', ['showNotification']),
    formatViewTime(timestamp) {
      const now = new Date();
      const viewed = new Date(timestamp);
      const diffMs = now - viewed;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) return `${diffDays}d ago`;
      if (diffHours > 0) return `${diffHours}h ago`;
      return 'Just now';
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString();
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getNotificationIcon(type) {
      const icons = {
        order: 'fas fa-box',
        promotion: 'fas fa-tag',
        stock: 'fas fa-boxes',
        system: 'fas fa-cog'
      };
      return icons[type] || 'fas fa-bell';
    },
    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
    changeLanguage(languageCode) {
      this.selectedLanguage = languageCode;
      this.showNotification({
        type: 'success',
        message: 'Language updated successfully'
      });
    },
    updateCurrency() {
      this.showNotification({
        type: 'success',
        message: 'Currency updated successfully'
      });
    },
    updateCountry() {
      this.showNotification({
        type: 'success',
        message: 'Country/Region updated successfully'
      });
    },
    showProfileEditModal() {
      this.showProfileModal = true;
    },
    handleProfileSave(updatedProfile) {
      // Update user profile in store/localStorage
      this.$store.dispatch('user/updateProfile', updatedProfile);
    },
    handleProfileNotification(notification) {
      this.showNotification(notification);
    },
    requestAccountDeletion() {
      this.deletionRequested = true;
      this.showNotification({
        type: 'info',
        message: 'Account deletion request submitted'
      });
    },
    cancelDeletionRequest() {
      this.deletionRequested = false;
      this.showNotification({
        type: 'success',
        message: 'Account deletion request cancelled'
      });
    },
    rescheduleDelivery(order) {
      this.selectedOrder = order;
      this.showRescheduleModal = true;
    },
    closeRescheduleModal() {
      this.showRescheduleModal = false;
      this.selectedOrder = null;
      this.newDeliveryDate = '';
      this.newDeliveryTime = '';
    },
    confirmReschedule() {
      this.showNotification({
        type: 'success',
        message: 'Delivery rescheduled successfully'
      });
      this.closeRescheduleModal();
    },
    trackOrder(order) {
      this.$router.push(`/order-tracking/${order.id}`);
    },
    saveDeliveryPreferences() {
      this.showNotification({
        type: 'success',
        message: 'Delivery preferences saved'
      });
    },
    viewRefundDetails(refund) {
      // Implementation for viewing refund details
      console.log('View refund details:', refund);
    },
    contactSupport(refund) {
      // Implementation for contacting support
      console.log('Contact support for refund:', refund);
    },

    // Customer Support Methods
    openAIChat() {
      // This would trigger the AI chat widget to open
      this.showNotification({
        type: 'info',
        message: 'AI Chat is available in the bottom-right corner!'
      });
    },

    toggleFAQAnswer(questionId) {
      this.filteredFAQResults.forEach(result => {
        if (result.id === questionId) {
          result.expanded = !result.expanded;
        }
      });
    },

    markFAQHelpful(questionId, helpful) {
      const result = this.filteredFAQResults.find(r => r.id === questionId);
      if (result) {
        result.helpful = helpful;
      }

      // Also check in category questions
      this.faqCategories.forEach(category => {
        const question = category.questions.find(q => q.id === questionId);
        if (question) {
          question.helpful = helpful;
        }
      });

      this.showNotification({
        type: 'success',
        message: helpful ? 'Thanks for your feedback!' : 'We\'ll work to improve this answer'
      });
    },

    getSelectedCategoryTitle() {
      const category = this.faqCategories.find(cat => cat.id === this.selectedFAQCategory);
      return category ? category.title : '';
    },

    getSelectedCategoryQuestions() {
      const category = this.faqCategories.find(cat => cat.id === this.selectedFAQCategory);
      return category ? category.questions : [];
    },

    selectIndividualQuestion(question) {
      // Find the category this question belongs to
      const category = this.faqCategories.find(cat =>
        cat.questions.some(q => q.id === question.id)
      );

      this.selectedQuestion = {
        ...question,
        categoryTitle: category ? category.title : '',
        categoryId: category ? category.id : null
      };
    },

    goBackFromQuestion() {
      if (this.selectedQuestion && this.selectedQuestion.categoryId) {
        // Go back to the category view
        this.selectedFAQCategory = this.selectedQuestion.categoryId;
        this.selectedQuestion = null;
      } else {
        // Go back to categories list
        this.selectedQuestion = null;
        this.selectedFAQCategory = null;
      }
    },

    togglePreviewQuestion(questionId) {
      this.faqCategories.forEach(category => {
        category.questions.forEach(question => {
          if (question.id === questionId) {
            // Toggle the clicked question
            question.expanded = !question.expanded;
          } else {
            // Collapse all other questions
            question.expanded = false;
          }
        });
      });
    },

    nextTicketStep() {
      if (this.currentTicketStep < 3) {
        this.currentTicketStep++;
      }
    },

    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
          this.newTicket.attachments.push({
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
          });
        } else {
          this.showNotification({
            type: 'error',
            message: `${file.name} is too large. Maximum file size is 10MB.`
          });
        }
      });
    },

    removeAttachment(index) {
      this.newTicket.attachments.splice(index, 1);
    },

    getFileIcon(fileType) {
      if (fileType.includes('image')) return 'fas fa-image';
      if (fileType.includes('pdf')) return 'fas fa-file-pdf';
      return 'fas fa-file';
    },

    formatFileSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      if (bytes === 0) return '0 Bytes';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    },

    getIssueTypeLabel(type) {
      const types = {
        'order': 'Order & Shipping',
        'product': 'Product Questions',
        'returns': 'Returns & Refunds',
        'account': 'Account Issues',
        'technical': 'Technical Problems',
        'beauty-advice': 'Beauty Advice',
        'other': 'Other'
      };
      return types[type] || type;
    },

    getPriorityLabel(priority) {
      const priorities = {
        'low': 'Low Priority',
        'medium': 'Medium Priority',
        'high': 'High Priority'
      };
      return priorities[priority] || priority;
    },

    async submitTicket() {
      this.submittingTicket = true;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Add to existing tickets
        const newTicket = {
          id: `BT-${new Date().getFullYear()}-${String(this.existingTickets.length + 1).padStart(3, '0')}`,
          subject: this.newTicket.subject,
          category: this.newTicket.issueType,
          status: 'open',
          priority: this.newTicket.priority,
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [
            {
              id: 1,
              message: this.newTicket.description,
              sender: 'user',
              timestamp: new Date()
            }
          ]
        };

        this.existingTickets.unshift(newTicket);

        // Reset form
        this.newTicket = {
          issueType: '',
          subject: '',
          description: '',
          priority: 'medium',
          attachments: []
        };
        this.currentTicketStep = 1;
        this.activeTicketTab = 'existing';

        this.showNotification({
          type: 'success',
          message: `Ticket #${newTicket.id} created successfully! We'll respond within 24 hours.`
        });

      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to create ticket. Please try again.'
        });
      } finally {
        this.submittingTicket = false;
      }
    },

    viewTicketDetails(ticket) {
      this.showNotification({
        type: 'info',
        message: `Opening ticket #${ticket.id} details...`
      });
    },

    formatTimeAgo(date) {
      const now = new Date();
      const diffMs = now - new Date(date);
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return 'Just now';
    }
  }
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--gray-50);
}

.profile-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  padding: 32px 0;
}

/* Sidebar Styles */
.profile-sidebar {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
  height: fit-content;
  position: sticky;
  top: 32px;
}

.profile-header {
  padding: 32px 24px 24px;
  border-bottom: 1px solid var(--gray-200);
}

.avatar-section {
  text-align: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 16px;
  border: 4px solid var(--primary-100);
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  border-color: var(--primary-500);
  transform: scale(1.05);
}

.avatar-edit-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.user-avatar:hover .avatar-edit-overlay {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 32px;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 4px;
}

.user-email {
  color: var(--gray-600);
  margin: 0 0 12px;
}

.member-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.profile-navigation {
  padding: 16px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: var(--gray-700);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border-left: 4px solid transparent;
}

.nav-item:hover {
  background: var(--gray-50);
  color: var(--primary-600);
}

.nav-item.active {
  background: var(--primary-50);
  color: var(--primary-600);
  border-left-color: var(--primary-500);
  font-weight: 600;
}

.nav-badge {
  background: var(--primary-500);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
}

.sidebar-footer {
  padding: 16px 24px 24px;
  border-top: 1px solid var(--gray-200);
}


/* Main Content Styles */
.profile-content {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
  min-height: 600px;
}

.content-section {
  padding: 32px;
}

.section-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--gray-200);
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-description {
  color: var(--gray-600);
  font-size: 16px;
  margin: 0;
}

/* Profile Update Section */
.profile-update-section {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--purple-50) 100%);
  border: 2px solid var(--primary-100);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

.update-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.update-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-edit-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
}

.btn-edit-profile:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
}

.profile-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.summary-item {
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--gray-200);
  transition: all 0.2s ease;
}

.summary-item:hover {
  border-color: var(--primary-300);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
}

/* Feed Styles */
.feed-section {
  margin-bottom: 48px;
}

.feed-section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.recently-viewed-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.recently-viewed-item {
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recently-viewed-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.recently-viewed-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.item-info {
  padding: 12px;
}

.item-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-info .price {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-600);
  margin: 0 0 4px;
}

.viewed-time {
  font-size: 12px;
  color: var(--gray-500);
}

/* Notifications Styles */
.notifications-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.notification-settings,
.recent-notifications {
  background: var(--gray-50);
  padding: 24px;
  border-radius: 12px;
}

.setting-group,
.preference-group {
  margin-top: 16px;
}

.setting-item,
.preference-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--gray-200);
}

.setting-item:last-child,
.preference-item:last-child {
  border-bottom: none;
}

.setting-label,
.preference-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 500;
}

.setting-label input[type="checkbox"],
.preference-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-300);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.setting-label input:checked + .checkmark,
.preference-label input:checked + .checkmark {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.setting-label input:checked + .checkmark::after,
.preference-label input:checked + .checkmark::after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 600;
  font-size: 12px;
}

.setting-description {
  color: var(--gray-600);
  font-size: 14px;
  margin: 4px 0 0;
}

.notification-list {
  margin-top: 16px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  margin-bottom: 12px;
  background: white;
}

.notification-item.unread {
  border-left: 4px solid var(--primary-500);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.notification-item.order .notification-icon {
  background: var(--blue-500);
}

.notification-item.promotion .notification-icon {
  background: var(--green-500);
}

.notification-item.stock .notification-icon {
  background: var(--orange-500);
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
}

.notification-content p {
  color: var(--gray-600);
  margin: 0 0 8px;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: var(--gray-500);
}

.mark-read-btn {
  background: var(--primary-100);
  border: none;
  color: var(--primary-600);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mark-read-btn:hover {
  background: var(--primary-200);
}

/* Language Settings */
.language-settings {
  max-width: 800px;
}

.language-options {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-option:hover {
  border-color: var(--primary-300);
}

.language-option.active {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.language-flag img {
  width: 32px;
  height: 24px;
  object-fit: cover;
  border-radius: 4px;
}

.language-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 2px;
  color: var(--gray-800);
}

.language-info p {
  color: var(--gray-600);
  margin: 0;
  font-size: 14px;
}

.language-check {
  margin-left: auto;
  color: var(--primary-500);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--gray-700);
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-500);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

/* Privacy Settings */
.privacy-content {
  max-width: 800px;
}

/* Customer Support Styles */
.support-options {
  display: grid;
  gap: 24px;
  margin-bottom: 40px;
}

.support-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%);
  border: 2px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.support-card:hover {
  border-color: var(--primary-300);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
}

.support-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.support-card:hover::before {
  left: 100%;
}

.support-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
}

.support-content {
  flex: 1;
}

.support-content h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 8px;
}

.support-content p {
  color: var(--gray-600);
  margin: 0 0 12px;
  line-height: 1.5;
}

.support-stats {
  display: flex;
  gap: 16px;
}

.support-stats span {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-700);
}

.support-arrow {
  color: var(--primary-500);
  font-size: 20px;
  transition: transform 0.2s ease;
}

.support-card:hover .support-arrow {
  transform: translateX(4px);
}

.quick-help {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  padding: 24px;
}

.quick-help h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 16px;
}

.quick-help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.quick-help-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.quick-help-item:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.quick-help-item i {
  font-size: 24px;
  color: var(--primary-500);
}

.quick-help-item span {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
  text-align: center;
}

/* Back Button */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--primary-600);
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 16px;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: var(--primary-700);
}

/* FAQ Styles */
.faq-search {
  margin-bottom: 32px;
}

.search-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 48px;
  border: 2px solid var(--gray-200);
  border-radius: 50px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-400);
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.15);
}

.search-clear {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-clear:hover {
  background: var(--gray-300);
}

.faq-categories {
  display: grid;
  gap: 24px;
}

.faq-category-card {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-category-card:hover {
  border-color: var(--primary-300);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.category-info {
  flex: 1;
}

.category-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 4px;
}

.category-info p {
  color: var(--gray-600);
  margin: 0;
  font-size: 14px;
}

.category-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-question {
  font-size: 14px;
  color: var(--gray-600);
  padding: 12px;
  background: var(--gray-50);
  border-radius: 8px;
  border: 1px solid transparent;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-question:hover {
  background: var(--primary-50);
  border-color: var(--primary-200);
  color: var(--gray-800);
  transform: translateY(-1px);
}

.preview-question.expanded {
  background: var(--primary-50);
  border-color: var(--primary-300);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.1);
}

.question-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: 500;
}

.expansion-icon {
  transition: transform 0.2s ease;
  color: var(--primary-500);
  font-size: 12px;
  margin-left: 8px;
}

.expansion-icon.rotated {
  transform: rotate(180deg);
}

.preview-question .question-answer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--gray-200);
  animation: fadeIn 0.3s ease;
}

.preview-question .question-answer p {
  color: var(--gray-700);
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 12px;
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

.faq-search-results h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 24px;
}

.faq-result-item {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.faq-result-item:hover {
  border-color: var(--primary-300);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  cursor: pointer;
  background: var(--gray-50);
}

.result-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
  flex: 1;
}

.result-answer {
  padding: 20px 24px;
  border-top: 1px solid var(--gray-200);
}

.result-answer p {
  color: var(--gray-700);
  line-height: 1.6;
  margin: 0 0 16px;
}

.faq-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.helpful-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-600);
}

.helpful-btn {
  background: var(--gray-100);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--gray-600);
}

.helpful-btn:hover {
  background: var(--primary-100);
  color: var(--primary-600);
}

.helpful-btn.active {
  background: var(--primary-500);
  color: white;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: var(--gray-500);
}

.no-results i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-results h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}

.no-results p {
  margin: 0 0 20px;
  line-height: 1.5;
}

.contact-support-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, var(--primary-50), var(--purple-50));
  border: 2px solid var(--primary-200);
  border-radius: 16px;
  padding: 24px;
  margin-top: 40px;
}

.contact-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.contact-content {
  flex: 1;
}

.contact-content h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 4px;
}

.contact-content p {
  color: var(--gray-600);
  margin: 0;
}

/* Ticketing Styles */
.ticket-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 32px;
  background: var(--gray-100);
  border-radius: 12px;
  padding: 4px;
}

.ticket-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--gray-600);
  position: relative;
}

.ticket-tab.active {
  background: white;
  color: var(--primary-600);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-badge {
  background: var(--primary-500);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
}

.form-steps {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  padding: 20px 0;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--gray-400);
  font-weight: 600;
}

.step.active {
  color: var(--primary-600);
}

.step.completed {
  color: var(--primary-700);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.2s ease;
}

.step.active .step-number {
  background: var(--primary-500);
  color: white;
}

.step.completed .step-number {
  background: var(--primary-600);
  color: white;
}

.ticket-step {
  max-width: 600px;
  margin: 0 auto;
}

.ticket-step h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 20px;
  text-align: center;
}

.priority-options {
  display: grid;
  gap: 12px;
}

.priority-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.priority-option:hover {
  border-color: var(--gray-300);
}

.priority-option.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.priority-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.priority-option.low .priority-indicator {
  background: var(--blue-400);
}

.priority-option.medium .priority-indicator {
  background: var(--yellow-400);
}

.priority-option.high .priority-indicator {
  background: var(--red-400);
}

.priority-text {
  flex: 1;
}

.priority-text strong {
  display: block;
  font-weight: 700;
  margin-bottom: 4px;
}

.priority-text span {
  font-size: 14px;
  color: var(--gray-600);
}

.file-upload-area {
  border: 2px dashed var(--gray-300);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;
}

.file-upload-area:hover {
  border-color: var(--primary-400);
  background: var(--primary-50);
}

.upload-content i {
  font-size: 48px;
  color: var(--primary-400);
  margin-bottom: 16px;
}

.upload-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 8px;
}

.upload-content p {
  color: var(--gray-600);
  margin: 0;
}

.attached-files h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 16px;
}

.attached-file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--gray-50);
  border-radius: 8px;
  margin-bottom: 8px;
}

.file-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 600;
  color: var(--gray-800);
  display: block;
  margin-bottom: 2px;
}

.file-size {
  font-size: 12px;
  color: var(--gray-500);
}

.remove-file {
  background: var(--red-100);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--red-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-file:hover {
  background: var(--red-200);
}

.step-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;
}

.ticket-review {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.review-section {
  margin-bottom: 24px;
}

.review-section:last-child {
  margin-bottom: 0;
}

.review-section h4 {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--gray-200);
}

.review-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.review-item strong {
  min-width: 100px;
  color: var(--gray-700);
  font-weight: 600;
}

.priority-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.low {
  background: var(--blue-100);
  color: var(--blue-700);
}

.priority-badge.medium {
  background: var(--yellow-100);
  color: var(--yellow-700);
}

.priority-badge.high {
  background: var(--red-100);
  color: var(--red-700);
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
}

.existing-tickets .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray-500);
}

.existing-tickets .empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.existing-tickets .empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
}

.existing-tickets .empty-state p {
  margin: 0 0 24px;
}

.tickets-list {
  display: grid;
  gap: 16px;
}

.ticket-card {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ticket-card:hover {
  border-color: var(--primary-300);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ticket-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.ticket-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 4px;
}

.ticket-id {
  font-size: 12px;
  color: var(--gray-500);
  font-weight: 500;
}

.ticket-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.ticket-status.open {
  background: var(--green-100);
  color: var(--green-700);
}

.ticket-status.pending {
  background: var(--yellow-100);
  color: var(--yellow-700);
}

.ticket-status.closed {
  background: var(--gray-100);
  color: var(--gray-700);
}

.ticket-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--gray-600);
}

.meta-item i {
  color: var(--gray-400);
}

.priority-text.low {
  color: var(--blue-600);
}

.priority-text.medium {
  color: var(--yellow-600);
}

.priority-text.high {
  color: var(--red-600);
}

.ticket-preview {
  color: var(--gray-700);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ticket-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.last-updated {
  font-size: 12px;
  color: var(--gray-500);
}

/* Responsive Design */
@media (max-width: 768px) {
  .support-card {
    flex-direction: column;
    text-align: center;
  }

  .support-arrow {
    align-self: flex-end;
  }

  .quick-help-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .faq-categories {
    gap: 16px;
  }

  .category-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .form-steps {
    gap: 20px;
  }

  .step {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .step span {
    font-size: 12px;
  }

  .step-actions {
    flex-direction: column;
  }

  .ticket-meta {
    flex-direction: column;
    gap: 8px;
  }
}

.privacy-controls {
  margin-top: 16px;
}

.control-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid var(--gray-200);
}

.control-item:last-child {
  border-bottom: none;
}

.control-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
}

.control-info p {
  color: var(--gray-600);
  margin: 0;
  font-size: 14px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-300);
  transition: 0.2s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-500);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.legal-links {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--gray-200);
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.legal-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  text-decoration: none;
  color: var(--gray-700);
  transition: all 0.2s ease;
}

.legal-link:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
  color: var(--primary-600);
}

.legal-link i:last-child {
  margin-left: auto;
  font-size: 12px;
}

/* Account Deletion */
.deletion-content {
  max-width: 600px;
}

.warning-card {
  display: flex;
  gap: 16px;
  background: var(--red-50);
  border: 1px solid var(--red-200);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.warning-icon {
  color: var(--red-500);
  font-size: 24px;
  flex-shrink: 0;
}

.warning-text h3 {
  color: var(--red-700);
  margin: 0 0 12px;
}

.warning-text p {
  color: var(--red-600);
  margin: 0 0 12px;
}

.warning-text ul {
  color: var(--red-600);
  margin: 0;
  padding-left: 20px;
}

.warning-text li {
  margin-bottom: 4px;
}

.deletion-form h3 {
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--gray-200);
}

.deletion-requested {
  text-align: center;
  padding: 32px;
}

.success-icon {
  color: var(--green-500);
  font-size: 48px;
  margin-bottom: 16px;
}

.deletion-requested h3 {
  color: var(--gray-800);
  margin-bottom: 16px;
}

.deletion-requested p {
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 24px;
}

/* Refunds */
.refunds-container {
  max-width: 1000px;
}

.refunds-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.summary-card {
  background: var(--gray-50);
  padding: 24px;
  border-radius: 12px;
  text-align: center;
}

.summary-card h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-600);
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-800);
}

.refunds-list {
  margin-top: 24px;
}

.refund-item {
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  background: white;
}

.refund-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.refund-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
}

.refund-date {
  font-size: 14px;
  color: var(--gray-600);
}

.refund-amount {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
}

.refund-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.refund-status.completed {
  background: var(--green-100);
  color: var(--green-700);
}

.refund-status.pending {
  background: var(--orange-100);
  color: var(--orange-700);
}

.refund-details {
  margin-bottom: 16px;
}

.refund-details p {
  margin: 8px 0;
  color: var(--gray-600);
}

.refund-actions {
  display: flex;
  gap: 12px;
}

/* Delivery Management */
.delivery-container {
  max-width: 1000px;
}

.active-orders {
  margin-bottom: 32px;
}

.order-card {
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  background: white;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.order-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--gray-800);
}

.order-date {
  font-size: 14px;
  color: var(--gray-600);
}

.order-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.order-status.in-transit {
  background: var(--blue-100);
  color: var(--blue-700);
}

.delivery-info {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: end;
}

.timeline-item {
  margin-bottom: 8px;
}

.timeline-item strong {
  display: inline-block;
  width: 140px;
  color: var(--gray-700);
}

.delivery-actions {
  display: flex;
  gap: 12px;
}

.delivery-preferences {
  background: var(--gray-50);
  padding: 24px;
  border-radius: 12px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
}

.modal-header h3 {
  margin: 0;
  color: var(--gray-800);
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--gray-500);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.order-summary {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--gray-50);
  border-radius: 8px;
}

.order-summary h4 {
  margin: 0 0 4px;
  color: var(--gray-800);
}

.calendar-section,
.time-section {
  margin-bottom: 24px;
}

.calendar-section h4,
.time-section h4 {
  margin: 0 0 16px;
  color: var(--gray-800);
}

.date-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
}

.date-option {
  text-align: center;
  padding: 12px 8px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-option:hover {
  border-color: var(--primary-300);
}

.date-option.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.date-day {
  font-size: 12px;
  color: var(--gray-600);
  margin-bottom: 4px;
}

.date-date {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
}

.time-options {
  display: grid;
  gap: 12px;
}

.time-option {
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.time-option:hover {
  border-color: var(--primary-300);
}

.time-option.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

/* Button Styles */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-600);
}

.btn-outline {
  background: white;
  color: var(--gray-700);
  border: 2px solid var(--gray-300);
}

.btn-outline:hover {
  border-color: var(--primary-500);
  color: var(--primary-600);
}

.btn-danger {
  background: var(--red-500);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: var(--red-600);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .profile-sidebar {
    position: static;
  }
  
  .notifications-container {
    grid-template-columns: 1fr;
  }
  
  .delivery-info {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .delivery-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }
  
  .content-section {
    padding: 24px 16px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .recently-viewed-carousel {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .refunds-summary {
    grid-template-columns: 1fr;
  }
  
  .refund-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .form-actions,
  .refund-actions,
  .delivery-actions {
    flex-direction: column;
  }

  .profile-summary {
    grid-template-columns: 1fr;
  }

  .update-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .modal-content {
    width: 95%;
  }
  
  .date-options {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 24px;
  }
  
  .feed-section-title {
    font-size: 18px;
  }
  
  .date-options {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .link-grid {
    grid-template-columns: 1fr;
  }

  .profile-update-section {
    padding: 16px;
  }

  .btn-edit-profile {
    width: 100%;
    justify-content: center;
  }
}

/* Single Question View Styles */
.faq-single-question {
  padding: 0;
  height: 600px;
  overflow-y: auto;
}

.question-header-back {
  padding: 24px 24px 0 24px;
  margin-bottom: 24px;
}

.single-question-content {
  padding: 0 24px 24px 24px;
}

.single-question-content h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 24px;
}

.faq-question-item {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.faq-category-questions .faq-question-item:hover {
  border-color: var(--primary-300);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.1);
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: var(--gray-50);
}

.question-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
  flex: 1;
}

.question-header i {
  color: var(--primary-500);
  font-size: 14px;
}

.question-answer {
  padding: 20px 24px;
  border-top: 1px solid var(--gray-200);
}

.question-answer p {
  color: var(--gray-700);
  line-height: 1.6;
  margin: 0 0 16px;
}

.faq-single-question .faq-question-item {
  cursor: default;
}

.faq-single-question .question-header {
  cursor: default;
}

.faq-single-question .question-header:hover {
  background: var(--gray-50);
}

/* FAQ Questions List Spacing */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-category-questions .faq-question-item {
  margin-bottom: 16px;
}

.faq-category-questions .faq-question-item:last-child {
  margin-bottom: 0;
}
</style>
