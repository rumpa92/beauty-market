<template>
  <div class="order-details-page" style="background: #f9fafb; min-height: 100vh; padding: 40px 20px;">
    <div style="max-width: 1200px; margin: 0 auto;">
      
      <!-- Header -->
      <div style="margin-bottom: 30px; display: flex; align-items: center; gap: 20px;">
        <button @click="goBack" style="background: #fff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 12px 16px; color: #6b7280; font-weight: 600; cursor: pointer;">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <div>
          <h1 style="font-size: 28px; font-weight: 700; color: #1f2937; margin: 0;">Order Details</h1>
          <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 14px;">Track your order and manage details</p>
        </div>
      </div>

      <!-- Order Summary -->
      <div style="background: #fff; border-radius: 20px; padding: 32px; margin-bottom: 24px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap;">
          <div>
            <h2 style="font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0;">Order #{{ orderData.id }}</h2>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">{{ formatDate(orderData.date) }}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span :style="getStatusStyle(orderData.status)" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 25px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
              <i :class="getStatusIcon(orderData.status)"></i>
              {{ orderData.status }}
            </span>
            <!-- Refund Button - Only for delivered orders -->
            <button 
              v-if="orderData.status === 'Delivered'" 
              @click="requestRefund"
              style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px;"
            >
              <i class="fas fa-undo"></i>
              Request Refund
            </button>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div style="background: #fff; border-radius: 20px; padding: 32px; margin-bottom: 24px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
        <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 24px 0;">Order Items</h3>
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <div 
            v-for="item in orderData.items" 
            :key="item.id"
            style="display: flex; gap: 16px; padding: 20px; background: #f9fafb; border-radius: 16px; border: 1px solid #f0f0f0;"
          >
            <div style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden; flex-shrink: 0;">
              <img :src="item.image" :alt="item.name" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="flex: 1;">
              <h4 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 8px 0; line-height: 1.4;">{{ item.name }}</h4>
              <p style="font-size: 14px; color: #8b4e9f; margin: 0 0 12px 0; font-weight: 500;">{{ item.brand }}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #6b7280; font-weight: 500;">Qty: {{ item.quantity }}</span>
                <span style="font-size: 16px; font-weight: 700; color: #8b4e9f;">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delivery Address -->
      <div style="background: #fff; border-radius: 20px; padding: 32px; margin-bottom: 24px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
        <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 24px 0;">Delivery Address</h3>
        <div style="background: #f9fafb; padding: 24px; border-radius: 16px; border: 1px solid #f0f0f0;">
          <h4 style="font-size: 18px; font-weight: 700; color: #1f2937; margin: 0 0 8px 0;">{{ orderData.deliveryAddress.name }}</h4>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px 0; font-weight: 500;">+91 {{ orderData.deliveryAddress.phone }}</p>
          <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0;">
            {{ orderData.deliveryAddress.street }}, 
            {{ orderData.deliveryAddress.city }}, 
            {{ orderData.deliveryAddress.state }} - {{ orderData.deliveryAddress.pincode }}
          </p>
        </div>
      </div>

      <!-- Price Breakdown -->
      <div style="background: #fff; border-radius: 20px; padding: 32px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
        <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 24px 0;">Price Breakdown</h3>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 16px;">
            <span style="color: #6b7280; font-weight: 500;">Item Subtotal</span>
            <span style="font-weight: 600; color: #1f2937;">₹{{ orderData.pricing.subtotal.toFixed(2) }}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 16px;">
            <span style="color: #6b7280; font-weight: 500;">Tax</span>
            <span style="font-weight: 600; color: #1f2937;">₹{{ orderData.pricing.tax.toFixed(2) }}</span>
          </div>
          <div v-if="orderData.pricing.discount > 0" style="display: flex; justify-content: space-between; align-items: center; font-size: 16px;">
            <span style="color: #6b7280; font-weight: 500;">Discount</span>
            <span style="font-weight: 600; color: #22c55e;">-₹{{ orderData.pricing.discount.toFixed(2) }}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 16px;">
            <span style="color: #6b7280; font-weight: 500;">Shipping Fee</span>
            <span style="font-weight: 600; color: #1f2937;">
              {{ orderData.pricing.shipping === 0 ? 'FREE' : '₹' + orderData.pricing.shipping.toFixed(2) }}
            </span>
          </div>
          <div style="height: 2px; background: linear-gradient(90deg, #f0e6e6 0%, #e9d5ff 50%, #f0e6e6 100%); margin: 8px 0; border-radius: 1px;"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 18px; font-weight: 700;">
            <span style="color: #1f2937;">Total Amount Paid</span>
            <span style="color: #8b4e9f; font-size: 20px;">₹{{ orderData.pricing.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailsFinal',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      orderData: null,
      // Mock orders data
      orders: [
        {
          id: '10234',
          date: new Date('2024-01-15'),
          status: 'Delivered',
          total: 2499,
          items: [
            {
              id: 1,
              name: 'Luxury Moisturizing Face Cream',
              brand: 'GlowLux',
              image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300',
              price: 1299,
              quantity: 1
            },
            {
              id: 2,
              name: 'Vitamin C Brightening Serum',
              brand: 'VitaGlow',
              image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
              price: 899,
              quantity: 1
            },
            {
              id: 3,
              name: 'Gentle Foaming Cleanser',
              brand: 'PureClean',
              image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300',
              price: 599,
              quantity: 1
            }
          ],
          deliveryAddress: {
            name: 'Rumpa Samanta',
            phone: '9876543210',
            street: '123 Beauty Lane, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          pricing: {
            subtotal: 2797,
            tax: 252,
            discount: 300,
            shipping: 0,
            total: 2499
          }
        },
        {
          id: '10233',
          date: new Date('2024-01-12'),
          status: 'Processing',
          total: 1899,
          items: [
            {
              id: 4,
              name: 'Hyaluronic Acid Moisturizer',
              brand: 'HydraLux',
              image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300',
              price: 999,
              quantity: 1
            },
            {
              id: 5,
              name: 'SPF 50 Daily Sunscreen',
              brand: 'SunGuard',
              image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300',
              price: 899,
              quantity: 1
            }
          ],
          deliveryAddress: {
            name: 'Rumpa Samanta',
            phone: '9876543210',
            street: '123 Beauty Lane, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          pricing: {
            subtotal: 1898,
            tax: 171,
            discount: 170,
            shipping: 0,
            total: 1899
          }
        },
        {
          id: '10232',
          date: new Date('2024-01-10'),
          status: 'Confirmed',
          total: 1299,
          items: [
            {
              id: 6,
              name: 'Niacinamide Pore Refining Serum',
              brand: 'ClearSkin',
              image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
              price: 1299,
              quantity: 1
            }
          ],
          deliveryAddress: {
            name: 'Rumpa Samanta',
            phone: '9876543210',
            street: '123 Beauty Lane, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          pricing: {
            subtotal: 1299,
            tax: 117,
            discount: 117,
            shipping: 0,
            total: 1299
          }
        }
      ]
    };
  },
  mounted() {
    this.loadOrder();
  },
  methods: {
    loadOrder() {
      this.orderData = this.orders.find(order => order.id === this.orderId);
      if (!this.orderData) {
        this.$router.push('/orders');
      }
    },
    goBack() {
      this.$router.push('/orders');
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getStatusStyle(status) {
      const styles = {
        'Processing': 'background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e; border: 1px solid #f59e0b;',
        'Confirmed': 'background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1e40af; border: 1px solid #3b82f6;',
        'Shipped': 'background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); color: #5b21b6; border: 1px solid #8b5cf6;',
        'Out for Delivery': 'background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%); color: #c2410c; border: 1px solid #f97316;',
        'Delivered': 'background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); color: #15803d; border: 1px solid #22c55e;',
        'Cancelled': 'background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color: #dc2626; border: 1px solid #ef4444;'
      };
      return styles[status] || styles['Processing'];
    },
    getStatusIcon(status) {
      const icons = {
        'Processing': 'fas fa-clock',
        'Confirmed': 'fas fa-check',
        'Shipped': 'fas fa-shipping-fast',
        'Out for Delivery': 'fas fa-truck',
        'Delivered': 'fas fa-check-circle',
        'Cancelled': 'fas fa-times-circle'
      };
      return icons[status] || 'fas fa-clock';
    },
    requestRefund() {
      if (confirm('Are you sure you want to request a refund for this order?')) {
        alert('Refund request submitted! You will receive an email confirmation shortly.');
      }
    }
  }
};
</script>
