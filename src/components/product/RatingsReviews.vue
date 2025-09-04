<template>
  <div class="ratings-reviews-section">
    <!-- Section Header -->
    <div class="section-header">
      <h3 class="section-title">Customer Reviews</h3>
      <button @click="openWriteReviewModal" class="write-review-btn">
        <i class="fas fa-edit"></i>
        Write a Review
      </button>
    </div>

    <!-- Rating Summary -->
    <div class="rating-summary">
      <div class="overall-rating">
        <div class="rating-score">{{ overallRating }}</div>
        <div class="rating-details">
          <div class="rating-stars">
            <div class="stars">
              <i v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.floor(overallRating), half: i === Math.ceil(overallRating) && overallRating % 1 !== 0 }">★</i>
            </div>
          </div>
          <div class="rating-count">Based on {{ totalReviews }} reviews</div>
        </div>
      </div>
      
      <!-- Rating Breakdown -->
      <div class="rating-breakdown">
        <div v-for="rating in [5,4,3,2,1]" :key="rating" class="rating-bar">
          <button 
            class="rating-filter-btn"
            :class="{ active: selectedRatingFilter === rating }"
            @click="filterByRating(rating)"
          >
            <span class="rating-label">{{ rating }}★</span>
            <div class="bar-container">
              <div class="bar-fill" :style="{ width: getRatingPercentage(rating) + '%' }"></div>
            </div>
            <span class="rating-count">{{ getRatingCount(rating) }}</span>
          </button>
        </div>
      </div>

      <!-- Rating Highlights -->
      <div class="rating-highlights">
        <div class="highlight-item positive">
          <i class="fas fa-thumbs-up"></i>
          <span>{{ positivePercentage }}% recommend this product</span>
        </div>
        <div class="highlight-item">
          <i class="fas fa-star"></i>
          <span>Most praised for: {{ topPraise }}</span>
        </div>
      </div>
    </div>

    <!-- Review Filters -->
    <div class="review-filters">
      <div class="filter-group">
        <button 
          v-for="filter in reviewFilters" 
          :key="filter.id"
          class="filter-btn"
          :class="{ active: selectedFilter === filter.id }"
          @click="setFilter(filter.id)"
        >
          {{ filter.label }}
          <span v-if="filter.count" class="filter-count">({{ filter.count }})</span>
        </button>
      </div>
      
      <div class="sort-options">
        <select v-model="sortBy" @change="sortReviews" class="sort-select">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="reviews-list" v-if="filteredReviews.length">
      <div v-for="review in paginatedReviews" :key="review.id" class="review-item">
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">
              <img :src="review.userAvatar || defaultAvatar" :alt="review.userName" />
              <div v-if="review.verified" class="verified-badge" title="Verified Purchase">
                <i class="fas fa-check"></i>
              </div>
            </div>
            <div class="reviewer-details">
              <div class="reviewer-name">
                {{ review.userName }}
                <span v-if="review.verified" class="verified-text">Verified Purchase</span>
              </div>
              <div class="review-meta">
                <span class="review-date">{{ formatDate(review.date) }}</span>
                <span v-if="review.purchaseDate" class="purchase-info">
                  Purchased {{ getTimeSince(review.purchaseDate) }} ago
                </span>
              </div>
            </div>
          </div>
          <div class="review-rating">
            <div class="stars">
              <i v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</i>
            </div>
            <div class="rating-text">{{ review.rating }}/5</div>
          </div>
        </div>
        
        <!-- Review Title -->
        <div v-if="review.title" class="review-title">
          {{ review.title }}
        </div>
        
        <!-- Review Content -->
        <div class="review-content">
          <p :class="{ truncated: !review.expanded && review.text.length > 300 }">
            {{ review.expanded ? review.text : getTruncatedText(review.text, 300) }}
          </p>
          <button 
            v-if="review.text.length > 300" 
            @click="toggleReviewExpansion(review)"
            class="read-more-btn"
          >
            {{ review.expanded ? 'Read less' : 'Read more' }}
          </button>
        </div>

        <!-- Review Images/Videos -->
        <div v-if="review.media && review.media.length > 0" class="review-media">
          <div class="media-grid">
            <div 
              v-for="(media, index) in review.media.slice(0, 4)" 
              :key="index"
              class="media-item"
              @click="openMediaModal(review.media, index)"
            >
              <img v-if="media.type === 'image'" :src="media.url" :alt="'Review media ' + (index + 1)" />
              <div v-else class="video-thumbnail">
                <img :src="media.thumbnail" :alt="'Review video ' + (index + 1)" />
                <div class="play-icon">
                  <i class="fas fa-play"></i>
                </div>
              </div>
              <div v-if="index === 3 && review.media.length > 4" class="media-overlay">
                +{{ review.media.length - 4 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Review Tags -->
        <div v-if="review.tags && review.tags.length" class="review-tags">
          <span v-for="tag in review.tags" :key="tag" class="review-tag">
            {{ tag }}
          </span>
        </div>

        <!-- Review Actions -->
        <div class="review-actions">
          <button 
            class="review-action-btn"
            :class="{ active: review.userFoundHelpful }"
            @click="toggleHelpful(review)"
          >
            <i class="fas fa-thumbs-up"></i>
            Helpful{{ review.helpfulCount > 0 ? ` (${review.helpfulCount})` : '' }}
          </button>
          
          <button class="review-action-btn" @click="reportReview(review)">
            <i class="fas fa-flag"></i>
            Report
          </button>
          
          <button v-if="review.response" class="review-action-btn" @click="toggleResponse(review)">
            <i class="fas fa-reply"></i>
            {{ review.showResponse ? 'Hide' : 'Show' }} Response
          </button>
        </div>

        <!-- Brand Response -->
        <div v-if="review.response && review.showResponse" class="brand-response">
          <div class="response-header">
            <div class="brand-avatar">
              <i class="fas fa-store"></i>
            </div>
            <div class="response-info">
              <div class="brand-name">{{ brandName }} Response</div>
              <div class="response-date">{{ formatDate(review.response.date) }}</div>
            </div>
          </div>
          <div class="response-content">
            <p>{{ review.response.text }}</p>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="pagination-btn prev"
        >
          <i class="fas fa-chevron-left"></i>
          Previous
        </button>
        
        <div class="pagination-info">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="pagination-btn next"
        >
          Next
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- No Reviews State -->
    <div v-else class="no-reviews">
      <div class="no-reviews-icon">
        <i class="fas fa-comment-alt"></i>
      </div>
      <h4>No reviews yet</h4>
      <p>Be the first to share your experience with this product.</p>
      <button @click="openWriteReviewModal" class="write-first-review-btn">
        Write the First Review
      </button>
    </div>

    <!-- Write Review Modal -->
    <div v-if="showWriteReviewModal" class="modal-overlay" @click="closeWriteReviewModal">
      <div class="review-modal" @click.stop>
        <div class="modal-header">
          <h3>Write a Review</h3>
          <button @click="closeWriteReviewModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-content">
          <!-- Overall Rating -->
          <div class="rating-input">
            <label>Overall Rating *</label>
            <div class="star-input">
              <button 
                v-for="i in 5" 
                :key="i"
                @click="newReview.rating = i"
                class="star-btn"
                :class="{ active: i <= newReview.rating }"
                type="button"
              >
                ★
              </button>
            </div>
            <div class="rating-labels">
              <span v-if="newReview.rating > 0" class="rating-label">
                {{ getRatingLabel(newReview.rating) }}
              </span>
            </div>
          </div>

          <!-- Review Title -->
          <div class="text-input">
            <label>Review Title</label>
            <input 
              v-model="newReview.title" 
              type="text"
              placeholder="Summarize your experience..."
              maxlength="60"
              class="review-title-input"
            />
            <div class="input-counter">{{ newReview.title.length }}/60</div>
          </div>

          <!-- Review Text -->
          <div class="text-input">
            <label>Your Review *</label>
            <textarea 
              v-model="newReview.text" 
              placeholder="Share your experience with this product. What did you like or dislike? How did it work for you?"
              rows="5"
              maxlength="1000"
              class="review-text-input"
            ></textarea>
            <div class="input-counter">{{ newReview.text.length }}/1000</div>
          </div>

          <!-- Category Ratings -->
          <div class="category-ratings">
            <h4>Rate Different Aspects</h4>
            <div class="category-grid">
              <div v-for="category in ratingCategories" :key="category.id" class="category-item">
                <label>{{ category.label }}</label>
                <div class="star-input small">
                  <button 
                    v-for="i in 5" 
                    :key="i"
                    @click="newReview.categoryRatings[category.id] = i"
                    class="star-btn"
                    :class="{ active: i <= (newReview.categoryRatings[category.id] || 0) }"
                    type="button"
                  >
                    ★
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Media Upload -->
          <div class="media-upload">
            <label>Add Photos or Videos (Optional)</label>
            <div class="upload-area" @click="$refs.mediaInput.click()">
              <i class="fas fa-camera"></i>
              <span>Click to add photos or videos</span>
              <small>Max 5 files, up to 10MB each</small>
            </div>
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              @change="handleMediaUpload" 
              ref="mediaInput" 
              style="display: none;"
            />
            
            <!-- Preview uploaded media -->
            <div v-if="newReview.media.length" class="media-preview">
              <div v-for="(media, index) in newReview.media" :key="index" class="preview-item">
                <img v-if="media.type === 'image'" :src="media.preview" alt="Preview" />
                <div v-else class="video-preview">
                  <i class="fas fa-video"></i>
                  <span>{{ media.name }}</span>
                </div>
                <button @click="removeMedia(index)" class="remove-media">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Recommend Toggle -->
          <div class="recommend-toggle">
            <label class="toggle-label">
              <input type="checkbox" v-model="newReview.wouldRecommend" />
              <span class="toggle-slider"></span>
              I would recommend this product to others
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closeWriteReviewModal" class="cancel-btn">Cancel</button>
          <button 
            @click="submitReview" 
            class="submit-btn" 
            :disabled="!isReviewValid || isSubmitting"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
            {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Media Modal -->
    <div v-if="showMediaModal" class="media-modal-overlay" @click="closeMediaModal">
      <div class="media-modal" @click.stop>
        <button @click="closeMediaModal" class="close-media">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="media-navigation">
          <button 
            @click="previousMedia" 
            :disabled="currentMediaIndex === 0"
            class="media-nav prev"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button 
            @click="nextMedia" 
            :disabled="currentMediaIndex === currentMediaItems.length - 1"
            class="media-nav next"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div class="media-content">
          <img 
            v-if="currentMedia.type === 'image'" 
            :src="currentMedia.url" 
            :alt="'Review media'"
            class="modal-media"
          />
          <video 
            v-else 
            :src="currentMedia.url" 
            controls
            class="modal-media"
          ></video>
        </div>
        
        <div class="media-counter">
          {{ currentMediaIndex + 1 }} / {{ currentMediaItems.length }}
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <transition name="toast">
      <div v-if="showToast" class="toast-notification" :class="toastType">
        <i :class="toastIcon"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'RatingsReviews',
  props: {
    productId: {
      type: [String, Number],
      required: true
    },
    brandName: {
      type: String,
      default: 'Brand'
    },
    reviews: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedFilter: 'all',
      selectedRatingFilter: null,
      sortBy: 'newest',
      currentPage: 1,
      reviewsPerPage: 5,
      showWriteReviewModal: false,
      showMediaModal: false,
      currentMediaItems: [],
      currentMediaIndex: 0,
      isSubmitting: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      defaultAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      
      newReview: {
        rating: 0,
        title: '',
        text: '',
        categoryRatings: {},
        media: [],
        wouldRecommend: true
      },
      
      reviewFilters: [
        { id: 'all', label: 'All Reviews' },
        { id: 'verified', label: 'Verified Only' },
        { id: 'with-media', label: 'With Photos/Videos' },
        { id: 'recent', label: 'Recent (30 days)' }
      ],
      
      ratingCategories: [
        { id: 'quality', label: 'Quality' },
        { id: 'value', label: 'Value for Money' },
        { id: 'effectiveness', label: 'Effectiveness' },
        { id: 'packaging', label: 'Packaging' }
      ]
    };
  },
  computed: {
    overallRating() {
      if (!this.reviews.length) return 0;
      const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
      return (sum / this.reviews.length).toFixed(1);
    },
    
    totalReviews() {
      return this.reviews.length;
    },
    
    positivePercentage() {
      if (!this.reviews.length) return 0;
      const positiveReviews = this.reviews.filter(review => review.rating >= 4).length;
      return Math.round((positiveReviews / this.reviews.length) * 100);
    },
    
    topPraise() {
      // This would typically come from review analysis
      return 'effectiveness and quality';
    },
    
    filteredReviews() {
      let filtered = [...this.reviews];
      
      // Apply filters
      if (this.selectedFilter === 'verified') {
        filtered = filtered.filter(review => review.verified);
      } else if (this.selectedFilter === 'with-media') {
        filtered = filtered.filter(review => review.media && review.media.length > 0);
      } else if (this.selectedFilter === 'recent') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(review => new Date(review.date) >= thirtyDaysAgo);
      }
      
      // Apply rating filter
      if (this.selectedRatingFilter) {
        filtered = filtered.filter(review => review.rating === this.selectedRatingFilter);
      }
      
      // Sort reviews
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'oldest':
            return new Date(a.date) - new Date(b.date);
          case 'highest':
            return b.rating - a.rating;
          case 'lowest':
            return a.rating - b.rating;
          case 'helpful':
            return (b.helpfulCount || 0) - (a.helpfulCount || 0);
          default: // newest
            return new Date(b.date) - new Date(a.date);
        }
      });
      
      return filtered;
    },
    
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.reviewsPerPage;
      const end = start + this.reviewsPerPage;
      return this.filteredReviews.slice(start, end);
    },
    
    totalPages() {
      return Math.ceil(this.filteredReviews.length / this.reviewsPerPage);
    },
    
    isReviewValid() {
      return this.newReview.rating > 0 && this.newReview.text.trim().length >= 10;
    },
    
    currentMedia() {
      return this.currentMediaItems[this.currentMediaIndex];
    },
    
    toastIcon() {
      return this.toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    }
  },
  methods: {
    getRatingPercentage(rating) {
      if (!this.reviews.length) return 0;
      const count = this.reviews.filter(r => r.rating === rating).length;
      return Math.round((count / this.reviews.length) * 100);
    },
    
    getRatingCount(rating) {
      return this.reviews.filter(r => r.rating === rating).length;
    },
    
    filterByRating(rating) {
      this.selectedRatingFilter = this.selectedRatingFilter === rating ? null : rating;
      this.currentPage = 1;
    },
    
    setFilter(filterId) {
      this.selectedFilter = filterId;
      this.currentPage = 1;
    },
    
    sortReviews() {
      this.currentPage = 1;
    },
    
    toggleReviewExpansion(review) {
      review.expanded = !review.expanded;
    },
    
    toggleHelpful(review) {
      review.userFoundHelpful = !review.userFoundHelpful;
      if (review.userFoundHelpful) {
        review.helpfulCount = (review.helpfulCount || 0) + 1;
      } else {
        review.helpfulCount = Math.max(0, (review.helpfulCount || 0) - 1);
      }
    },
    
    toggleResponse(review) {
      review.showResponse = !review.showResponse;
    },
    
    reportReview(review) {
      this.showToastMessage('Review reported. Thank you for your feedback.', 'success');
    },
    
    openWriteReviewModal() {
      this.showWriteReviewModal = true;
      document.body.style.overflow = 'hidden';
    },
    
    closeWriteReviewModal() {
      this.showWriteReviewModal = false;
      document.body.style.overflow = 'auto';
      this.resetReviewForm();
    },
    
    resetReviewForm() {
      this.newReview = {
        rating: 0,
        title: '',
        text: '',
        categoryRatings: {},
        media: [],
        wouldRecommend: true
      };
    },
    
    async submitReview() {
      if (!this.isReviewValid) return;
      
      this.isSubmitting = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const review = {
          id: Date.now(),
          userName: 'You',
          userAvatar: this.defaultAvatar,
          rating: this.newReview.rating,
          title: this.newReview.title,
          text: this.newReview.text,
          date: new Date().toISOString(),
          verified: true,
          media: this.newReview.media,
          helpfulCount: 0,
          expanded: false,
          categoryRatings: this.newReview.categoryRatings,
          wouldRecommend: this.newReview.wouldRecommend
        };
        
        this.reviews.unshift(review);
        this.closeWriteReviewModal();
        this.showToastMessage('Review submitted successfully!', 'success');
        
        // Emit event to parent
        this.$emit('review-submitted', review);
      } catch (error) {
        this.showToastMessage('Failed to submit review. Please try again.', 'error');
      } finally {
        this.isSubmitting = false;
      }
    },
    
    handleMediaUpload(event) {
      const files = Array.from(event.target.files);
      
      files.forEach(file => {
        if (this.newReview.media.length >= 5) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newReview.media.push({
            type: file.type.startsWith('image/') ? 'image' : 'video',
            name: file.name,
            preview: e.target.result,
            file: file
          });
        };
        reader.readAsDataURL(file);
      });
    },
    
    removeMedia(index) {
      this.newReview.media.splice(index, 1);
    },
    
    openMediaModal(mediaItems, startIndex) {
      this.currentMediaItems = mediaItems;
      this.currentMediaIndex = startIndex;
      this.showMediaModal = true;
      document.body.style.overflow = 'hidden';
    },
    
    closeMediaModal() {
      this.showMediaModal = false;
      document.body.style.overflow = 'auto';
    },
    
    nextMedia() {
      if (this.currentMediaIndex < this.currentMediaItems.length - 1) {
        this.currentMediaIndex++;
      }
    },
    
    previousMedia() {
      if (this.currentMediaIndex > 0) {
        this.currentMediaIndex--;
      }
    },
    
    getRatingLabel(rating) {
      const labels = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      };
      return labels[rating] || '';
    },
    
    getTruncatedText(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    getTimeSince(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day';
      if (diffDays < 30) return `${diffDays} days`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
      return `${Math.floor(diffDays / 365)} years`;
    },
    
    showToastMessage(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  },
  
  watch: {
    selectedFilter() {
      this.currentPage = 1;
    },
    sortBy() {
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
.ratings-reviews-section {
  padding: 40px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--market-text);
  margin: 0;
}

.write-review-btn {
  background: var(--market-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.write-review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

/* Rating Summary */
.rating-summary {
  background: var(--market-secondary);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 32px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 32px;
  align-items: center;
}

.overall-rating {
  display: flex;
  align-items: center;
  gap: 20px;
}

.rating-score {
  font-size: 64px;
  font-weight: 700;
  color: var(--market-primary);
  line-height: 1;
}

.rating-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #d1d5db;
  font-size: 24px;
  transition: color 0.2s ease;
}

.star.filled {
  color: #fbbf24;
}

.star.half {
  background: linear-gradient(90deg, #fbbf24 50%, #d1d5db 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rating-count {
  color: var(--market-text-light);
  font-size: 14px;
}

.rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 250px;
}

.rating-filter-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 4px 8px;
}

.rating-filter-btn:hover,
.rating-filter-btn.active {
  background: rgba(236, 72, 153, 0.1);
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-label {
  font-size: 14px;
  color: var(--market-text);
  min-width: 30px;
}

.bar-container {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--market-gradient);
  transition: width 0.3s ease;
}

.rating-highlights {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--market-text);
  font-size: 14px;
}

.highlight-item.positive {
  color: #059669;
}

/* Review Filters */
.review-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--market-border);
}

