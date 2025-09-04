<template>
  <div>
    <h1>Order Details for Order #{{ orderId }}</h1>
    <p>This is a minimal test component.</p>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailsMinimal',
  props: {
    orderId: {
      type: String,
      required: true
    }
  }
};
</script>
