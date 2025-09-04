<template>
  <div class="faq-center">
    <div class="faq-header">
      <h3>FAQ & Help Center</h3>
      <p>Find answers to common questions</p>
    </div>
    
    <div class="search-section">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search for help..."
          class="search-input"
        >
      </div>
    </div>

    <div class="faq-categories">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-card"
        @click="selectCategory(category)"
      >
        <div class="category-icon" :style="{ color: category.color }">
          <i :class="category.icon"></i>
        </div>
        <div class="category-info">
          <h4>{{ category.title }}</h4>
          <p>{{ category.questions.length }} articles</p>
        </div>
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>

    <div v-if="searchQuery" class="search-results">
      <h4>Search Results</h4>
      <div class="result-item" v-for="result in searchResults" :key="result.id">
        <h5>{{ result.question }}</h5>
        <p>{{ result.answer }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'FAQCenter',
  computed: {
    ...mapGetters('support', ['faqCategories']),
    
    categories() {
      return this.faqCategories;
    },
    
    searchQuery: {
      get() {
        return this.$store.getters['support/faqSearchQuery'];
      },
      set(value) {
        this.searchFAQ(value);
      }
    },
    
    searchResults() {
      if (!this.searchQuery) return [];
      
      const query = this.searchQuery.toLowerCase();
      const results = [];
      
      this.categories.forEach(category => {
        category.questions.forEach(question => {
          if (question.question.toLowerCase().includes(query) ||
              question.answer.toLowerCase().includes(query)) {
            results.push(question);
          }
        });
      });
      
      return results;
    }
  },
  
  methods: {
    ...mapActions('support', ['searchFAQ']),
    
    selectCategory(category) {
      console.log('Selected category:', category.title);
    }
  }
};
</script>

<style scoped>
.faq-center {
  padding: 24px;
  height: 600px;
  overflow-y: auto;
}

.faq-header {
  margin-bottom: 24px;
}

.faq-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 8px;
}

.faq-header p {
  color: var(--gray-600);
  margin: 0;
}

.search-section {
  margin-bottom: 32px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar i {
  position: absolute;
  left: 16px;
  color: var(--gray-400);
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #ec4899;
}

.faq-categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-card:hover {
  border-color: #ec4899;
  background: #fdf2f8;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(236, 72, 153, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.category-info {
  flex: 1;
}

.category-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 4px;
}

.category-info p {
  font-size: 14px;
  color: var(--gray-600);
  margin: 0;
}

.search-results {
  margin-top: 24px;
}

.search-results h4 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 16px;
}

.result-item {
  padding: 16px;
  border-radius: 12px;
  background: var(--gray-50);
  margin-bottom: 12px;
}

.result-item h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 8px;
}

.result-item p {
  font-size: 13px;
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
}
</style>
