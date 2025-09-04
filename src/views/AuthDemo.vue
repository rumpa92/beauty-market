<template>
  <div class="auth-demo-page">
    <div class="demo-container">
      <div class="demo-header">
        <h1 class="demo-title">Enhanced Authentication System</h1>
        <p class="demo-description">
          Experience our beautiful, fully functional sign-in and sign-up system with social login integration.
        </p>
      </div>

      <div class="demo-features">
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3>Secure Authentication</h3>
            <p>End-to-end encrypted authentication with secure password handling and validation.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fab fa-google"></i>
            </div>
            <h3>Social Login</h3>
            <p>Quick sign-in with Google, Facebook, and Apple for seamless user experience.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <h3>Mobile Responsive</h3>
            <p>Perfectly optimized for all devices with touch-friendly interactions.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-eye"></i>
            </div>
            <h3>Password Strength</h3>
            <p>Real-time password strength indicator with helpful validation feedback.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-key"></i>
            </div>
            <h3>Password Recovery</h3>
            <p>Secure forgot password functionality with email verification.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-user-check"></i>
            </div>
            <h3>Smart Validation</h3>
            <p>Intelligent form validation with real-time error feedback and suggestions.</p>
          </div>
        </div>
      </div>

      <div class="demo-actions">
        <div class="action-buttons">
          <button @click="openSignIn" class="demo-btn demo-btn-primary">
            <i class="fas fa-sign-in-alt"></i>
            Try Sign In
          </button>
          <button @click="openSignUp" class="demo-btn demo-btn-secondary">
            <i class="fas fa-user-plus"></i>
            Try Sign Up
          </button>
        </div>

        <div class="demo-note">
          <i class="fas fa-info-circle"></i>
          <span>All authentication actions are simulated for demo purposes. No real accounts are created.</span>
        </div>
      </div>

      <div class="current-user" v-if="isAuthenticated">
        <div class="user-card">
          <div class="user-avatar">
            <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="User Avatar">
            <i v-else class="fas fa-user"></i>
          </div>
          <div class="user-details">
            <h3>{{ userProfile.name || 'User' }}</h3>
            <p>{{ userProfile.email || 'user@example.com' }}</p>
            <div class="user-badges">
              <span class="user-badge" v-if="userProfile.provider">
                <i :class="getProviderIcon(userProfile.provider)"></i>
                {{ userProfile.provider }}
              </span>
              <span class="user-badge">
                <i class="fas fa-check-circle"></i>
                Verified
              </span>
            </div>
          </div>
          <button @click="logout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            Sign Out
          </button>
        </div>
      </div>

      <div class="demo-info">
        <div class="info-grid">
          <div class="info-item">
            <h4>🎨 Beautiful Design</h4>
            <p>Modern, accessible design with smooth animations and beautiful gradient backgrounds.</p>
          </div>
          <div class="info-item">
            <h4>🔐 Security First</h4>
            <p>Built with security best practices including CSRF protection and secure session management.</p>
          </div>
          <div class="info-item">
            <h4>📱 Responsive</h4>
            <p>Works flawlessly on desktop, tablet, and mobile devices with adaptive layouts.</p>
          </div>
          <div class="info-item">
            <h4>♿ Accessible</h4>
            <p>WCAG compliant with proper ARIA labels, keyboard navigation, and screen reader support.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Authentication Modal -->
    <AuthModal
      :isVisible="showAuthModal"
      :initialMode="authMode"
      @close="closeAuthModal"
      @auth-success="handleAuthSuccess"
      @auth-error="handleAuthError"
      @password-reset-sent="handlePasswordReset"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AuthModal from '@/components/auth/AuthModal.vue';

export default {
  name: 'AuthDemo',
  components: {
    AuthModal
  },
  data() {
    return {
      showAuthModal: false,
      authMode: 'signin'
    };
  },
  computed: {
    ...mapGetters('user', ['isAuthenticated', 'userProfile'])
  },
  methods: {
    ...mapActions('ui', ['showNotification']),
    ...mapActions('user', ['logout']),

    openSignIn() {
      this.authMode = 'signin';
      this.showAuthModal = true;
    },

    openSignUp() {
      this.authMode = 'signup';
      this.showAuthModal = true;
    },

    closeAuthModal() {
      this.showAuthModal = false;
    },

    handleAuthSuccess(data) {
      this.showNotification({
        type: 'success',
        title: 'Authentication Successful!',
        message: data.message
      });
    },

    handleAuthError(data) {
      this.showNotification({
        type: 'error',
        title: 'Authentication Error',
        message: data.message
      });
    },

    handlePasswordReset(data) {
      this.showNotification({
        type: 'info',
        title: 'Password Reset',
        message: data.message
      });
    },

    async logout() {
      try {
        await this.$store.dispatch('user/logout');
        this.showNotification({
          type: 'success',
          title: 'Signed Out',
          message: 'You have been successfully signed out.'
        });
      } catch (error) {
        this.showNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to sign out. Please try again.'
        });
      }
    },

    getProviderIcon(provider) {
      const icons = {
        google: 'fab fa-google',
        facebook: 'fab fa-facebook-f',
        apple: 'fab fa-apple'
      };
      return icons[provider] || 'fas fa-user';
    }
  }
};
</script>

<style scoped>
.auth-demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%);
  padding: 40px 0;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.demo-header {
  text-align: center;
  margin-bottom: 60px;
}

.demo-title {
  font-size: 48px;
  font-weight: 800;
  color: var(--gray-800);
  margin: 0 0 16px;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.demo-description {
  font-size: 20px;
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.demo-features {
  margin-bottom: 60px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--primary-600);
  font-size: 24px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 12px;
}

.feature-card p {
  color: var(--gray-600);
  line-height: 1.6;
  margin: 0;
}

.demo-actions {
  text-align: center;
  margin-bottom: 60px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
}

.demo-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  min-width: 160px;
  justify-content: center;
}

.demo-btn-primary {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.3);
}

.demo-btn-primary:hover {
  background: linear-gradient(135deg, #db2777, #be185d);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
}

.demo-btn-secondary {
  background: white;
  color: var(--primary-600);
  border: 2px solid var(--primary-200);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.demo-btn-secondary:hover {
  background: var(--primary-50);
  border-color: var(--primary-300);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.demo-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--gray-500);
  font-size: 14px;
  background: rgba(255, 255, 255, 0.7);
  padding: 12px 20px;
  border-radius: 12px;
  margin: 0 auto;
  max-width: 500px;
}

.current-user {
  margin-bottom: 60px;
}

.user-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 0 auto;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 24px;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-details h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 4px;
}

.user-details p {
  color: var(--gray-600);
  margin: 0 0 12px;
}

.user-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.logout-btn {
  background: var(--gray-100);
  color: var(--gray-700);
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-btn:hover {
  background: var(--gray-200);
  color: var(--gray-800);
}

.demo-info {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.info-item h4 {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 12px;
}

.info-item p {
  color: var(--gray-600);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .demo-title {
    font-size: 36px;
  }

  .demo-description {
    font-size: 18px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .user-card {
    flex-direction: column;
    text-align: center;
  }

  .user-badges {
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .demo-container {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .demo-title {
    font-size: 28px;
  }

  .feature-card {
    padding: 24px 20px;
  }

  .demo-info {
    padding: 24px 20px;
  }
}
</style>
