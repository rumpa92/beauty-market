<template>
  <div class="product-detail-wrapper">
    <!-- Back Navigation - Always show -->
    <div class="back-navigation">
      <button @click="goToHome" class="back-btn">
        <i class="fas fa-arrow-left"></i>
        <span>Back</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading product details...</p>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="product-detail-page">

    <!-- Main Product Section -->
    <div class="main-product-container">
      <div class="product-content">
        <!-- Product Image -->
        <div class="product-image-section">
          <div class="image-container" :class="{ changing: imageChanging }">
            <img :src="currentProductImage" :alt="product.name" :key="selectedColor" class="main-product-image" />
            <div class="image-controls">
              <button class="control-btn prev" @click="previousImage">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="control-btn next" @click="nextImage">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            <div class="image-counter">
              {{ currentImageIndex + 1 }}/{{ productImages.length }}
            </div>
          </div>

          <!-- Thumbnail Gallery -->
          <div class="thumbnail-gallery">
            <div
              v-for="(image, index) in productImages"
              :key="index"
              class="thumbnail-item"
              :class="{ active: currentImageIndex === index }"
              @click="selectImage(index)"
            >
              <img :src="image" :alt="`${product.name} view ${index + 1}`" />
            </div>
          </div>
        </div>

        <!-- Product Information -->
        <div class="product-info-section">
          <h1 class="product-name">{{ product.name }}</h1>
          
          <!-- Rating -->
          <div class="rating-section">
            <div class="stars">
              <i v-for="i in 5" :key="i" 
                 :class="['fas fa-star', { filled: i <= Math.floor(product.rating) }]"></i>
            </div>
            <span class="review-count">({{ product.reviewCount }} Reviews)</span>
          </div>

          <!-- Price -->
          <div class="price-section">
            <span class="current-price">${{ formatPrice(currentPrice) }}</span>
            <span v-if="originalPrice && originalPrice > currentPrice" class="original-price">
              ${{ formatPrice(originalPrice) }}
            </span>
          </div>

          <!-- Color Selection -->
          <div class="selection-group">
            <label class="selection-label">Color: <span class="selected-value">{{ selectedColorName }}</span></label>
            <div class="color-options">
              <button
                v-for="color in product.colors"
                :key="color.id"
                @click="selectColor(color)"
                :class="['color-option', { active: selectedColor === color.id }]"
                :style="{ backgroundColor: color.hex }"
                :title="color.name"
              />
            </div>
          </div>

          <!-- Size Selection -->
          <div class="selection-group">
            <label class="selection-label">Size:</label>
            <div class="size-options">
              <button
                v-for="size in product.sizes"
                :key="size.id"
                @click="selectSize(size)"
                :class="['size-option', { active: selectedSize === size.id }]"
              >
                <span class="size-value">{{ size.value }}</span>
                <span v-if="size.price" class="size-price">${{ formatPrice(size.price) }}</span>
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div class="quantity-section">
            <label class="quantity-label">Quantity</label>
            <div class="quantity-controls">
              <button @click="decreaseQuantity" class="quantity-btn">-</button>
              <span class="quantity-value">{{ quantity }}</span>
              <button @click="increaseQuantity" class="quantity-btn">+</button>
              <button @click="removeItem" class="remove-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="addToCart" class="add-to-cart-btn">Add to Cart</button>
            <button @click="openRatingModal" class="rating-review-btn">Rating & Review</button>
          </div>

          <!-- Delivery Info -->
          <div class="delivery-info">
            <div class="delivery-item">
              <div class="delivery-icon">
                <i class="fas fa-truck"></i>
              </div>
              <div class="delivery-text">
                <div class="delivery-title">Free Standard Delivery</div>
                <div class="delivery-subtitle">Estimated delivery: 3-5 business days</div>
              </div>
            </div>
            <div class="delivery-item">
              <div class="delivery-icon">
                <i class="fas fa-undo"></i>
              </div>
              <div class="delivery-text">
                <div class="delivery-title">Free Returns</div>
                <div class="delivery-subtitle">30-day return policy for unworn items</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product details section -->
    <section class="product-details-section">
      <div class="details-container">
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <button
            @click="activeTab = 'details'"
            :class="['tab-btn', { active: activeTab === 'details' }]"
          >
            Description
          </button>
          <button
            @click="activeTab = 'care'"
            :class="['tab-btn', { active: activeTab === 'care' }]"
          >
            Additional Information
          </button>
          <button
            @click="activeTab = 'review'"
            :class="['tab-btn', { active: activeTab === 'review' }]"
          >
            Review
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <div v-if="activeTab === 'details'" class="tab-panel">
            <p class="product-description">Experience bold, long-lasting color with our Matte Lipstick Collection designed for all-day wear without drying your lips. Each shade glides on smoothly, delivering rich pigmentation and a soft, velvety finish. From everyday nudes to statement reds, this collection has the perfect color for every mood and occasion. Lightweight, transfer-resistant, and infused with nourishing ingredients to keep your lips comfortable and beautiful all day.</p>
          </div>
          <div v-if="activeTab === 'care'" class="tab-panel">
            <ul class="care-instructions">
              <li v-for="instruction in product.careInstructions" :key="instruction">{{ instruction }}</li>
            </ul>
          </div>
          <div v-if="activeTab === 'review'" class="tab-panel">
            <p class="product-description">Customer reviews will be displayed here.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Matte Lipstick Collection Colors -->
    <section class="related-products-section">
      <div class="related-container">
        <h2 class="section-title">Explore Related Products</h2>
        <div class="products-grid">
          <div
            v-for="product in lipstickColorVariants"
            :key="product.id"
            class="product-card"
            @click="viewProduct(product)"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <button class="wishlist-btn" :class="{ active: product.isWishlisted }">
                <i class="fas fa-heart"></i>
              </button>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-price">${{ formatPrice(product.price) }}</div>
              <button
                @click.stop="addRelatedToCart(product)"
                class="add-to-cart-btn"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!loading" class="product-not-found">
      <div class="market-container">
        <div class="not-found-content">
          <i class="fas fa-search not-found-icon"></i>
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <router-link to="/" class="back-home-btn">
            <i class="fas fa-arrow-left"></i>
            Back to Home
          </router-link>
        </div>
      </div>
    </div>

    <!-- Rating & Review Modal -->
    <RatingReviewModal
      :is-visible="showRatingModal"
      :product="modalProductData"
      @close="closeRatingModal"
      @review-submitted="handleReviewSubmitted"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import RatingReviewModal from '@/components/product/RatingReviewModal.vue';

