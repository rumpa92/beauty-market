<template>
  <div class="modern-pdp" v-if="product">
    <!-- Product Hero Section -->
    <section class="product-hero">
      <div class="hero-container">
        
        <!-- Left: Image Carousel -->
        <div class="image-section">
          <div class="main-image-container">
            <!-- Share Icons Overlay -->
            <div class="share-overlay">
              <button @click="shareProduct('whatsapp')" class="share-btn whatsapp">
                <i class="fab fa-whatsapp"></i>
              </button>
              <button @click="shareProduct('instagram')" class="share-btn instagram">
                <i class="fab fa-instagram"></i>
              </button>
              <button @click="shareProduct('facebook')" class="share-btn facebook">
                <i class="fab fa-facebook"></i>
              </button>
              <button @click="copyLink" class="share-btn copy">
                <i class="fas fa-link"></i>
              </button>
            </div>

            <!-- Main Product Image -->
            <div 
              class="main-image-wrapper"
              @mousemove="handleZoom"
              @mouseleave="resetZoom"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
            >
              <img 
                :src="currentImage" 
                :alt="product.name"
                class="main-image"
                :style="zoomStyle"
                ref="mainImage"
              />
              
              <!-- Carousel Navigation -->
              <button 
                @click="previousImage" 
                class="carousel-btn prev-btn"
                :disabled="currentImageIndex === 0"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                @click="nextImage" 
                class="carousel-btn next-btn"
                :disabled="currentImageIndex === product.images.length - 1"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <!-- Image Thumbnails -->
            <div class="thumbnails-container">
              <div class="thumbnails-scroll">
                <div 
                  v-for="(image, index) in product.images" 
                  :key="index"
                  class="thumbnail"
                  :class="{ active: currentImageIndex === index }"
                  @click="selectImage(index)"
                >
                  <img :src="image" :alt="`${product.name} view ${index + 1}`" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Product Information -->
        <div class="product-info">
          <!-- Brand & Title -->
          <div class="product-header">
            <div class="brand-name">{{ product.brand }}</div>
            <h1 class="product-title">{{ product.name }}</h1>
            <div class="product-rating">
              <div class="stars">
                <i 
                  v-for="i in 5" 
                  :key="i"
                  class="star"
                  :class="{ filled: i <= Math.floor(product.rating), half: i === Math.ceil(product.rating) && product.rating % 1 !== 0 }"
                >★</i>
              </div>
              <span class="rating-text">{{ product.rating }} ({{ product.reviewCount }} reviews)</span>
            </div>
          </div>

          <!-- Price Section -->
          <div class="price-section">
            <div class="current-price">₹{{ product.price.toLocaleString() }}</div>
            <div v-if="product.originalPrice" class="original-price">₹{{ product.originalPrice.toLocaleString() }}</div>
            <div v-if="product.discount" class="discount-badge">{{ product.discount }}% OFF</div>
          </div>

          <!-- Product Description -->
          <div class="product-description">
            <p>{{ product.description }}</p>
          </div>

          <!-- Variants Section -->
          <div class="variants-section">
            <!-- Size Selection -->
            <div v-if="product.sizes" class="variant-group">
              <h4 class="variant-title">Size</h4>
              <div class="size-options">
                <button 
                  v-for="size in product.sizes" 
                  :key="size.id"
                  class="size-pill"
                  :class="{ selected: selectedSize === size.id }"
                  @click="selectSize(size.id)"
                >
                  <span class="size-value">{{ size.value }}</span>
                  <span class="size-price">₹{{ size.price.toLocaleString() }}</span>
                </button>
              </div>
            </div>

            <!-- Color Selection -->
            <div v-if="product.colors" class="variant-group">
              <h4 class="variant-title">Color</h4>
              <div class="color-options">
                <button 
                  v-for="color in product.colors" 
                  :key="color.id"
                  class="color-swatch"
                  :class="{ selected: selectedColor === color.id }"
                  :style="{ backgroundColor: color.hex }"
                  @click="selectColor(color.id)"
                  :title="color.name"
                >
                  <div class="color-check" v-if="selectedColor === color.id">
                    <i class="fas fa-check"></i>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Key Features -->
          <div class="key-features">
            <div class="feature-list">
              <div v-for="feature in product.features" :key="feature" class="feature-item">
                <i class="fas fa-check"></i>
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- Add to Cart Section -->
          <div class="cart-section">
            <!-- If item is already in cart, show quantity controls -->
            <div v-if="itemInCart" class="cart-controls">
              <div class="quantity-section">
                <h4>In Cart</h4>
                <div class="quantity-controls">
                  <button @click="decreaseQuantity" class="qty-btn">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="quantity-display">{{ itemInCart.quantity }}</span>
                  <button @click="increaseQuantity" class="qty-btn">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              <button @click="removeFromCart" class="remove-btn">
                <i class="fas fa-trash"></i>
                Remove
              </button>
            </div>

            <!-- If item is not in cart, show add to cart button -->
            <div v-else class="add-to-cart-section">
              <div class="quantity-selector">
                <label>Quantity</label>
                <div class="quantity-controls">
                  <button @click="quantity > 1 && quantity--" class="qty-btn">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="quantity-display">{{ quantity }}</span>
                  <button @click="quantity++" class="qty-btn">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <button 
                @click="addToCart" 
                class="add-to-cart-btn"
                :class="{ loading: isAddingToCart }"
                :disabled="isAddingToCart"
              >
                <i v-if="isAddingToCart" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-shopping-bag"></i>
                <span v-if="isAddingToCart">Adding...</span>
                <span v-else>Add to Cart</span>
              </button>
            </div>
          </div>

          <!-- Delivery Info -->
          <div class="delivery-info">
            <div class="delivery-item">
              <i class="fas fa-truck"></i>
              <span>Free delivery on orders over ₹499</span>
            </div>
            <div class="delivery-item">
              <i class="fas fa-undo"></i>
              <span>7 days easy returns</span>
            </div>
            <div class="delivery-item">
              <i class="fas fa-shield-alt"></i>
              <span>100% authentic products</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Information Tabs -->
    <section class="product-details">
      <div class="details-container">
        <div class="tabs-navigation">
          <button 
            v-for="tab in detailTabs" 
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i>
            {{ tab.title }}
          </button>
        </div>

        <div class="tab-content">
          <!-- How to Use Tab -->
          <div v-if="activeTab === 'how-to-use'" class="how-to-use">
            <h3>How to Use</h3>
            <div class="usage-steps">
              <div v-for="(step, index) in product.howToUse" :key="index" class="usage-step">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Ingredients Tab -->
          <div v-if="activeTab === 'ingredients'" class="ingredients">
            <h3>Key Ingredients</h3>
            <div class="ingredients-list">
              <div v-for="ingredient in product.ingredients" :key="ingredient.name" class="ingredient-item">
                <div class="ingredient-name">{{ ingredient.name }}</div>
                <div class="ingredient-benefit">{{ ingredient.benefit }}</div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'" class="reviews-section">
            <div class="reviews-header">
              <h3>Customer Reviews</h3>
              <button @click="openReviewModal" class="write-review-btn">
                <i class="fas fa-edit"></i>
                Write a Review
              </button>
            </div>

            <!-- Rating Summary -->
            <div class="rating-summary">
              <div class="overall-rating">
                <div class="rating-score">{{ product.rating }}</div>
                <div class="rating-stars">
                  <div class="stars">
                    <i v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.floor(product.rating) }">★</i>
                  </div>
                  <div class="rating-count">Based on {{ product.reviewCount }} reviews</div>
                </div>
              </div>
              
              <!-- Rating Breakdown -->
              <div class="rating-breakdown">
                <div v-for="rating in [5,4,3,2,1]" :key="rating" class="rating-bar">
                  <span class="rating-label">{{ rating }}★</span>
                  <div class="bar-container">
                    <div class="bar-fill" :style="{ width: getRatingPercentage(rating) + '%' }"></div>
                  </div>
                  <span class="rating-percent">{{ getRatingPercentage(rating) }}%</span>
                </div>
              </div>
            </div>

            <!-- Review Filters -->
            <div class="review-filters">
              <button 
                v-for="filter in reviewFilters" 
                :key="filter.id"
                class="filter-btn"
                :class="{ active: selectedFilter === filter.id }"
                @click="selectedFilter = filter.id"
              >
                {{ filter.label }}
              </button>
            </div>

            <!-- Reviews List -->
            <div class="reviews-list">
              <div v-for="review in filteredReviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <div class="reviewer-info">
                    <img :src="review.userAvatar" :alt="review.userName" class="reviewer-avatar" />
                    <div class="reviewer-details">
                      <div class="reviewer-name">{{ review.userName }}</div>
                      <div class="review-date">{{ formatDate(review.date) }}</div>
                    </div>
                  </div>
                  <div class="review-rating">
                    <div class="stars">
                      <i v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</i>
                    </div>
                  </div>
                </div>
                
                <div class="review-content">
                  <p :class="{ truncated: !review.expanded && review.text.length > 200 }">
                    {{ review.expanded ? review.text : review.text.substring(0, 200) + (review.text.length > 200 ? '...' : '') }}
                  </p>
                  <button 
                    v-if="review.text.length > 200" 
                    @click="review.expanded = !review.expanded"
                    class="read-more-btn"
                  >
                    {{ review.expanded ? 'Read less' : 'Read more' }}
                  </button>
                </div>

                <!-- Review Images -->
                <div v-if="review.images && review.images.length > 0" class="review-images">
                  <div 
                    v-for="(image, index) in review.images" 
                    :key="index"
                    class="review-image"
                    @click="openImageModal(image)"
                  >
                    <img :src="image" :alt="'Review image ' + (index + 1)" />
                  </div>
                </div>

                <div class="review-actions">
                  <button class="review-action-btn">
                    <i class="fas fa-thumbs-up"></i>
                    Helpful ({{ review.helpfulCount || 0 }})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Products -->
    <section class="related-products">
      <div class="related-container">
        <h2 class="section-title">You may also like</h2>
        <div class="products-carousel">
          <div class="carousel-controls">
            <button @click="scrollRelated('left')" class="carousel-control prev">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button @click="scrollRelated('right')" class="carousel-control next">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <div class="products-scroll" ref="relatedProductsScroll">
            <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" class="related-product-card">
              <div class="product-image">
                <img :src="relatedProduct.image" :alt="relatedProduct.name" />
              </div>
              <div class="product-info">
                <div class="product-brand">{{ relatedProduct.brand }}</div>
                <div class="product-name">{{ relatedProduct.name }}</div>
                <div class="product-price">₹{{ relatedProduct.price.toLocaleString() }}</div>
                <button @click="viewProduct(relatedProduct.id)" class="view-product-btn">
                  Quick View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Write Review Modal -->
    <div v-if="showReviewModal" class="modal-overlay" @click="closeReviewModal">
      <div class="review-modal" @click.stop>
        <div class="modal-header">
          <h3>Write a Review</h3>
          <button @click="closeReviewModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-content">
          <div class="rating-input">
            <label>Your Rating</label>
            <div class="star-input">
              <button 
                v-for="i in 5" 
                :key="i"
                @click="newReview.rating = i"
                class="star-btn"
                :class="{ active: i <= newReview.rating }"
              >
                ★
              </button>
            </div>
          </div>

          <div class="text-input">
            <label>Your Review</label>
            <textarea 
              v-model="newReview.text" 
              placeholder="Share your experience with this product..."
              rows="4"
            ></textarea>
          </div>

          <div class="image-upload">
            <label>Add Photos (Optional)</label>
            <input type="file" multiple accept="image/*" @change="handleImageUpload" ref="imageInput" style="display: none;">
            <button @click="$refs.imageInput.click()" class="upload-btn">
              <i class="fas fa-camera"></i>
              Add Photos
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closeReviewModal" class="cancel-btn">Cancel</button>
          <button @click="submitReview" class="submit-btn" :disabled="!newReview.rating || !newReview.text.trim()">
            Submit Review
          </button>
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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ModernProductDetail',
  props: {
    productId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // Image carousel
      currentImageIndex: 0,
      zoomStyle: {},
      isZooming: false,
      
      // Product selection
      selectedSize: null,
      selectedColor: null,
      quantity: 1,
      
      // UI states
      isAddingToCart: false,
      activeTab: 'how-to-use',
      selectedFilter: 'all',
      showReviewModal: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      
      // Review form
      newReview: {
        rating: 0,
        text: '',
        images: []
      },

      // Sample product data (in real app, this would come from API/store)
      product: {
        id: 1,
        name: 'Hydrating Vitamin C Face Serum',
        brand: 'GlowLux Premium',
        price: 1299,
        originalPrice: 1599,
        discount: 19,
        rating: 4.6,
        reviewCount: 324,
        description: 'A powerful vitamin C serum that brightens, hydrates, and protects your skin. Formulated with 20% vitamin C, hyaluronic acid, and natural botanicals for a radiant, youthful glow.',
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop'
        ],
        sizes: [
          { id: 'small', value: '15ml', price: 699 },
          { id: 'medium', value: '30ml', price: 1299 },
          { id: 'large', value: '50ml', price: 1899 }
        ],
        colors: [
          { id: 'clear', name: 'Clear', hex: '#f8f9fa' },
          { id: 'amber', name: 'Amber', hex: '#ffc107' },
          { id: 'cobalt', name: 'Cobalt', hex: '#0056b3' }
        ],
        features: [
          '20% Vitamin C for brightening',
          'Hyaluronic acid for hydration',
          'Non-comedogenic formula',
          'Dermatologically tested',
          'Suitable for all skin types'
        ],
        howToUse: [
          {
            title: 'Cleanse',
            description: 'Start with clean, dry skin. Use your regular cleanser and pat dry.'
          },
          {
            title: 'Apply Serum',
            description: 'Apply 2-3 drops to face and neck. Gently pat and press into skin.'
          },
          {
            title: 'Moisturize',
            description: 'Follow with your favorite moisturizer to lock in hydration.'
          },
          {
            title: 'Sun Protection',
            description: 'Always use SPF 30+ during the day when using vitamin C products.'
          }
        ],
        ingredients: [
          { name: 'Vitamin C (L-Ascorbic Acid)', benefit: 'Brightens skin and fights free radicals' },
          { name: 'Hyaluronic Acid', benefit: 'Deeply hydrates and plumps skin' },
          { name: 'Vitamin E', benefit: 'Antioxidant protection and nourishment' },
          { name: 'Ferulic Acid', benefit: 'Stabilizes vitamin C and enhances benefits' }
        ]
      },

      // Sample reviews data
      reviews: [
        {
          id: 1,
          userName: 'Priya Sharma',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          date: '2024-01-15',
          text: 'Amazing serum! I\'ve been using it for 3 weeks and my skin looks so much brighter. The texture is lightweight and absorbs quickly. Definitely worth the investment.',
          images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop'],
          helpfulCount: 12,
          expanded: false
        },
        {
          id: 2,
          userName: 'Ananya Patel',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          rating: 4,
          date: '2024-01-10',
          text: 'Good product overall. I noticed some brightening after 2 weeks of use. The packaging is premium and the dropper works well. Would recommend for those with dull skin.',
          images: [],
          helpfulCount: 8,
          expanded: false
        },
        {
          id: 3,
          userName: 'Riya Singh',
          userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          date: '2024-01-08',
          text: 'Love this serum! It has transformed my skin. I was skeptical about vitamin C serums but this one is gentle and effective. My dark spots have faded significantly.',
          images: ['https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&h=300&fit=crop', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop'],
          helpfulCount: 15,
          expanded: false
        }
      ],

      // Related products
      relatedProducts: [
        {
          id: 2,
          name: 'Hydrating Face Moisturizer',
          brand: 'GlowLux',
          price: 899,
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop'
        },
        {
          id: 3,
          name: 'Gentle Foaming Cleanser',
          brand: 'PureClean',
          price: 599,
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&h=300&fit=crop'
        },
        {
          id: 4,
          name: 'Anti-Aging Eye Cream',
          brand: 'YouthGlow',
          price: 1599,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'
        },
        {
          id: 5,
          name: 'Nourishing Night Oil',
          brand: 'NightGlow',
          price: 1799,
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop'
        }
      ],

      // Tab configuration
      detailTabs: [
        { id: 'how-to-use', title: 'How to Use', icon: 'fas fa-info-circle' },
        { id: 'ingredients', title: 'Ingredients', icon: 'fas fa-leaf' },
        { id: 'reviews', title: 'Reviews', icon: 'fas fa-star' }
      ],

      // Review filters
      reviewFilters: [
        { id: 'all', label: 'All Reviews' },
        { id: '5', label: '5 Stars' },
        { id: '4', label: '4 Stars' },
        { id: '3', label: '3 Stars' },
        { id: '2', label: '2 Stars' },
        { id: '1', label: '1 Star' }
      ]
    };
  },

  computed: {
    ...mapGetters('cart', ['cartItems']),
    
    currentImage() {
      return this.product.images[this.currentImageIndex];
    },
    
    itemInCart() {
      return this.cartItems.find(item => item.id === this.product.id);
    },
    
    filteredReviews() {
      if (this.selectedFilter === 'all') {
        return this.reviews;
      }
      return this.reviews.filter(review => review.rating.toString() === this.selectedFilter);
    },
    
    toastIcon() {
      return this.toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    }
  },

  methods: {
    ...mapActions('cart', ['addToCart', 'updateQuantity', 'removeFromCart']),
    ...mapActions('ui', ['showNotification']),

    // Image carousel methods
    selectImage(index) {
      this.currentImageIndex = index;
    },
    
    nextImage() {
      if (this.currentImageIndex < this.product.images.length - 1) {
        this.currentImageIndex++;
      }
    },
    
    previousImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },

    // Zoom functionality
    handleZoom(event) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      
      this.zoomStyle = {
        transform: 'scale(2)',
        transformOrigin: `${xPercent}% ${yPercent}%`,
        cursor: 'zoom-in'
      };
    },
    
    resetZoom() {
      this.zoomStyle = {};
    },

    // Touch events for mobile
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
    },
    
    handleTouchMove(event) {
      if (!this.touchStartX) return;
      
      const touchX = event.touches[0].clientX;
      const diff = this.touchStartX - touchX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextImage();
        } else {
          this.previousImage();
        }
        this.touchStartX = null;
      }
    },
    
    handleTouchEnd() {
      this.touchStartX = null;
    },

    // Variant selection
    selectSize(sizeId) {
      this.selectedSize = sizeId;
      const size = this.product.sizes.find(s => s.id === sizeId);
      if (size) {
        this.product.price = size.price;
      }
    },
    
    selectColor(colorId) {
      this.selectedColor = colorId;
    },

    // Cart operations
    async addToCart() {
      this.isAddingToCart = true;
      
      try {
        await this.$store.dispatch('cart/addToCart', {
          ...this.product,
          quantity: this.quantity,
          selectedSize: this.selectedSize,
          selectedColor: this.selectedColor
        });
        
        this.showToastMessage('Added to cart successfully!', 'success');
      } catch (error) {
        this.showToastMessage('Failed to add to cart', 'error');
      } finally {
        this.isAddingToCart = false;
      }
    },
    
    increaseQuantity() {
      if (this.itemInCart) {
        this.updateQuantity({
          productId: this.product.id,
          quantity: this.itemInCart.quantity + 1
        });
      }
    },
    
    decreaseQuantity() {
      if (this.itemInCart && this.itemInCart.quantity > 1) {
        this.updateQuantity({
          productId: this.product.id,
          quantity: this.itemInCart.quantity - 1
        });
      }
    },
    
    removeFromCart() {
      this.removeFromCart(this.product.id);
      this.showToastMessage('Removed from cart', 'success');
    },

    // Share functionality
    shareProduct(platform) {
      const url = window.location.href;
      const text = `Check out this amazing ${this.product.name} from ${this.product.brand}!`;
      
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          break;
        case 'instagram':
          this.showToastMessage('Copy the link to share on Instagram', 'info');
          this.copyLink();
          break;
      }
    },
    
    copyLink() {
      navigator.clipboard.writeText(window.location.href);
      this.showToastMessage('Link copied to clipboard!', 'success');
    },

    // Review functionality
    openReviewModal() {
      this.showReviewModal = true;
    },
    
    closeReviewModal() {
      this.showReviewModal = false;
      this.newReview = { rating: 0, text: '', images: [] };
    },
    
    submitReview() {
      // In a real app, this would submit to an API
      const review = {
        id: Date.now(),
        userName: 'You',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        rating: this.newReview.rating,
        date: new Date().toISOString().split('T')[0],
        text: this.newReview.text,
        images: this.newReview.images,
        helpfulCount: 0,
        expanded: false
      };
      
      this.reviews.unshift(review);
      this.closeReviewModal();
      this.showToastMessage('Review submitted successfully!', 'success');
      
      // Update product rating and review count
      const totalRating = this.reviews.reduce((sum, r) => sum + r.rating, 0);
      this.product.rating = (totalRating / this.reviews.length).toFixed(1);
      this.product.reviewCount = this.reviews.length;
    },
    
    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newReview.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },

    // Utility methods
    getRatingPercentage(rating) {
      const count = this.reviews.filter(r => r.rating === rating).length;
      return Math.round((count / this.reviews.length) * 100);
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    showToastMessage(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },
    
    scrollRelated(direction) {
      const container = this.$refs.relatedProductsScroll;
      const scrollAmount = 300;
      
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    },
    
    viewProduct(productId) {
      this.$router.push(`/product/${productId}`);
    },
    
    openImageModal(image) {
      // Open image in modal or new tab
      window.open(image, '_blank');
    }
  },

  mounted() {
    // Set default selections
    if (this.product.sizes && this.product.sizes.length > 0) {
      this.selectedSize = this.product.sizes[1].id; // Select medium by default
    }
    
    if (this.product.colors && this.product.colors.length > 0) {
      this.selectedColor = this.product.colors[0].id; // Select first color by default
    }
  }
};
</script>

