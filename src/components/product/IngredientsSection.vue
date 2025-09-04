<template>
  <div class="ingredients-section">
    <div class="ingredients-list">
      <h3>Full Ingredients List</h3>
      <div class="ingredients-grid">
        <div 
          v-for="ingredient in ingredients" 
          :key="ingredient.name"
          class="ingredient-item"
          @click="showIngredientInfo(ingredient)"
        >
          <span class="ingredient-name">{{ ingredient.name }}</span>
          <span class="ingredient-percentage" v-if="ingredient.percentage">
            {{ ingredient.percentage }}%
          </span>
        </div>
      </div>
    </div>

    <div class="key-ingredients">
      <h3>Key Active Ingredients</h3>
      <div class="key-ingredients-cards">
        <div 
          v-for="ingredient in keyIngredients" 
          :key="ingredient.name"
          class="key-ingredient-card"
        >
          <div class="ingredient-icon">
            <i :class="ingredient.icon"></i>
          </div>
          <h4>{{ ingredient.name }}</h4>
          <p>{{ ingredient.benefit }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IngredientsSection',
  props: {
    ingredients: {
      type: Array,
      default: () => [
        { name: 'Hyaluronic Acid', percentage: 2 },
        { name: 'Vitamin C', percentage: 15 },
        { name: 'Niacinamide', percentage: 5 },
        { name: 'Aqua', percentage: null },
        { name: 'Glycerin', percentage: null }
      ]
    }
  },
  computed: {
    keyIngredients() {
      return [
        {
          name: 'Hyaluronic Acid',
          benefit: 'Intense hydration and plumping',
          icon: 'fas fa-tint'
        },
        {
          name: 'Vitamin C',
          benefit: 'Brightening and antioxidant protection',
          icon: 'fas fa-sun'
        },
        {
          name: 'Niacinamide',
          benefit: 'Pore refinement and oil control',
          icon: 'fas fa-leaf'
        }
      ];
    }
  },
  methods: {
    showIngredientInfo(ingredient) {
      console.log('Show ingredient info for:', ingredient.name);
    }
  }
};
</script>

<style scoped>
.ingredients-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.ingredients-list h3,
.key-ingredients h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 20px;
}

.ingredients-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ingredient-item {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ingredient-item:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.ingredient-name {
  font-size: 14px;
  color: var(--gray-700);
}

.ingredient-percentage {
  font-size: 12px;
  color: var(--primary-600);
  font-weight: 600;
}

.key-ingredients-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.key-ingredient-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  border: 1px solid var(--gray-200);
  transition: all 0.2s ease;
}

.key-ingredient-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.ingredient-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
  font-size: 20px;
}

.key-ingredient-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.key-ingredient-card p {
  color: var(--gray-600);
  line-height: 1.4;
}
</style>
