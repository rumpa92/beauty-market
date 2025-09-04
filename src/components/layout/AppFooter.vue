<template>
  <footer class="app-footer">
    <div class="footer-container">
      <!-- Main Footer Content -->
      <div class="footer-main">
        <!-- Brand Section -->
        <div class="footer-section">
          <div class="footer-brand">
            <div class="logo">
              <i class="fas fa-gem"></i>
              <span>Beauty Market</span>
            </div>
            <p class="brand-description">
              Discover premium beauty and personal care products from top brands. 
              Your beauty journey starts here.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Instagram">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#" class="social-link" aria-label="Facebook">
                <i class="fab fa-facebook"></i>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-link" aria-label="YouTube">
                <i class="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h3 class="footer-title">Shop</h3>
          <ul class="footer-links">
            <li><router-link to="/products/skincare">Skincare</router-link></li>
            <li><router-link to="/products/makeup">Makeup</router-link></li>
            <li><router-link to="/products/haircare">Hair Care</router-link></li>
            <li><router-link to="/products/fragrance">Fragrance</router-link></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div class="footer-section">
          <h3 class="footer-title">Customer Care</h3>
          <ul class="footer-links">
            <li><a href="#" @click.prevent="openSkinQuiz">Skin Quiz</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <!-- Company -->
        <div class="footer-section">
          <h3 class="footer-title">Company</h3>
          <ul class="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="footer-section newsletter-section">
          <h3 class="footer-title">Stay Beautiful</h3>
          <p class="newsletter-description">
            Get the latest beauty tips, product launches, and exclusive offers.
          </p>
          <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
            <input 
              type="email" 
              placeholder="Enter your email"
              v-model="email"
              class="newsletter-input"
              required
            >
            <button type="submit" class="newsletter-btn">
              Subscribe
            </button>
          </form>
          <div class="newsletter-benefits">
            <div class="benefit">
              <i class="fas fa-gift"></i>
              <span>Exclusive Offers</span>
            </div>
            <div class="benefit">
              <i class="fas fa-star"></i>
              <span>Beauty Tips</span>
            </div>
            <div class="benefit">
              <i class="fas fa-tag"></i>
              <span>Early Access</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} Beauty Market. All rights reserved.
          </p>
          <div class="payment-methods">
            <span class="payment-label">We Accept:</span>
            <div class="payment-icons">
              <i class="fab fa-cc-visa"></i>
              <i class="fab fa-cc-mastercard"></i>
              <i class="fab fa-cc-amex"></i>
              <i class="fab fa-cc-paypal"></i>
              <i class="fab fa-apple-pay"></i>
              <i class="fab fa-google-pay"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AppFooter',
  data() {
    return {
      email: '',
      currentYear: new Date().getFullYear()
    };
  },
  methods: {
    ...mapActions('ui', ['openModal', 'showNotification']),
    subscribeNewsletter() {
      if (this.email) {
        // Simulate newsletter subscription
        this.showNotification({
          type: 'success',
          message: 'Thank you for subscribing to our newsletter!'
        });
        this.email = '';
      }
    },
    openSkinQuiz() {
      this.openModal({ modalName: 'skinQuiz' });
    }
  }
};
</script>

<style scoped>
.app-footer {
  background: var(--gray-800);
  color: var(--gray-100);
  margin-top: 80px;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 40px;
  padding: 60px 0;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-brand {
  max-width: 280px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-400);
  margin-bottom: 16px;
}

.logo i {
  font-size: 28px;
}

.brand-description {
  color: var(--gray-300);
  line-height: 1.6;
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--gray-700);
  color: var(--gray-300);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: var(--primary-500);
  color: white;
  transform: translateY(-2px);
}

.footer-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 20px;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: var(--gray-300);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--primary-400);
}

.newsletter-section {
  background: var(--gray-700);
  padding: 32px;
  border-radius: 12px;
  height: fit-content;
}

.newsletter-description {
  color: var(--gray-300);
  margin-bottom: 24px;
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.newsletter-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid var(--gray-600);
  border-radius: 8px;
  background: var(--gray-800);
  color: white;
  font-size: 14px;
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--primary-500);
}

.newsletter-input::placeholder {
  color: var(--gray-400);
}

.newsletter-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.newsletter-btn:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
}

.newsletter-benefits {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray-300);
  font-size: 14px;
}

.benefit i {
  color: var(--primary-400);
  width: 16px;
}

.footer-bottom {
  border-top: 1px solid var(--gray-700);
  padding: 24px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: var(--gray-400);
  font-size: 14px;
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 16px;
}

.payment-label {
  color: var(--gray-400);
  font-size: 14px;
}

.payment-icons {
  display: flex;
  gap: 8px;
}

.payment-icons i {
  font-size: 24px;
  color: var(--gray-500);
  transition: color 0.2s ease;
}

.payment-icons i:hover {
  color: var(--gray-300);
}

@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 32px;
  }
  
  .footer-brand {
    grid-column: 1 / -1;
    max-width: none;
    margin-bottom: 20px;
  }
  
  .newsletter-section {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 40px 0;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .footer-brand {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .newsletter-form {
    flex-direction: column;
    gap: 12px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .payment-methods {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 16px;
  }
  
  .newsletter-section {
    padding: 24px;
  }
}
</style>
