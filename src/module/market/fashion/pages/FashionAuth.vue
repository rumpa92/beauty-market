<template>
  <div class="fashion-auth market-container">
    <div class="auth-container">
      <div class="auth-card market-card">
        <div class="auth-header">
          <h1 class="market-title-lg">Welcome to Fashion Market</h1>
          <p class="market-text-light">Sign in to discover your perfect style</p>
        </div>
        
        <div class="auth-tabs">
          <button 
            @click="activeTab = 'signin'"
            class="tab-btn"
            :class="{ active: activeTab === 'signin' }"
          >
            Sign In
          </button>
          <button 
            @click="activeTab = 'signup'"
            class="tab-btn"
            :class="{ active: activeTab === 'signup' }"
          >
            Sign Up
          </button>
        </div>
        
        <form @submit.prevent="handleAuth" class="auth-form">
          <div v-if="activeTab === 'signup'" class="market-form-group">
            <label class="market-form-label">Full Name</label>
            <input type="text" v-model="form.name" class="market-form-input" required>
          </div>
          
          <div class="market-form-group">
            <label class="market-form-label">Email</label>
            <input type="email" v-model="form.email" class="market-form-input" required>
          </div>
          
          <div class="market-form-group">
            <label class="market-form-label">Password</label>
            <input type="password" v-model="form.password" class="market-form-input" required>
          </div>
          
          <button type="submit" class="market-btn market-btn-primary" style="width: 100%;">
            {{ activeTab === 'signin' ? 'Sign In' : 'Sign Up' }}
          </button>
        </form>
        
        <div class="social-auth">
          <p class="divider">Or continue with</p>
          <div class="social-buttons">
            <button class="social-btn">
              <i class="fab fa-google"></i>
              Google
            </button>
            <button class="social-btn">
              <i class="fab fa-facebook"></i>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FashionAuth',
  data() {
    return {
      activeTab: 'signin',
      form: {
        name: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    handleAuth() {
      // Authentication logic will be managed by existing store
      this.$router.push('/fashion');
    }
  }
};
</script>

<style scoped>
.fashion-auth {
  padding: 60px 0;
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  max-width: 400px;
  width: 100%;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-tabs {
  display: flex;
  margin-bottom: 32px;
  background: var(--market-secondary);
  border-radius: 8px;
  padding: 4px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: var(--market-surface);
  color: var(--market-primary);
}

.auth-form {
  margin-bottom: 24px;
}

.social-auth {
  text-align: center;
}

.divider {
  color: var(--market-text-light);
  margin-bottom: 16px;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: var(--market-border);
}

.divider::before { left: 0; }
.divider::after { right: 0; }

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--market-border);
  background: var(--market-surface);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  border-color: var(--market-primary);
}
</style>
