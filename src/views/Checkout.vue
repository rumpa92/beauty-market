<template>
  <div class="checkout-page">
    <!-- Progress Steps -->
    <div class="checkout-progress">
      <div class="market-container">
        <div class="progress-steps">
          <div 
            v-for="(step, index) in steps" 
            :key="step.id"
            :class="['progress-step', { 
              active: currentStep === index + 1, 
              completed: currentStep > index + 1 
            }]"
          >
            <div class="step-circle">
              <i v-if="currentStep > index + 1" class="fas fa-check"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="step-info">
              <span class="step-title">{{ step.title }}</span>
              <span class="step-description">{{ step.description }}</span>
            </div>
            <div v-if="index < steps.length - 1" class="step-connector"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="checkout-content">
      <div class="market-container">
        <div class="checkout-layout">
          <!-- Main Content -->
          <div class="checkout-main">
            <!-- Step 1: Shipping Address -->
            <div v-if="currentStep === 1" class="checkout-section">
              <div class="section-header">
                <div class="section-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="section-content">
                  <h2 class="section-title">Shipping Address</h2>
                  <p class="section-description">Choose where your beauty essentials should be delivered</p>
                </div>
              </div>

              <!-- Saved Addresses -->
              <div v-if="savedAddresses.length > 0" class="address-selection">
                <div class="addresses-grid">
                  <div 
                    v-for="address in savedAddresses" 
                    :key="address.id"
                    :class="['address-card', { selected: selectedAddress?.id === address.id }]"
                    @click="selectAddress(address)"
                  >
                    <div class="address-header">
                      <div class="address-type-badge" :class="address.type.toLowerCase()">
                        <i :class="getAddressIcon(address.type)"></i>
                        <span>{{ address.type }}</span>
                      </div>
                      <button @click.stop="editAddress(address)" class="edit-address-btn">
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                    
                    <div class="address-content">
                      <h4 class="recipient-name">{{ address.name }}</h4>
                      <p class="address-line">{{ address.street }}</p>
                      <p class="address-line">{{ address.city }}, {{ address.state }} {{ address.pincode }}</p>
                      <p class="phone-number">
                        <i class="fas fa-phone"></i>
                        {{ address.phone }}
                      </p>
                    </div>
                    
                    <div v-if="address.isDefault" class="default-indicator">
                      <i class="fas fa-star"></i>
                      <span>Default</span>
                    </div>

                    <div class="selection-indicator">
                      <i class="fas fa-check"></i>
                    </div>
                  </div>

                  <!-- Add New Address Card -->
                  <div class="add-address-card" @click="addNewAddress">
                    <div class="add-address-content">
                      <div class="add-icon">
                        <i class="fas fa-plus"></i>
                      </div>
                      <h4>Add New Address</h4>
                      <p>Deliver to a different address</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Addresses State -->
              <div v-else class="no-addresses">
                <div class="empty-state">
                  <div class="empty-icon">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <h3>No saved addresses</h3>
                  <p>Add your first address to continue with checkout</p>
                  <button @click="addNewAddress" class="add-first-address-btn">
                    <i class="fas fa-plus"></i>
                    Add Address
                  </button>
                </div>
              </div>
            </div>

            <!-- Step 2: Payment Method -->
            <div v-if="currentStep === 2" class="checkout-section">
              <!-- Selected Address Display -->
              <div v-if="selectedAddress" class="selected-address-summary">
                <div class="address-summary-header">
                  <div class="summary-icon">
                    <i class="fas fa-check-circle"></i>
                  </div>
                  <div class="summary-content">
                    <h3 class="summary-title">Delivering to</h3>
                    <div class="address-summary-details">
                      <h4 class="summary-name">{{ selectedAddress.name }}</h4>
                      <p class="summary-address">{{ selectedAddress.street }}, {{ selectedAddress.city }}, {{ selectedAddress.state }} {{ selectedAddress.pincode }}</p>
                    </div>
                  </div>
                  <button @click="changeAddress" class="change-address-btn">
                    <i class="fas fa-edit"></i>
                    Change
                  </button>
                </div>
              </div>

              <div class="section-header">
                <div class="section-icon">
                  <i class="fas fa-credit-card"></i>
                </div>
                <div class="section-content">
                  <h2 class="section-title">Payment Method</h2>
                  <p class="section-description">Choose your preferred payment option</p>
                </div>
              </div>

              <!-- Payment Options -->
              <div class="payment-methods-grid">
                <!-- Credit/Debit Cards -->
                <div :class="['payment-method-card', { selected: selectedPayment === 'card' }]" @click="selectPayment('card')">
                  <div class="payment-header">
                    <div class="payment-icon card">
                      <i class="fas fa-credit-card"></i>
                    </div>
                    <div class="payment-content">
                      <h3>Credit/Debit Card</h3>
                      <p class="payment-description">Safe and secure payment</p>
                    </div>
                    <div class="card-brands">
                      <div class="brand-logo visa"></div>
                      <div class="brand-logo mastercard"></div>
                      <div class="brand-logo amex"></div>
                    </div>
                  </div>
                  <div class="selection-check">
                    <i class="fas fa-check"></i>
                  </div>
                </div>

                <!-- UPI -->
                <div :class="['payment-method-card', { selected: selectedPayment === 'upi' }]" @click="selectPayment('upi')">
                  <div class="payment-header">
                    <div class="payment-icon upi">
                      <i class="fas fa-qrcode"></i>
                    </div>
                    <div class="payment-content">
                      <h3>UPI</h3>
                      <p class="payment-description">Fast & secure payments</p>
                    </div>
                    <div class="payment-brands">
                      <div class="brand-logo paytm"></div>
                      <div class="brand-logo phonepe"></div>
                      <div class="brand-logo gpay"></div>
                    </div>
                  </div>
                  <div class="selection-check">
                    <i class="fas fa-check"></i>
                  </div>
                </div>

                <!-- Digital Wallets -->
                <div :class="['payment-method-card', { selected: selectedPayment === 'wallet' }]" @click="selectPayment('wallet')">
                  <div class="payment-header">
                    <div class="payment-icon wallet">
                      <i class="fas fa-wallet"></i>
                    </div>
                    <div class="payment-content">
                      <h3>Digital Wallets</h3>
                      <p class="payment-description">Quick wallet payments</p>
                    </div>
                    <div class="payment-brands">
                      <div class="brand-logo paypal"></div>
                      <div class="brand-logo applepay"></div>
                    </div>
                  </div>
                  <div class="selection-check">
                    <i class="fas fa-check"></i>
                  </div>
                </div>

                <!-- Net Banking -->
                <div :class="['payment-method-card', { selected: selectedPayment === 'netbanking' }]" @click="selectPayment('netbanking')">
                  <div class="payment-header">
                    <div class="payment-icon netbanking">
                      <i class="fas fa-university"></i>
                    </div>
                    <div class="payment-content">
                      <h3>Net Banking</h3>
                      <p class="payment-description">Secure banking gateway</p>
                    </div>
                    <div class="payment-brands">
                      <span class="bank-text">HDFC</span>
                      <span class="bank-text">SBI</span>
                      <span class="bank-text">ICICI</span>
                    </div>
                  </div>
                  <div class="selection-check">
                    <i class="fas fa-check"></i>
                  </div>
                </div>

                <!-- Cash on Delivery -->
                <div :class="['payment-method-card', { selected: selectedPayment === 'cod' }]" @click="selectPayment('cod')">
                  <div class="payment-header">
                    <div class="payment-icon cod">
                      <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div class="payment-content">
                      <h3>Cash on Delivery</h3>
                      <p class="payment-description">Pay when you receive</p>
                    </div>
                    <div class="payment-brands">
                      <div class="cod-badge">
                        <i class="fas fa-truck"></i>
                        <span>COD</span>
                      </div>
                      <div class="cod-badge">
                        <i class="fas fa-hand-holding-usd"></i>
                        <span>Cash</span>
                      </div>
                    </div>
                  </div>
                  <div class="selection-check">
                    <i class="fas fa-check"></i>
                  </div>
                </div>
              </div>

              <!-- Enhanced Payment Form -->
              <transition name="payment-form" mode="out-in">
                <div v-if="selectedPayment" class="payment-form-section">
                  <!-- Premium Card Form -->
                  <div v-if="selectedPayment === 'card'" class="payment-form">
                    <div class="form-header">
                      <div class="form-icon">
                        <i class="fas fa-credit-card"></i>
                      </div>
                      <h3 class="form-title">Card Details</h3>
                      <div class="security-badge">
                        <i class="fas fa-shield-alt"></i>
                        <span>Secured by SSL</span>
                      </div>
                    </div>
                    
                    <div class="card-form">
                      <!-- Card Number -->
                      <div class="form-group">
                        <label class="form-label">
                          <i class="fas fa-credit-card"></i>
                          Card Number
                        </label>
                        <div class="card-input-wrapper">
                          <input 
                            type="text" 
                            v-model="cardDetails.number" 
                            placeholder="1234 5678 9012 3456"
                            @input="formatCardNumber"
                            @focus="focusField('cardNumber')"
                            @blur="blurField('cardNumber')"
                            :class="['form-input', 'card-number-input', { 
                              focused: focusedField === 'cardNumber',
                              valid: isCardNumberValid,
                              error: cardDetails.number && !isCardNumberValid
                            }]"
                            maxlength="19"
                          />
                          <div class="input-icons">
                            <div class="detected-card-brand">
                              <div :class="['card-brand-icon', getCardBrand(cardDetails.number)]"></div>
                            </div>
                            <div v-if="isCardNumberValid" class="validation-icon success">
                              <i class="fas fa-check"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Expiry and CVV Row -->
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">
                            <i class="fas fa-calendar-alt"></i>
                            Expiry Date
                          </label>
                          <input 
                            type="text" 
                            v-model="cardDetails.expiry" 
                            placeholder="MM/YY"
                            @input="formatExpiry"
                            @focus="focusField('expiry')"
                            @blur="blurField('expiry')"
                            :class="['form-input', { 
                              focused: focusedField === 'expiry',
                              valid: isExpiryValid,
                              error: cardDetails.expiry && !isExpiryValid
                            }]"
                            maxlength="5"
                          />
                          <div v-if="isExpiryValid" class="validation-icon success">
                            <i class="fas fa-check"></i>
                          </div>
                        </div>
                        
                        <div class="form-group">
                          <label class="form-label">
                            <i class="fas fa-lock"></i>
                            CVV
                          </label>
                          <div class="cvv-input-wrapper">
                            <input 
                              :type="showCvv ? 'text' : 'password'"
                              v-model="cardDetails.cvv" 
                              placeholder="123"
                              @focus="focusField('cvv')"
                              @blur="blurField('cvv')"
                              :class="['form-input', { 
                                focused: focusedField === 'cvv',
                                valid: isCvvValid,
                                error: cardDetails.cvv && !isCvvValid
                              }]"
                              maxlength="4"
                            />
                            <button 
                              type="button" 
                              class="cvv-toggle" 
                              @click="showCvv = !showCvv"
                              :title="showCvv ? 'Hide CVV' : 'Show CVV'"
                            >
                              <i :class="showCvv ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                            <div v-if="isCvvValid" class="validation-icon success">
                              <i class="fas fa-check"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Cardholder Name -->
                      <div class="form-group">
                        <label class="form-label">
                          <i class="fas fa-user"></i>
                          Cardholder Name
                        </label>
                        <input 
                          type="text" 
                          v-model="cardDetails.name" 
                          placeholder="John Doe"
                          @focus="focusField('cardholderName')"
                          @blur="blurField('cardholderName')"
                          :class="['form-input', { 
                            focused: focusedField === 'cardholderName',
                            valid: isNameValid,
                            error: cardDetails.name && !isNameValid
                          }]"
                        />
                        <div v-if="isNameValid" class="validation-icon success">
                          <i class="fas fa-check"></i>
                        </div>
                      </div>
                      
                      <!-- Save Card Option -->
                      <div class="save-card-option">
                        <label class="premium-checkbox">
                          <input type="checkbox" v-model="cardDetails.saveCard" />
                          <span class="checkbox-mark">
                            <i class="fas fa-check"></i>
                          </span>
                          <span class="checkbox-content">
                            <span class="checkbox-text">Save this card for future purchases</span>
                            <span class="checkbox-subtext">
                              <i class="fas fa-shield-alt"></i>
                              Your card details are encrypted and secure
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- UPI Form -->
                  <div v-if="selectedPayment === 'upi'" class="payment-form">
                    <div class="form-header">
                      <div class="form-icon">
                        <i class="fas fa-qrcode"></i>
                      </div>
                      <h3 class="form-title">UPI Payment</h3>
                    </div>
                    
                    <div class="upi-form">
                      <div class="form-group">
                        <label class="form-label">
                          <i class="fas fa-at"></i>
                          UPI ID
                        </label>
                        <input 
                          type="text" 
                          v-model="upiDetails.id" 
                          placeholder="yourname@paytm"
                          class="form-input"
                        />
                      </div>
                      
                      <div class="divider">
                        <span>OR</span>
                      </div>
                      
                      <div class="upi-apps-section">
                        <h4 class="apps-title">Choose your UPI app</h4>
                        <div class="upi-apps-grid">
                          <div 
                            v-for="app in upiApps" 
                            :key="app.id"
                            :class="['upi-app', { selected: selectedUpiApp === app.id }]"
                            @click="selectedUpiApp = app.id"
                          >
                            <div class="app-icon">
                              <i :class="app.icon"></i>
                            </div>
                            <span>{{ app.name }}</span>
                            <div class="selection-indicator">
                              <i class="fas fa-check"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Wallet Form -->
                  <div v-if="selectedPayment === 'wallet'" class="payment-form">
                    <div class="form-header">
                      <div class="form-icon">
                        <i class="fas fa-wallet"></i>
                      </div>
                      <h3 class="form-title">Select Wallet</h3>
                    </div>
                    
                    <div class="wallet-options">
                      <div 
                        v-for="wallet in walletOptions" 
                        :key="wallet.id"
                        :class="['wallet-option', { selected: selectedWallet === wallet.id }]"
                        @click="selectedWallet = wallet.id"
                      >
                        <div class="wallet-icon">
                          <i :class="wallet.icon"></i>
                        </div>
                        <div class="wallet-info">
                          <h4>{{ wallet.name }}</h4>
                          <p>{{ wallet.description }}</p>
                        </div>
                        <div class="selection-indicator">
                          <i class="fas fa-check"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Net Banking Form -->
                  <div v-if="selectedPayment === 'netbanking'" class="payment-form">
                    <div class="form-header">
                      <div class="form-icon">
                        <i class="fas fa-university"></i>
                      </div>
                      <h3 class="form-title">Select Your Bank</h3>
                    </div>

                    <div class="bank-selection">
                      <div class="popular-banks">
                        <h4>Popular Banks</h4>
                        <div class="banks-grid">
                          <div
                            v-for="bank in popularBanks"
                            :key="bank.id"
                            :class="['bank-option', { selected: selectedBank === bank.id }]"
                            @click="selectedBank = bank.id"
                          >
                            <div class="bank-logo">
                              <span>{{ bank.name }}</span>
                            </div>
                            <div class="selection-indicator">
                              <i class="fas fa-check"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Cash on Delivery Form -->
                  <div v-if="selectedPayment === 'cod'" class="payment-form">
                    <div class="form-header">
                      <div class="form-icon">
                        <i class="fas fa-money-bill-wave"></i>
                      </div>
                      <h3 class="form-title">Cash on Delivery</h3>
                      <div class="security-badge">
                        <i class="fas fa-truck"></i>
                        <span>Pay on Delivery</span>
                      </div>
                    </div>

                    <div class="cod-info">
                      <div class="cod-benefits">
                        <h4>Why Choose Cash on Delivery?</h4>
                        <div class="benefits-list">
                          <div class="benefit-item">
                            <div class="benefit-icon">
                              <i class="fas fa-shield-alt"></i>
                            </div>
                            <div class="benefit-content">
                              <h5>Secure & Safe</h5>
                              <p>Pay only when you receive your order</p>
                            </div>
                          </div>

                          <div class="benefit-item">
                            <div class="benefit-icon">
                              <i class="fas fa-eye"></i>
                            </div>
                            <div class="benefit-content">
                              <h5>Inspect Before Payment</h5>
                              <p>Check your products before making payment</p>
                            </div>
                          </div>

                          <div class="benefit-item">
                            <div class="benefit-icon">
                              <i class="fas fa-credit-card"></i>
                            </div>
                            <div class="benefit-content">
                              <h5>No Online Transaction</h5>
                              <p>No need to share card details online</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="cod-note">
                        <div class="note-header">
                          <i class="fas fa-info-circle"></i>
                          <span>Important Information</span>
                        </div>
                        <ul class="note-list">
                          <li>Cash on Delivery is available for orders above $10</li>
                          <li>Additional COD charges may apply: $2.99</li>
                          <li>Please keep exact change ready for smooth delivery</li>
                          <li>Orders will be delivered within 3-5 business days</li>
                        </ul>
                      </div>

                      <div class="cod-confirmation">
                        <label class="premium-checkbox">
                          <input type="checkbox" v-model="codConfirmed" />
                          <span class="checkbox-mark">
                            <i class="fas fa-check"></i>
                          </span>
                          <span class="checkbox-content">
                            <span class="checkbox-text">I understand and agree to the Cash on Delivery terms</span>
                            <span class="checkbox-subtext">
                              <i class="fas fa-handshake"></i>
                              I will be available to receive the order and make payment
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Step 3: Order Review -->
            <div v-if="currentStep === 3" class="checkout-section">
              <div class="section-header">
                <div class="section-icon">
                  <i class="fas fa-clipboard-check"></i>
                </div>
                <div class="section-content">
                  <h2 class="section-title">Review Your Order</h2>
                  <p class="section-description">Confirm your details and complete your purchase</p>
                </div>
              </div>

              <!-- Order Review Content -->
              <div class="order-review">
                <div class="review-sections">
                  <!-- Address Review -->
                  <div class="review-section">
                    <div class="review-header">
                      <h3>Shipping Address</h3>
                      <button @click="currentStep = 1" class="edit-btn">
                        <i class="fas fa-edit"></i>
                        Edit
                      </button>
                    </div>
                    <div class="review-content">
                      <p class="review-name">{{ selectedAddress?.name }}</p>
                      <p class="review-address">{{ selectedAddress?.street }}, {{ selectedAddress?.city }}, {{ selectedAddress?.state }} {{ selectedAddress?.pincode }}</p>
                    </div>
                  </div>

                  <!-- Payment Review -->
                  <div class="review-section">
                    <div class="review-header">
                      <h3>Payment Method</h3>
                      <button @click="currentStep = 2" class="edit-btn">
                        <i class="fas fa-edit"></i>
                        Edit
                      </button>
                    </div>
                    <div class="review-content">
                      <div class="payment-method-display">
                        <div class="payment-icon">
                          <i :class="getPaymentIcon(selectedPayment)"></i>
                        </div>
                        <span>{{ getPaymentDisplayName(selectedPayment) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="checkout-navigation">
              <button 
                v-if="currentStep > 1" 
                @click="previousStep" 
                class="nav-btn secondary"
              >
                <i class="fas fa-arrow-left"></i>
                Back
              </button>
              
              <button
                @click="nextStep"
                :disabled="!canProceed || isProcessingOrder"
                :class="['nav-btn', 'primary', { processing: isProcessingOrder }]"
              >
                <span v-if="currentStep < 3">
                  Continue
                  <i class="fas fa-arrow-right"></i>
                </span>
                <span v-else-if="isProcessingOrder">
                  <i class="fas fa-spinner fa-spin"></i>
                  Processing Order...
                </span>
                <span v-else>
                  <i class="fas fa-lock"></i>
                  Complete Order
                </span>
              </button>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="order-summary">
            <div class="summary-card">
              <div class="summary-header">
                <h3 class="summary-title">
                  <i class="fas fa-shopping-bag"></i>
                  Order Summary
                </h3>
                <span class="item-count">{{ cartItemCount }} items</span>
              </div>

              <!-- Cart Items -->
              <div class="summary-items">
                <div 
                  v-for="item in cartItems" 
                  :key="item.id"
                  class="summary-item"
                >
                  <div class="item-image">
                    <img :src="item.image" :alt="item.name" />
                    <div class="item-quantity">{{ item.quantity }}</div>
                  </div>
                  <div class="item-details">
                    <h4 class="item-name">{{ item.name }}</h4>
                    <p class="item-brand">{{ item.brand }}</p>
                    <div class="item-variants">
                      <span v-if="item.selectedSize" class="variant">Size: {{ item.selectedSize }}</span>
                      <span v-if="item.selectedColor" class="variant">{{ item.selectedColor }}</span>
                    </div>
                  </div>
                  <div class="item-price">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>

              <!-- Promo Code -->
              <div class="promo-section">
                <div v-if="!appliedPromo" class="promo-input">
                  <input 
                    v-model="promoCode" 
                    type="text" 
                    placeholder="Enter promo code"
                    @keyup.enter="applyPromo"
                  />
                  <button @click="applyPromo" class="apply-btn">
                    Apply
                  </button>
                </div>
                <div v-else class="applied-promo">
                  <div class="promo-success">
                    <i class="fas fa-check-circle"></i>
                    <span>{{ appliedPromo.code }} applied!</span>
                  </div>
                  <button @click="removePromo" class="remove-promo">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="price-breakdown">
                <div class="price-row">
                  <span>Subtotal</span>
                  <span>${{ cartSubtotal.toFixed(2) }}</span>
                </div>
                
                <div class="price-row">
                  <span>Shipping</span>
                  <span class="shipping-cost">
                    {{ shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'FREE' }}
                  </span>
                </div>
                
                <div v-if="appliedPromo" class="price-row discount">
                  <span>Discount ({{ appliedPromo.code }})</span>
                  <span>-${{ discountAmount.toFixed(2) }}</span>
                </div>
                
                <div class="price-row">
                  <span>Tax</span>
                  <span>${{ taxAmount.toFixed(2) }}</span>
                </div>

                <div class="price-divider"></div>
                
                <div class="price-row total">
                  <span>Total</span>
                  <span>${{ grandTotal.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Security Badge -->
              <div class="security-info">
                <div class="security-badge">
                  <i class="fas fa-shield-alt"></i>
                  <span>256-bit SSL Encrypted</span>
                </div>
                <div class="security-badge">
                  <i class="fas fa-lock"></i>
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Checkout',
  data() {
    return {
      currentStep: 2, // Start at payment step to showcase card form
      focusedField: null,
      showCvv: false,
      promoCode: '',
      appliedPromo: null,
      
      steps: [
        { id: 1, title: 'Shipping', description: 'Address details' },
        { id: 2, title: 'Payment', description: 'Payment method' },
        { id: 3, title: 'Review', description: 'Confirm order' }
      ],
      
      savedAddresses: [
        {
          id: 1,
          name: 'Sarah Johnson',
          street: '123 Beauty Street, Apt 4B',
          city: 'New York',
          state: 'NY',
          pincode: '10001',
          phone: '+1 (555) 123-4567',
          type: 'Home',
          isDefault: true
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          street: '456 Office Plaza, Suite 200',
          city: 'New York',
          state: 'NY',
          pincode: '10002',
          phone: '+1 (555) 123-4567',
          type: 'Office',
          isDefault: false
        }
      ],
      
      selectedAddress: null,
      selectedPayment: 'card',
      selectedUpiApp: null,
      selectedWallet: null,
      selectedBank: null,
      codConfirmed: false,
      isProcessingOrder: false,
      
      cardDetails: {
        number: '',
        expiry: '',
        cvv: '',
        name: '',
        saveCard: false
      },
      
      upiDetails: {
        id: ''
      },
      
      upiApps: [
        { id: 'paytm', name: 'Paytm', icon: 'fas fa-mobile-alt' },
        { id: 'phonepe', name: 'PhonePe', icon: 'fas fa-phone' },
        { id: 'gpay', name: 'Google Pay', icon: 'fab fa-google' },
        { id: 'amazonpay', name: 'Amazon Pay', icon: 'fab fa-amazon' }
      ],
      
      walletOptions: [
        { id: 'paypal', name: 'PayPal', description: 'Pay with your PayPal account', icon: 'fab fa-paypal' },
        { id: 'applepay', name: 'Apple Pay', description: 'Touch ID or Face ID', icon: 'fab fa-apple' },
        { id: 'googlepay', name: 'Google Pay', description: 'Pay with Google', icon: 'fab fa-google' }
      ],
      
      popularBanks: [
        { id: 'hdfc', name: 'HDFC' },
        { id: 'sbi', name: 'SBI' },
        { id: 'icici', name: 'ICICI' },
        { id: 'axis', name: 'Axis' },
        { id: 'kotak', name: 'Kotak' },
        { id: 'pnb', name: 'PNB' }
      ]
    };
  },
  
  computed: {
    ...mapGetters('cart', [
      'cartItems', 
      'cartItemCount', 
      'cartSubtotal', 
      'shippingCost', 
      'discountAmount'
    ]),
    
    taxAmount() {
      return this.cartSubtotal * 0.085; // 8.5% tax
    },
    
    grandTotal() {
      let total = this.cartSubtotal + this.shippingCost + this.taxAmount;
      if (this.appliedPromo) {
        total -= this.discountAmount;
      }
      return total;
    },
    
    canProceed() {
      if (this.currentStep === 1) {
        return this.selectedAddress !== null;
      }
      if (this.currentStep === 2) {
        return this.selectedPayment && this.isPaymentDetailsValid;
      }
      if (this.currentStep === 3) {
        // Allow completion even with empty cart for demo purposes
        return this.selectedAddress && this.selectedPayment;
      }
      return false;
    },
    
    isPaymentDetailsValid() {
      if (this.selectedPayment === 'card') {
        return this.isCardNumberValid && this.isExpiryValid && this.isCvvValid && this.isNameValid;
      }
      if (this.selectedPayment === 'upi') {
        return this.upiDetails.id || this.selectedUpiApp;
      }
      if (this.selectedPayment === 'wallet') {
        return this.selectedWallet;
      }
      if (this.selectedPayment === 'netbanking') {
        return this.selectedBank;
      }
      if (this.selectedPayment === 'cod') {
        return this.codConfirmed;
      }
      return false;
    },
    
    isCardNumberValid() {
      const cleaned = this.cardDetails.number.replace(/\s/g, '');
      return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
    },
    
    isExpiryValid() {
      const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!regex.test(this.cardDetails.expiry)) return false;
      
      const [month, year] = this.cardDetails.expiry.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      
      return expiry > now;
    },
    
    isCvvValid() {
      return this.cardDetails.cvv.length >= 3 && this.cardDetails.cvv.length <= 4;
    },
    
    isNameValid() {
      return this.cardDetails.name.trim().length >= 2;
    }
  },
  
  mounted() {
    // Set default address
    if (this.savedAddresses.length > 0) {
      this.selectedAddress = this.savedAddresses.find(addr => addr.isDefault) || this.savedAddresses[0];
    }

    // Set default payment method for demo
    if (!this.selectedPayment) {
      this.selectedPayment = 'cod';
      this.codConfirmed = true;
    }

    console.log('Checkout mounted:', {
      selectedAddress: this.selectedAddress,
      selectedPayment: this.selectedPayment,
      currentStep: this.currentStep
    });
  },
  
  methods: {
    ...mapActions('cart', ['applyPromoCode']),
    ...mapActions('ui', ['showNotification']),
    
    nextStep() {
      if (this.canProceed) {
        if (this.currentStep === 3) {
          this.completeOrder();
        } else {
          this.currentStep++;
        }
      }
    },
    
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    
    selectAddress(address) {
      this.selectedAddress = address;
    },
    
    selectPayment(method) {
      this.selectedPayment = method;
    },
    
    formatCardNumber() {
      let value = this.cardDetails.number.replace(/\s/g, '');
      value = value.replace(/\D/g, '');
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      this.cardDetails.number = value;
    },
    
    formatExpiry() {
      let value = this.cardDetails.expiry.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      this.cardDetails.expiry = value;
    },
    
    focusField(field) {
      this.focusedField = field;
    },
    
    blurField() {
      this.focusedField = null;
    },
    
    getCardBrand(number) {
      const cleaned = number.replace(/\s/g, '');
      if (/^4/.test(cleaned)) return 'visa';
      if (/^5[1-5]/.test(cleaned)) return 'mastercard';
      if (/^3[47]/.test(cleaned)) return 'amex';
      return 'unknown';
    },
    
    getAddressIcon(type) {
      const icons = {
        'Home': 'fas fa-home',
        'Office': 'fas fa-building',
        'Other': 'fas fa-map-marker-alt'
      };
      return icons[type] || 'fas fa-map-marker-alt';
    },
    
    getPaymentIcon(method) {
      const icons = {
        'card': 'fas fa-credit-card',
        'upi': 'fas fa-qrcode',
        'wallet': 'fas fa-wallet',
        'netbanking': 'fas fa-university',
        'cod': 'fas fa-money-bill-wave'
      };
      return icons[method] || 'fas fa-credit-card';
    },

    getPaymentDisplayName(method) {
      const names = {
        'card': 'Credit/Debit Card',
        'upi': 'UPI Payment',
        'wallet': 'Digital Wallet',
        'netbanking': 'Net Banking',
        'cod': 'Cash on Delivery'
      };
      return names[method] || 'Payment Method';
    },
    
    addNewAddress() {
      this.$router.push('/add-address');
    },
    
    editAddress(address) {
      this.$router.push(`/edit-address/${address.id}`);
    },
    
    changeAddress() {
      this.currentStep = 1;
    },
    
    async applyPromo() {
      if (this.promoCode.trim()) {
        // Mock promo application
        this.appliedPromo = {
          code: this.promoCode.toUpperCase(),
          discount: 10
        };
        this.promoCode = '';
      }
    },
    
    removePromo() {
      this.appliedPromo = null;
    },
    
    async completeOrder() {
      console.log('Completing order...', {
        selectedPayment: this.selectedPayment,
        selectedAddress: this.selectedAddress,
        currentStep: this.currentStep,
        canProceed: this.canProceed
      });

      try {
        // Show loading state
        this.isProcessingOrder = true;

        // Store checkout data for order confirmation
        const checkoutData = {
          paymentMethod: this.selectedPayment,
          address: this.selectedAddress,
          orderTotal: this.grandTotal || 97.64, // fallback for demo
          cartItems: this.cartItems.length > 0 ? this.cartItems : [
            // Mock data for demo
            {
              id: 1,
              name: 'Beauty Product',
              brand: 'Demo Brand',
              price: 89.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200'
            }
          ]
        };

        console.log('Storing checkout data:', checkoutData);
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

        // Simulate API call to place order
        console.log('Simulating order processing...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate order ID
        const orderId = 'BM' + Date.now().toString().slice(-8);
        console.log('Generated order ID:', orderId);

        // Navigate to order confirmation with order ID
        console.log('Navigating to order confirmation...');
        this.$router.push({
          name: 'OrderConfirmation',
          params: { orderId }
        });

      } catch (error) {
        // Handle error
        console.error('Order placement failed:', error);
        this.showNotification({
          type: 'error',
          message: 'Failed to place order. Please try again.'
        });
      } finally {
        this.isProcessingOrder = false;
      }
    }
  }
};
</script>

<style scoped>
.checkout-page {
  background: linear-gradient(135deg, #fdf2f8 0%, #f9fafb 100%);
  min-height: 100vh;
  padding-bottom: 40px;
}

/* Progress Steps */
.checkout-progress {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 24px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.progress-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
  max-width: 600px;
  margin: 0 auto;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--gray-200);
  color: var(--gray-500);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.progress-step.active .step-circle {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
  transform: scale(1.1);
}

.progress-step.completed .step-circle {
  background: var(--success-500);
  color: white;
}

.step-info {
  text-align: center;
}

.step-title {
  display: block;
  font-weight: 600;
  color: var(--gray-800);
  font-size: 14px;
}

.step-description {
  display: block;
  font-size: 12px;
  color: var(--gray-500);
  margin-top: 2px;
}

.progress-step.active .step-title {
  color: var(--primary-600);
}

.step-connector {
  position: absolute;
  top: 24px;
  left: calc(100% + 30px);
  width: 60px;
  height: 2px;
  background: var(--gray-200);
  transition: all 0.3s ease;
}

.progress-step.completed .step-connector {
  background: var(--success-500);
}

/* Main Layout */
.checkout-content {
  padding: 40px 0;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: start;
}

.checkout-main {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--gray-100);
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--gray-100);
}

.section-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 24px;
  flex-shrink: 0;
}

.section-content {
  flex: 1;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.section-description {
  color: var(--gray-600);
  font-size: 1.1rem;
  line-height: 1.5;
}

/* Address Selection */
.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.address-card {
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
}

.address-card:hover {
  border-color: var(--primary-300);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
  transform: translateY(-2px);
}

.address-card.selected {
  border-color: var(--primary-500);
  background: linear-gradient(135deg, var(--primary-50), var(--purple-50));
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.2);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.address-type-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.address-type-badge.home {
  background: var(--success-100);
  color: var(--success-700);
}

.address-type-badge.office {
  background: var(--primary-100);
  color: var(--primary-700);
}

.address-type-badge.other {
  background: var(--gray-100);
  color: var(--gray-700);
}

.edit-address-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.edit-address-btn:hover {
  background: var(--gray-100);
  color: var(--gray-600);
}

.address-content {
  margin-bottom: 16px;
}

.recipient-name {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.address-line {
  color: var(--gray-600);
  line-height: 1.5;
  margin-bottom: 4px;
}

.phone-number {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray-600);
  font-size: 14px;
  margin-top: 8px;
}

.default-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--warning-100);
  color: var(--warning-700);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.selection-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.address-card.selected .selection-indicator {
  opacity: 1;
  transform: scale(1);
}

.add-address-card {
  border: 2px dashed var(--gray-300);
  border-radius: 16px;
  padding: 40px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-address-card:hover {
  border-color: var(--primary-400);
  background: var(--primary-25);
}

.add-address-content {
  text-align: center;
}

.add-icon {
  width: 48px;
  height: 48px;
  background: var(--gray-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: var(--gray-500);
  font-size: 20px;
  transition: all 0.3s ease;
}

.add-address-card:hover .add-icon {
  background: var(--primary-100);
  color: var(--primary-600);
}

.add-address-content h4 {
  color: var(--gray-800);
  margin-bottom: 8px;
  font-weight: 600;
}

.add-address-content p {
  color: var(--gray-600);
  font-size: 14px;
}

/* No Addresses State */
.no-addresses {
  text-align: center;
  padding: 60px 20px;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: var(--gray-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: var(--gray-400);
  font-size: 32px;
}

.empty-state h3 {
  color: var(--gray-800);
  margin-bottom: 12px;
  font-size: 1.5rem;
}

.empty-state p {
  color: var(--gray-600);
  margin-bottom: 24px;
  line-height: 1.6;
}

.add-first-address-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.add-first-address-btn:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
}

/* Selected Address Summary */
.selected-address-summary {
  background: linear-gradient(135deg, var(--success-50), var(--primary-50));
  border: 1px solid var(--success-200);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
}

.address-summary-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-icon {
  width: 40px;
  height: 40px;
  background: var(--success-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.summary-content {
  flex: 1;
}

.summary-title {
  color: var(--success-700);
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.address-summary-details h4 {
  color: var(--gray-800);
  font-weight: 600;
  margin-bottom: 4px;
}

.address-summary-details p {
  color: var(--gray-600);
}

.change-address-btn {
  background: white;
  border: 1px solid var(--gray-300);
  color: var(--gray-700);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.change-address-btn:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

/* Payment Methods */
.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.payment-method-card {
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
}

.payment-method-card:hover {
  border-color: var(--primary-300);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);
  transform: translateY(-2px);
}

.payment-method-card.selected {
  border-color: var(--primary-500);
  background: linear-gradient(135deg, var(--primary-50), var(--purple-50));
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.2);
}

.payment-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.payment-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.payment-icon.card {
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
}

.payment-icon.upi {
  background: linear-gradient(135deg, #059669, #10B981);
}

.payment-icon.wallet {
  background: linear-gradient(135deg, #EA580C, #F97316);
}

.payment-icon.netbanking {
  background: linear-gradient(135deg, #0284C7, #0EA5E9);
}

.payment-icon.cod {
  background: linear-gradient(135deg, #059669, #34D399);
}

.payment-content {
  flex: 1;
}

.payment-content h3 {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.payment-description {
  font-size: 14px;
  color: var(--gray-600);
}

.card-brands,
.payment-brands {
  display: flex;
  gap: 8px;
  align-items: center;
}

.brand-logo {
  width: 32px;
  height: 20px;
  border-radius: 4px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.brand-logo.visa {
  background: linear-gradient(135deg, #1A1F71, #0052CC);
}

.brand-logo.mastercard {
  background: linear-gradient(135deg, #EB001B, #FF5F00);
}

.brand-logo.amex {
  background: linear-gradient(135deg, #006FCF, #0099D4);
}

.brand-logo.paytm {
  background: linear-gradient(135deg, #00BAF2, #0084D6);
}

.brand-logo.phonepe {
  background: linear-gradient(135deg, #5F259F, #7B2CBF);
}

.brand-logo.gpay {
  background: linear-gradient(135deg, #4285F4, #34A853);
}

.brand-logo.paypal {
  background: linear-gradient(135deg, #003087, #009CDE);
}

.brand-logo.applepay {
  background: linear-gradient(135deg, #000000, #333333);
}

.bank-text {
  background: var(--gray-100);
  color: var(--gray-700);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.cod-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--success-100);
  color: var(--success-700);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.cod-badge i {
  font-size: 10px;
}

.selection-check {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.payment-method-card.selected .selection-check {
  opacity: 1;
  transform: scale(1);
}

/* Payment Form */
.payment-form-section {
  margin-top: 32px;
}

.payment-form {
  border: 1px solid var(--gray-200);
  border-radius: 16px;
  padding: 32px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--gray-100);
}

.form-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 20px;
}

.form-title {
  flex: 1;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-800);
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--success-50);
  color: var(--success-700);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Form Elements */
.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 8px;
  font-size: 14px;
}

.form-label i {
  color: var(--primary-500);
  font-size: 12px;
}

.form-input {
  width: 100%;
  padding: 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  color: var(--gray-800);
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
  transform: translateY(-1px);
}

.form-input.focused {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1);
}

.form-input.valid {
  border-color: var(--success-500);
  background: var(--success-25);
}

.form-input.error {
  border-color: var(--error-500);
  background: var(--error-25);
}

.form-input::placeholder {
  color: var(--gray-400);
}

/* Card Input */
.card-input-wrapper {
  position: relative;
}

.input-icons {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.detected-card-brand .card-brand-icon {
  width: 32px;
  height: 20px;
  border-radius: 4px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.card-brand-icon.visa {
  background: linear-gradient(135deg, #1A1F71, #0052CC);
}

.card-brand-icon.mastercard {
  background: linear-gradient(135deg, #EB001B, #FF5F00);
}

.card-brand-icon.amex {
  background: linear-gradient(135deg, #006FCF, #0099D4);
}

.card-brand-icon.unknown {
  background: var(--gray-200);
}

.validation-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.validation-icon.success {
  background: var(--success-500);
  color: white;
}

/* CVV Input */
.cvv-input-wrapper {
  position: relative;
}

.cvv-toggle {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.cvv-toggle:hover {
  color: var(--gray-600);
  background: var(--gray-100);
}

/* Premium Checkbox */
.premium-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 16px;
  background: var(--gray-50);
  border-radius: 12px;
  border: 1px solid var(--gray-200);
  transition: all 0.3s ease;
}

.premium-checkbox:hover {
  background: var(--gray-100);
  border-color: var(--gray-300);
}

.premium-checkbox input {
  display: none;
}

.checkbox-mark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-300);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  background: white;
}

.premium-checkbox input:checked + .checkbox-mark {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-color: var(--primary-500);
  color: white;
}

.checkbox-mark i {
  font-size: 12px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s ease;
}

.premium-checkbox input:checked + .checkbox-mark i {
  opacity: 1;
  transform: scale(1);
}

.checkbox-content {
  flex: 1;
}

.checkbox-text {
  display: block;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.checkbox-subtext {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--gray-500);
}

.checkbox-subtext i {
  color: var(--success-500);
}

/* UPI Form */
.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gray-200);
}

.divider span {
  background: white;
  padding: 0 16px;
  color: var(--gray-500);
  font-size: 14px;
  font-weight: 500;
}

.apps-title {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 16px;
}

.upi-apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.upi-app {
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
}

.upi-app:hover {
  border-color: var(--primary-300);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.upi-app.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.app-icon {
  width: 40px;
  height: 40px;
  background: var(--gray-100);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  color: var(--gray-600);
  font-size: 16px;
}

.upi-app span {
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-700);
}

.upi-app .selection-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.upi-app.selected .selection-indicator {
  opacity: 1;
  transform: scale(1);
}

/* Wallet Options */
.wallet-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wallet-option {
  display: flex;
  align-items: center;
  gap: 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
}

.wallet-option:hover {
  border-color: var(--primary-300);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.wallet-option.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.wallet-icon {
  width: 48px;
  height: 48px;
  background: var(--gray-100);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-600);
  font-size: 20px;
}

.wallet-info {
  flex: 1;
}

.wallet-info h4 {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.wallet-info p {
  font-size: 14px;
  color: var(--gray-600);
}

/* Cash on Delivery */
.cod-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cod-benefits h4 {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 16px;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--success-25);
  border-radius: 12px;
  border: 1px solid var(--success-200);
}

.benefit-icon {
  width: 40px;
  height: 40px;
  background: var(--success-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.benefit-content h5 {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.benefit-content p {
  font-size: 14px;
  color: var(--gray-600);
  line-height: 1.4;
}

.cod-note {
  background: var(--warning-25);
  border: 1px solid var(--warning-200);
  border-radius: 12px;
  padding: 20px;
}

.note-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--warning-700);
  margin-bottom: 12px;
}

.note-header i {
  font-size: 16px;
}

.note-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.note-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--gray-700);
  line-height: 1.5;
}

.note-list li:before {
  content: '•';
  color: var(--warning-600);
  font-weight: bold;
  flex-shrink: 0;
}

.note-list li:last-child {
  margin-bottom: 0;
}

.cod-confirmation {
  background: var(--primary-25);
  border: 1px solid var(--primary-200);
  border-radius: 12px;
  padding: 20px;
}

/* Bank Selection */
.popular-banks h4 {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 16px;
}

.banks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.bank-option {
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: white;
}

.bank-option:hover {
  border-color: var(--primary-300);
  transform: translateY(-2px);
}

.bank-option.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.bank-logo {
  font-weight: 600;
  color: var(--gray-700);
  font-size: 14px;
}

/* Navigation */
.checkout-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--gray-200);
}

.nav-btn {
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 140px;
  justify-content: center;
}

.nav-btn.secondary {
  background: white;
  color: var(--gray-700);
  border-color: var(--gray-300);
}

.nav-btn.secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
  transform: translateY(-1px);
}

.nav-btn.primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
}

.nav-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.nav-btn.processing {
  background: linear-gradient(135deg, var(--primary-400), var(--primary-500)) !important;
  cursor: wait;
}

.nav-btn.processing:hover {
  transform: none !important;
}

/* Order Summary */
.order-summary {
  position: sticky;
  top: 120px;
}

.summary-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--gray-100);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--gray-100);
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--gray-800);
  font-size: 1.25rem;
}

.summary-title i {
  color: var(--primary-500);
}

.item-count {
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Summary Items */
.summary-items {
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--gray-100);
}

.summary-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  background: var(--gray-100);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-quantity {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-brand {
  font-size: 12px;
  color: var(--gray-500);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.variant {
  font-size: 11px;
  background: var(--gray-100);
  color: var(--gray-600);
  padding: 2px 6px;
  border-radius: 4px;
}

.item-price {
  font-weight: 700;
  color: var(--primary-600);
  font-size: 14px;
}

/* Promo Section */
.promo-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--gray-100);
}

.promo-input {
  display: flex;
  gap: 8px;
}

.promo-input input {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
}

.promo-input input:focus {
  outline: none;
  border-color: var(--primary-500);
}

.apply-btn {
  background: var(--primary-500);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-btn:hover {
  background: var(--primary-600);
}

.applied-promo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--success-50);
  border: 1px solid var(--success-200);
  border-radius: 8px;
  padding: 12px;
}

.promo-success {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--success-700);
  font-weight: 500;
  font-size: 14px;
}

.remove-promo {
  background: none;
  border: none;
  color: var(--error-500);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.remove-promo:hover {
  background: var(--error-100);
}

/* Price Breakdown */
.price-breakdown {
  margin-bottom: 24px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 15px;
}

.price-row span:first-child {
  color: var(--gray-600);
}

.price-row span:last-child {
  font-weight: 500;
  color: var(--gray-800);
}

.price-row.discount span:last-child {
  color: var(--success-600);
}

.shipping-cost {
  color: var(--success-600) !important;
  font-weight: 600 !important;
}

.price-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 16px 0;
}

.price-row.total {
  margin-bottom: 0;
  padding-top: 12px;
  border-top: 2px solid var(--gray-200);
}

.price-row.total span {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-800);
}

.price-row.total span:last-child {
  color: var(--primary-600);
}

/* Security Info */
.security-info {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--gray-50);
  color: var(--gray-600);
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--gray-200);
}

.security-badge i {
  color: var(--success-500);
}

/* Animations */
.payment-form-enter-active, .payment-form-leave-active {
  transition: all 0.4s ease;
}

.payment-form-enter, .payment-form-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Order Review */
.order-review {
  margin-bottom: 32px;
}

.review-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-section {
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 20px;
  background: white;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.review-header h3 {
  font-weight: 600;
  color: var(--gray-800);
}

.edit-btn {
  background: none;
  border: 1px solid var(--gray-300);
  color: var(--gray-600);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

.review-content {
  color: var(--gray-600);
  line-height: 1.5;
}

.review-name {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.payment-method-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.payment-method-display .payment-icon {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .order-summary {
    position: static;
    order: -1;
  }
  
  .progress-steps {
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .checkout-main {
    padding: 24px;
    margin: 0 16px;
  }
  
  .summary-card {
    padding: 20px;
    margin: 0 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .addresses-grid,
  .payment-methods-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .progress-steps {
    gap: 20px;
    padding: 0 16px;
  }
  
  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
  
  .step-connector {
    width: 20px;
    left: calc(100% + 10px);
  }
  
  .checkout-navigation {
    flex-direction: column-reverse;
  }
  
  .nav-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .checkout-content {
    padding: 20px 0;
  }
  
  .checkout-main,
  .summary-card {
    margin: 0 12px;
    padding: 16px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .form-input {
    padding: 14px;
  }
  
  .progress-steps {
    flex-direction: column;
    gap: 16px;
  }
  
  .step-connector {
    display: none;
  }
}
</style>
