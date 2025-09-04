<template>
  <div class="enhanced-search-bar">
    <!-- Main Search Container -->
    <div class="search-container">
      <div class="search-wrapper" :class="{ active: isSearchFocused, 'voice-active': isVoiceActive }">
        
        <!-- Search Input -->
        <input
          v-model="searchQuery"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
          @input="handleSearchInput"
          @keydown="handleSearchKeydown"
          type="text"
          class="search-input"
          :placeholder="searchPlaceholder"
          ref="searchInput"
        >
        
        <!-- Voice Search Button -->
        <div class="voice-search-container">
          <button 
            @click="toggleVoiceSearch" 
            :class="['voice-btn', { active: isVoiceActive, listening: isListening }]"
            :title="voiceTooltip"
          >
            <i v-if="!isVoiceActive" class="fas fa-microphone"></i>
            <div v-if="isVoiceActive" class="voice-animation">
              <div class="wave-bar" v-for="n in 5" :key="n" :style="{ animationDelay: `${n * 0.1}s` }"></div>
            </div>
          </button>
          
          <!-- Voice Tooltip -->
          <div v-if="showVoiceTooltip" class="voice-tooltip">
            <div class="tooltip-content">
              <p class="tooltip-title">Try voice commands like:</p>
              <ul class="tooltip-examples">
                <li>"Show me Niacinamide Serum"</li>
                <li>"Find red lipstick under $30"</li>
                <li>"Skincare for oily skin"</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Clear Button -->
        <button 
          v-if="searchQuery && !isVoiceActive" 
          @click="clearSearch" 
          class="clear-btn"
          title="Clear search"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Voice Status -->
      <div v-if="isVoiceActive" class="voice-status">
        <div class="voice-status-content">
          <div class="status-animation">
            <div class="pulse-ring"></div>
            <div class="pulse-ring delay-1"></div>
            <div class="pulse-ring delay-2"></div>
          </div>
          <div class="status-text">
            <p v-if="isListening" class="listening-text">Listening...</p>
            <p v-else-if="isProcessing" class="processing-text">Processing...</p>
            <p v-else class="ready-text">Tap to speak</p>
          </div>
          <button @click="stopVoiceSearch" class="stop-voice-btn">
            <i class="fas fa-stop"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Search Suggestions Dropdown -->
    <div v-if="showSuggestions && (searchQuery || isSearchFocused)" class="suggestions-dropdown">
      <div class="suggestions-container">
        <!-- Popular Searches (when no query) -->
        <div v-if="!searchQuery && popularSearches.length" class="suggestion-section">
          <h4 class="section-title">
            <i class="fas fa-fire"></i>
            Popular Searches
          </h4>
          <div 
            v-for="(search, index) in popularSearches" 
            :key="'popular-' + index"
            @click="selectSuggestion({ type: 'search', data: search })"
            class="suggestion-item popular-search"
          >
            <div class="item-icon trending-icon">
              <i class="fas fa-trending-up"></i>
            </div>
            <div class="item-content">
              <span class="item-title">{{ search.query }}</span>
              <span class="item-meta">{{ search.searches }} recent searches</span>
            </div>
          </div>
        </div>
        
        <!-- Products -->
        <div v-if="filteredProducts.length" class="suggestion-section">
          <h4 class="section-title">
            <i class="fas fa-shopping-bag"></i>
            Products
          </h4>
          <div 
            v-for="(product, index) in filteredProducts" 
            :key="'product-' + index"
            @click="selectSuggestion({ type: 'product', data: product })"
            :class="['suggestion-item', { active: selectedIndex === getItemIndex('product', index) }]"
          >
            <div class="item-icon product-icon">
              <img :src="product.image" :alt="product.name" class="product-thumbnail">
            </div>
            <div class="item-content">
              <span class="item-title" v-html="highlightMatch(product.name, searchQuery)"></span>
              <span class="item-meta">{{ product.brand }} • ${{ product.price }}</span>
            </div>
            <div class="item-category">
              <i :class="getCategoryIcon(product.category)"></i>
            </div>
          </div>
        </div>
        
        <!-- Brands -->
        <div v-if="filteredBrands.length" class="suggestion-section">
          <h4 class="section-title">
            <i class="fas fa-star"></i>
            Brands
          </h4>
          <div 
            v-for="(brand, index) in filteredBrands" 
            :key="'brand-' + index"
            @click="selectSuggestion({ type: 'brand', data: brand })"
            :class="['suggestion-item', { active: selectedIndex === getItemIndex('brand', index) }]"
          >
            <div class="item-icon brand-icon">
              <span>{{ brand.name.charAt(0) }}</span>
            </div>
            <div class="item-content">
              <span class="item-title" v-html="highlightMatch(brand.name, searchQuery)"></span>
              <span class="item-meta">{{ brand.products }} products</span>
            </div>
          </div>
        </div>
        
        <!-- Categories -->
        <div v-if="filteredCategories.length" class="suggestion-section">
          <h4 class="section-title">
            <i class="fas fa-th-large"></i>
            Categories
          </h4>
          <div 
            v-for="(category, index) in filteredCategories" 
            :key="'category-' + index"
            @click="selectSuggestion({ type: 'category', data: category })"
            :class="['suggestion-item', { active: selectedIndex === getItemIndex('category', index) }]"
          >
            <div class="item-icon category-icon">
              <i :class="category.icon"></i>
            </div>
            <div class="item-content">
              <span class="item-title" v-html="highlightMatch(category.name, searchQuery)"></span>
              <span class="item-meta">{{ category.products }} products</span>
            </div>
          </div>
        </div>
        
        <!-- Beauty Routines -->
        <div v-if="filteredRoutines.length" class="suggestion-section">
          <h4 class="section-title">
            <i class="fas fa-magic"></i>
            Beauty Routines
          </h4>
          <div 
            v-for="(routine, index) in filteredRoutines" 
            :key="'routine-' + index"
            @click="selectSuggestion({ type: 'routine', data: routine })"
            :class="['suggestion-item', { active: selectedIndex === getItemIndex('routine', index) }]"
          >
            <div class="item-icon routine-icon">
              <i class="fas fa-layer-group"></i>
            </div>
            <div class="item-content">
              <span class="item-title" v-html="highlightMatch(routine.name, searchQuery)"></span>
              <span class="item-meta">{{ routine.steps }} steps • {{ routine.skinType }}</span>
            </div>
          </div>
        </div>
        
        <!-- No Results -->
        <div v-if="searchQuery && !hasAnyResults" class="no-results">
          <div class="no-results-icon">
            <i class="fas fa-search"></i>
          </div>
          <p class="no-results-title">No results found for "{{ searchQuery }}"</p>
          <p class="no-results-subtitle">Try adjusting your search or browse our categories</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TopSearchBar',
  data() {
    return {
      searchQuery: '',
      isSearchFocused: false,
      showSuggestions: false,
      selectedIndex: -1,
      searchTimeout: null,
      
      // Voice search state
      isVoiceActive: false,
      isListening: false,
      isProcessing: false,
      showVoiceTooltip: false,
      voiceRecognition: null,
      voiceTimeout: null,
      
      // Mock data for suggestions
      popularSearches: [
        { query: 'Niacinamide Serum', searches: '12.5k' },
        { query: 'Vitamin C Cream', searches: '8.3k' },
        { query: 'Retinol Night Cream', searches: '6.7k' },
        { query: 'Hyaluronic Acid', searches: '5.2k' },
        { query: 'Red Lipstick', searches: '4.1k' }
      ],
      
      products: [
        {
          id: 1,
          name: 'Niacinamide Serum 10% + Zinc',
          brand: 'The Ordinary',
          price: '6.90',
          category: 'skincare',
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100'
        },
        {
          id: 2,
          name: 'Niacinamide Face Wash',
          brand: 'CeraVe',
          price: '12.99',
          category: 'skincare',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100'
        },
        {
          id: 3,
          name: 'Niacinamide Brightening Cream',
          brand: 'Paula\'s Choice',
          price: '38.00',
          category: 'skincare',
          image: 'https://images.unsplash.com/photo-1556229174-f25e97436b3d?w=100'
        },
        {
          id: 4,
          name: 'Vitamin C Serum',
          brand: 'Mad Hippie',
          price: '34.00',
          category: 'skincare',
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=100'
        },
        {
          id: 5,
          name: 'Red Velvet Lipstick',
          brand: 'Charlotte Tilbury',
          price: '45.00',
          category: 'makeup',
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100'
        },
        {
          id: 6,
          name: 'Retinol Night Serum',
          brand: 'Olay',
          price: '28.99',
          category: 'skincare',
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100'
        }
      ],
      
      brands: [
        { name: 'The Ordinary', products: 45 },
        { name: 'CeraVe', products: 32 },
        { name: 'Paula\'s Choice', products: 28 },
        { name: 'Charlotte Tilbury', products: 56 },
        { name: 'Neutrogena', products: 67 },
        { name: 'Olay', products: 43 }
      ],
      
      categories: [
        { name: 'Skincare', icon: 'fas fa-leaf', products: 234 },
        { name: 'Makeup', icon: 'fas fa-palette', products: 189 },
        { name: 'Hair Care', icon: 'fas fa-cut', products: 156 },
        { name: 'Fragrance', icon: 'fas fa-spray-can', products: 78 },
        { name: 'Bath & Body', icon: 'fas fa-bath', products: 92 }
      ],
      
      routines: [
        { name: 'Morning Skincare Routine', steps: 5, skinType: 'All skin types' },
        { name: 'Evening Anti-Aging Routine', steps: 7, skinType: 'Mature skin' },
        { name: 'Acne-Fighting Routine', steps: 4, skinType: 'Oily/Acne-prone' },
        { name: 'Hydrating Night Routine', steps: 6, skinType: 'Dry skin' }
      ]
    };
  },
  
  computed: {
    ...mapGetters('user', ['isAuthenticated']),
    
    searchPlaceholder() {
      if (this.isVoiceActive) return 'Listening for voice command...';
      return 'Search products, brands, categories...';
    },
    
    voiceTooltip() {
      return this.isVoiceActive ? 'Stop voice search' : 'Start voice search';
    },
    
    filteredProducts() {
      if (!this.searchQuery) return [];
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(this.searchQuery.toLowerCase())
      ).slice(0, 5);
    },
    
    filteredBrands() {
      if (!this.searchQuery) return [];
      return this.brands.filter(brand =>
        brand.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      ).slice(0, 3);
    },
    
    filteredCategories() {
      if (!this.searchQuery) return [];
      return this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      ).slice(0, 4);
    },
    
    filteredRoutines() {
      if (!this.searchQuery) return [];
      return this.routines.filter(routine =>
        routine.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      ).slice(0, 3);
    },
    
    hasAnyResults() {
      return this.filteredProducts.length > 0 || 
             this.filteredBrands.length > 0 || 
             this.filteredCategories.length > 0 || 
             this.filteredRoutines.length > 0;
    },
    
    totalResults() {
      return this.filteredProducts.length + 
             this.filteredBrands.length + 
             this.filteredCategories.length + 
             this.filteredRoutines.length;
    }
  },
  
  methods: {
    // Search Methods
    handleSearchFocus() {
      this.isSearchFocused = true;
      this.showSuggestions = true;
      this.showVoiceTooltip = true;
      setTimeout(() => {
        this.showVoiceTooltip = false;
      }, 3000);
    },
    
    handleSearchBlur() {
      setTimeout(() => {
        this.isSearchFocused = false;
        this.showSuggestions = false;
        this.selectedIndex = -1;
      }, 200);
    },
    
    handleSearchInput() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      
      this.searchTimeout = setTimeout(() => {
        this.selectedIndex = -1;
      }, 100);
    },
    
    handleSearchKeydown(event) {
      if (!this.showSuggestions) return;
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.totalResults - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (this.selectedIndex >= 0) {
            this.selectItemByIndex(this.selectedIndex);
          } else {
            this.performSearch();
          }
          break;
        case 'Escape':
          this.showSuggestions = false;
          this.selectedIndex = -1;
          this.$refs.searchInput.blur();
          break;
      }
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.selectedIndex = -1;
      this.$refs.searchInput.focus();
    },
    
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$emit('search', {
          query: this.searchQuery,
          type: 'general'
        });
        this.showSuggestions = false;
      }
    },
    
    selectSuggestion(suggestion) {
      switch (suggestion.type) {
        case 'search':
          this.searchQuery = suggestion.data.query;
          this.performSearch();
          break;
        case 'product':
          this.$emit('product-selected', suggestion.data);
          break;
        case 'brand':
          this.$emit('brand-selected', suggestion.data);
          break;
        case 'category':
          this.$emit('category-selected', suggestion.data);
          break;
        case 'routine':
          this.$emit('routine-selected', suggestion.data);
          break;
      }
      this.showSuggestions = false;
    },
    
    selectItemByIndex(index) {
      let currentIndex = 0;
      
      // Products
      if (index < currentIndex + this.filteredProducts.length) {
        const productIndex = index - currentIndex;
        this.selectSuggestion({ type: 'product', data: this.filteredProducts[productIndex] });
        return;
      }
      currentIndex += this.filteredProducts.length;
      
      // Brands
      if (index < currentIndex + this.filteredBrands.length) {
        const brandIndex = index - currentIndex;
        this.selectSuggestion({ type: 'brand', data: this.filteredBrands[brandIndex] });
        return;
      }
      currentIndex += this.filteredBrands.length;
      
      // Categories
      if (index < currentIndex + this.filteredCategories.length) {
        const categoryIndex = index - currentIndex;
        this.selectSuggestion({ type: 'category', data: this.filteredCategories[categoryIndex] });
        return;
      }
      currentIndex += this.filteredCategories.length;
      
      // Routines
      if (index < currentIndex + this.filteredRoutines.length) {
        const routineIndex = index - currentIndex;
        this.selectSuggestion({ type: 'routine', data: this.filteredRoutines[routineIndex] });
        return;
      }
    },
    
    getItemIndex(type, index) {
      let baseIndex = 0;
      
      switch (type) {
        case 'product':
          return baseIndex + index;
        case 'brand':
          return this.filteredProducts.length + index;
        case 'category':
          return this.filteredProducts.length + this.filteredBrands.length + index;
        case 'routine':
          return this.filteredProducts.length + this.filteredBrands.length + 
                 this.filteredCategories.length + index;
        default:
          return -1;
      }
    },
    
    // Voice Search Methods
    toggleVoiceSearch() {
      if (this.isVoiceActive) {
        this.stopVoiceSearch();
      } else {
        this.startVoiceSearch();
      }
    },
    
    async startVoiceSearch() {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        this.$emit('error', 'Voice search is not supported in this browser');
        return;
      }
      
      try {
        this.isVoiceActive = true;
        this.isListening = false;
        this.isProcessing = false;
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.voiceRecognition = new SpeechRecognition();
        
        this.voiceRecognition.continuous = false;
        this.voiceRecognition.interimResults = true;
        this.voiceRecognition.lang = 'en-US';
        
        this.voiceRecognition.onstart = () => {
          this.isListening = true;
        };
        
        this.voiceRecognition.onresult = (event) => {
          const result = event.results[event.results.length - 1];
          const transcript = result.transcript.trim();
          
          if (result.isFinal) {
            this.isListening = false;
            this.isProcessing = true;
            this.processVoiceCommand(transcript);
          }
        };
        
        this.voiceRecognition.onerror = (event) => {
          this.stopVoiceSearch();
          this.$emit('error', 'Voice recognition error: ' + event.error);
        };
        
        this.voiceRecognition.onend = () => {
          if (this.isVoiceActive && !this.isProcessing) {
            this.stopVoiceSearch();
          }
        };
        
        this.voiceRecognition.start();
        
        // Auto-stop after 10 seconds
        this.voiceTimeout = setTimeout(() => {
          this.stopVoiceSearch();
        }, 10000);
        
      } catch (error) {
        this.stopVoiceSearch();
        this.$emit('error', 'Failed to start voice search');
      }
    },
    
    stopVoiceSearch() {
      this.isVoiceActive = false;
      this.isListening = false;
      this.isProcessing = false;
      
      if (this.voiceRecognition) {
        this.voiceRecognition.stop();
        this.voiceRecognition = null;
      }
      
      if (this.voiceTimeout) {
        clearTimeout(this.voiceTimeout);
        this.voiceTimeout = null;
      }
    },
    
    async processVoiceCommand(transcript) {
      try {
        // Simulate processing delay
        await this.delay(800);
        
        // Parse voice command
        const command = transcript.toLowerCase();
        let searchQuery = '';
        
        // Extract search terms from natural language
        if (command.includes('find') || command.includes('show me') || command.includes('search for')) {
          searchQuery = command
            .replace(/find|show me|search for|looking for/gi, '')
            .replace(/under \$\d+|below \$\d+|less than \$\d+/gi, '')
            .replace(/for|the|a|an/gi, '')
            .trim();
        } else {
          searchQuery = transcript;
        }
        
        if (searchQuery) {
          this.searchQuery = searchQuery;
          this.stopVoiceSearch();
          this.$emit('voice-search', {
            originalCommand: transcript,
            searchQuery: searchQuery
          });
          this.performSearch();
        } else {
          this.stopVoiceSearch();
          this.$emit('error', 'Could not understand the voice command');
        }
        
      } catch (error) {
        this.stopVoiceSearch();
        this.$emit('error', 'Failed to process voice command');
      }
    },
    
    // Utility Methods
    highlightMatch(text, query) {
      if (!query) return text;
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
      return text.replace(regex, '<strong>$1</strong>');
    },
    
    escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
    
    getCategoryIcon(category) {
      const icons = {
        skincare: 'fas fa-leaf',
        makeup: 'fas fa-palette',
        haircare: 'fas fa-cut',
        fragrance: 'fas fa-spray-can',
        tools: 'fas fa-brush'
      };
      return icons[category] || 'fas fa-shopping-bag';
    },
    
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    showAuthModal() {
      this.$emit('show-auth');
    }
  },
  
  beforeDestroy() {
    this.stopVoiceSearch();
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }
};
</script>