export default {
  name: 'ProductDetail',
  components: {
    RatingReviewModal
  },
  data() {
    return {
      loading: true,
      product: null,
      activeTab: 'details',
      selectedColor: 'ruby-red',
      selectedSize: 'standard',
      quantity: 1,
      imageChanging: false,
      currentImageIndex: 0,
      showRatingModal: false,
      
      // Sample matte lipstick collection data
      sampleProduct: {
        id: 3,
        name: 'Matte Lipstick Collection',
        brand: 'Beauty Pro',
        price: 24.99,
        originalPrice: 34.99,
        category: 'makeup',
        rating: 4.7,
        reviewCount: 324,
        description: 'Experience bold, long-lasting color with our Matte Lipstick Collection designed for all-day wear without drying your lips. Each shade glides on smoothly, delivering rich pigmentation and a soft, velvety finish.',
        images: {
          'ruby-red': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
          'berry-bliss': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',
          'nude-rose': 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=600&fit=crop',
          'coral-dream': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
          'midnight-blue': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
        },
        colors: [
          { id: 'ruby-red', name: 'Ruby Red', hex: '#DC143C' },
          { id: 'berry-bliss', name: 'Berry Bliss', hex: '#8B008B' },
          { id: 'nude-rose', name: 'Nude Rose', hex: '#E6B3B3' },
          { id: 'coral-dream', name: 'Coral Dream', hex: '#FF7F50' },
          { id: 'midnight-blue', name: 'Midnight Blue', hex: '#191970' }
        ],
        sizes: [
          { id: 'mini', value: '1.5ml', price: 12.99 },
          { id: 'standard', value: '3.5ml', price: 24.99 },
          { id: 'jumbo', value: '5ml', price: 34.99 }
        ],
        features: [
          'Long-lasting matte finish',
          'Transfer-resistant formula',
          'Enriched with Vitamin E',
          'Cruelty-free & vegan',
          'Dermatologically tested'
        ],
        careInstructions: [
          'Store in a cool, dry place',
          'Keep cap tightly closed',
          'Remove with makeup remover',
          'For external use only'
        ]
      },

      ratingBreakdown: [
        { stars: 5, percentage: 60 },
        { stars: 4, percentage: 20 },
        { stars: 3, percentage: 10 },
        { stars: 2, percentage: 7 },
        { stars: 1, percentage: 3 }
      ],

    };
  },
  
  computed: {
    ...mapGetters('products', ['productById', 'allProducts']),

    productId() {
      return parseInt(this.$route.params.id);
    },

    currentPrice() {
      return this.product?.price || 0;
    },

    originalPrice() {
      return this.product?.originalPrice;
    },

    selectedColorName() {
      const color = this.product?.colors?.find(c => c.id === this.selectedColor);
      return color ? color.name : 'Ruby Red';
    },

    productImages() {
      // Create multiple views of the selected color lipstick
      if (this.product?.images && typeof this.product.images === 'object') {
        const selectedImage = this.product.images[this.selectedColor];
        if (selectedImage) {
          // Generate different angles/views for the same product color
          return [
            selectedImage, // Main view
            selectedImage, // Same view from different angle
            selectedImage, // Close-up view
            selectedImage, // Another angle
            selectedImage  // Top view
          ];
        }
      }
      // Fallback to default images - different lipstick product images
      return [
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
      ];
    },

    currentProductImage() {
      return this.productImages[this.currentImageIndex] || this.productImages[0];
    },

    lipstickColorVariants() {
      // Return products related to Matte Lipstick Collection with reliable matching images
      return [
        {
          id: 'matte-lipstick-1',
          name: 'Matte Liquid Lipstick',
          price: 22.99,
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
          isWishlisted: false
        },
        {
          id: 'matte-lipstick-2',
          name: 'Matte Lip Liner Set',
          price: 19.99,
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',
          isWishlisted: false
        },
        {
          id: 'matte-lipstick-3',
          name: 'Matte Lip Balm',
          price: 15.99,
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=600&fit=crop',
          isWishlisted: false
        },
        {
          id: 'matte-lipstick-4',
          name: 'Matte Lip Primer',
          price: 16.99,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
          isWishlisted: false
        }
      ];
    },

    // Get beauty & personal care products for "You May Also Like"
    relatedProducts() {
      if (!this.product) return [];

      // Filter beauty and personal care products (excluding current product)
      const beautyCategories = ['skincare', 'makeup', 'haircare', 'fragrance', 'tools'];
      return this.allProducts
        .filter(p =>
          p.id !== this.product.id &&
          beautyCategories.includes(p.category)
        )
        .slice(0, 5)
        .map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          isWishlisted: false // You can connect this to wishlist state later
        }));
    },

    modalProductData() {
      if (!this.product) return {};

      return {
        id: this.product.id,
        name: this.product.name,
        image: this.currentProductImage,
        price: this.product.price
      };
    },

    productReviews() {
      return [
        {
          id: 1,
          userName: 'Jane Cooper',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=50&h=50&fit=crop&crop=face',
          rating: 5,
          title: 'Very Good',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
          id: 2,
          userName: 'Jane Cooper',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
          rating: 4,
          title: 'Very Good',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
        },
        {
          id: 3,
          userName: 'Jane Cooper',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          rating: 5,
          title: 'Very Good',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        }
      ];
    }
  },
  
  methods: {
    ...mapActions('cart', ['addToCart']),

    goToHome() {
      this.$router.push('/');
    },

    async loadProduct() {
      this.loading = true;
      try {
        // Get product from store by ID
        let product = this.productById(this.productId);

        if (product) {
          // Enhance the store product with additional data needed for the UI
          this.product = this.enhanceProductData(product);
        } else {
          // Fallback to sample product if ID not found
          this.product = this.sampleProduct;
        }
      } catch (error) {
        console.error('Error loading product:', error);
        this.product = null;
      } finally {
        this.loading = false;
      }
    },

    // Image gallery navigation methods
    selectImage(index) {
      this.currentImageIndex = index;
    },

    nextImage() {
      if (this.currentImageIndex < this.productImages.length - 1) {
        this.currentImageIndex++;
      } else {
        this.currentImageIndex = 0; // Loop back to first image
      }
    },

    previousImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      } else {
        this.currentImageIndex = this.productImages.length - 1; // Loop to last image
      }
    },

    selectColor(color) {
      console.log('Selecting color:', color.name, 'ID:', color.id);

      // Trigger image changing animation
      this.imageChanging = true;
      setTimeout(() => {
        this.imageChanging = false;
      }, 500);

      this.selectedColor = color.id;

      // Reset image index to first image when changing colors
      this.currentImageIndex = 0;

      // Log the current image that should be displayed
      console.log('New image URL:', this.product?.images?.[color.id]);

      // Update price if sizes have different prices
      if (this.product?.sizes) {
        const selectedSize = this.product.sizes.find(s => s.id === this.selectedSize);
        if (selectedSize && selectedSize.price) {
          this.product.price = selectedSize.price;
        }
      }

      // Show notification for color selection
      if (this.$store) {
        this.$store.dispatch('ui/showNotification', {
          type: 'info',
          message: `Selected ${color.name} shade`
        });
      }
    },
    
    selectSize(size) {
      this.selectedSize = size.id;
      // Update price based on selected size
      if (size.price) {
        this.product.price = size.price;
      }
    },
    
    increaseQuantity() {
      this.quantity++;
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    
    removeItem() {
      // Remove item from cart or reset quantity
      if (this.quantity > 1) {
        this.quantity = 1;
      } else {
        // If in cart, remove completely
        this.$store.dispatch('ui/showNotification', {
          type: 'info',
          message: 'Item removed from selection'
        });
        this.quantity = 1;
      }
    },
    
    async addToCart() {
      try {
        const cartItem = {
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          image: this.currentProductImage,
          color: this.selectedColorName,
          size: this.product.sizes.find(s => s.id === this.selectedSize)?.value,
          quantity: this.quantity,
          selectedColor: this.selectedColor,
          selectedSize: this.selectedSize
        };

        await this.$store.dispatch('cart/addToCart', cartItem);

        this.$store.dispatch('ui/showNotification', {
          type: 'success',
          message: `${this.product.name} (${this.selectedColorName}) added to cart!`
        });

        // Redirect to cart page after successful add to cart
        setTimeout(() => {
          this.$router.push('/cart');
        }, 1000); // Small delay to show the success notification
      } catch (error) {
        this.$store.dispatch('ui/showNotification', {
          type: 'error',
          message: 'Failed to add item to cart'
        });
      }
    },
    
    openRatingModal() {
      this.showRatingModal = true;
      console.log('Opening rating modal for product:', this.product.name);
    },

    closeRatingModal() {
      this.showRatingModal = false;
    },

    handleReviewSubmitted(review) {
      console.log('Review submitted:', review);

      // Show success notification
      this.$store.dispatch('ui/showNotification', {
        type: 'success',
        message: 'Thank you for your review! It will be visible after verification.'
      });

      // Close modal
      this.showRatingModal = false;
    },
    
    showAllReviews() {
      console.log('Showing all reviews');
    },
    
    addRelatedToCart(product) {
      console.log('Adding related product to cart:', product);
      // Navigate to the clicked product
      this.$router.push(`/product/${product.id}`);
    },

    viewProduct(product) {
      console.log('Viewing product:', product);
      // Navigate to the clicked product
      this.$router.push(`/product/${product.id}`);
    },

    selectColorVariant(colorVariant) {
      // Update the selected color to match the clicked variant
      this.selectedColor = colorVariant.colorId;

      // Update price if sizes have different prices
      if (this.product?.sizes) {
        const selectedSize = this.product.sizes.find(s => s.id === this.selectedSize);
        if (selectedSize && selectedSize.price) {
          this.product.price = selectedSize.price;
        }
      }

      // Show notification
      this.$store.dispatch('ui/showNotification', {
        type: 'info',
        message: `Selected ${colorVariant.colorName} shade`
      });
    },

    async addColorVariantToCart(colorVariant) {
      // If this is the currently selected color, use the existing addToCart method
      if (colorVariant.colorId === this.selectedColor) {
        await this.addToCart();
        return;
      }

      // Otherwise, add the specific color variant to cart
      try {
        const cartItem = {
          id: colorVariant.id,
          name: colorVariant.name,
          price: colorVariant.price,
          image: colorVariant.image,
          color: colorVariant.colorName,
          size: this.product.sizes.find(s => s.id === this.selectedSize)?.value || 'Standard',
          quantity: 1,
          selectedColor: colorVariant.colorId,
          selectedSize: this.selectedSize
        };

        await this.$store.dispatch('cart/addToCart', cartItem);

        this.$store.dispatch('ui/showNotification', {
          type: 'success',
          message: `${colorVariant.name} (${colorVariant.colorName}) added to cart!`
        });

        // Redirect to cart page after successful add to cart
        setTimeout(() => {
          this.$router.push('/cart');
        }, 1000); // Small delay to show the success notification
      } catch (error) {
        this.$store.dispatch('ui/showNotification', {
          type: 'error',
          message: 'Failed to add item to cart'
        });
      }
    },

    enhanceProductData(storeProduct) {
      // Convert store product data to the format expected by the UI
      return {
        ...storeProduct,
        images: storeProduct.images || {
          'ruby-red': storeProduct.image || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop',
          'berry-bliss': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',
          'nude-rose': 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=600&h=600&fit=crop',
          'coral-dream': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
          'midnight-blue': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
        },
        colors: storeProduct.colors ? storeProduct.colors.map((color, index) => ({
          id: color.toLowerCase().replace(/\s+/g, '-'),
          name: color,
          hex: this.getColorHex(color)
        })) : [
          { id: 'ruby-red', name: 'Ruby Red', hex: '#DC143C' },
          { id: 'berry-bliss', name: 'Berry Bliss', hex: '#8B008B' },
          { id: 'nude-rose', name: 'Nude Rose', hex: '#E6B3B3' },
          { id: 'coral-dream', name: 'Coral Dream', hex: '#FF7F50' },
          { id: 'midnight-blue', name: 'Midnight Blue', hex: '#191970' }
        ],
        sizes: storeProduct.sizes || [
          { id: 'mini', value: '1.5ml', price: 12.99 },
          { id: 'standard', value: '3.5ml', price: 24.99 },
          { id: 'jumbo', value: '5ml', price: 34.99 }
        ],
        features: storeProduct.ingredients || storeProduct.benefits || [
          'Premium quality materials',
          'Dermatologically tested',
          'Suitable for all skin types'
        ],
        careInstructions: [
          'Store in a cool, dry place',
          'Keep away from direct sunlight',
          'For external use only',
          'Discontinue use if irritation occurs'
        ]
      };
    },

    getColorHex(colorName) {
      const colorMap = {
        'Ruby Red': '#DC143C',
        'Berry Bliss': '#8B008B',
        'Nude Rose': '#E6B3B3',
        'Coral Dream': '#FF7F50',
        'Midnight Blue': '#191970',
        'Red': '#DC2626',
        'Blue': '#2563EB',
        'Green': '#059669',
        'Purple': '#7C3AED',
        'Orange': '#EA580C',
        'Champagne': '#F7E7CE',
        'Rose Gold': '#E8B4A0',
        'Bronze': '#CD7F32',
        'Pearl': '#F8F6F0'
      };
      return colorMap[colorName] || '#DC143C';
    },

    formatPrice(price) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    }
  },
  
  async created() {
    await this.loadProduct();
  },

  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: false
    }
  }
};
</script>

