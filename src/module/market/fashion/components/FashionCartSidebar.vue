<template>
  <div class="fashion-cart-sidebar">
    <!-- Reuse existing cart sidebar with fashion theming -->
    <div class="cart-header">
      <h2>Shopping Bag</h2>
      <button @click="closeCart" class="close-btn">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="cart-content">
      <p>Fashion cart will be managed by existing store logic</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'FashionCartSidebar',
  methods: {
    ...mapActions('cart', ['closeCart'])
  }
};
</script>

<style scoped>
.fashion-cart-sidebar {
  /* Inherit from global market CSS */
}
</style>