<style scoped>
.enhanced-search-bar {
  background: linear-gradient(135deg, #fefce8 0%, #fef3f2 25%, #f0f9ff 50%, #fdf2f8 75%, #faf5ff 100%);
  border-bottom: 1px solid rgba(236, 72, 153, 0.08);
  position: relative;
  z-index: 1000;
  margin-top: 82px;
}


/* Main Search Container */
.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.search-wrapper {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid rgba(236, 72, 153, 0.1);
  border-radius: 24px;
  padding: 16px 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.search-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.search-wrapper.active {
  border-color: #ec4899;
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.1), 0 8px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.search-wrapper.active::before {
  opacity: 1;
}

.search-wrapper.voice-active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 32px rgba(59, 130, 246, 0.15);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 18px;
  color: #374151;
  background: transparent;
  font-weight: 500;
  position: relative;
  z-index: 2;
  padding-left: 4px;
}

.search-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

/* Voice Search */
.voice-search-container {
  position: relative;
  margin-left: 12px;
}

.voice-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 16px;
  padding: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  position: relative;
  overflow: hidden;
}

.voice-btn:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: scale(1.05);
}

.voice-btn.active {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  animation: pulse-red 2s infinite;
}

.voice-btn.listening {
  animation: pulse-blue 1.5s infinite;
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
}

