<template>
  <div class="wishlist-page">
    <PageHeader
      title="My Wishlist"
      :subtitle="wishlistItems.length ? `${wishlistItems.length} items saved` : 'Your wishlist is empty'"
    />
    <div class="container">
      <div v-if="wishlistItems.length === 0" class="empty-wishlist">
        <p>Your wishlist is empty</p>
        <router-link to="/products" class="btn btn-gradient">Browse Products</router-link>
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

/* Gradient CTA button for empty state */
.btn-gradient {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119));
  border-radius: 8px;
  color: rgb(255, 255, 255);
  font-weight: 500;
  min-height: 44px;
  text-decoration: none;
  transition-duration: 0.2s;
  padding: 12px 24px;
}
.btn-gradient:hover {
  opacity: 0.95;
}
</style>
