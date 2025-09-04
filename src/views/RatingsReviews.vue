<template>
  <div class="ratings-reviews-page" v-if="product">
    <!-- Page Header -->
    <section class="page-header">
      <div class="market-container">
        <div class="header-content">
          <button @click="goBack" class="back-button">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
          
          <div class="header-main">
            <h1 class="page-title">Ratings & Reviews</h1>
            
            <div class="product-context">
              <div class="product-thumbnail">
                <img :src="product.images[0]" :alt="product.name">
              </div>
              <div class="product-info">
                <h2 class="product-name">{{ product.name }}</h2>
                <p class="product-brand">{{ product.brand }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Aggregate Rating Section -->
    <section class="aggregate-rating-section">
      <div class="market-container">
        <div class="rating-overview">
          <div class="overall-rating">
            <div class="rating-display">
              <span class="rating-number">{{ product.rating }}</span>
              <div class="rating-stars">
                <i v-for="n in 5" :key="n" 
                   :class="['fas fa-star', { filled: n <= Math.floor(product.rating) }]">
                </i>
              </div>
            </div>
            <p class="rating-subtitle">Based on {{ product.reviewCount }} reviews</p>
            <div class="recommendation">
              <span class="recommend-percentage">{{ recommendationPercentage }}%</span>
              <span class="recommend-text">would recommend this product</span>
            </div>
          </div>

          <div class="rating-breakdown">
            <h3 class="breakdown-title">Rating Breakdown</h3>
            <div class="breakdown-bars">
              <div 
                v-for="rating in [5, 4, 3, 2, 1]" 
                :key="rating"
                class="rating-bar-row"
              >
                <span class="rating-label">{{ rating }}★</span>
                <div class="rating-bar">
                  <div 
                    class="rating-fill" 
                    :style="{ width: getRatingPercentage(rating) + '%' }"
                  ></div>
                </div>
                <span class="rating-count">{{ getRatingCount(rating) }}</span>
                <span class="rating-percentage">{{ getRatingPercentage(rating) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filter and Sort Section -->
    <section class="filter-sort-section">
      <div class="market-container">
        <div class="filter-controls">
          <div class="filter-group">
            <label class="filter-label">Filter by:</label>
            <select v-model="reviewFilter" class="filter-select">
              <option value="all">All Reviews ({{ reviews.length }})</option>
              <option value="5">5 Stars ({{ getRatingCount(5) }})</option>
              <option value="4">4 Stars ({{ getRatingCount(4) }})</option>
              <option value="3">3 Stars ({{ getRatingCount(3) }})</option>
              <option value="2">2 Stars ({{ getRatingCount(2) }})</option>
              <option value="1">1 Star ({{ getRatingCount(1) }})</option>
              <option value="photos">With Photos ({{ photosCount }})</option>
              <option value="verified">Verified Purchase ({{ verifiedCount }})</option>
            </select>
          </div>
          
          <div class="sort-group">
            <label class="sort-label">Sort by:</label>
            <select v-model="reviewSort" class="sort-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          <button @click="showWriteReview = true" class="write-review-btn">
            <i class="fas fa-pen"></i>
            <span>Write a Review</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Reviews List -->
    <section class="reviews-list-section">
      <div class="market-container">
        <div class="reviews-container">
          <div 
            v-for="review in paginatedReviews" 
            :key="review.id"
            class="review-card"
          >
            <div class="review-header">
              <div class="reviewer-profile">
                <div class="reviewer-avatar">
                  <img :src="review.userAvatar" :alt="review.userName">
                </div>
                <div class="reviewer-details">
                  <h4 class="reviewer-name">{{ review.userName }}</h4>
                  <div class="review-meta">
                    <div class="review-rating">
                      <i v-for="n in 5" :key="n" 
                         :class="['fas fa-star', { filled: n <= review.rating }]">
                      </i>
                    </div>
                    <span class="review-date">{{ formatDate(review.date) }}</span>
                    <span v-if="review.verified" class="verified-badge">
                      <i class="fas fa-check-circle"></i>
                      Verified Purchase
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="review-actions">
                <button class="share-review-btn" @click="shareReview(review)">
                  <i class="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
            
            <div class="review-content">
              <h5 v-if="review.title" class="review-title">{{ review.title }}</h5>
              
              <div 
                :class="['review-text', { expanded: review.isExpanded }]"
                :style="{ maxHeight: review.isExpanded ? 'none' : '120px' }"
              >
                <p>{{ review.text }}</p>
              </div>
              
              <button 
                v-if="review.text.length > 200 && !review.isExpanded"
                @click="toggleReviewExpansion(review)"
                class="read-more-btn"
              >
                <span>Read more</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              
              <button 
                v-if="review.isExpanded"
                @click="toggleReviewExpansion(review)"
                class="read-less-btn"
              >
                <span>Show less</span>
                <i class="fas fa-chevron-up"></i>
              </button>
              
              <!-- Review Media Gallery -->
              <div v-if="review.photos && review.photos.length" class="review-media">
                <div class="media-grid">
                  <div 
                    v-for="(photo, index) in review.photos" 
                    :key="index"
                    @click="openPhotoModal(photo, review.photos, index)"
                    class="media-item"
                  >
                    <img :src="photo.thumbnail" :alt="`Review photo ${index + 1}`">
                    <div class="media-overlay">
                      <i class="fas fa-expand-alt"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Review Footer -->
              <div class="review-footer">
                <div class="helpfulness">
                  <span class="helpful-question">Was this helpful?</span>
                  <div class="helpful-actions">
                    <button 
                      @click="markHelpful(review.id, true)"
                      :class="['helpful-btn', { active: review.userHelpfulVote === true }]"
                    >
                      <i class="fas fa-thumbs-up"></i>
                      <span>{{ review.helpfulCount || 0 }}</span>
                    </button>
                    <button 
                      @click="markHelpful(review.id, false)"
                      :class="['helpful-btn', { active: review.userHelpfulVote === false }]"
                    >
                      <i class="fas fa-thumbs-down"></i>
                    </button>
                  </div>
                </div>
                
                <button @click="reportReview(review)" class="report-btn">
                  <i class="fas fa-flag"></i>
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Load More Button -->
          <div v-if="hasMoreReviews" class="load-more-container">
            <button @click="loadMoreReviews" class="load-more-btn">
              <i class="fas fa-chevron-down"></i>
              <span>Load More Reviews ({{ remainingReviewsCount }} remaining)</span>
            </button>
          </div>

          <!-- No Reviews State -->
          <div v-if="filteredReviews.length === 0" class="no-reviews">
            <div class="no-reviews-icon">
              <i class="fas fa-star"></i>
            </div>
            <h3>No reviews found</h3>
            <p>Be the first to review this product or adjust your filters.</p>
            <button @click="showWriteReview = true" class="write-first-review-btn">
              Write the First Review
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Add Your Review Form Modal -->
    <div v-if="showWriteReview" class="modal-overlay" @click="closeWriteReview">
      <div class="modal-content write-review-modal" @click.stop>
        <div class="modal-header">
          <h3>Write Your Review</h3>
          <p class="modal-subtitle">Share your experience with {{ product.name }}</p>
          <button @click="closeWriteReview" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="review-form">
            <!-- Star Rating Input -->
            <div class="form-group rating-group">
              <label class="form-label">Overall Rating *</label>
              <div class="rating-input">
                <div class="star-selector">
                  <i v-for="n in 5" :key="n" 
                     @click="setRating(n)"
                     @mouseover="hoverRating = n"
                     @mouseleave="hoverRating = 0"
                     :class="['fas fa-star rating-star', { 
                       filled: n <= (hoverRating || newReview.rating),
                       hover: n <= hoverRating 
                     }]">
                  </i>
                </div>
                <span class="rating-label">
                  {{ getRatingLabel(newReview.rating) }}
                </span>
              </div>
            </div>
            
            <!-- Review Title -->
            <div class="form-group">
              <label class="form-label">Review Title</label>
              <input 
                type="text" 
                v-model="newReview.title" 
                placeholder="Summarize your experience in a few words"
                class="form-input"
                maxlength="100"
              >
              <div class="input-counter">{{ newReview.title.length }}/100</div>
            </div>
            
            <!-- Review Text -->
            <div class="form-group">
              <label class="form-label">Your Review *</label>
              <textarea 
                v-model="newReview.text" 
                placeholder="Share your experience... What did you like or dislike about this product?"
                class="form-textarea"
                rows="6"
                maxlength="1000"
              ></textarea>
              <div class="character-count">
                {{ newReview.text.length }}/1000 characters
              </div>
            </div>
            
            <!-- Media Upload -->
            <div class="form-group">
              <label class="form-label">Add Photos/Videos (Optional)</label>
              <div class="media-upload-area">
                <input 
                  type="file" 
                  ref="mediaInput" 
                  @change="handleMediaUpload" 
                  multiple 
                  accept="image/*,video/*"
                  class="media-input"
                >
                <button 
                  @click="$refs.mediaInput.click()" 
                  class="upload-btn"
                  type="button"
                >
                  <i class="fas fa-camera"></i>
                  <span>Upload Photos/Videos</span>
                </button>
                <p class="upload-hint">Upload up to 5 files (Max 10MB each)</p>
                
                <!-- Media Previews -->
                <div v-if="newReview.media && newReview.media.length" class="uploaded-media">
                  <div 
                    v-for="(media, index) in newReview.media" 
                    :key="index"
                    class="uploaded-media-item"
                  >
                    <img v-if="media.type === 'image'" :src="media.preview" :alt="`Upload ${index + 1}`">
                    <video v-else-if="media.type === 'video'" :src="media.preview" muted></video>
                    <button 
                      @click="removeMedia(index)" 
                      class="remove-media"
                      type="button"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeWriteReview" class="btn-secondary">Cancel</button>
          <button 
            @click="submitReview" 
            :disabled="!canSubmitReview"
            :class="['btn-primary save-review-btn', { loading: isSubmittingReview }]"
          >
            <div v-if="isSubmittingReview" class="btn-loading">
              <div class="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <i v-else class="fas fa-paper-plane"></i>
            <span>{{ isSubmittingReview ? 'Saving Review...' : 'Save Review' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Photo/Video Modal -->
    <div v-if="showMediaModal" class="media-modal-overlay" @click="closeMediaModal">
      <div class="media-modal-content" @click.stop>
        <button @click="closeMediaModal" class="media-modal-close">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="media-modal-container">
          <img v-if="currentMedia.type === 'image'" :src="currentMedia.url" alt="Review media">
          <video v-else-if="currentMedia.type === 'video'" :src="currentMedia.url" controls></video>
        </div>
        
        <div v-if="mediaGallery.length > 1" class="media-modal-nav">
          <button @click="previousMedia" class="media-nav-btn prev" :disabled="currentMediaIndex === 0">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="media-counter">{{ currentMediaIndex + 1 }} / {{ mediaGallery.length }}</span>
          <button @click="nextMedia" class="media-nav-btn next" :disabled="currentMediaIndex === mediaGallery.length - 1">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <Transition name="toast">
      <div v-if="showSuccessToast" class="success-toast">
        <div class="toast-content">
          <div class="toast-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="toast-message">
            <h4>Thank you!</h4>
            <p>Your review has been submitted successfully</p>
          </div>
        </div>
        <div class="toast-actions">
          <button @click="goBackToProduct" class="toast-btn primary">
            Go Back to Product
          </button>
          <button @click="writeAnotherReview" class="toast-btn secondary">
            Add Another Review
          </button>
        </div>
        <button @click="hideSuccessToast" class="toast-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RatingsReviews',
  props: {
    productId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      // Filter and sort
      reviewFilter: 'all',
      reviewSort: 'newest',
      
      // Pagination
      currentPage: 1,
      reviewsPerPage: 10,
      
      // Modal states
      showWriteReview: false,
      showMediaModal: false,
      showSuccessToast: false,
      
      // Review form
      newReview: {
        rating: 0,
        title: '',
        text: '',
        media: []
      },
      hoverRating: 0,
      isSubmittingReview: false,
      
      // Media modal
      currentMedia: {},
      currentMediaIndex: 0,
      mediaGallery: [],
      
      // Mock reviews data - in real app this would come from API
      reviews: [
        {
          id: 1,
          userName: 'Emma Wilson',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
          rating: 5,
          title: 'Amazing transformation!',
          text: 'This product has completely changed my skin routine. After using it for 6 weeks, I can see a visible difference in my skin texture and brightness. The formula is lightweight, absorbs quickly, and doesn\'t cause any irritation. I\'ve already recommended it to all my friends. Definitely worth the investment! The packaging is also very elegant and feels premium.',
          date: new Date('2024-01-15'),
          verified: true,
          helpfulCount: 24,
          userHelpfulVote: null,
          photos: [
            { 
              thumbnail: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200', 
              full: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
              type: 'image'
            }
          ],
          isExpanded: false
        },
        {
          id: 2,
          userName: 'Sarah Johnson',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
          rating: 4,
          title: 'Great product, quick results',
          text: 'I love how lightweight this serum is. It absorbs quickly and doesn\'t leave any residue. I\'ve noticed improvement in my skin texture after just 2 weeks of use. The packaging is also very elegant and feels premium.',
          date: new Date('2024-01-10'),
          verified: true,
          helpfulCount: 18,
          userHelpfulVote: null,
          isExpanded: false
        },
        {
          id: 3,
          userName: 'Maria Garcia',
          userAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
          rating: 5,
          title: 'Holy grail product!',
          text: 'This is my third bottle and I\'m never switching! The formula is perfect for my sensitive skin and I love that it\'s fragrance-free. It plays well with other products in my routine and has helped fade my dark spots significantly. Customer service is also excellent.',
          date: new Date('2024-01-08'),
          verified: true,
          helpfulCount: 31,
          userHelpfulVote: null,
          photos: [
            { 
              thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200', 
              full: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
              type: 'image'
            },
            { 
              thumbnail: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=200', 
              full: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800',
              type: 'image'
            }
          ],
          isExpanded: false
        },
        {
          id: 4,
          userName: 'Jessica Chen',
          userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
          rating: 4,
          title: 'Noticeable improvement',
          text: 'Been using this for about a month now and I can definitely see improvements in my skin tone and texture. The price point is reasonable for the quality.',
          date: new Date('2024-01-05'),
          verified: true,
          helpfulCount: 12,
          userHelpfulVote: null,
          isExpanded: false
        },
        {
          id: 5,
          userName: 'Alexandra Smith',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
          rating: 3,
          title: 'Decent product',
          text: 'It\'s okay, but I\'ve used better serums for the same price range. The texture is nice but I didn\'t see dramatic results.',
          date: new Date('2024-01-02'),
          verified: false,
          helpfulCount: 8,
          userHelpfulVote: null,
          isExpanded: false
        },
        {
          id: 6,
          userName: 'Rachel Brown',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          rating: 5,
          title: 'Perfect for sensitive skin',
          text: 'I have very sensitive skin and this product works wonderfully. No irritation whatsoever and I can see my skin getting brighter each day.',
          date: new Date('2023-12-28'),
          verified: true,
          helpfulCount: 15,
          userHelpfulVote: null,
          isExpanded: false
        }
      ]
    };
  },
  
  computed: {
    ...mapGetters('products', ['productById']),
    
    product() {
      const baseProduct = this.productById(this.productId);
      if (!baseProduct) return null;

      return {
        ...baseProduct,
        images: [
          baseProduct.image || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600',
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
          'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600'
        ]
      };
    },
    
    filteredReviews() {
      let filtered = [...this.reviews];
      
      if (this.reviewFilter !== 'all') {
        if (this.reviewFilter === 'photos') {
          filtered = filtered.filter(review => review.photos && review.photos.length > 0);
        } else if (this.reviewFilter === 'verified') {
          filtered = filtered.filter(review => review.verified);
        } else {
          filtered = filtered.filter(review => review.rating === parseInt(this.reviewFilter));
        }
      }
      
      // Sort reviews
      switch (this.reviewSort) {
        case 'oldest':
          filtered.sort((a, b) => a.date - b.date);
          break;
        case 'highest':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'lowest':
          filtered.sort((a, b) => a.rating - b.rating);
          break;
        case 'helpful':
          filtered.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
          break;
        default:
          filtered.sort((a, b) => b.date - a.date);
      }
      
      return filtered;
    },
    
    paginatedReviews() {
      const startIndex = 0;
      const endIndex = this.currentPage * this.reviewsPerPage;
      return this.filteredReviews.slice(startIndex, endIndex);
    },
    
    hasMoreReviews() {
      return this.paginatedReviews.length < this.filteredReviews.length;
    },
    
    remainingReviewsCount() {
      return this.filteredReviews.length - this.paginatedReviews.length;
    },
    
    recommendationPercentage() {
      const positiveReviews = this.reviews.filter(review => review.rating >= 4).length;
      return Math.round((positiveReviews / this.reviews.length) * 100);
    },
    
    photosCount() {
      return this.reviews.filter(review => review.photos && review.photos.length > 0).length;
    },
    
    verifiedCount() {
      return this.reviews.filter(review => review.verified).length;
    },
    
    canSubmitReview() {
      return this.newReview.rating > 0 && this.newReview.text.trim().length >= 10;
    }
  },
  
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    
    goBackToProduct() {
      this.$router.push(`/product/${this.productId}`);
    },
    
    getRatingCount(rating) {
      return this.reviews.filter(review => review.rating === rating).length;
    },
    
    getRatingPercentage(rating) {
      const count = this.getRatingCount(rating);
      return this.reviews.length > 0 ? Math.round((count / this.reviews.length) * 100) : 0;
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    },
    
    toggleReviewExpansion(review) {
      review.isExpanded = !review.isExpanded;
    },
    
    markHelpful(reviewId, isHelpful) {
      const review = this.reviews.find(r => r.id === reviewId);
      if (review) {
        if (review.userHelpfulVote === isHelpful) {
          // User is removing their vote
          review.userHelpfulVote = null;
          if (isHelpful) {
            review.helpfulCount = (review.helpfulCount || 1) - 1;
          }
        } else {
          // User is adding or changing their vote
          if (review.userHelpfulVote === true && !isHelpful) {
            review.helpfulCount = (review.helpfulCount || 1) - 1;
          } else if (review.userHelpfulVote !== true && isHelpful) {
            review.helpfulCount = (review.helpfulCount || 0) + 1;
          }
          review.userHelpfulVote = isHelpful;
        }
      }
    },
    
    shareReview(review) {
      if (navigator.share) {
        navigator.share({
          title: `Review: ${review.title}`,
          text: review.text,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        // You could show a toast here
      }
    },
    
    reportReview(review) {
      // In a real app, this would open a report dialog or send to API
      alert('Review reported. Thank you for helping us maintain quality.');
    },
    
    loadMoreReviews() {
      this.currentPage++;
    },
    
    // Write Review Modal Methods
    closeWriteReview() {
      this.showWriteReview = false;
      this.resetReviewForm();
    },
    
    setRating(rating) {
      this.newReview.rating = rating;
    },
    
    getRatingLabel(rating) {
      const labels = {
        0: 'Select a rating',
        1: 'Poor',
        2: 'Fair', 
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      };
      return labels[rating] || '';
    },
    
    handleMediaUpload(event) {
      const files = Array.from(event.target.files);
      
      files.forEach(file => {
        if (this.newReview.media.length >= 5) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newReview.media.push({
            file: file,
            preview: e.target.result,
            type: file.type.startsWith('image/') ? 'image' : 'video'
          });
        };
        reader.readAsDataURL(file);
      });
      
      // Reset input
      event.target.value = '';
    },
    
    removeMedia(index) {
      this.newReview.media.splice(index, 1);
    },
    
    async submitReview() {
      if (!this.canSubmitReview) return;
      
      this.isSubmittingReview = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Add review to local state (in real app, this would be handled by API/store)
        const newReview = {
          id: Date.now(),
          userName: 'You', // In real app, get from user store
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          rating: this.newReview.rating,
          title: this.newReview.title,
          text: this.newReview.text,
          date: new Date(),
          verified: true,
          helpfulCount: 0,
          userHelpfulVote: null,
          photos: this.newReview.media.map(media => ({
            thumbnail: media.preview,
            full: media.preview,
            type: media.type
          })),
          isExpanded: false
        };
        
        this.reviews.unshift(newReview);
        
        this.isSubmittingReview = false;
        this.showWriteReview = false;
        this.showSuccessToast = true;
        this.resetReviewForm();
        
        // Auto-hide toast after 10 seconds
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 10000);
        
      } catch (error) {
        this.isSubmittingReview = false;
        // Handle error
        console.error('Failed to submit review:', error);
      }
    },
    
    resetReviewForm() {
      this.newReview = {
        rating: 0,
        title: '',
        text: '',
        media: []
      };
      this.hoverRating = 0;
    },
    
    // Media Modal Methods
    openPhotoModal(photo, gallery, index) {
      this.currentMedia = {
        url: photo.full,
        type: photo.type
      };
      this.mediaGallery = gallery;
      this.currentMediaIndex = index;
      this.showMediaModal = true;
    },
    
    closeMediaModal() {
      this.showMediaModal = false;
      this.currentMedia = {};
      this.mediaGallery = [];
      this.currentMediaIndex = 0;
    },
    
    previousMedia() {
      if (this.currentMediaIndex > 0) {
        this.currentMediaIndex--;
        const media = this.mediaGallery[this.currentMediaIndex];
        this.currentMedia = {
          url: media.full,
          type: media.type
        };
      }
    },
    
    nextMedia() {
      if (this.currentMediaIndex < this.mediaGallery.length - 1) {
        this.currentMediaIndex++;
        const media = this.mediaGallery[this.currentMediaIndex];
        this.currentMedia = {
          url: media.full,
          type: media.type
        };
      }
    },
    
    // Success Toast Methods
    hideSuccessToast() {
      this.showSuccessToast = false;
    },
    
    writeAnotherReview() {
      this.showSuccessToast = false;
      this.showWriteReview = true;
    }
  }
};
</script>

