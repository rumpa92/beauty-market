<template>
  <div class="wishlist-page">
    <PageHeader
      title="My Wishlist"
      :subtitle="wishlistItems.length ? `${wishlistItems.length} items saved` : 'Your wishlist is empty'"
    />
    <div class="container">
      <h1>My Wishlist</h1>
      <div v-if="wishlistItems.length === 0" class="empty-wishlist">
        <p>Your wishlist is empty</p>
        <router-link to="/products" class="btn btn-primary">Browse Products</router-link>
      </div>
      <div v-else class="wishlist-grid">
        <ProductCard 
          v-for="product in wishlistItems" 
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductCard from '../components/product/ProductCard.vue';
import PageHeader from '../components/ui/PageHeader.vue';

export default {
  name: 'Wishlist',
  components: {
    ProductCard,
    PageHeader
  },
  computed: {
    ...mapGetters('user', ['wishlistItems'])
  }
};
</script>

<style scoped>
.wishlist-page {
  padding: 40px 0;
}

.empty-wishlist {
  text-align: center;
  padding: 60px 20px;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
</style>
