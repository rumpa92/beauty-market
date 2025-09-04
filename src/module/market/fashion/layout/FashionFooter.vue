<template>
  <footer class="fashion-footer">
    <div class="market-container">
      <!-- Main Footer Content -->
      <div class="footer-main">
        <!-- Brand Section -->
        <div class="footer-section brand-section">
          <div class="footer-brand">
            <div class="footer-logo">
              <i class="fas fa-tshirt"></i>
              <span>Fashion Market</span>
            </div>
            <p class="brand-description">
              Discover the latest fashion trends and timeless styles. 
              Your ultimate destination for premium fashion and accessories.
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
              <a href="#" class="social-link" aria-label="Pinterest">
                <i class="fab fa-pinterest"></i>
              </a>
              <a href="#" class="social-link" aria-label="TikTok">
                <i class="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Shop Links -->
        <div class="footer-section">
          <h3 class="footer-title">Shop</h3>
          <ul class="footer-links">
            <li><router-link to="/fashion/products/women">Women's Fashion</router-link></li>
            <li><router-link to="/fashion/products/men">Men's Fashion</router-link></li>
            <li><router-link to="/fashion/products/shoes">Shoes & Footwear</router-link></li>
            <li><router-link to="/fashion/products/accessories">Accessories</router-link></li>
            <li><router-link to="/fashion/products/luxury">Luxury Collection</router-link></li>
            <li><router-link to="/fashion/products">All Products</router-link></li>
          </ul>
        </div>

        <!-- Customer Service */
        <div class="footer-section">
          <h3 class="footer-title">Customer Care</h3>
          <ul class="footer-links">
            <li><a href="#" @click.prevent="openSizeGuide">Size Guide</a></li>
            <li><a href="#" @click.prevent="openStyleQuiz">Style Quiz</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">Track Your Order</a></li>
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
            <li><a href="#">Fashion Blog</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <!-- Newsletter & Apps -->
        <div class="footer-section newsletter-section">
          <h3 class="footer-title">Stay Stylish</h3>
          <p class="newsletter-description">
            Get the latest fashion trends, exclusive offers, and style tips.
          </p>
          <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
            <input 
              type="email" 
              placeholder="Enter your email"
              v-model="email"
              class="newsletter-input"
              required
            >
            <button type="submit" class="newsletter-btn market-btn-accent">
              Subscribe
            </button>
          </form>
          
          <div class="app-downloads">
            <h4>Download Our App</h4>
            <div class="app-buttons">
              <a href="#" class="app-button">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on App Store">
              </a>
              <a href="#" class="app-button">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play">
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="copyright-section">
            <p class="copyright">
              © {{ currentYear }} Fashion Market. All rights reserved.
            </p>
            <div class="legal-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms & Conditions</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
          
          <div class="payment-security">
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
            
            <div class="security-badges">
              <div class="security-badge">
                <i class="fas fa-shield-alt"></i>
                <span>Secure Shopping</span>
              </div>
              <div class="security-badge">
                <i class="fas fa-truck"></i>
                <span>Free Shipping</span>
              </div>
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
  name: 'FashionFooter',
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
        this.showNotification({
          type: 'success',
          message: 'Thank you for subscribing to our fashion newsletter!'
        });
        this.email = '';
      }
    },
    openSizeGuide() {
      this.openModal({ modalName: 'sizeGuide' });
    },
    openStyleQuiz() {
      this.openModal({ modalName: 'styleQuiz' });
    }
  }
};
</script>

<style scoped>
.fashion-footer {
  background: var(--market-primary);
  color: white;
  margin-top: 80px;
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

.brand-section {
  max-width: 300px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--market-accent);
  margin-bottom: 16px;
}

.footer-logo i {
  font-size: 28px;
}

.brand-description {
  color: rgba(255, 255, 255, 0.8);
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
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: var(--market-accent);
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
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 14px;
}

.footer-links a:hover {
  color: var(--market-accent);
}

.newsletter-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 32px;
  border-radius: 12px;
  height: fit-content;
}

.newsletter-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
  line-height: 1.5;
  font-size: 14px;
}

.newsletter-form {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
}

.newsletter-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--market-accent);
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.newsletter-btn {
  padding: 12px 20px;
  background: var(--market-accent-gradient);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.newsletter-btn:hover {
  transform: translateY(-1px);
}

.app-downloads h4 {
  color: white;
  font-size: 16px;
  margin-bottom: 16px;
}

.app-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.app-button img {
  height: 40px;
  transition: transform 0.2s ease;
}

.app-button:hover img {
  transform: scale(1.05);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.copyright-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.copyright {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.legal-links {
  display: flex;
  gap: 24px;
}

.legal-links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 12px;
  transition: color 0.2s ease;
}

.legal-links a:hover {
  color: var(--market-accent);
}

.payment-security {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 16px;
}

.payment-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.payment-icons {
  display: flex;
  gap: 8px;
}

.payment-icons i {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s ease;
}

.payment-icons i:hover {
  color: rgba(255, 255, 255, 0.8);
}

.security-badges {
  display: flex;
  gap: 16px;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.security-badge i {
  color: var(--market-accent);
}

@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 32px;
  }
  
  .brand-section {
    grid-column: 1 / -1;
    max-width: none;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .newsletter-section {
    grid-column: 1 / -1;
  }
  
  .social-links {
    justify-content: center;
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
  
  .newsletter-form {
    flex-direction: column;
    gap: 12px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
  
  .payment-security {
    align-items: center;
  }
  
  .legal-links {
    justify-content: center;
  }
  
  .app-buttons {
    align-items: center;
  }
}

@media (max-width: 480px) {
  .newsletter-section {
    padding: 24px;
  }
  
  .payment-methods {
    flex-direction: column;
    gap: 8px;
  }
  
  .security-badges {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