.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  background: none;
  border: 1px solid var(--market-border);
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--market-text);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-btn:hover,
.filter-btn.active {
  border-color: var(--market-primary);
  background: var(--market-primary);
  color: white;
}

.filter-count {
  font-size: 12px;
  opacity: 0.8;
}

.sort-select {
  border: 1px solid var(--market-border);
  border-radius: 8px;
  padding: 8px 12px;
  background: white;
  color: var(--market-text);
  cursor: pointer;
}

/* Reviews List */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  background: white;
  border: 1px solid var(--market-border);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.review-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
}

.reviewer-avatar {
  position: relative;
}

.reviewer-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.verified-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: #059669;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  border: 2px solid white;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reviewer-name {
  font-weight: 600;
  color: var(--market-text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.verified-text {
  color: #059669;
  font-size: 12px;
  font-weight: 500;
}

.review-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--market-text-light);
}

.review-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.rating-text {
  font-size: 12px;
  color: var(--market-text-light);
}

.review-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 12px;
}

.review-content {
  margin-bottom: 16px;
}

.review-content p {
  color: var(--market-text);
  line-height: 1.6;
  margin: 0;
}

.review-content p.truncated {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-btn {
  background: none;
  border: none;
  color: var(--market-primary);
  cursor: pointer;
  font-weight: 600;
  margin-top: 8px;
  transition: all 0.3s ease;
}

.read-more-btn:hover {
  text-decoration: underline;
}

/* Review Media */
.review-media {
  margin-bottom: 16px;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
  max-width: 340px;
}

.media-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.media-item:hover {
  transform: scale(1.05);
}

.media-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
}

