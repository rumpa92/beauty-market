<template>
  <div class="fashion-product-detail market-container">
    <h1 class="market-title-lg">Product Detail</h1>
    <p>Product ID: {{ id }}</p>
    <p>Detailed product view will be managed by existing store logic</p>
  </div>
</template>

<script>
export default {
  name: 'FashionProductDetail',
  props: {
    id: String
  }
};
</script>
