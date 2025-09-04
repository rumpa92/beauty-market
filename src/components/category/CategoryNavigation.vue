<template>
  <div class="category-navigation">
    <!-- Main Categories Grid -->
    <div class="categories-grid">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-tile"
        :class="{ active: selectedCategory === category.id }"
        @click="selectCategory(category)"
      >
        <div class="category-icon">
          <i :class="category.icon"></i>
        </div>
        <h3 class="category-name">{{ category.name }}</h3>
        <span class="product-count">{{ category.productCount }} products</span>
        <div class="category-hover-overlay">
          <span class="explore-text">Explore {{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- Subcategory Tabs -->
    <div v-if="selectedCategory && selectedCategoryData" class="subcategory-section">
      <div class="subcategory-header">
        <h2>{{ selectedCategoryData.name }}</h2>
        <p>{{ selectedCategoryData.description }}</p>
      </div>
      
      <div class="subcategory-tabs">
        <button 
          v-for="subcategory in selectedCategoryData.subcategories" 
          :key="subcategory.id"
          class="subcategory-tab"
          :class="{ active: selectedSubcategory === subcategory.id }"
          @click="selectSubcategory(subcategory.id)"
        >
          <i :class="subcategory.icon"></i>
          <span>{{ subcategory.name }}</span>
          <span class="subcategory-count">({{ subcategory.productCount }})</span>
        </button>
      </div>

      <!-- Featured Subcategory Highlights -->
      <div class="subcategory-highlights">
        <div 
          v-for="highlight in subcategoryHighlights" 
          :key="highlight.id"
          class="highlight-card"
        >
          <div class="highlight-image">
            <img :src="highlight.image" :alt="highlight.name">
          </div>
          <div class="highlight-content">
            <h4>{{ highlight.name }}</h4>
            <p>{{ highlight.description }}</p>
            <div class="highlight-tags">
              <span 
                v-for="tag in highlight.tags" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
            <button class="shop-now-btn" @click="shopSubcategory(highlight.subcategoryId)">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <div class="action-card bestsellers">
        <i class="fas fa-star"></i>
        <span>Bestsellers</span>
      </div>
      <div class="action-card new-arrivals">
        <i class="fas fa-sparkles"></i>
        <span>New Arrivals</span>
      </div>
      <div class="action-card on-sale">
        <i class="fas fa-tags"></i>
        <span>On Sale</span>
      </div>
      <div class="action-card bundles">
        <i class="fas fa-gift"></i>
        <span>Gift Sets</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'CategoryNavigation',
  data() {
    return {
      selectedCategory: null,
      selectedSubcategory: null,
      categories: [
        {
          id: 'skincare',
          name: 'Skincare',
          icon: 'fas fa-leaf',
          productCount: 1247,
          description: 'Professional skincare solutions for every skin type and concern',
          subcategories: [
            { id: 'cleansers', name: 'Cleansers', icon: 'fas fa-soap', productCount: 156 },
            { id: 'serums', name: 'Serums', icon: 'fas fa-tint', productCount: 89 },
            { id: 'moisturizers', name: 'Moisturizers', icon: 'fas fa-cloud', productCount: 134 },
            { id: 'sunscreen', name: 'SPF Protection', icon: 'fas fa-sun', productCount: 67 },
            { id: 'treatments', name: 'Treatments', icon: 'fas fa-magic', productCount: 78 },
            { id: 'masks', name: 'Face Masks', icon: 'fas fa-mask', productCount: 45 }
          ]
        },
        {
          id: 'makeup',
          name: 'Makeup',
          icon: 'fas fa-palette',
          productCount: 892,
          description: 'Premium makeup for flawless looks and self-expression',
          subcategories: [
            { id: 'foundation', name: 'Foundation', icon: 'fas fa-circle', productCount: 78 },
            { id: 'lips', name: 'Lips', icon: 'fas fa-kiss', productCount: 124 },
            { id: 'eyes', name: 'Eyes', icon: 'fas fa-eye', productCount: 156 },
            { id: 'cheeks', name: 'Cheeks', icon: 'fas fa-heart', productCount: 67 },
            { id: 'brows', name: 'Eyebrows', icon: 'fas fa-minus', productCount: 34 },
            { id: 'tools', name: 'Tools & Brushes', icon: 'fas fa-brush', productCount: 89 }
          ]
        },
        {
          id: 'haircare',
          name: 'Hair Care',
          icon: 'fas fa-cut',
          productCount: 567,
          description: 'Professional hair care for healthy, beautiful hair',
          subcategories: [
            { id: 'shampoo', name: 'Shampoo', icon: 'fas fa-pump-soap', productCount: 89 },
            { id: 'conditioner', name: 'Conditioner', icon: 'fas fa-spa', productCount: 76 },
            { id: 'styling', name: 'Styling', icon: 'fas fa-wind', productCount: 112 },
            { id: 'treatments', name: 'Treatments', icon: 'fas fa-magic', productCount: 45 },
            { id: 'tools', name: 'Hair Tools', icon: 'fas fa-hair-dryer', productCount: 67 }
          ]
        },
        {
          id: 'fragrance',
          name: 'Fragrance',
          icon: 'fas fa-spray-can',
          productCount: 234,
          description: 'Luxury fragrances for every occasion and personality',
          subcategories: [
            { id: 'perfume', name: 'Perfume', icon: 'fas fa-gem', productCount: 78 },
            { id: 'cologne', name: 'Cologne', icon: 'fas fa-male', productCount: 45 },
            { id: 'body-spray', name: 'Body Spray', icon: 'fas fa-spray-can', productCount: 56 },
            { id: 'gift-sets', name: 'Gift Sets', icon: 'fas fa-gift', productCount: 34 }
          ]
        },
        {
          id: 'mens-grooming',
          name: "Men's Grooming",
          icon: 'fas fa-male',
          productCount: 345,
          description: 'Premium grooming essentials for the modern man',
          subcategories: [
            { id: 'skincare', name: 'Skincare', icon: 'fas fa-face', productCount: 89 },
            { id: 'shaving', name: 'Shaving', icon: 'fas fa-razor', productCount: 67 },
            { id: 'hair', name: 'Hair Care', icon: 'fas fa-cut', productCount: 56 },
            { id: 'fragrance', name: 'Fragrance', icon: 'fas fa-spray-can', productCount: 78 }
          ]
        },
        {
          id: 'body-care',
          name: 'Bath & Body',
          icon: 'fas fa-bath',
          productCount: 456,
          description: 'Luxurious bath and body care for complete wellness',
          subcategories: [
            { id: 'body-wash', name: 'Body Wash', icon: 'fas fa-soap', productCount: 78 },
            { id: 'lotions', name: 'Body Lotions', icon: 'fas fa-pump-medical', productCount: 89 },
            { id: 'scrubs', name: 'Body Scrubs', icon: 'fas fa-seedling', productCount: 45 },
            { id: 'oils', name: 'Body Oils', icon: 'fas fa-tint', productCount: 67 }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters('products', ['categories']),
    selectedCategoryData() {
      return this.categories.find(cat => cat.id === this.selectedCategory);
    },
    subcategoryHighlights() {
      if (!this.selectedCategory) return [];
      
      const highlights = {
        skincare: [
          {
            id: 1,
            name: 'Vitamin C Serums',
            description: 'Brighten and protect your skin with powerful antioxidants',
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
            tags: ['Brightening', 'Anti-aging', 'Antioxidant'],
            subcategoryId: 'serums'
          },
          {
            id: 2,
            name: 'Hydrating Moisturizers',
            description: 'Deep hydration for plump, healthy-looking skin',
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300',
            tags: ['Hydrating', 'Nourishing', 'All Skin Types'],
            subcategoryId: 'moisturizers'
          }
        ],
        makeup: [
          {
            id: 3,
            name: 'Long-Wear Foundation',
            description: 'Flawless coverage that lasts all day',
            image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300',
            tags: ['Full Coverage', 'Long-wearing', 'Buildable'],
            subcategoryId: 'foundation'
          },
          {
            id: 4,
            name: 'Matte Lipsticks',
            description: 'Bold, transfer-proof color in stunning shades',
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300',
            tags: ['Transfer-proof', 'Matte', 'Bold Color'],
            subcategoryId: 'lips'
          }
        ]
      };
      
      return highlights[this.selectedCategory] || [];
    }
  },
  methods: {
    ...mapActions('products', ['filterByCategory', 'filterBySubcategory']),
    selectCategory(category) {
      this.selectedCategory = category.id;
      this.selectedSubcategory = null;
      this.filterByCategory(category.id);
    },
    selectSubcategory(subcategoryId) {
      this.selectedSubcategory = subcategoryId;
      this.filterBySubcategory(subcategoryId);
      this.$router.push(`/products/${this.selectedCategory}/${subcategoryId}`);
    },
    shopSubcategory(subcategoryId) {
      this.selectSubcategory(subcategoryId);
    }
  }
};
</script>

<style scoped>
.category-navigation {
  padding: 40px 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

.category-tile {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.category-tile:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-200);
}

.category-tile.active {
  border-color: var(--primary-500);
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
}

.category-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 32px;
  transition: transform 0.3s ease;
}

.category-tile:hover .category-icon {
  transform: scale(1.1) rotate(5deg);
}

.category-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.product-count {
  color: var(--gray-500);
  font-size: 14px;
  font-weight: 500;
}

.category-hover-overlay {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  padding: 16px;
  transition: bottom 0.3s ease;
}

.category-tile:hover .category-hover-overlay {
  bottom: 0;
}

.explore-text {
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.subcategory-section {
  background: var(--gray-50);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
}

.subcategory-header {
  text-align: center;
  margin-bottom: 32px;
}

.subcategory-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 12px;
}

.subcategory-header p {
  font-size: 18px;
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.subcategory-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
}

.subcategory-tab {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 50px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: var(--gray-700);
}

.subcategory-tab:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.subcategory-tab.active {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.subcategory-count {
  font-size: 12px;
  opacity: 0.8;
}

.subcategory-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.highlight-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-4px);
}

.highlight-image {
  height: 200px;
  overflow: hidden;
}

.highlight-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.highlight-content {
  padding: 24px;
}

.highlight-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.highlight-content p {
  color: var(--gray-600);
  margin-bottom: 16px;
  line-height: 1.5;
}

.highlight-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.shop-now-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.shop-now-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(var(--primary-500), 0.3);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.action-card i {
  font-size: 24px;
  color: var(--primary-500);
}

.action-card span {
  font-weight: 600;
  color: var(--gray-700);
}

.bestsellers:hover {
  border-color: #fbbf24;
  background: #fef3c7;
}

.new-arrivals:hover {
  border-color: #8b5cf6;
  background: #f3e8ff;
}

.on-sale:hover {
  border-color: #ef4444;
  background: #fee2e2;
}

.bundles:hover {
  border-color: #10b981;
  background: #d1fae5;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .subcategory-section {
    padding: 24px;
  }
  
  .subcategory-tabs {
    justify-content: flex-start;
  }
  
  .subcategory-highlights {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