@keyframes pulse-blue {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
}

.voice-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 16px;
}

.wave-bar {
  width: 2px;
  height: 4px;
  background: white;
  border-radius: 1px;
  animation: voice-wave 1s infinite ease-in-out;
}

@keyframes voice-wave {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}

.voice-tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 280px;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-title {
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px;
  font-size: 14px;
}

.tooltip-examples {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tooltip-examples li {
  font-size: 13px;
  color: #6b7280;
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
}

.tooltip-examples li::before {
  content: '"';
  position: absolute;
  left: 0;
  color: #ec4899;
  font-weight: 600;
}

.tooltip-examples li::after {
  content: '"';
  color: #ec4899;
  font-weight: 600;
}

.clear-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 12px;
  padding: 8px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  position: relative;
  z-index: 2;
}

.clear-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

/* Voice Status */
.voice-status {
  margin-top: 16px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.voice-status-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-animation {
  position: relative;
  width: 40px;
  height: 40px;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  animation: pulse-ring 2s infinite;
}

.delay-1 { animation-delay: 0.5s; }
.delay-2 { animation-delay: 1s; }

@keyframes pulse-ring {
  0% {
    width: 20px;
    height: 20px;
    opacity: 1;
  }
  100% {
    width: 40px;
    height: 40px;
    opacity: 0;
  }
}

.status-text {
  flex: 1;
}

.listening-text {
  color: #3b82f6;
  font-weight: 600;
  margin: 0;
  animation: pulse-text 1.5s infinite;
}

.processing-text {
  color: #f59e0b;
  font-weight: 600;
  margin: 0;
}

.ready-text {
  color: #6b7280;
  margin: 0;
}

@keyframes pulse-text {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.stop-voice-btn {
  background: #ef4444;
  border: none;
  border-radius: 12px;
  padding: 8px 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.stop-voice-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}

/* Suggestions Dropdown */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid rgba(236, 72, 153, 0.1);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  margin-top: 8px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestions-container {
  max-height: 500px;
  overflow-y: auto;
}

.suggestion-section {
  border-bottom: 1px solid rgba(243, 244, 246, 0.8);
}

.suggestion-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px 20px 8px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #fafafa 0%, #f9fafb 100%);
}

.section-title i {
  font-size: 12px;
  color: #ec4899;
}

/* Suggestion Items */
.suggestion-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;
}

