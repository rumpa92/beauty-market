<template>
  <div v-if="isVisible" class="rating-modal-overlay" @click="closeModal">
    <div class="rating-modal" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <h2 class="modal-title">Rate & Review</h2>
        <button @click="closeModal" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Success Message -->
      <div v-if="isSubmitted" class="success-message">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>✅ Review Submitted!</h3>
        <p>Thank you for sharing your feedback. Your review will be visible after verification.</p>
        <button @click="closeModal" class="success-btn">Close</button>
      </div>

      <!-- Review Form -->
      <div v-else class="modal-content">
        <!-- Product Summary Header -->
        <div class="product-summary">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="order-details">
              <span class="order-date">Order Date: {{ formatDate(orderDate) }}</span>
              <span class="delivery-date">Delivered: {{ formatDate(deliveryDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Rating Section -->
        <div class="rating-section">
          <h4 class="section-title">⭐ Rate Your Experience</h4>
          <div class="stars-container">
            <div class="stars">
              <i
                v-for="star in 5"
                :key="star"
                @click="setRating(star)"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                :class="[
                  'fas fa-star star',
                  { 
                    'filled': star <= (hoverRating || rating),
                    'hover': star <= hoverRating && hoverRating !== 0
                  }
                ]"
              ></i>
            </div>
            <span class="rating-text">{{ getRatingText() }}</span>
          </div>
          <p class="rating-subtext">1 = Poor, 5 = Excellent</p>
        </div>

        <!-- Review Title -->
        <div class="form-group">
          <label class="form-label">Review Title</label>
          <input
            v-model="reviewTitle"
            type="text"
            class="form-input"
            placeholder="Write a short headline for your review"
            maxlength="100"
          />
          <div class="char-count">{{ reviewTitle.length }}/100</div>
        </div>

        <!-- Review Description -->
        <div class="form-group">
          <label class="form-label">Review Description</label>
          <textarea
            v-model="reviewDescription"
            class="form-textarea"
            placeholder="Describe the delivery speed, service quality, and your thoughts on the product"
            rows="5"
            maxlength="500"
          ></textarea>
          <div class="char-count">{{ reviewDescription.length }}/500</div>
        </div>

        <!-- Upload Photos -->
        <div class="form-group">
          <label class="form-label">Upload Photos</label>
          <div class="upload-section">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              @change="handleFileUpload"
              class="file-input"
            />
            <button @click="$refs.fileInput.click()" class="upload-btn">
              <i class="fas fa-camera"></i>
              Upload Images
            </button>
            <p class="upload-subtext">Add outfit try-on or product photos to make your review more helpful</p>
          </div>
          
          <!-- Image Previews -->
          <div v-if="uploadedImages.length > 0" class="image-previews">
            <div
              v-for="(image, index) in uploadedImages"
              :key="index"
              class="image-preview"
            >
              <img :src="image.url" :alt="`Preview ${index + 1}`" />
              <button @click="removeImage(index)" class="remove-image">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Form Buttons -->
        <div class="form-actions">
          <button @click="closeModal" class="cancel-btn">Cancel</button>
          <button 
            @click="submitReview" 
            :disabled="!isFormValid"
            :class="['submit-btn', { disabled: !isFormValid }]"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RatingReviewModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rating: 0,
      hoverRating: 0,
      reviewTitle: '',
      reviewDescription: '',
      uploadedImages: [],
      isSubmitted: false,
      orderDate: new Date('2024-01-15'),
      deliveryDate: new Date('2024-01-18')
    };
  },
  computed: {
    isFormValid() {
      return this.rating > 0 && this.reviewTitle.trim().length > 0 && this.reviewDescription.trim().length > 0;
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },

    setRating(star) {
      this.rating = star;
    },

    getRatingText() {
      const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
      return texts[this.hoverRating || this.rating] || '';
    },

    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.uploadedImages.push({
              file: file,
              url: e.target.result,
              name: file.name
            });
          };
          reader.readAsDataURL(file);
        }
      });
    },

    removeImage(index) {
      this.uploadedImages.splice(index, 1);
    },

    async submitReview() {
      if (!this.isFormValid) return;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create review object
        const review = {
          productId: this.product.id,
          rating: this.rating,
          title: this.reviewTitle,
          description: this.reviewDescription,
          images: this.uploadedImages,
          orderDate: this.orderDate,
          deliveryDate: this.deliveryDate,
          submittedAt: new Date()
        };

        console.log('Review submitted:', review);

        // Show success message
        this.isSubmitted = true;

        // Emit success event
        this.$emit('review-submitted', review);

        // Auto close after 3 seconds
        setTimeout(() => {
          this.closeModal();
        }, 3000);

      } catch (error) {
        console.error('Error submitting review:', error);
        // Handle error (could show error message)
      }
    },

    resetForm() {
      this.rating = 0;
      this.hoverRating = 0;
      this.reviewTitle = '';
      this.reviewDescription = '';
      this.uploadedImages = [];
      this.isSubmitted = false;
    },

    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }
};
</script>

<style scoped>
.rating-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.rating-modal {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-content {
  padding: 32px;
}

.success-message {
  text-align: center;
  padding: 60px 32px;
}

.success-icon {
  font-size: 64px;
  color: #10b981;
  margin-bottom: 24px;
}

.success-message h3 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.success-message p {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 32px;
}

.success-btn {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.success-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}

.product-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.product-image {
  flex-shrink: 0;
}

.product-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-date,
.delivery-date {
  font-size: 14px;
  color: #666;
}

.rating-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.stars-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.stars {
  display: flex;
  gap: 8px;
}

.star {
  font-size: 32px;
  color: #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
}

.star:hover {
  transform: scale(1.1);
}

.star.filled {
  color: #fbbf24;
}

.star.hover {
  color: #f59e0b;
  transform: scale(1.15);
}

.rating-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  min-width: 100px;
}

.rating-subtext {
  color: #666;
  font-size: 14px;
  margin: 0;
  font-style: italic;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 16px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: inherit;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.upload-section {
  margin-bottom: 16px;
}

.file-input {
  display: none;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #374151;
  font-size: 16px;
}

.upload-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
  transform: translateY(-2px);
}

.upload-subtext {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.image-previews {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.image-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.remove-image:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  background: transparent;
  color: #666;
  border: none;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-decoration: underline;
}

.cancel-btn:hover {
  color: #333;
  background: #f3f4f6;
  text-decoration: none;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn.disabled {
  background: #d1d5db;
  cursor: not-allowed;
  box-shadow: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .rating-modal-overlay {
    padding: 10px;
  }

  .modal-header {
    padding: 20px 24px;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-content {
    padding: 24px;
  }

  .product-summary {
    flex-direction: column;
    text-align: center;
  }

  .product-image {
    align-self: center;
  }

  .stars-container {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .star {
    font-size: 28px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .submit-btn,
  .cancel-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 20px;
  }

  .image-previews {
    justify-content: center;
  }

  .star {
    font-size: 24px;
  }
}
</style>
