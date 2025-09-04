<template>
  <div class="my-orders-page">
    <PageHeader
      title="My Orders"
      subtitle="Track and manage your beauty purchases"
    />

    <!-- Filter and Sort Section -->
    <div class="filters-section">
      <div class="market-container">
        <div class="filters-content">
          <!-- Filter Tabs -->
          <div class="filter-tabs">
            <button 
              v-for="filter in filterOptions" 
              :key="filter.key"
              @click="setActiveFilter(filter.key)"
              :class="['filter-tab', { active: activeFilter === filter.key }]"
            >
              <div class="filter-icon">
                <i :class="filter.icon"></i>
              </div>
              <div class="filter-text">
                <span class="filter-label">{{ filter.label }}</span>
                <span v-if="getFilterCount(filter.key) > 0" class="filter-count">
                  {{ getFilterCount(filter.key) }}
                </span>
              </div>
            </button>
          </div>

          <!-- Sort Dropdown -->
          <div class="sort-section">
            <label class="sort-label">Sort by:</label>
            <select v-model="sortBy" @change="applySorting" class="sort-dropdown">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Content -->
    <div class="orders-content">
      <div class="market-container">
        <!-- Empty State -->
        <div v-if="filteredOrders.length === 0" class="empty-state">
          <div class="empty-illustration">
            <div class="empty-icon">
              <i class="fas fa-shopping-bag"></i>
            </div>
            <div class="empty-circles">
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="circle"></div>
            </div>
          </div>
          <h3 class="empty-title">{{ getEmptyStateTitle() }}</h3>
          <p class="empty-text">{{ getEmptyStateText() }}</p>
          <button @click="startShopping" class="shop-now-btn">
            <i class="fas fa-shopping-cart"></i>
            <span>Shop Now</span>
          </button>
        </div>

        <!-- Orders List -->
        <div v-else class="orders-list">
          <Transition name="fade" mode="out-in">
            <div :key="activeFilter" class="orders-grid">
              <div 
                v-for="order in paginatedOrders" 
                :key="order.id"
                class="order-card"
                @click="viewOrderDetails(order)"
              >
                <!-- Product Thumbnail -->
                <div class="order-thumbnail">
                  <img :src="order.mainProduct.image" :alt="order.mainProduct.name" />
                  <div v-if="order.items.length > 1" class="items-count">
                    +{{ order.items.length - 1 }}
                  </div>
                </div>

                <!-- Order Information -->
                <div class="order-info">
                  <div class="order-header">
                    <h3 class="order-id">Order #{{ order.id }}</h3>
                    <div class="order-status">
                      <span :class="['status-badge', getStatusClass(order.status)]">
                        <i :class="getStatusIcon(order.status)"></i>
                        {{ order.status }}
                      </span>
                    </div>
                  </div>

                  <div class="product-info">
                    <h4 class="product-name">{{ order.mainProduct.name }}</h4>
                    <div class="product-meta">
                      <span class="quantity">Qty: {{ order.totalQuantity }}</span>
                      <span class="price">₹{{ order.total.toFixed(2) }}</span>
                    </div>
                  </div>

                  <div class="order-footer">
                    <div class="order-date">
                      <i class="fas fa-calendar-alt"></i>
                      <span>{{ formatOrderDate(order.date) }}</span>
                    </div>
                    <button 
                      @click.stop="viewOrderDetails(order)" 
                      class="view-details-btn"
                    >
                      <span>View Details</span>
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Load More Button -->
          <div v-if="hasMoreOrders" class="load-more-section">
            <button @click="loadMore" class="load-more-btn">
              <i class="fas fa-chevron-down"></i>
              <span>Load More Orders</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderModal" class="order-modal-overlay" @click="closeOrderModal">
      <div class="order-modal-content" @click.stop>
        <div class="modal-header">
          <h3>Order Details</h3>
          <button @click="closeOrderModal" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="selectedOrder" class="order-details">
            <!-- Order Summary -->
            <div class="detail-section">
              <h4>Order Summary</h4>
              <div class="summary-info">
                <div class="summary-row">
                  <span>Order ID:</span>
                  <span>#{{ selectedOrder.id }}</span>
                </div>
                <div class="summary-row">
                  <span>Order Date:</span>
                  <span>{{ formatFullDate(selectedOrder.date) }}</span>
                </div>
                <div class="summary-row">
                  <span>Status:</span>
                  <span :class="['status-badge', getStatusClass(selectedOrder.status)]">
                    <i :class="getStatusIcon(selectedOrder.status)"></i>
                    {{ selectedOrder.status }}
                  </span>
                </div>
                <div class="summary-row">
                  <span>Total Amount:</span>
                  <span class="total-amount">₹{{ selectedOrder.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="detail-section">
              <h4>Items Ordered</h4>
              <div class="items-list">
                <div v-for="item in selectedOrder.items" :key="item.id" class="item-row">
                  <img :src="item.image" :alt="item.name" class="item-image" />
                  <div class="item-details">
                    <h5>{{ item.name }}</h5>
                    <p>{{ item.brand }}</p>
                    <div class="item-meta">
                      <span>Qty: {{ item.quantity }}</span>
                      <span class="item-price">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Information -->
            <div v-if="selectedOrder.deliveryInfo" class="detail-section">
              <h4>Delivery Information</h4>
              <div class="delivery-info">
                <p class="delivery-address">{{ selectedOrder.deliveryInfo.address }}</p>
                <div v-if="selectedOrder.deliveryInfo.estimatedDate" class="delivery-date">
                  <i class="fas fa-truck"></i>
                  <span>Estimated Delivery: {{ formatFullDate(selectedOrder.deliveryInfo.estimatedDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button
            v-if="selectedOrder.status !== 'Delivered'"
            @click="trackOrder(selectedOrder)"
            class="track-order-btn"
          >
            <i class="fas fa-map-marker-alt"></i>
            Track Order
          </button>
          <button
            v-if="selectedOrder.status === 'Delivered'"
            @click="requestRefund(selectedOrder)"
            class="refund-btn"
          >
            <i class="fas fa-undo"></i>
            Request Refund
          </button>
          <button @click="reorderItems(selectedOrder)" class="reorder-btn">
            <i class="fas fa-redo"></i>
            Reorder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import PageHeader from '../components/ui/PageHeader.vue';

export default {
  name: 'Orders',
  components: {
    PageHeader
  },
  data() {
    return {
      activeFilter: 'all',
      sortBy: 'newest',
      showOrderModal: false,
      selectedOrder: null,
      currentPage: 1,
      ordersPerPage: 10,
      
      filterOptions: [
        { key: 'all', label: 'All', icon: 'fas fa-list' },
        { key: 'delivered', label: 'Delivered', icon: 'fas fa-check-circle' },
        { key: 'confirmed', label: 'Confirmed', icon: 'fas fa-clock' },
        { key: 'cancelled', label: 'Cancelled', icon: 'fas fa-times-circle' },
        { key: 'processing', label: 'Processing', icon: 'fas fa-cog' }
      ],
      
      // Mock orders data - in real app this would come from store/API
      orders: [
        {
          id: '10234',
          date: new Date('2024-01-15'),
          status: 'Delivered',
          total: 2499,
          totalQuantity: 3,
          mainProduct: {
            name: 'Luxury Moisturizing Face Cream',
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300'
          },
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
          deliveryInfo: {
            address: '123 Beauty Lane, Bandra West, Mumbai, Maharashtra 400001',
            estimatedDate: new Date('2024-01-20')
          }
        },
        {
          id: '10233',
          date: new Date('2024-01-12'),
          status: 'Processing',
          total: 1899,
          totalQuantity: 2,
          mainProduct: {
            name: 'Hyaluronic Acid Moisturizer',
            image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300'
          },
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
          deliveryInfo: {
            address: '123 Beauty Lane, Bandra West, Mumbai, Maharashtra 400001',
            estimatedDate: new Date('2024-01-18')
          }
        },
        {
          id: '10232',
          date: new Date('2024-01-10'),
          status: 'Confirmed',
          total: 1299,
          totalQuantity: 1,
          mainProduct: {
            name: 'Niacinamide Pore Refining Serum',
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300'
          },
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
          deliveryInfo: {
            address: '123 Beauty Lane, Bandra West, Mumbai, Maharashtra 400001',
            estimatedDate: new Date('2024-01-16')
          }
        },
        {
          id: '10231',
          date: new Date('2024-01-08'),
          status: 'Cancelled',
          total: 799,
          totalQuantity: 1,
          mainProduct: {
            name: 'Retinol Night Cream',
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300'
          },
          items: [
            {
              id: 7,
              name: 'Retinol Night Cream',
              brand: 'AgeReverse',
              image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300',
              price: 799,
              quantity: 1
            }
          ],
          deliveryInfo: {
            address: '123 Beauty Lane, Bandra West, Mumbai, Maharashtra 400001'
          }
        }
      ]
    };
  },
  
  computed: {
    filteredOrders() {
      let filtered = this.orders;
      
      if (this.activeFilter !== 'all') {
        filtered = filtered.filter(order => 
          order.status.toLowerCase() === this.activeFilter.toLowerCase()
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        if (this.sortBy === 'newest') {
          return new Date(b.date) - new Date(a.date);
        } else {
          return new Date(a.date) - new Date(b.date);
        }
      });
      
      return filtered;
    },
    
    paginatedOrders() {
      const startIndex = 0;
      const endIndex = this.currentPage * this.ordersPerPage;
      return this.filteredOrders.slice(startIndex, endIndex);
    },
    
    hasMoreOrders() {
      return this.paginatedOrders.length < this.filteredOrders.length;
    }
  },
  
  methods: {
    ...mapActions('ui', ['showNotification']),
    ...mapActions('cart', ['addToCart']),
    
    
    setActiveFilter(filter) {
      this.activeFilter = filter;
      this.currentPage = 1; // Reset pagination
    },
    
    applySorting() {
      this.currentPage = 1; // Reset pagination
    },
    
    getFilterCount(filterKey) {
      if (filterKey === 'all') {
        return this.orders.length;
      }
      return this.orders.filter(order => 
        order.status.toLowerCase() === filterKey.toLowerCase()
      ).length;
    },
    
    getStatusClass(status) {
      const statusMap = {
        'delivered': 'status-delivered',
        'confirmed': 'status-confirmed',
        'cancelled': 'status-cancelled',
        'processing': 'status-processing',
        'shipped': 'status-processing' // Treat shipped as processing
      };
      return statusMap[status.toLowerCase()] || 'status-default';
    },
    
    getStatusIcon(status) {
      const iconMap = {
        'delivered': 'fas fa-check-circle',
        'confirmed': 'fas fa-clock',
        'cancelled': 'fas fa-times-circle',
        'processing': 'fas fa-cog',
        'shipped': 'fas fa-truck'
      };
      return iconMap[status.toLowerCase()] || 'fas fa-info-circle';
    },
    
    formatOrderDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(date));
    },
    
    formatFullDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(date));
    },
    
    getEmptyStateTitle() {
      const titles = {
        all: 'No orders found',
        delivered: 'No delivered orders',
        confirmed: 'No confirmed orders',
        cancelled: 'No cancelled orders',
        processing: 'No processing orders'
      };
      return titles[this.activeFilter] || 'No orders found';
    },
    
    getEmptyStateText() {
      if (this.activeFilter === 'all') {
        return 'Start shopping now!';
      }
      return `You don't have any ${this.activeFilter} orders yet.`;
    },
    
    startShopping() {
      this.$router.push('/');
    },
    
    viewOrderDetails(order) {
      this.$router.push(`/order-details/${order.id}`);
    },
    
    closeOrderModal() {
      this.showOrderModal = false;
      this.selectedOrder = null;
    },
    
    trackOrder(order) {
      this.$router.push(`/order-tracking/${order.id}`);
    },
    
    async reorderItems(order) {
      try {
        for (const item of order.items) {
          await this.addToCart({
            id: item.id,
            name: item.name,
            brand: item.brand,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          });
        }
        
        this.showNotification({
          type: 'success',
          message: `${order.items.length} items added to cart`
        });
        
        this.closeOrderModal();
        this.$router.push('/cart');
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to add items to cart. Please try again.'
        });
      }
    },

    requestRefund(order) {
      this.showNotification({
        type: 'info',
        message: 'Refund request initiated. You will be redirected to the refund page.'
      });
      this.closeOrderModal();
      this.$router.push(`/returns?orderId=${order.id}`);
    },

    loadMore() {
      this.currentPage++;
    }
  }
};
</script>