<style scoped>
.product-detail-wrapper {
  min-height: 100vh;
  background: #f8f9fa;
  position: relative;
  z-index: 1;
}

.loading-container,
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 40px 20px;
}

.loading-spinner,
.error-content {
  text-align: center;
  color: #6b7280;
}

.loading-spinner i {
  font-size: 48px;
  color: #ec4899;
  margin-bottom: 16px;
}

.loading-spinner p {
  font-size: 18px;
  font-weight: 500;
}

.error-content i {
  font-size: 64px;
  color: #ef4444;
  margin-bottom: 24px;
}

.error-content h3 {
  font-size: 24px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 12px;
}

.error-content p {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
}

.product-detail-page {
  background: #f8f9fa;
  min-height: 100vh;
}

/* Back Navigation */
.back-navigation {
  background: #ffffff;
  padding: 20px 24px;
  border-bottom: 2px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  top: 0;
  z-index: 100;
  min-height: 80px;
  display: flex;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ec4899;
  border: 2px solid #ec4899;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 10px;
  transition: all 0.2s ease;
  min-height: 48px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.back-btn:hover {
  background: #db2777;
  color: white;
  border-color: #db2777;
  transform: translateX(-3px);
  box-shadow: 0 6px 16px rgba(219, 39, 119, 0.4);
}

.back-btn i {
  font-size: 16px;
  transition: transform 0.2s ease;
}

.back-btn:hover i {
  transform: translateX(-2px);
}

/* Main Product Section */
.main-product-container {
  background: white;
  margin-top: 0;
  padding: 40px 0 50px;
  min-height: 80vh;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
}

.product-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

@media (max-width: 768px) {
  .back-navigation {
    padding: 16px 20px;
  }

  .back-btn {
    font-size: 15px;
    padding: 10px 14px;
    gap: 8px;
  }

  .product-content {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 0 16px;
  }

  .main-product-container {
    padding: 24px 0 32px;
  }
}

.product-image-section {
  position: relative;
}

.image-container {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.main-product-image {
  width: 100%;
  height: 600px;
  object-fit: cover;
  display: block;
  transition: all 0.4s ease-in-out;
  border-radius: 8px;
}

.main-product-image:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Add a subtle loading animation when image changes */
.image-container {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
  z-index: 2;
  pointer-events: none;
}

.image-container.changing::before {
  left: 100%;
}

.image-counter {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 10;
}

/* Thumbnail Gallery */
.thumbnail-gallery {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding: 0 4px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.thumbnail-gallery::-webkit-scrollbar {
  display: none;
}

.thumbnail-item {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail-item:hover {
  border-color: rgba(102, 51, 153, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.thumbnail-item.active {
  border-color: #663399;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 51, 153, 0.3);
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.thumbnail-item:hover img {
  transform: scale(1.1);
}

.image-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: none;
}

.control-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: all;
  color: #333;
  font-size: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background: white;
  transform: scale(1.1);
}

/* Product Information */
.product-info-section {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.product-name {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  color: #ddd;
  font-size: 18px;
}

.stars i.filled {
  color: #ffc107;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.price-section {
  margin-bottom: 24px;
}

.current-price {
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.original-price {
  font-size: 20px;
  color: #999;
  text-decoration: line-through;
  margin-left: 12px;
}

/* Selection Groups */
.selection-group {
  margin-bottom: 24px;
}

.selection-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.selected-value {
  font-weight: 700;
}

.color-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-option {
  width: 120px;
  height: 50px;
  border-radius: 25px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.color-option:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-option.active {
  border-color: #333;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.color-option::after {
  content: '';
  position: absolute;
  inset: -6px;
  border: 2px solid transparent;
  border-radius: 31px;
  transition: border-color 0.3s ease;
}

.color-option.active::after {
  border-color: #333;
}


.size-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.size-option {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.size-option:hover {
  border-color: #663399;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 51, 153, 0.2);
}

.size-option.active {
  background: #663399;
  color: white;
  border-color: #663399;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 51, 153, 0.3);
}

.size-value {
  font-size: 14px;
  font-weight: 700;
}

.size-price {
  font-size: 12px;
  opacity: 0.8;
}

/* Quantity Section */
.quantity-section {
  margin-bottom: 32px;
}

.quantity-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-btn {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover {
  border-color: #663399;
  color: #663399;
}

.quantity-value {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}

.remove-btn {
  background: #ff4757;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #ff3742;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.add-to-cart-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.add-to-cart-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.rating-review-btn {
  background: #663399;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.rating-review-btn:hover {
  background: #552288;
  transform: translateY(-2px);
}

/* Delivery Info */
.delivery-info {
  border-top: 1px solid #eee;
  padding-top: 24px;
}

.delivery-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.delivery-icon {
  width: 50px;
  height: 50px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #663399;
  font-size: 20px;
}

.delivery-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.delivery-subtitle {
  color: #666;
  font-size: 14px;
}

/* Product Details Section */
.product-details-section {
  background: white;
  padding: 60px 0;
  border-top: 1px solid #eee;
  margin-bottom: -4px;
}

.details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
}

.tab-navigation {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  background: none;
  border: none;
  padding: 16px 32px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn.active {
  color: #333;
  border-bottom-color: #663399;
  background: #f8f9fa;
}

.tab-btn:hover {
  color: #333;
}

.tab-content {
  min-height: 0px;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

.product-description {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 24px;
}

.product-features,
.care-instructions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-features li,
.care-instructions li {
  padding: 8px 0;
  color: #666;
  position: relative;
  padding-left: 20px;
}

.product-features li::before,
.care-instructions li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #663399;
  font-weight: bold;
}

/* Related Products */
.related-products-section {
  background: white;
  padding: 60px 0;
  margin-top: -5px;
}

.related-container {
  max-width: 1200px;
  margin: 5px auto 0;
  padding: 0 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* Lipstick Variant Specific Styles */
.lipstick-variant {
  border: 3px solid transparent;
}

.lipstick-variant:hover {
  border-color: rgba(102, 51, 153, 0.3);
}

.lipstick-variant.selected-variant {
  border-color: #663399;
  box-shadow: 0 8px 30px rgba(102, 51, 153, 0.25);
  transform: translateY(-4px);
}

.lipstick-variant.selected-variant::after {
  content: '✓ Selected';
  position: absolute;
  top: 10px;
  left: 10px;
  background: #663399;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  z-index: 10;
}

.product-image {
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.color-indicator {
  position: absolute;
  bottom: 12px;
  left: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.wishlist-btn:hover {
  background: white;
  color: #dc3545;
}

.wishlist-btn.active {
  color: #dc3545;
  background: white;
}

.product-info {
  padding: 20px;
}

.product-card .product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.color-name {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
  font-style: italic;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.product-card .add-to-cart-btn {
  width: 100%;
  background: #f8f9fa;
  color: #333;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card .add-to-cart-btn:hover {
  background: #663399;
  color: white;
  border-color: #663399;
}

.product-card .add-to-cart-btn.selected-color {
  background: #663399;
  color: white;
  border-color: #663399;
}

.product-card .add-to-cart-btn.selected-color:hover {
  background: #552288;
  border-color: #552288;
}

/* Product Not Found */
.product-not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  text-align: center;
  max-width: 400px;
}

.not-found-icon {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 24px;
}

.not-found-content h2 {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.not-found-content p {
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.back-home-btn {
  background: #663399;
  color: white;
  text-decoration: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  background: #552288;
  transform: translateY(-2px);
  text-decoration: none;
  color: white;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .main-product-image {
    height: 400px;
  }
  
  .product-name {
    font-size: 28px;
  }
  
  .current-price {
    font-size: 24px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .reviews-header {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .rating-score {
    font-size: 48px;
  }
}

@media (max-width: 480px) {
  .purple-header,
  .main-product-container,
  .product-details-section,
  .reviews-section,
  .related-products-section {
    padding: 20px 0;
  }
  
  .header-container,
  .product-content,
  .details-container,
  .reviews-container,
  .related-container {
    padding: 0 16px;
  }
  
  .products-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
