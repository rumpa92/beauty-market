<template>
  <teleport to="body">
    <div 
      v-if="isPanelOpen" 
      class="support-overlay"
      @click="closePanel"
    >
      <div 
        class="support-panel"
        @click.stop
        :class="{ 'panel-visible': isPanelOpen }"
      >
        <!-- Panel Header -->
        <div class="panel-header">
          <div class="header-content">
            <div class="brand-section">
              <div class="brand-icon">
                <i class="fas fa-gem"></i>
              </div>
              <div class="brand-info">
                <h3>Beauty Support</h3>
                <p>We're here to help! 💄</p>
              </div>
            </div>
            <button @click="closePanel" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Tab Navigation -->
          <div class="tab-nav">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="switchTab(tab.id)"
              class="tab-btn"
              :class="{ active: activeTab === tab.id }"
            >
              <i :class="tab.icon"></i>
              <span>{{ tab.label }}</span>
              <div v-if="tab.badge" class="tab-badge">{{ tab.badge }}</div>
            </button>
          </div>
        </div>

        <!-- Panel Content -->
        <div class="panel-content">
          <!-- Chat Tab -->
          <div v-if="activeTab === 'chat'" class="tab-content">
            <ChatInterface />
          </div>

          <!-- FAQ Tab -->
          <div v-if="activeTab === 'faq'" class="tab-content">
            <FAQCenter />
          </div>

          <!-- Tickets Tab -->
          <div v-if="activeTab === 'tickets'" class="tab-content">
            <TicketingSystem />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SupportPanel',
  data() {
    return {
      tabs: [
        { 
          id: 'chat', 
          label: 'Chat', 
          icon: 'fas fa-comments',
          badge: null
        },
        { 
          id: 'faq', 
          label: 'FAQ & Help', 
          icon: 'fas fa-question-circle',
          badge: null
        },
        { 
          id: 'tickets', 
          label: 'Tickets', 
          icon: 'fas fa-ticket-alt',
          badge: null
        }
      ]
    };
  },
  computed: {
    ...mapGetters('support', [
      'isPanelOpen',
      'activeTab',
      'notificationCount'
    ])
  },
  methods: {
    ...mapActions('support', [
      'closePanel',
      'switchTab'
    ])
  },
  components: {
    ChatInterface: () => import('./chat/ChatInterface.vue'),
    FAQCenter: () => import('./faq/FAQCenter.vue'),
    TicketingSystem: () => import('./tickets/TicketingSystem.vue')
  }
};
</script>

<style scoped>
.support-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(8px);
  animation: overlay-fade-in 0.3s ease;
}

.support-panel {
  background: white;
  border-radius: 24px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: panel-slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.panel-header {
  background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%);
  border-bottom: 1px solid var(--gray-200);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px 20px;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ec4899, #db2777);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
}

.brand-info h3 {
  font-size: 24px;
  font-weight: 800;
  color: var(--gray-800);
  margin: 0 0 4px;
  letter-spacing: -0.5px;
}

.brand-info p {
  color: var(--gray-600);
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: var(--gray-600);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: white;
  color: var(--gray-800);
  transform: scale(1.05);
}

.tab-nav {
  display: flex;
  padding: 0 32px 24px;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--gray-600);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.8);
  color: var(--gray-800);
}

.tab-btn.active {
  background: white;
  color: #ec4899;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tab-btn i {
  font-size: 16px;
}

.tab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tab-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Animations */
@keyframes overlay-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes panel-slide-up {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .support-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .support-panel {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 24px 24px 0 0;
    margin: 0;
  }

  .header-content {
    padding: 20px 24px 16px;
  }

  .brand-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .brand-info h3 {
    font-size: 20px;
  }

  .tab-nav {
    padding: 0 24px 20px;
  }

  .tab-btn {
    padding: 10px 12px;
    font-size: 13px;
  }

  .tab-btn span {
    display: none;
  }

  .tab-btn i {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .support-panel {
    border-radius: 16px 16px 0 0;
  }

  .header-content {
    padding: 16px 20px 12px;
  }

  .tab-nav {
    padding: 0 20px 16px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .support-overlay,
  .support-panel,
  .close-btn,
  .tab-btn {
    animation: none;
    transition: none;
  }
}

.close-btn:focus-visible,
.tab-btn:focus-visible {
  outline: 3px solid rgba(236, 72, 153, 0.5);
  outline-offset: 2px;
}
</style>
