<template>
  <div style="padding: 40px; background: #f9fafb; min-height: 100vh;">
    
    <!-- Demo Page Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 36px; font-weight: 700; color: #1f2937; margin-bottom: 16px;">Refund Modal Demo</h1>
      <p style="color: #6b7280; font-size: 18px;">Click the button below to see the enhanced refund flow</p>
    </div>

    <!-- Demo Button -->
    <div style="text-align: center; margin-bottom: 40px;">
      <button @click="openRefundModal" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 18px; cursor: pointer; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
        <i class="fas fa-undo" style="margin-right: 8px;"></i>
        Demo Refund Process
      </button>
    </div>

    <!-- Sample Order Card -->
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);">
      <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 16px;">Sample Order #10234</h3>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <p style="color: #6b7280; margin: 0 0 8px 0;">3 items • Delivered Jan 15, 2024</p>
          <p style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0;">Total: ₹2,499.00</p>
        </div>
        <button @click="openRefundModal" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">
          Request Refund
        </button>
      </div>
    </div>

    <!-- Step 1: Initial Form Modal -->
    <div v-if="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;" @click="closeModal">
      <div style="background: white; border-radius: 16px; width: 100%; max-width: 420px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2); animation: modalSlideIn 0.3s ease;" @click.stop>

        <!-- Header -->
        <div style="padding: 20px 20px 16px; border-bottom: 1px solid #f0f0f0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 4px; background: linear-gradient(135deg, #8b4e9f, #d946b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Refund Request</h2>
              <p style="color: #6b7280; margin: 0; font-size: 13px;">Quick and secure refunds for eligible delivered items.</p>
            </div>
            <button @click="closeModal" style="width: 32px; height: 32px; border-radius: 50%; background: #f8fafc; border: 1px solid #e5e7eb; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #6b7280;">×</button>
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 20px;">

          <!-- Form -->
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 6px; font-size: 14px;">
              Reason for Refund *
            </label>
            <select v-model="refundReason" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #374151; box-sizing: border-box; background: #fff;">
              <option value="">Select a reason</option>
              <option value="defective">Product is defective</option>
              <option value="damaged">Product arrived damaged</option>
              <option value="wrong-item">Wrong item received</option>
              <option value="not-as-described">Not as described</option>
            </select>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-weight: 600; color: #1f2937; margin-bottom: 6px; font-size: 14px;">
              Additional Comments <span style="color: #9ca3af; font-weight: 400;">(Optional)</span>
            </label>
            <textarea v-model="refundComments" placeholder="Brief description of the issue..." style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #374151; box-sizing: border-box; font-family: inherit; resize: vertical; min-height: 80px;"></textarea>
          </div>

          <!-- Buttons -->
          <div style="display: flex; gap: 12px;">
            <button @click="closeModal" style="flex: 1; padding: 12px; border: 2px solid #e5e7eb; background: #fff; color: #6b7280; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
              Cancel
            </button>
            <button @click="continueRefund" :disabled="!refundReason" :style="{ flex: '2', padding: '12px', background: refundReason ? 'linear-gradient(135deg, #8b4e9f, #7c3aed)' : '#e5e7eb', color: refundReason ? 'white' : '#9ca3af', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: refundReason ? 'pointer' : 'not-allowed' }">
              Continue
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Step 2: Confirmation Modal -->
    <div v-if="showConfirmation" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;" @click="closeConfirmation">
      <div style="background: white; border-radius: 24px; width: 100%; max-width: 480px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); animation: modalSlideIn 0.4s ease; position: relative;" @click.stop>

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 32px 24px; border-radius: 24px 24px 0 0; text-align: center; color: white; position: relative; overflow: hidden;">
          <div style="position: relative; z-index: 1;">
            <div style="width: 64px; height: 64px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; backdrop-filter: blur(10px);">
              <i class="fas fa-wallet" style="font-size: 28px;"></i>
            </div>
            <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">Instant Store Wallet Refund</h2>
            <p style="opacity: 0.9; margin: 0; font-size: 14px;">Fastest refund method with bonus credits</p>
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Refund Amount -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
              <div style="font-size: 14px; color: #16a34a; font-weight: 600; margin-bottom: 4px;">TOTAL REFUND AMOUNT</div>
              <div style="font-size: 32px; font-weight: 700; color: #15803d; margin-bottom: 8px;">₹2,499.00</div>
              <div style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #22c55e; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                <i class="fas fa-bolt" style="font-size: 10px;"></i>
                <span>+5% BONUS CREDITS</span>
              </div>
            </div>
          </div>

          <!-- Your exact message -->
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #22c55e;">
            <p style="margin: 0; line-height: 1.6; color: #374151; font-size: 15px;">
              You will receive a total refund of <strong style="color: #15803d;">₹2,499.00</strong>. Your refund will be credited instantly to your Store Wallet for faster future shopping. No waiting for bank approvals — shop again right away!
            </p>
          </div>

          <!-- Benefits -->
          <div style="margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div style="width: 32px; height: 32px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-zap" style="color: white; font-size: 14px;"></i>
              </div>
              <div>
                <div style="font-weight: 600; color: #1f2937; font-size: 14px;">Instant Credit</div>
                <div style="color: #6b7280; font-size: 12px;">Money available immediately</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div style="width: 32px; height: 32px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-gift" style="color: white; font-size: 14px;"></i>
              </div>
              <div>
                <div style="font-weight: 600; color: #1f2937; font-size: 14px;">5% Bonus Credits</div>
                <div style="color: #6b7280; font-size: 12px;">Extra ₹125 bonus</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 32px; height: 32px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-shopping-bag" style="color: white; font-size: 14px;"></i>
              </div>
              <div>
                <div style="font-weight: 600; color: #1f2937; font-size: 14px;">Shop Immediately</div>
                <div style="color: #6b7280; font-size: 12px;">Use credits for next purchase</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px;">
            <button @click="closeConfirmation" style="flex: 1; padding: 14px 20px; border: 2px solid #e5e7eb; background: white; color: #6b7280; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer;">
              <i class="fas fa-arrow-left" style="margin-right: 6px;"></i>
              Go Back
            </button>
            <button @click="submitRefund" style="flex: 2; padding: 14px 20px; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
              <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
              Submit Refund Request
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Step 3: Success Modal -->
    <div v-if="showSuccess" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;" @click="closeSuccess">
      <div style="background: white; border-radius: 24px; width: 100%; max-width: 500px; box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3); text-align: left; padding: 48px 32px; animation: successSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);" @click.stop>

        <!-- Success Message -->
        <h2 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0; text-align: left;">Refund Successful!</h2>
        <p style="color: #6b7280; margin: 0 0 32px 0; line-height: 1.6; font-size: 16px;">
          Your refund of <strong style="color: #15803d;">₹2,499.00</strong> has been added to your Store Wallet.
        </p>

        <!-- Wallet Details -->
        <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 16px; padding: 24px; margin-bottom: 32px; text-align: left; border: 2px solid #22c55e;">
          <h3 style="font-size: 16px; font-weight: 700; color: #15803d; margin: 0 0 16px 0; text-align: center;">💰 Store Wallet Updated</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #22c55e; text-align: center;">
              <span style="font-size: 14px; color: #6b7280; font-weight: 500; display: block; margin-bottom: 4px;">Refund Amount</span>
              <span style="color: #15803d; font-weight: 700; font-size: 16px;">₹2,499.00</span>
            </div>
            <div style="background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #22c55e; text-align: center;">
              <span style="font-size: 14px; color: #6b7280; font-weight: 500; display: block; margin-bottom: 4px;">Bonus Credits</span>
              <span style="color: #f59e0b; font-weight: 700; font-size: 16px;">+₹125</span>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div style="text-align: right;">
          <button @click="goToHome" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);">
            <i class="fas fa-shopping-bag" style="margin-right: 8px;"></i>
            Continue Shopping
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'RefundDemo',
  data() {
    return {
      showModal: false,
      showConfirmation: false,
      showSuccess: false,
      refundReason: '',
      refundComments: ''
    };
  },
  methods: {
    openRefundModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.refundReason = '';
      this.refundComments = '';
    },
    closeConfirmation() {
      this.showConfirmation = false;
    },
    closeSuccess() {
      this.showSuccess = false;
    },
    goToHome() {
      this.showSuccess = false;
      this.$router.push('/');
    },
    continueRefund() {
      if (!this.refundReason) return;
      this.showModal = false;
      this.showConfirmation = true;
    },
    submitRefund() {
      this.showConfirmation = false;
      this.showSuccess = true;
      
      // Reset form
      this.refundReason = '';
      this.refundComments = '';
    }
  }
};
</script>

<style scoped>
@keyframes modalSlideIn {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes successSlideIn {
  from {
    transform: scale(0.8) translateY(30px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes successPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