<style scoped>
.my-orders-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Header Section */
.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: #e2e8f0;
  transform: translateX(-2px);
}

.header-main {
  flex: 1;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
}

.header-spacer {
  width: 80px;
}

/* Filters Section */
.filters-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 0;
}

.filters-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.filter-tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #374151;
  min-height: 56px;
  font-size: 0.875rem;
}

.filter-tab:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.filter-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.filter-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.filter-label {
  font-weight: 600;
  font-size: 0.875rem;
}

.filter-count {
  font-size: 0.75rem;
  opacity: 0.8;
}

.filter-tab.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 8px;
  margin-top: 0.25rem;
}

.sort-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.sort-dropdown {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;
}

.sort-dropdown:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Orders Content */
.orders-content {
  padding: 2rem 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 400px;
  margin: 0 auto;
}

.empty-illustration {
  position: relative;
  margin-bottom: 2rem;
}

.empty-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto;
  animation: float 3s ease-in-out infinite;
}

.empty-circles {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle {
  position: absolute;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.circle:nth-child(1) {
  width: 140px;
  height: 140px;
  animation-delay: 0s;
}

.circle:nth-child(2) {
  width: 160px;
  height: 160px;
  animation-delay: 0.5s;
}

.circle:nth-child(3) {
  width: 180px;
  height: 180px;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.6;
  }
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.75rem;
}

.empty-text {
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.shop-now-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.shop-now-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
}

/* Orders Grid */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.order-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15);
}

