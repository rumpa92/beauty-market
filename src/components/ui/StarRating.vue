<template>
  <div class="star-rating" @click="openReviews">
    <div class="stars">
      <i 
        v-for="star in 5" 
        :key="star"
        class="fas fa-star"
        :class="{ 
          'full': star <= fullStars,
          'half': star === halfStar,
          'empty': star > rating
        }"
      ></i>
    </div>
    <span class="rating-value">{{ rating.toFixed(1) }}</span>
    <span class="review-count" v-if="reviewCount">({{ reviewCount }} reviews)</span>
  </div>
</template>

<script>
export default {
  name: 'StarRating',
  props: {
    rating: {
      type: Number,
      required: true
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    clickable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    fullStars() {
      return Math.floor(this.rating);
    },
    halfStar() {
      return this.rating % 1 >= 0.5 ? this.fullStars + 1 : 0;
    }
  },
  methods: {
    openReviews() {
      if (this.clickable) {
        this.$emit('open-reviews');
      }
    }
  }
};
</script>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  font-size: 14px;
  transition: color 0.2s ease;
}

.stars i.full {
  color: #fbbf24;
}

.stars i.half {
  background: linear-gradient(90deg, #fbbf24 50%, #d1d5db 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stars i.empty {
  color: #d1d5db;
}

.rating-value {
  font-weight: 600;
  color: var(--gray-700);
}

.review-count {
  color: var(--gray-500);
  font-size: 14px;
}

.star-rating:hover .review-count {
  color: var(--primary-600);
  text-decoration: underline;
}
</style>
