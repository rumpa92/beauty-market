<template>
  <div class="order-details-simple">
    <div class="market-container">
      <h1>Order Details</h1>
      <p>Order ID: {{ orderId }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailsSimple',
  props: {
    orderId: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.order-details-simple {
  padding: 200px 0 100px 0;
  min-height: 100vh;
  background: #f3f4f6;
}

.market-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 16px;
}

p {
  font-size: 18px;
  color: #6b7280;
}
</style>
