<template>
  <ProductQuickViewModal
    :show="isOpen"
    :product="product || {}"
    @close="handleClose"
    @added-to-cart="handleAddedToCart"
    @wishlist-toggle="handleWishlistToggle"
    @view-full-details="handleViewFullDetails"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProductQuickViewModal from './ProductQuickViewModal.vue';

export default {
  name: 'ProductQuickView',
  components: {
    ProductQuickViewModal
  },
  computed: {
    ...mapGetters('ui', ['getModal']),
    isOpen() {
      return this.getModal('productQuickView').open;
    },
    product() {
      return this.getModal('productQuickView').data;
    }
  },
  methods: {
    ...mapActions('ui', ['closeModal', 'showNotification']),

    handleClose() {
      this.closeModal('productQuickView');
    },

    handleAddedToCart(data) {
      this.showNotification({
        type: 'success',
        message: `${data.product.name} added to cart!`
      });
      // Optionally close modal after adding to cart
      // this.closeModal('productQuickView');
    },

    handleWishlistToggle(data) {
      const message = data.isInWishlist ? 'Added to wishlist' : 'Removed from wishlist';
      this.showNotification({
        type: 'success',
        message: message
      });
    },

    handleViewFullDetails(product) {
      this.closeModal('productQuickView');
      this.$router.push(`/product/${product.id}`);
    }
  }
};
</script>

<style scoped>
/* No styles needed - using ProductQuickViewModal component */
</style>
