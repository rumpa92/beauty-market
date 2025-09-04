<template>
  <div class="auth-test-page">
    <div class="test-container">
      <h1>Authentication Test Page</h1>
      <p>Click the buttons below to test the sign in and sign up modals:</p>
      
      <div class="test-buttons">
        <button @click="openSignIn" class="test-btn test-btn-signin">
          <i class="fas fa-sign-in-alt"></i>
          Test Sign In Modal
        </button>
        <button @click="openSignUp" class="test-btn test-btn-signup">
          <i class="fas fa-user-plus"></i>
          Test Sign Up Modal
        </button>
      </div>

      <div class="test-info">
        <div class="info-box">
          <h3>Current Authentication State:</h3>
          <p><strong>Authenticated:</strong> {{ isAuthenticated ? 'Yes' : 'No' }}</p>
          <p v-if="isAuthenticated"><strong>User:</strong> {{ userProfile.name || 'Unknown' }}</p>
          <p v-if="isAuthenticated"><strong>Email:</strong> {{ userProfile.email || 'No email' }}</p>
        </div>
        
        <div class="info-box" v-if="isAuthenticated">
          <h3>Actions:</h3>
          <button @click="logoutUser" class="test-btn test-btn-logout">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
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
  name: 'AuthTest',
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
        title: 'Success!',
        message: data.message
      });
    },

    handleAuthError(data) {
      this.showNotification({
        type: 'error',
        title: 'Error',
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

    async logoutUser() {
      try {
        await this.logout();
        this.showNotification({
          type: 'success',
          title: 'Logged Out',
          message: 'You have been successfully logged out.'
        });
      } catch (error) {
        this.showNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to logout. Please try again.'
        });
      }
    }
  }
};
</script>

<style scoped>
.auth-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
  padding: 40px 20px;
}

.test-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-size: 36px;
  font-weight: 800;
  color: var(--gray-800);
  margin-bottom: 16px;
}

p {
  font-size: 18px;
  color: var(--gray-600);
  margin-bottom: 40px;
}

.test-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.test-btn {
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
  min-width: 200px;
  justify-content: center;
}

.test-btn-signin {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.test-btn-signin:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.test-btn-signup {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.3);
}

.test-btn-signup:hover {
  background: linear-gradient(135deg, #db2777, #be185d);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
}

.test-btn-logout {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.test-btn-logout:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.test-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.info-box {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: left;
}

.info-box h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 16px;
}

.info-box p {
  font-size: 16px;
  color: var(--gray-600);
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  h1 {
    font-size: 28px;
  }

  .test-buttons {
    flex-direction: column;
    align-items: center;
  }

  .test-info {
    grid-template-columns: 1fr;
  }
}
</style>
