<template>
  <div class="auth-overlay" v-if="isVisible" @click="closeModal">
    <div class="auth-modal" @click.stop>
      <!-- Animated Background -->
      <div class="auth-background">
        <div class="gradient-overlay"></div>
        <div class="floating-elements">
          <div class="beauty-element element-1">
            <i class="fas fa-heart"></i>
          </div>
          <div class="beauty-element element-2">
            <i class="fas fa-star"></i>
          </div>
          <div class="beauty-element element-3">
            <i class="fas fa-gem"></i>
          </div>
          <div class="beauty-element element-4">
            <i class="fas fa-magic"></i>
          </div>
        </div>
      </div>

      <!-- Close Button -->
      <button @click="closeModal" class="close-btn" aria-label="Close modal">
        <i class="fas fa-times"></i>
      </button>

      <!-- Modal Content -->
      <div class="auth-content">
        <!-- Header -->
        <div class="auth-header">
          <div class="brand-logo">
            <div class="logo-container">
              <i class="fas fa-gem"></i>
            </div>
            <h1 class="brand-name">Beauty Market</h1>
          </div>
          
          <div class="welcome-section">
            <h2 class="auth-title">
              {{ isSignUp ? 'Create Your Account' : 'Welcome Back' }}
            </h2>
            <p class="auth-subtitle">
              {{ isSignUp ? 'Join our beauty community and discover your perfect look' : 'Sign in to continue your beauty journey' }}
            </p>
          </div>
        </div>

        <!-- Authentication Form -->
        <form @submit.prevent="handleSubmit" class="auth-form">
          <!-- Name Fields (Sign Up only) -->
          <div v-if="isSignUp" class="form-row">
            <div class="form-group">
              <label class="form-label" for="firstName">First Name</label>
              <div class="input-container">
                <div class="input-icon">
                  <i class="fas fa-user"></i>
                </div>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.firstName }"
                  placeholder="Enter your first name"
                  required
                  autocomplete="given-name"
                >
              </div>
              <div v-if="errors.firstName" class="error-message" role="alert">
                <i class="fas fa-exclamation-circle"></i>
                {{ errors.firstName }}
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="lastName">Last Name</label>
              <div class="input-container">
                <div class="input-icon">
                  <i class="fas fa-user"></i>
                </div>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.lastName }"
                  placeholder="Enter your last name"
                  required
                  autocomplete="family-name"
                >
              </div>
              <div v-if="errors.lastName" class="error-message" role="alert">
                <i class="fas fa-exclamation-circle"></i>
                {{ errors.lastName }}
              </div>
            </div>
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <div class="input-container">
              <div class="input-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ 'error': errors.email }"
                placeholder="Enter your email"
                required
                autocomplete="email"
              >
            </div>
            <div v-if="errors.email" class="error-message" role="alert">
              <i class="fas fa-exclamation-circle"></i>
              {{ errors.email }}
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="input-container">
              <div class="input-icon">
                <i class="fas fa-lock"></i>
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'error': errors.password }"
                placeholder="Enter your password"
                required
                autocomplete="current-password"
              >
              <button 
                type="button" 
                @click="togglePassword" 
                class="password-toggle"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.password" class="error-message" role="alert">
              <i class="fas fa-exclamation-circle"></i>
              {{ errors.password }}
            </div>
          </div>

          <!-- Confirm Password (Sign Up only) -->
          <div v-if="isSignUp" class="form-group">
            <label class="form-label" for="confirmPassword">Confirm Password</label>
            <div class="input-container">
              <div class="input-icon">
                <i class="fas fa-lock"></i>
              </div>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'error': errors.confirmPassword }"
                placeholder="Confirm your password"
                required
                autocomplete="new-password"
              >
              <button 
                type="button" 
                @click="toggleConfirmPassword" 
                class="password-toggle"
                :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="error-message" role="alert">
              <i class="fas fa-exclamation-circle"></i>
              {{ errors.confirmPassword }}
            </div>
            
            <!-- Password Strength Indicator -->
            <div v-if="form.password" class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <span class="strength-text" :class="passwordStrength.class">
                {{ passwordStrength.text }}
              </span>
            </div>
          </div>

          <!-- Form Options -->
          <div class="form-options">
            <label v-if="!isSignUp" class="remember-checkbox">
              <input type="checkbox" v-model="form.rememberMe" class="checkbox-input">
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">Remember me</span>
            </label>
            
            <div v-if="isSignUp" class="terms-agreement">
              <label class="remember-checkbox">
                <input 
                  type="checkbox" 
                  v-model="form.agreeToTerms" 
                  class="checkbox-input"
                  required
                >
                <span class="checkbox-custom"></span>
                <span class="checkbox-text">
                  I agree to the <a href="/terms" target="_blank">Terms of Service</a> 
                  and <a href="/privacy" target="_blank">Privacy Policy</a>
                </span>
              </label>
            </div>
            
            <button 
              v-if="!isSignUp" 
              type="button" 
              @click="showForgotPasswordModal = true" 
              class="forgot-password-link"
            >
              Forgot Password?
            </button>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isLoading || (isSignUp && !form.agreeToTerms)"
            :class="{ 'loading': isLoading }"
          >
            <span v-if="!isLoading" class="btn-content">
              <i class="fas" :class="isSignUp ? 'fa-sparkles' : 'fa-sign-in-alt'"></i>
              {{ isSignUp ? 'Create Account' : 'Sign In' }}
            </span>
            <span v-else class="btn-loading">
              <i class="fas fa-spinner fa-spin"></i>
              {{ isSignUp ? 'Creating Account...' : 'Signing In...' }}
            </span>
          </button>
        </form>

        <!-- Social Authentication (Display Only) -->
        <div class="social-auth-section">
          <div class="auth-divider">
            <span>Or continue with email</span>
          </div>

          <div class="social-buttons">
            <div class="social-btn google-btn disabled">
              <div class="social-icon">
                <span class="google-logo">G</span>
              </div>
              <span>Google</span>
            </div>
            <div class="social-btn facebook-btn disabled">
              <div class="social-icon">
                <i class="fab fa-facebook-f"></i>
              </div>
              <span>Facebook</span>
            </div>
            <div class="social-btn apple-btn disabled">
              <div class="social-icon">
                <i class="fab fa-apple"></i>
              </div>
              <span>Apple</span>
            </div>
          </div>
        </div>

        <!-- Switch Mode -->
        <div class="auth-switch">
          <p class="switch-text">
            {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
            <button @click="toggleMode" class="switch-link">
              {{ isSignUp ? 'Sign In' : 'Sign Up' }}
            </button>
          </p>
        </div>

        <!-- Additional Features -->
        <div class="auth-features">
          <div class="feature-item">
            <i class="fas fa-shield-alt"></i>
            <span>Secure & Protected</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-heart"></i>
            <span>Personalized Recommendations</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-gift"></i>
            <span>Exclusive Offers</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPasswordModal" class="forgot-overlay" @click="showForgotPasswordModal = false">
      <div class="forgot-modal" @click.stop>
        <div class="forgot-header">
          <div class="forgot-icon">
            <i class="fas fa-key"></i>
          </div>
          <h3>Reset Password</h3>
          <p>Enter your email and we'll send you a reset link</p>
        </div>
        
        <form @submit.prevent="handleForgotPassword" class="forgot-form">
          <div class="form-group">
            <div class="input-container">
              <div class="input-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <input
                v-model="forgotEmail"
                type="email"
                class="form-input"
                placeholder="Enter your email"
                required
              >
            </div>
          </div>
          
          <div class="forgot-actions">
            <button type="button" @click="showForgotPasswordModal = false" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="reset-btn" :disabled="!forgotEmail || isLoading">
              <span v-if="!isLoading">Send Reset Link</span>
              <span v-else><i class="fas fa-spinner fa-spin"></i> Sending...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    initialMode: {
      type: String,
      default: 'signin'
    }
  },
  data() {
    return {
      isSignUp: this.initialMode === 'signup',
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false,
      showForgotPasswordModal: false,
      forgotEmail: '',
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        agreeToTerms: false
      },
      errors: {}
    };
  },
  computed: {
    passwordStrength() {
      const password = this.form.password;
      if (!password) return { width: '0%', class: '', text: '' };
      
      let score = 0;
      
      if (password.length >= 8) score += 2;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/\d/.test(password)) score += 1;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
      
      if (score <= 2) {
        return { width: '25%', class: 'weak', text: 'Weak' };
      } else if (score <= 4) {
        return { width: '50%', class: 'medium', text: 'Medium' };
      } else if (score <= 5) {
        return { width: '75%', class: 'good', text: 'Good' };
      } else {
        return { width: '100%', class: 'strong', text: 'Strong' };
      }
    }
  },
  methods: {
    toggleMode() {
      this.isSignUp = !this.isSignUp;
      this.clearForm();
      this.errors = {};
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    
    validateForm() {
      this.errors = {};
      
      if (this.isSignUp) {
        if (!this.form.firstName.trim()) {
          this.errors.firstName = 'First name is required';
        }
        
        if (!this.form.lastName.trim()) {
          this.errors.lastName = 'Last name is required';
        }
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
      }
      
      if (this.form.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters';
      }
      
      if (this.isSignUp) {
        if (this.form.password !== this.form.confirmPassword) {
          this.errors.confirmPassword = 'Passwords do not match';
        }
        
        if (!this.form.agreeToTerms) {
          this.errors.terms = 'You must agree to the terms';
        }
      }
      
      return Object.keys(this.errors).length === 0;
    },
    
    async handleSubmit() {
      if (!this.validateForm()) return;
      
      this.isLoading = true;
      
      try {
        if (this.isSignUp) {
          await this.signUp();
        } else {
          await this.signIn();
        }
      } catch (error) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async signUp() {
      await this.delay(2000);
      
      const userData = {
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email
      };
      
      this.$store.dispatch('user/createAccount', userData);
      
      this.$emit('auth-success', {
        type: 'signup',
        user: userData,
        message: `Welcome to Beauty Market, ${userData.firstName}! Your account has been created ✨`
      });
      
      this.closeModal();
    },
    
    async signIn() {
      await this.delay(1500);
      
      const userData = {
        email: this.form.email,
        rememberMe: this.form.rememberMe
      };
      
      this.$store.dispatch('user/signIn', userData);
      
      this.$emit('auth-success', {
        type: 'signin',
        user: userData,
        message: 'Welcome back! Ready to glow? 🌟'
      });
      
      this.closeModal();
    },
    
    async signInWithGoogle() {
      this.isLoading = true;
      try {
        await this.delay(1000);
        
        const userData = {
          name: 'Google User',
          email: 'user@gmail.com',
          provider: 'google',
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        };
        
        this.$store.dispatch('user/socialSignIn', userData);
        
        this.$emit('auth-success', {
          type: 'social',
          user: userData,
          message: 'Successfully signed in with Google! ✨'
        });
        
        this.closeModal();
      } catch (error) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async signInWithFacebook() {
      this.isLoading = true;
      try {
        await this.delay(1000);
        
        const userData = {
          name: 'Facebook User',
          email: 'user@facebook.com',
          provider: 'facebook',
          avatar: 'https://graph.facebook.com/me/picture?type=large'
        };
        
        this.$store.dispatch('user/socialSignIn', userData);
        
        this.$emit('auth-success', {
          type: 'social',
          user: userData,
          message: 'Successfully signed in with Facebook! 💕'
        });
        
        this.closeModal();
      } catch (error) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async signInWithApple() {
      this.isLoading = true;
      try {
        await this.delay(1000);
        
        const userData = {
          name: 'Apple User',
          email: 'user@icloud.com',
          provider: 'apple',
          avatar: ''
        };
        
        this.$store.dispatch('user/socialSignIn', userData);
        
        this.$emit('auth-success', {
          type: 'social',
          user: userData,
          message: 'Successfully signed in with Apple! 🍃'
        });
        
        this.closeModal();
      } catch (error) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async handleForgotPassword() {
      this.isLoading = true;
      try {
        await this.delay(1000);
        
        this.$emit('password-reset-sent', {
          email: this.forgotEmail,
          message: `Password reset link sent to ${this.forgotEmail}! Check your email 📧`
        });
        
        this.showForgotPasswordModal = false;
        this.forgotEmail = '';
      } catch (error) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    },
    
    handleAuthError(error) {
      this.$emit('auth-error', {
        message: error.message || 'Something went wrong. Please try again.'
      });
    },
    
    clearForm() {
      this.form = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        agreeToTerms: false
      };
    },
    
    closeModal() {
      this.$emit('close');
      this.clearForm();
      this.errors = {};
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.showForgotPasswordModal = false;
    },
    
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
  
  watch: {
    initialMode(newMode) {
      this.isSignUp = newMode === 'signup';
    }
  }
};
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(16px);
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.auth-modal {
  background: white;
  border-radius: 32px;
  max-width: 520px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin: auto;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Animated Background */
.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(
    135deg,
    #fdf2f8 0%,
    #fce7f3 25%,
    #e0e7ff 50%,
    #f3e8ff 75%,
    #fdf2f8 100%
  );
  border-radius: 32px 32px 0 0;
  overflow: hidden;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.15) 0%,
    rgba(168, 85, 247, 0.15) 50%,
    rgba(251, 146, 60, 0.15) 100%
  );
  animation: gradientShift 8s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.beauty-element {
  position: absolute;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(236, 72, 153, 0.9);
  font-size: 18px;
  animation: float 6s ease-in-out infinite;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
}

.element-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.element-2 {
  top: 60%;
  right: 20%;
  animation-delay: 1.5s;
}

.element-3 {
  top: 15%;
  right: 15%;
  animation-delay: 3s;
}

.element-4 {
  bottom: 25%;
  left: 20%;
  animation-delay: 4.5s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.5;
  }
  50% { 
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  color: var(--gray-600);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: var(--gray-800);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Content */
.auth-content {
  padding: 30px 40px 30px;
  position: relative;
  z-index: 5;
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.brand-logo {
  margin-bottom: 20px;
}

.logo-container {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #ec4899, #db2777);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  margin: 0 auto 16px;
  box-shadow: 
    0 16px 32px rgba(236, 72, 153, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: brandGlow 3s ease-in-out infinite;
}

@keyframes brandGlow {
  0%, 100% { 
    box-shadow: 0 16px 32px rgba(236, 72, 153, 0.4);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 20px 40px rgba(236, 72, 153, 0.5);
    transform: scale(1.02);
  }
}

.brand-name {
  font-size: 30px;
  font-weight: 800;
  color: var(--gray-800);
  margin: 0;
  letter-spacing: -0.5px;
}

.welcome-section {
  margin-bottom: 8px;
}

.auth-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--gray-800);
  margin: 0 0 8px;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.auth-subtitle {
  color: var(--gray-600);
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  font-weight: 400;
}

/* Social Authentication */
.social-auth-section {
  margin-bottom: 16px;
}

.social-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.social-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 12px;
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  background: white;
  color: var(--gray-700);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  min-height: 70px;
  position: relative;
  overflow: hidden;
}

.social-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gray-50);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-btn:hover::before {
  opacity: 1;
}

.social-btn:hover:not(:disabled) {
  border-color: var(--primary-300);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.social-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: var(--gray-100);
  color: var(--gray-700);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.social-icon svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.social-icon i {
  font-size: 18px;
}

.google-logo {
  font-weight: bold;
  font-size: 18px;
  font-family: 'Arial', sans-serif;
}

.social-btn span {
  position: relative;
  z-index: 2;
}

.social-btn.disabled {
  cursor: default;
  opacity: 0.8;
  pointer-events: none;
}

.social-btn.disabled:hover {
  transform: none;
  box-shadow: none;
  border-color: inherit;
}

.social-btn.disabled::before {
  display: none;
}

.google-btn {
  border-color: #db4437;
  color: #db4437;
}

.google-btn .social-icon {
  background: #db4437;
  color: white;
}

.facebook-btn {
  border-color: #1877f2;
  color: #1877f2;
}

.facebook-btn .social-icon {
  background: #1877f2;
  color: white;
}

.apple-btn {
  border-color: #333;
  color: #333;
}

.apple-btn .social-icon {
  background: #000;
  color: white;
}

.google-btn:hover:not(:disabled) {
  border-color: #db4437;
  color: #db4437;
}

.google-btn:hover:not(:disabled) .social-icon {
  background: #db4437;
  color: white;
}

.facebook-btn:hover:not(:disabled) {
  border-color: #1877f2;
  color: #1877f2;
}

.facebook-btn:hover:not(:disabled) .social-icon {
  background: #1877f2;
  color: white;
}

.apple-btn:hover:not(:disabled) {
  border-color: #000;
  color: #000;
}

.apple-btn:hover:not(:disabled) .social-icon {
  background: #000;
  color: white;
}

.auth-divider {
  text-align: center;
  position: relative;
  margin: 20px 0;
}

.auth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gray-200), transparent);
}

.auth-divider span {
  background: white;
  color: var(--gray-500);
  padding: 0 24px;
  font-size: 14px;
  font-weight: 600;
  position: relative;
}

/* Form */
.auth-form {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 18px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 8px;
  font-size: 14px;
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  font-size: 16px;
  z-index: 2;
  transition: color 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 18px 20px 18px 52px;
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  color: var(--gray-800);
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-400);
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
  background: white;
}

