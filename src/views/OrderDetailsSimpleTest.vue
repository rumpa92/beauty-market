<template>
  <div style="padding: 40px; background: white; min-height: 100vh;">
    <h1>Order Details Test - Order #{{ orderId }}</h1>
    <p>This is a simple test to see if the component renders.</p>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailsSimpleTest',
  props: {
    orderId: {
      type: String,
      required: true
    }
  }
};
</script>