.order-thumbnail {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 2px solid #e5e7eb;
}

.order-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.items-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.order-id {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-delivered {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.status-confirmed {
  background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
  color: #1e40af;
}

.status-cancelled {
  background: linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%);
  color: #991b1b;
}

.status-processing {
  background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
  color: #92400e;
}

.product-info {
  margin-bottom: 1rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.quantity {
  color: #6b7280;
}

.price {
  font-weight: 700;
  color: #667eea;
  font-size: 1rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.order-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.order-date i {
  color: #9ca3af;
}

.view-details-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #667eea;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-details-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Load More */
.load-more-section {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.load-more-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f0f4ff;
  transform: translateY(-2px);
}

/* Order Modal */
.order-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.order-modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.summary-info {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.summary-row span:first-child {
  color: #6b7280;
}

.summary-row span:last-child {
  font-weight: 500;
  color: #374151;
}

.total-amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: #667eea !important;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-row {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
}

.item-details h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.25rem 0;
}

.item-details p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.item-price {
  font-weight: 600;
  color: #667eea;
}

.delivery-info {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
}

.delivery-address {
  color: #374151;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.delivery-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.delivery-date i {
  color: #667eea;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
}

.track-order-btn,
.refund-btn,
.reorder-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.track-order-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.track-order-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.reorder-btn {
  background: #f8fafc;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.refund-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.refund-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.reorder-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f0f4ff;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .orders-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
  
  .filters-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-tabs {
    justify-content: flex-start;
    gap: 0.5rem;
  }

  .filter-tab {
    padding: 0.75rem 1rem;
    min-height: 48px;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .header-content {
    gap: 0.5rem;
  }
  
  .header-spacer {
    width: 60px;
  }
  
  .orders-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-tabs {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .filter-tab {
    justify-content: center;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .view-details-btn {
    justify-content: center;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .orders-content {
    padding: 1rem 0;
  }
  
  .order-card {
    padding: 1rem;
  }
  
  .order-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .product-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .filter-tabs {
    gap: 0.375rem;
  }

  .filter-tab {
    flex: 1;
    min-width: 0;
    padding: 0.625rem 0.5rem;
    min-height: 44px;
    border-radius: 12px;
  }

  .filter-icon {
    display: none;
  }

  .filter-text {
    align-items: center;
    width: 100%;
  }

  .filter-label {
    font-size: 0.75rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .filter-count {
    font-size: 0.7rem;
    margin-top: 0.125rem;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.5rem;
  }
  
  .item-row {
    flex-direction: column;
    text-align: center;
  }
  
  .item-image {
    align-self: center;
  }
}
</style>