.play-icon {
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* Review Tags */
.review-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.review-tag {
  background: var(--market-secondary);
  color: var(--market-text);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* Review Actions */
.review-actions {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--market-border);
}

.review-action-btn {
  background: none;
  border: none;
  color: var(--market-text-light);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.review-action-btn:hover,
.review-action-btn.active {
  color: var(--market-primary);
}

/* Brand Response */
.brand-response {
  margin-top: 16px;
  padding: 16px;
  background: var(--market-secondary);
  border-radius: 12px;
  border-left: 4px solid var(--market-primary);
}

.response-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.brand-avatar {
  width: 32px;
  height: 32px;
  background: var(--market-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.response-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-name {
  font-weight: 600;
  color: var(--market-text);
  font-size: 14px;
}

.response-date {
  font-size: 12px;
  color: var(--market-text-light);
}

.response-content p {
  margin: 0;
  color: var(--market-text);
  line-height: 1.5;
  font-size: 14px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--market-border);
}

.pagination-btn {
  background: var(--market-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--market-accent);
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--market-text);
  font-weight: 500;
}

/* No Reviews */
.no-reviews {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  border: 1px solid var(--market-border);
}

.no-reviews-icon {
  font-size: 48px;
  color: var(--market-text-light);
  margin-bottom: 16px;
}

.no-reviews h4 {
  font-size: 20px;
  color: var(--market-text);
  margin-bottom: 8px;
}

.no-reviews p {
  color: var(--market-text-light);
  margin-bottom: 24px;
}

.write-first-review-btn {
  background: var(--market-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.write-first-review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.review-modal {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--market-text);
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--market-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--market-border);
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
}

/* Form Inputs */
.rating-input,
.text-input,
.category-ratings,
.media-upload,
.recommend-toggle {
  margin-bottom: 24px;
}

.rating-input label,
.text-input label,
.category-ratings h4 {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--market-text);
}

.star-input {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.star-input.small {
  gap: 2px;
}

.star-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #d1d5db;
  cursor: pointer;
  transition: all 0.3s ease;
}

.star-input.small .star-btn {
  font-size: 20px;
}

.star-btn:hover,
.star-btn.active {
  color: #fbbf24;
  transform: scale(1.1);
}

.rating-labels {
  height: 20px;
}

.rating-label {
  color: var(--market-primary);
  font-weight: 600;
}

.review-title-input,
.review-text-input {
  width: 100%;
  border: 2px solid var(--market-border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: vertical;
}

.review-title-input:focus,
.review-text-input:focus {
  outline: none;
  border-color: var(--market-primary);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.input-counter {
  text-align: right;
  font-size: 12px;
  color: var(--market-text-light);
  margin-top: 4px;
}

/* Category Ratings */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item label {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

/* Media Upload */
.upload-area {
  border: 2px dashed var(--market-border);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--market-secondary);
}

.upload-area:hover {
  border-color: var(--market-primary);
  background: rgba(236, 72, 153, 0.05);
}

.upload-area i {
  font-size: 32px;
  color: var(--market-primary);
  margin-bottom: 8px;
}

.upload-area span {
  display: block;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 4px;
}

.upload-area small {
  color: var(--market-text-light);
}

.media-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  margin-top: 16px;
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-preview {
  width: 100%;
  height: 100%;
  background: var(--market-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  text-align: center;
  padding: 8px;
}

.remove-media {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 10px;
}

/* Recommend Toggle */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 500;
  color: var(--market-text);
}

.toggle-label input[type="checkbox"] {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 50px;
  height: 24px;
  background: #d1d5db;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-label input:checked + .toggle-slider {
  background: var(--market-primary);
}

.toggle-label input:checked + .toggle-slider::after {
  transform: translateX(26px);
}

/* Modal Actions */
.modal-actions {
  padding: 20px 24px;
  background: var(--market-secondary);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn,
.submit-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cancel-btn {
  background: white;
  color: var(--market-text);
  border: 1px solid var(--market-border);
}

.cancel-btn:hover {
  background: var(--market-secondary);
}

.submit-btn {
  background: var(--market-gradient);
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Media Modal */
.media-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.media-modal {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-media {
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-media:hover {
  background: rgba(255, 255, 255, 0.2);
}

.media-navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% + 120px);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.media-nav {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
}

.media-nav:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.media-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.modal-media {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.media-counter {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
}

/* Toast */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  font-weight: 500;
}

.toast-notification.success {
  background: #22c55e;
  color: white;
}

.toast-notification.error {
  background: #dc2626;
  color: white;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .rating-summary {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }
  
  .review-filters {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: center;
  }
  
  .review-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .section-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .overall-rating {
    flex-direction: column;
    gap: 12px;
  }
  
  .rating-score {
    font-size: 48px;
  }
  
  .review-item {
    padding: 16px;
  }
  
  .modal-content {
    padding: 16px;
  }
}
</style>
