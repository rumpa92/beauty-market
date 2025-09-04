<template>
  <div class="returns-simple">
    <div class="container">
      <h1>Easy Returns & Refunds</h1>
      <p>Returning is simple — select your delivered item from order history, choose a reason, and submit your request. For faster access to your money, choose an instant refund to your store wallet and shop again anytime.</p>
      
      <div class="return-methods">
        <div class="method">
          <h3>Instant Store Wallet</h3>
          <p>Get your money back instantly + 5% bonus credits!</p>
        </div>
        <div class="method">
          <h3>Original Payment Method</h3>
          <p>Refund to your card/UPI in 5-7 business days</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReturnsSimple'
};
</script>

<style scoped>
.returns-simple {
  padding: 80px 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faff 0%, #fef7ff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 24px;
  color: #1f2937;
}

p {
  font-size: 18px;
  text-align: center;
  color: #6b7280;
  margin-bottom: 48px;
  line-height: 1.6;
}

.return-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 48px;
}

.method {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.method h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1f2937;
}

.method p {
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .return-methods {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 36px;
  }
}
</style>
