<template>
  <div class="legal-page">
    <div class="container">
      <div class="legal-header">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last updated: {{ lastUpdated }}</p>
      </div>
      
      <div class="legal-content">
        <section class="legal-section">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
          
          <h3>Personal Information</h3>
          <ul>
            <li>Name, email address, and contact information</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information (processed securely by our payment providers)</li>
            <li>Beauty profile information (skin type, preferences, concerns)</li>
            <li>Purchase history and product reviews</li>
          </ul>
          
          <h3>Automatically Collected Information</h3>
          <ul>
            <li>Device information and browser type</li>
            <li>IP address and location data</li>
            <li>Website usage patterns and analytics</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Provide personalized product recommendations</li>
            <li>Send order updates and customer support communications</li>
            <li>Improve our website and services</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Prevent fraud and ensure platform security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>3. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:</p>
          <ul>
            <li>SSL encryption for data transmission</li>
            <li>Secure payment processing</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and employee training</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>5. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Restriction:</strong> Limit how we process your data</li>
          </ul>
          
          <p>To exercise these rights, contact us at <a href="mailto:privacy@beautymarket.com">privacy@beautymarket.com</a></p>
        </section>

        <section class="legal-section">
          <h2>6. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to enhance your browsing experience. You can control cookie settings through your browser preferences.</p>
          
          <h3>Types of Cookies We Use:</h3>
          <ul>
            <li><strong>Essential:</strong> Required for website functionality</li>
            <li><strong>Analytics:</strong> Help us understand website usage</li>
            <li><strong>Marketing:</strong> Used for personalized advertising</li>
            <li><strong>Functional:</strong> Remember your preferences</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>7. International Transfers</h2>
          <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.</p>
        </section>

        <section class="legal-section">
          <h2>8. Data Retention</h2>
          <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.</p>
        </section>

        <section class="legal-section">
          <h2>9. Children's Privacy</h2>
          <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>
        </section>

        <section class="legal-section">
          <h2>10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.</p>
        </section>

        <section class="legal-section">
          <h2>11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <div class="contact-info">
            <p><strong>Email:</strong> <a href="mailto:privacy@beautymarket.com">privacy@beautymarket.com</a></p>
            <p><strong>Address:</strong> Beauty Market Inc., 123 Privacy Lane, Data City, DC 12345</p>
            <p><strong>Phone:</strong> +1 (555) 123-PRIVACY</p>
          </div>
        </section>
      </div>
      
      <div class="legal-footer">
        <p>By using our website, you acknowledge that you have read and understood this Privacy Policy.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
  data() {
    return {
      lastUpdated: 'December 1, 2024'
    };
  },
  mounted() {
    document.title = 'Privacy Policy - Beauty Market';
  }
};
</script>

<style scoped>
.legal-page {
  padding: 40px 0 80px;
  background: var(--gray-50);
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.legal-header {
  text-align: center;
  margin-bottom: 48px;
  padding: 32px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.legal-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 12px;
}

.last-updated {
  color: var(--gray-600);
  font-style: italic;
  margin: 0;
}

.legal-content {
  background: white;
  padding: 48px;
  border-radius: 16px;
  box-shadow: var(--shadow);
  margin-bottom: 32px;
}

.legal-section {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--gray-200);
}

.legal-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.legal-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-200);
}

.legal-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-700);
  margin: 24px 0 12px;
}

.legal-section p {
  color: var(--gray-600);
  line-height: 1.7;
  margin: 0 0 16px;
}

.legal-section ul {
  margin: 16px 0;
  padding-left: 24px;
}

.legal-section li {
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 8px;
}

.legal-section a {
  color: var(--primary-600);
  text-decoration: none;
  font-weight: 500;
}

.legal-section a:hover {
  color: var(--primary-700);
  text-decoration: underline;
}

.contact-info {
  background: var(--gray-50);
  padding: 20px;
  border-radius: 8px;
  margin-top: 16px;
}

.contact-info p {
  margin: 8px 0;
}

.legal-footer {
  text-align: center;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.legal-footer p {
  color: var(--gray-600);
  margin: 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .legal-page {
    padding: 20px 0 60px;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .legal-header {
    padding: 24px 20px;
  }
  
  .legal-header h1 {
    font-size: 28px;
  }
  
  .legal-content {
    padding: 32px 24px;
  }
  
  .legal-section h2 {
    font-size: 20px;
  }
  
  .legal-section h3 {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .legal-content {
    padding: 24px 16px;
  }
  
  .legal-header {
    padding: 20px 16px;
  }
  
  .legal-header h1 {
    font-size: 24px;
  }
}
</style>