.form-input:focus + .input-icon,
.form-input:not(:placeholder-shown) + .input-icon {
  color: var(--primary-500);
}

.form-input.error {
  border-color: var(--red-400);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.form-input::placeholder {
  color: var(--gray-400);
  font-weight: 400;
}

.password-toggle {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 16px;
}

.password-toggle:hover {
  color: var(--gray-600);
  background: var(--gray-100);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--red-600);
  font-size: 12px;
  font-weight: 500;
  margin-top: 8px;
}

.error-message i {
  font-size: 12px;
}

/* Password Strength */
.password-strength {
  margin-top: 12px;
}

.strength-bar {
  height: 4px;
  background: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.strength-fill.weak {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.strength-fill.medium {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.strength-fill.good {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.strength-fill.strong {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.strength-text {
  font-size: 12px;
  font-weight: 600;
}

.strength-text.weak { color: #ef4444; }
.strength-text.medium { color: #f59e0b; }
.strength-text.good { color: #3b82f6; }
.strength-text.strong { color: #10b981; }

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: var(--gray-700);
  font-weight: 500;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-300);
  border-radius: 6px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-color: var(--primary-500);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 700;
}

.checkbox-text a {
  color: var(--primary-600);
  text-decoration: none;
  font-weight: 600;
}

.checkbox-text a:hover {
  text-decoration: underline;
}

.terms-agreement {
  flex: 1;
}

.forgot-password-link {
  background: none;
  border: none;
  color: var(--primary-600);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  padding: 0;
  transition: color 0.3s ease;
}

.forgot-password-link:hover {
  color: var(--primary-700);
  text-decoration: underline;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  padding: 20px 24px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 60px;
  box-shadow: 
    0 8px 20px rgba(236, 72, 153, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #db2777, #be185d);
  transform: translateY(-2px);
  box-shadow: 
    0 12px 30px rgba(236, 72, 153, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-content,
.btn-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Switch Mode */
.auth-switch {
  text-align: center;
  margin-bottom: 32px;
}

.switch-text {
  color: var(--gray-600);
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.switch-link {
  background: none;
  border: none;
  color: var(--primary-600);
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  margin-left: 6px;
  font-size: 14px;
  transition: color 0.3s ease;
}

.switch-link:hover {
  color: var(--primary-700);
  text-decoration: underline;
}

/* Additional Features */
.auth-features {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 24px;
  padding: 24px 0;
  border-top: 1px solid var(--gray-200);
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  flex: 1;
}

.feature-item i {
  font-size: 20px;
  color: var(--primary-500);
  margin-bottom: 4px;
}

.feature-item span {
  font-size: 12px;
  color: var(--gray-600);
  font-weight: 500;
  line-height: 1.3;
}

/* Forgot Password Modal */
.forgot-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
  backdrop-filter: blur(12px);
}

.forgot-modal {
  background: white;
  border-radius: 24px;
  padding: 40px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.4s ease;
}

.forgot-header {
  text-align: center;
  margin-bottom: 32px;
}

.forgot-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: var(--primary-600);
  font-size: 24px;
}

.forgot-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 8px;
}

.forgot-header p {
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
}

.forgot-form {
  margin-bottom: 24px;
}

.forgot-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn,
.reset-btn {
  flex: 1;
  padding: 16px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 14px;
}

.cancel-btn {
  background: var(--gray-100);
  color: var(--gray-700);
}

.cancel-btn:hover {
  background: var(--gray-200);
}

.reset-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
}

.reset-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-modal {
    margin: 10px;
    border-radius: 24px;
    max-height: 95vh;
  }
  
  .auth-content {
    padding: 32px 28px 28px;
  }
  
  .auth-background {
    height: 160px;
  }
  
  .auth-title {
    font-size: 28px;
  }
  
  .brand-name {
    font-size: 26px;
  }
  
  .logo-container {
    width: 64px;
    height: 64px;
    font-size: 28px;
  }
  
  .social-buttons {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .social-btn {
    flex-direction: row;
    min-height: auto;
    padding: 16px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .auth-features {
    gap: 20px;
  }
  
  .feature-item span {
    font-size: 11px;
  }
  
  .forgot-modal {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .auth-overlay {
    padding: 12px;
  }
  
  .auth-content {
    padding: 24px 20px 20px;
  }
  
  .auth-background {
    height: 140px;
  }
  
  .close-btn {
    top: 16px;
    right: 16px;
    width: 44px;
    height: 44px;
  }
  
  .social-btn {
    padding: 14px 16px;
    font-size: 13px;
  }
  
  .auth-features {
    flex-direction: column;
    gap: 16px;
  }
  
  .feature-item {
    flex-direction: row;
    text-align: left;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .auth-modal,
  .floating-elements .beauty-element,
  .close-btn,
  .social-btn,
  .form-input,
  .submit-btn {
    animation: none;
    transition: none;
  }
}

/* Focus styles for keyboard navigation */
.close-btn:focus-visible,
.social-btn:focus-visible,
.form-input:focus-visible,
.password-toggle:focus-visible,
.remember-checkbox:focus-visible,
.forgot-password-link:focus-visible,
.submit-btn:focus-visible,
.switch-link:focus-visible {
  outline: 3px solid var(--primary-400);
  outline-offset: 2px;
}
</style>