<style scoped>
.modern-pdp {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf7ff 0%, #f8faff 50%, #fff5f8 100%);
}

/* Hero Section */
.product-hero {
  padding: 40px 0 80px;
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

/* Image Section */
.image-section {
  position: sticky;
  top: 20px;
}

.main-image-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  position: relative;
}

.share-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.share-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.share-btn.whatsapp:hover { color: #25d366; }
.share-btn.instagram:hover { color: #e4405f; }
.share-btn.facebook:hover { color: #1877f2; }
.share-btn.copy:hover { color: #8b5cf6; }

.main-image-wrapper {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.carousel-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-btn { left: 20px; }
.next-btn { right: 20px; }

.thumbnails-container {
  padding: 20px;
  background: white;
}

.thumbnails-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 5px;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s ease;
}

.thumbnail.active {
  border-color: #ec4899;
  transform: scale(1.05);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info */
.product-info {
  padding: 20px 0;
}

.product-header {
  margin-bottom: 24px;
}

.brand-name {
  font-size: 14px;
  font-weight: 600;
  color: #8b5cf6;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.product-title {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 16px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #d1d5db;
  font-size: 18px;
  transition: color 0.2s ease;
}

.star.filled {
  color: #fbbf24;
}

.star.half {
  background: linear-gradient(90deg, #fbbf24 50%, #d1d5db 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rating-text {
  color: #6b7280;
  font-size: 14px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: #ec4899;
}

.original-price {
  font-size: 20px;
  color: #9ca3af;
  text-decoration: line-through;
}

.discount-badge {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.product-description {
  margin-bottom: 32px;
}

.product-description p {
  color: #4b5563;
  line-height: 1.6;
  font-size: 16px;
}

/* Variants */
.variants-section {
  margin-bottom: 32px;
}

.variant-group {
  margin-bottom: 24px;
}

.variant-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.size-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.size-pill {
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 24px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.size-pill:hover {
  border-color: #ec4899;
  transform: translateY(-2px);
}

.size-pill.selected {
  border-color: #ec4899;
  background: #fdf2f8;
  color: #ec4899;
}

.size-value {
  font-weight: 600;
  font-size: 14px;
}

.size-price {
  font-size: 12px;
  color: #6b7280;
}

.color-options {
  display: flex;
  gap: 12px;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.selected {
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
}

.color-check {
  color: #1f2937;
  font-size: 12px;
}

/* Features */
.key-features {
  margin-bottom: 32px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4b5563;
  font-size: 14px;
}

.feature-item i {
  color: #22c55e;
  font-size: 12px;
}

/* Cart Section */
.cart-section {
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.cart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.quantity-section h4 {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  border-color: #ec4899;
  color: #ec4899;
}

.quantity-display {
  font-weight: 600;
  font-size: 16px;
  min-width: 30px;
  text-align: center;
}

.remove-btn {
  background: #fef2f2;
  color: #dc2626;
  border: 2px solid #fecaca;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.remove-btn:hover {
  background: #dc2626;
  color: white;
}

.add-to-cart-section {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
}

.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quantity-selector label {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
}

.add-to-cart-btn {
  flex: 1;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 52px;
}

.add-to-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
}

.add-to-cart-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.add-to-cart-btn.loading {
  background: #9ca3af;
}

/* Delivery Info */
.delivery-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.delivery-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4b5563;
  font-size: 14px;
}

.delivery-item i {
  color: #22c55e;
  width: 16px;
}

/* Product Details Tabs */
.product-details {
  padding: 80px 0;
  background: white;
}

.details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.tabs-navigation {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
  border-bottom: 2px solid #f3f4f6;
}

.tab-btn {
  padding: 16px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  color: #ec4899;
}

.tab-btn.active {
  color: #ec4899;
  border-bottom-color: #ec4899;
}

.tab-content {
  min-height: 400px;
}

/* How to Use */
.how-to-use h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 32px;
  text-align: center;
}

.usage-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.usage-step {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
  border-left: 4px solid #ec4899;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.step-content p {
  color: #6b7280;
  line-height: 1.5;
}

/* Ingredients */
.ingredients h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 32px;
  text-align: center;
}

.ingredients-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.ingredient-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #22c55e;
}

.ingredient-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.ingredient-benefit {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

/* Reviews Section */
.reviews-section {
  max-width: 800px;
  margin: 0 auto;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.reviews-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.write-review-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.write-review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

.rating-summary {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
}

.overall-rating {
  text-align: center;
}

.rating-score {
  font-size: 48px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.rating-stars .stars {
  justify-content: center;
  margin-bottom: 8px;
}

.rating-count {
  color: #6b7280;
  font-size: 14px;
}

.rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-label {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
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
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  transition: width 0.3s ease;
}

.rating-percent {
  font-size: 12px;
  color: #6b7280;
  min-width: 35px;
  text-align: right;
}

.review-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #ec4899;
  color: #ec4899;
}

.filter-btn.active {
  border-color: #ec4899;
  background: #ec4899;
  color: white;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f3f4f6;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.reviewer-name {
  font-weight: 600;
  color: #1f2937;
}

.review-date {
  font-size: 12px;
  color: #9ca3af;
}

.review-content {
  margin-bottom: 16px;
}

.review-content p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 8px;
}

.review-content p.truncated {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-btn {
  background: none;
  border: none;
  color: #ec4899;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.review-images {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.review-image:hover {
  transform: scale(1.05);
}

.review-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-actions {
  display: flex;
  gap: 16px;
}

.review-action-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;
}

.review-action-btn:hover {
  color: #ec4899;
}

/* Related Products */
.related-products {
  padding: 80px 0;
  background: #f8fafc;
}

.related-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 40px;
}

.products-carousel {
  position: relative;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -20px;
  right: -20px;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
}

.carousel-control {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.carousel-control:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.products-scroll {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 20px 0;
  scroll-behavior: smooth;
}

.products-scroll::-webkit-scrollbar {
  display: none;
}

.related-product-card {
  flex-shrink: 0;
  width: 280px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.related-product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.related-product-card .product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.related-product-card .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-product-card:hover .product-image img {
  transform: scale(1.1);
}

.related-product-card .product-info {
  padding: 20px;
}

.related-product-card .product-brand {
  font-size: 12px;
  color: #8b5cf6;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.related-product-card .product-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.4;
}

.related-product-card .product-price {
  font-size: 16px;
  font-weight: 700;
  color: #ec4899;
  margin-bottom: 12px;
}

.view-product-btn {
  width: 100%;
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-product-btn:hover {
  transform: translateY(-2px);
}

/* Review Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.review-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  padding: 24px;
}

.rating-input {
  margin-bottom: 20px;
}

.rating-input label {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.star-input {
  display: flex;
  gap: 4px;
}

.star-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.2s ease;
}

.star-btn:hover,
.star-btn.active {
  color: #fbbf24;
}

.text-input {
  margin-bottom: 20px;
}

.text-input label {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.text-input textarea {
  width: 100%;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-family: inherit;
  resize: vertical;
}

.text-input textarea:focus {
  outline: none;
  border-color: #ec4899;
}

.image-upload {
  margin-bottom: 20px;
}

.image-upload label {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.upload-btn {
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  color: #6b7280;
}

.upload-btn:hover {
  border-color: #ec4899;
  color: #ec4899;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.cancel-btn {
  flex: 1;
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
}

.submit-btn {
  flex: 2;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1100;
  border-left: 4px solid #22c55e;
}

.toast-notification.error {
  border-left-color: #dc2626;
}

.toast-notification i {
  color: #22c55e;
}

.toast-notification.error i {
  color: #dc2626;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .image-section {
    position: static;
  }
  
  .main-image-wrapper {
    height: 400px;
  }
  
  .product-title {
    font-size: 28px;
  }
  
  .usage-steps {
    grid-template-columns: 1fr;
  }
  
  .rating-summary {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .product-hero {
    padding: 20px 0 40px;
  }
  
  .hero-container {
    padding: 0 16px;
  }
  
  .thumbnails-scroll {
    justify-content: center;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .current-price {
    font-size: 24px;
  }
  
  .size-options {
    justify-content: center;
  }
  
  .add-to-cart-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .tabs-navigation {
    flex-direction: column;
    align-items: center;
  }
  
  .review-filters {
    justify-content: center;
  }
  
  .carousel-controls {
    display: none;
  }
  
  .related-product-card {
    width: 240px;
  }
  
  .modal-overlay {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .share-overlay {
    flex-direction: row;
    top: 10px;
    right: 10px;
  }
  
  .share-btn {
    width: 32px;
    height: 32px;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
  }
  
  .prev-btn { left: 10px; }
  .next-btn { right: 10px; }
  
  .product-info {
    padding: 16px 0;
  }
  
  .cart-section {
    padding: 16px;
  }
  
  .cart-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .add-to-cart-section {
    align-items: stretch;
  }
  
  .details-container {
    padding: 0 16px;
  }
  
  .related-container {
    padding: 0 16px;
  }
  
  .related-product-card {
    width: 200px;
  }
}
</style>
