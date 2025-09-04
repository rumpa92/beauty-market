<template>
  <div class="order-details-test">
    <div class="market-container">
      <h1>Order Details Test</h1>
      <p>Order ID: {{ $route.params.orderId }}</p>
      <div class="test-content">
        <div class="card">
          <h2>This is a test page</h2>
          <p>If you can see this, the routing and basic structure are working.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailsTest',
  mounted() {
    console.log('OrderDetails component mounted with orderId:', this.$route.params.orderId);
  }
};
</script>

<style scoped>
.order-details-test {
  padding-top: 150px;
  min-height: 100vh;
  background: #f9fafb;
}

.market-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.test-content {
  margin-top: 40px;
}

.card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #1f2937;
  margin-bottom: 20px;
}

h2 {
  color: #374151;
  margin-bottom: 16px;
}

p {
  color: #6b7280;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .order-details-test {
    padding-top: 120px;
  }
  
  .market-container {
    padding: 0 16px;
  }
  
  .card {
    padding: 24px;
  }
}
</style>
