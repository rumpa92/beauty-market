<template>
  <AddToCartConfirmation
    :is-visible="cartConfirmationModal.open"
    :product="cartConfirmationModal.product || {}"
    :quantity="cartConfirmationModal.quantity"
    @close="closeCartConfirmation"
    @continue-shopping="handleContinueShopping"
    @go-to-cart="handleGoToCart"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AddToCartConfirmation from './AddToCartConfirmation.vue';

export default {
  name: 'AddToCartConfirmationWrapper',
  components: {
    AddToCartConfirmation
  },
  computed: {
    ...mapGetters('ui', ['getModal']),
    cartConfirmationModal() {
      return this.getModal('cartConfirmation');
    }
  },
  methods: {
    ...mapActions('ui', ['closeCartConfirmation']),
    ...mapActions('cart', ['openCart']),

    handleContinueShopping() {
      // Just close the modal, user continues shopping on current page
      this.closeCartConfirmation();
    },

    handleGoToCart() {
      // Close the modal and navigate to cart
      this.closeCartConfirmation();
      this.$router.push('/cart');
    }
  }
};
</script>