<style scoped>
.ratings-reviews-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  padding-bottom: 2rem;
}

/* Page Header */
.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.back-button:hover {
  background: #e5e7eb;
  transform: translateX(-2px);
}

.header-main {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.product-context {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.product-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.product-brand {
  color: #6b7280;
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
}

/* Aggregate Rating Section */
.aggregate-rating-section {
  background: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.rating-overview {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: start;
}

.overall-rating {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
}

.rating-display {
  margin-bottom: 1rem;
}

.rating-number {
  font-size: 4rem;
  font-weight: 700;
  display: block;
  margin-bottom: 0.5rem;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.rating-stars .fa-star {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.3);
}

.rating-stars .fa-star.filled {
  color: #fbbf24;
}

.rating-subtitle {
  font-size: 1.125rem;
  margin: 0 0 1.5rem 0;
  opacity: 0.9;
}

.recommendation {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.recommend-percentage {
  font-size: 2rem;
  font-weight: 700;
  display: block;
}

.recommend-text {
  font-size: 0.875rem;
  opacity: 0.9;
}

.rating-breakdown {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 16px;
}

.breakdown-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #111827;
}

.rating-bar-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.rating-label {
  font-weight: 500;
  color: #374151;
  min-width: 30px;
}

.rating-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
  transition: width 0.3s ease;
}

.rating-count {
  font-weight: 500;
  color: #6b7280;
  min-width: 30px;
  text-align: center;
}

.rating-percentage {
  font-size: 0.875rem;
  color: #9ca3af;
  min-width: 40px;
  text-align: right;
}

/* Filter and Sort Section */
.filter-sort-section {
  padding: 1.5rem 0;
  background: white;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.filter-group,
.sort-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-label,
.sort-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.filter-select,
.sort-select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  min-width: 160px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus,
.sort-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.write-review-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.write-review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Reviews List */
.reviews-list-section {
  padding: 2rem 0;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.review-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.reviewer-profile {
  display: flex;
  gap: 1rem;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.reviewer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reviewer-name {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.review-rating {
  display: flex;
  gap: 0.125rem;
}

.review-rating .fa-star {
  color: #d1d5db;
  font-size: 0.875rem;
}

.review-rating .fa-star.filled {
  color: #fbbf24;
}

.review-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.verified-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #ecfdf5;
  color: #047857;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.review-actions {
  display: flex;
  gap: 0.5rem;
}

.share-review-btn {
  padding: 0.5rem;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-review-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.review-content {
  padding-left: 4rem;
}

.review-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.review-text {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.review-text.expanded {
  max-height: none !important;
}

.read-more-btn,
.read-less-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #667eea;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: color 0.2s ease;
}

.read-more-btn:hover,
.read-less-btn:hover {
  color: #5a67d8;
}

/* Review Media */
.review-media {
  margin: 1.5rem 0;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  max-width: 600px;
}

.media-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.media-item:hover {
  transform: scale(1.05);
}

.media-item img,
.media-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.media-item:hover .media-overlay {
  opacity: 1;
}

.media-overlay i {
  color: white;
  font-size: 1.25rem;
}

/* Review Footer */
.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.helpfulness {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.helpful-question {
  color: #6b7280;
  font-size: 0.875rem;
}

.helpful-actions {
  display: flex;
  gap: 0.5rem;
}

.helpful-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.helpful-btn:hover {
  background: #e5e7eb;
}

.helpful-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.report-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.report-btn:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

/* Load More */
.load-more-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.load-more-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
}

/* No Reviews State */
.no-reviews {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
}

.no-reviews-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.no-reviews-icon i {
  color: white;
  font-size: 2rem;
}

.no-reviews h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.no-reviews p {
  color: #6b7280;
  margin: 0 0 2rem 0;
}

.write-first-review-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.write-first-review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.write-review-modal {
  max-width: 700px;
}

.modal-header {
  padding: 2rem 2rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  position: relative;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.modal-subtitle {
  color: #6b7280;
  margin: 0 0 2rem 0;
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 0 2rem;
}

.modal-footer {
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Form Styles */
.review-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.rating-group {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.star-selector {
  display: flex;
  gap: 0.25rem;
}

.rating-star {
  font-size: 2rem;
  color: #d1d5db;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-star.filled {
  color: #fbbf24;
}

.rating-star.hover {
  color: #f59e0b;
  transform: scale(1.1);
}

.rating-label {
  font-weight: 600;
  color: #374151;
  font-size: 1.125rem;
}

.form-input {
  padding: 0.875rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-counter,
.character-count {
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: right;
  margin-top: 0.25rem;
}

/* Media Upload */
.media-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
}

.media-upload-area:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.02);
}

.media-input {
  display: none;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  margin: 0 auto 0.5rem;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.upload-hint {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.uploaded-media {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.uploaded-media-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.uploaded-media-item img,
.uploaded-media-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-media {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: background 0.2s ease;
}

.remove-media:hover {
  background: #dc2626;
}

/* Button Styles */
.btn-secondary {
  padding: 0.875rem 1.5rem;
  background: #f8f9fa;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.save-review-btn.loading {
  pointer-events: none;
}

.btn-loading {
  display: flex;
  align-items: center;
}

.loading-dots {
  display: flex;
  gap: 0.25rem;
}

.loading-dots span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  animation: bounce 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

/* Media Modal */
.media-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.2s ease;
}

.media-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  animation: slideUp 0.3s ease;
}

.media-modal-close {
  position: absolute;
  top: -50px;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.media-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.media-modal-container {
  border-radius: 12px;
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
}

.media-modal-container img,
.media-modal-container video {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.media-modal-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  color: white;
}

.media-nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.media-nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.media-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.media-counter {
  font-weight: 500;
}

/* Success Toast */
.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 90vw;
  z-index: 3000;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #e5e7eb;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.toast-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.toast-message h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.toast-message p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.toast-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.toast-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  min-width: 120px;
}

.toast-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.toast-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.toast-btn.secondary {
  background: #f8f9fa;
  color: #374151;
  border: 1px solid #d1d5db;
}

.toast-btn.secondary:hover {
  background: #e5e7eb;
}

.toast-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.75rem;
}

.toast-close:hover {
  background: #e5e7eb;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
    transform: scale(1);
  }
}

/* Transitions */
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter, .toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    padding: 1rem 0;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .back-button {
    align-self: flex-start;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .rating-overview {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-group,
  .sort-group {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .filter-select,
  .sort-select {
    min-width: auto;
  }
  
  .write-review-btn {
    margin-left: 0;
    justify-content: center;
  }
  
  .review-card {
    padding: 1.5rem;
  }
  
  .review-content {
    padding-left: 0;
  }
  
  .review-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .helpful-actions {
    flex-wrap: wrap;
  }
  
  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .toast-actions {
    flex-direction: column;
  }
  
  .toast-btn {
    min-width: auto;
  }
  
  .media-modal-overlay {
    padding: 1rem;
  }
  
  .media-modal-close {
    top: -40px;
    right: -10px;
  }
}

@media (max-width: 480px) {
  .product-context {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .aggregate-rating-section {
    padding: 2rem 0;
  }
  
  .overall-rating {
    padding: 1.5rem;
  }
  
  .rating-number {
    font-size: 3rem;
  }
  
  .star-selector {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .rating-star {
    font-size: 1.75rem;
  }
  
  .media-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  
  .uploaded-media {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
}
</style>