.suggestion-item:hover,
.suggestion-item.active {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%);
  border-left-color: #ec4899;
  transform: translateX(2px);
}

.popular-search:hover {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%);
  border-left-color: #f59e0b;
}

.item-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
  font-size: 16px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.product-icon {
  padding: 0;
  background: #f9fafb;
}

.product-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
}

.brand-icon {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  font-weight: 700;
  font-size: 16px;
}

.category-icon {
  background: linear-gradient(135deg, #a855f7, #9333ea);
  color: white;
}

.routine-icon {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.trending-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-weight: 600;
  color: #374151;
  font-size: 15px;
  margin-bottom: 2px;
  line-height: 1.3;
  display: block;
}

.item-meta {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.2;
}

.item-category {
  margin-left: 12px;
  color: #9ca3af;
  font-size: 16px;
}

/* Highlight matched text */
.item-title strong {
  background: linear-gradient(135deg, #fce7f3, #e0e7ff);
  color: #7c3aed;
  font-weight: 800;
  padding: 1px 3px;
  border-radius: 4px;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.no-results-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.no-results-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px;
}

.no-results-subtitle {
  font-size: 14px;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-container {
    padding: 16px;
  }
  
  .search-wrapper {
    padding: 12px 16px;
    border-radius: 20px;
  }
  
  .search-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .voice-btn {
    width: 44px;
    height: 44px;
    padding: 10px;
  }
  
  .voice-tooltip {
    width: 260px;
    right: -100px;
  }
  
  .suggestions-container {
    max-height: 400px;
  }
  
  .suggestion-item {
    padding: 12px 16px;
  }
  
  .item-icon {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }
}

@media (max-width: 480px) {
  .search-container {
    padding: 12px;
  }
  
  .search-wrapper {
    padding: 10px 14px;
    border-radius: 18px;
  }
  
  
  .voice-btn {
    width: 40px;
    height: 40px;
    margin-left: 8px;
  }
  
  .voice-tooltip {
    width: 240px;
    right: -80px;
    padding: 12px;
  }
  
  .voice-status {
    margin-top: 12px;
    padding: 12px;
  }
  
  .suggestions-dropdown {
    border-radius: 16px;
  }
  
  .suggestion-item {
    padding: 10px 12px;
  }
  
  .item-icon {
    width: 36px;
    height: 36px;
    margin-right: 10px;
    border-radius: 10px;
  }
  
  .section-title {
    padding: 12px 12px 6px;
    font-size: 12px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .search-wrapper,
  .suggestion-item,
  .voice-btn {
    transition: none;
  }
  
  .suggestions-dropdown {
    animation: none;
  }
  
  .wave-bar {
    animation: none;
    height: 8px;
  }
  
  .pulse-ring {
    animation: none;
  }
}

/* Focus styles for keyboard navigation */
.search-input:focus,
.voice-btn:focus,
.clear-btn:focus {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

/* Smooth scrolling for suggestions */
.suggestions-container {
  scroll-behavior: smooth;
}

.suggestions-container::-webkit-scrollbar {
  width: 4px;
}

.suggestions-container::-webkit-scrollbar-track {
  background: transparent;
}

.suggestions-container::-webkit-scrollbar-thumb {
  background: rgba(236, 72, 153, 0.2);
  border-radius: 2px;
}

.suggestions-container::-webkit-scrollbar-thumb:hover {
  background: rgba(236, 72, 153, 0.3);
}
</style>
