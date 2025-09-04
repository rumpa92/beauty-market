<template>
  <div style="padding: 50px; text-align: center; font-family: Arial; margin-top: 150px; min-height: 100vh; background: #fdf2f8;">
    <h1 style="color: #ec4899; font-size: 3rem;">🎉 Order Placed Successfully!</h1>
    <p style="font-size: 1.5rem; color: #666;">Your order ID is: <strong>#{{ orderId }}</strong></p>
    <div style="background: #f0f0f0; padding: 30px; margin: 30px 0; border-radius: 10px;">
      <h3>Order Details</h3>
      <p>Payment Method: Cash on Delivery</p>
      <p>Total: $97.64</p>
      <p>Delivery: 3-5 business days</p>
    </div>
    <button @click="goHome" style="background: #ec4899; color: white; padding: 15px 30px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
      Continue Shopping
    </button>
  </div>
</template>

<script>
export default {
  name: 'SimpleTest',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
};
</script>
