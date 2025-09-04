<template>
  <div class="reviews-section">
    <div class="reviews-overview">
      <div class="rating-summary">
        <div class="overall-rating">
          <span class="rating-score">4.8</span>
          <StarRating :rating="4.8" :reviewCount="1247" :clickable="false" />
        </div>
        <div class="rating-breakdown">
          <div v-for="star in 5" :key="star" class="rating-bar">
            <span class="star-label">{{ 6 - star }} ★</span>
            <div class="bar-container">
              <div class="bar-fill" :style="{ width: getRatingPercentage(6 - star) + '%' }"></div>
            </div>
            <span class="rating-count">{{ getRatingCount(6 - star) }}</span>
          </div>
        </div>
      </div>
      
      <div class="review-actions">
        <button class="write-review-btn">
          <i class="fas fa-edit"></i>
          Write a Review
        </button>
      </div>
    </div>

    <div class="reviews-filters">
      <select v-model="selectedFilter" class="filter-select">
        <option value="all">All Reviews</option>
        <option value="5">5 Stars</option>
        <option value="4">4 Stars</option>
        <option value="3">3 Stars</option>
        <option value="verified">Verified Purchase</option>
        <option value="photos">With Photos</option>
      </select>
      
      <select v-model="sortBy" class="sort-select">
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="helpful">Most Helpful</option>
        <option value="rating-high">Highest Rating</option>
        <option value="rating-low">Lowest Rating</option>
      </select>
    </div>

    <div class="reviews-list">
      <div v-for="review in filteredReviews" :key="review.id" class="review-item">
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">
              {{ review.author.name.charAt(0) }}
            </div>
            <div class="reviewer-details">
              <span class="reviewer-name">{{ review.author.name }}</span>
              <div class="review-meta">
                <StarRating :rating="review.rating" :clickable="false" />
                <span class="review-date">{{ formatDate(review.date) }}</span>
                <span v-if="review.verified" class="verified-badge">Verified Purchase</span>
              </div>
            </div>
          </div>
          
          <div class="review-actions-menu">
            <button class="helpful-btn" @click="markHelpful(review.id)">
              <i class="fas fa-thumbs-up"></i>
              Helpful ({{ review.helpfulCount }})
            </button>
          </div>
        </div>
        
        <div class="review-content">
          <h4 v-if="review.title" class="review-title">{{ review.title }}</h4>
          <p class="review-text">{{ review.content }}</p>
          
          <div v-if="review.images" class="review-images">
            <img 
              v-for="image in review.images" 
              :key="image"
              :src="image" 
              :alt="'Review image'"
              class="review-image"
              @click="openImageModal(image)"
            >
          </div>
        </div>
      </div>
    </div>

    <button v-if="hasMoreReviews" @click="loadMoreReviews" class="load-more-btn">
      Load More Reviews
    </button>
  </div>
</template>

<script>
import StarRating from '../ui/StarRating.vue';

export default {
  name: 'ReviewsSection',
  components: {
    StarRating
  },
  props: {
    productId: String
  },
  data() {
    return {
      selectedFilter: 'all',
      sortBy: 'newest',
      hasMoreReviews: true,
      mockReviews: [
        {
          id: 1,
          author: { name: 'Sarah M.' },
          rating: 5,
          title: 'Amazing results!',
          content: 'This serum has completely transformed my skin. I\'ve been using it for 3 months and the difference is incredible.',
          date: '2024-01-15',
          verified: true,
          helpfulCount: 23,
          images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200']
        },
        {
          id: 2,
          author: { name: 'Jennifer L.' },
          rating: 4,
          title: 'Great product',
          content: 'Really love this serum. It absorbs quickly and doesn\'t leave any residue.',
          date: '2024-01-10',
          verified: true,
          helpfulCount: 15
        }
      ]
    };
  },
  computed: {
    filteredReviews() {
      return this.mockReviews; // Placeholder
    }
  },
  methods: {
    getRatingPercentage(stars) {
      const percentages = { 5: 70, 4: 20, 3: 6, 2: 3, 1: 1 };
      return percentages[stars] || 0;
    },
    getRatingCount(stars) {
      const counts = { 5: 873, 4: 249, 3: 75, 2: 37, 1: 13 };
      return counts[stars] || 0;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    markHelpful(reviewId) {
      console.log('Mark helpful:', reviewId);
    },
    openImageModal(image) {
      console.log('Open image modal:', image);
    },
    loadMoreReviews() {
      console.log('Load more reviews');
    }
  }
};
</script>

<style scoped>
.reviews-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.reviews-overview {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 40px;
  align-items: start;
}

.rating-summary {
  display: flex;
  gap: 40px;
  align-items: center;
}

.overall-rating {
  text-align: center;
}

.rating-score {
  display: block;
  font-size: 48px;
  font-weight: 700;
  color: var(--primary-600);
  margin-bottom: 8px;
}

.rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.star-label {
  width: 40px;
  color: var(--gray-600);
}

.bar-container {
  flex: 1;
  height: 8px;
  background: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #fbbf24;
  transition: width 0.3s ease;
}

.rating-count {
  width: 30px;
  text-align: right;
  color: var(--gray-500);
}

.write-review-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.write-review-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(var(--primary-500), 0.3);
}

.reviews-filters {
  display: flex;
  gap: 16px;
}

.filter-select,
.sort-select {
  padding: 8px 12px;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--gray-200);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.reviewer-name {
  font-weight: 600;
  color: var(--gray-800);
  display: block;
  margin-bottom: 4px;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--gray-500);
}

.verified-badge {
  background: var(--success-100);
  color: var(--success-700);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.helpful-btn {
  background: none;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--gray-600);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.helpful-btn:hover {
  border-color: var(--primary-400);
  color: var(--primary-600);
}

.review-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.review-text {
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 16px;
}

.review-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.review-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.review-image:hover {
  transform: scale(1.05);
}

.load-more-btn {
  background: var(--gray-100);
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  color: var(--gray-700);
  font-weight: 500;
  transition: all 0.2s ease;
  align-self: center;
}

.load-more-btn:hover {
  background: var(--gray-200);
}

@media (max-width: 768px) {
  .reviews-overview {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .rating-summary {
    flex-direction: column;
    gap: 24px;
  }
  
  .reviews-filters {
    flex-direction: column;
  }
}
</style>
