<template>
  <div class="fashion-market market-fashion">
    <FashionHeader v-if="!$route.meta.hideLayout" />
    <main class="fashion-main">
      <router-view />
    </main>
    <FashionFooter v-if="!$route.meta.hideLayout" />
    
    <!-- Global Fashion Components -->
    <FashionCartSidebar />
    <FashionSearchModal />
    <FashionNotifications />
    <FashionProductQuickView />
    <FashionVoiceAssistant />
  </div>
</template>

<script>
import FashionHeader from './FashionHeader.vue';
import FashionFooter from './FashionFooter.vue';
import FashionCartSidebar from '../components/FashionCartSidebar.vue';
import FashionSearchModal from '../components/FashionSearchModal.vue';
import FashionNotifications from '../components/FashionNotifications.vue';
import FashionProductQuickView from '../components/FashionProductQuickView.vue';
import FashionVoiceAssistant from '../components/FashionVoiceAssistant.vue';

export default {
  name: 'FashionLayout',
  components: {
    FashionHeader,
    FashionFooter,
    FashionCartSidebar,
    FashionSearchModal,
    FashionNotifications,
    FashionProductQuickView,
    FashionVoiceAssistant
  },
  mounted() {
    // Apply fashion market theme
    document.body.classList.add('market-fashion');
    
    // Initialize fashion market
    this.$store.dispatch('ui/setTheme', 'fashion');
  },
  beforeDestroy() {
    document.body.classList.remove('market-fashion');
  }
};
</script>

<style scoped>
.fashion-market {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.fashion-main {
  flex: 1;
  padding-top: 80px;
}

@media (max-width: 768px) {
  .fashion-main {
    padding-top: 70px;
  }
}
</style>
