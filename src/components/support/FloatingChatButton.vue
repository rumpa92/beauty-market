<template>
  <div class="floating-chat-container">
    <!-- Floating Chat Button -->
    <button 
      @click="togglePanel"
      class="floating-chat-btn"
      :class="{ 'panel-open': isPanelOpen }"
      aria-label="Open customer support"
    >
      <!-- Notification Badge -->
      <div 
        v-if="notificationCount > 0 && !isPanelOpen" 
        class="notification-badge"
      >
        {{ notificationCount > 9 ? '9+' : notificationCount }}
      </div>

      <!-- Button Icon -->
      <div class="btn-icon">
        <transition name="icon-flip" mode="out-in">
          <i 
            v-if="!isPanelOpen" 
            key="chat"
            class="fas fa-comments"
          ></i>
          <i 
            v-else 
            key="close"
            class="fas fa-times"
          ></i>
        </transition>
      </div>

      <!-- Pulse Animation for Notifications -->
      <div 
        v-if="hasUnreadMessages && !isPanelOpen" 
        class="pulse-ring"
      ></div>
    </button>

    <!-- Quick Access Tooltip -->
    <div 
      v-if="!isPanelOpen && showTooltip" 
      class="quick-tooltip"
      @mouseenter="pauseTooltip"
      @mouseleave="resumeTooltip"
    >
      <div class="tooltip-content">
        <div class="tooltip-header">
          <i class="fas fa-sparkles"></i>
          <span>Need help? We're here! 💄</span>
        </div>
        <div class="tooltip-actions">
          <button @click="openChat" class="tooltip-btn">
            <i class="fas fa-robot"></i>
            Chat with AI
          </button>
          <button @click="openFAQ" class="tooltip-btn">
            <i class="fas fa-question-circle"></i>
            Quick FAQ
          </button>
        </div>
      </div>
      <div class="tooltip-arrow"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'FloatingChatButton',
  data() {
    return {
      showTooltip: false,
      tooltipTimer: null,
      tooltipPaused: false
    };
  },
  computed: {
    ...mapGetters('support', [
      'isPanelOpen',
      'hasUnreadMessages', 
      'notificationCount'
    ])
  },
  methods: {
    ...mapActions('support', [
      'openPanel',
      'closePanel'
    ]),

    togglePanel() {
      if (this.isPanelOpen) {
        this.closePanel();
      } else {
        this.openPanel('chat');
      }
      this.hideTooltip();
    },

    openChat() {
      this.openPanel('chat');
      this.hideTooltip();
    },

    openFAQ() {
      this.openPanel('faq');
      this.hideTooltip();
    },

    showTooltipDelayed() {
      if (!this.tooltipPaused && !this.isPanelOpen) {
        this.tooltipTimer = setTimeout(() => {
          this.showTooltip = true;
        }, 3000); // Show after 3 seconds
      }
    },

    hideTooltip() {
      this.showTooltip = false;
      if (this.tooltipTimer) {
        clearTimeout(this.tooltipTimer);
        this.tooltipTimer = null;
      }
    },

    pauseTooltip() {
      this.tooltipPaused = true;
    },

    resumeTooltip() {
      this.tooltipPaused = false;
      setTimeout(() => {
        if (!this.tooltipPaused) {
          this.hideTooltip();
        }
      }, 5000);
    }
  },

  mounted() {
    // Show tooltip after user has been on page for a while
    this.showTooltipDelayed();
  },

  beforeDestroy() {
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
    }
  },

  watch: {
    isPanelOpen(newVal) {
      if (newVal) {
        this.hideTooltip();
      } else {
        // Show tooltip again after panel closes
        setTimeout(() => {
          this.showTooltipDelayed();
        }, 5000);
      }
    }
  }
};
</script>

<style scoped>
.floating-chat-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1500;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.floating-chat-btn {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ec4899, #db2777);
  box-shadow: 
    0 8px 32px rgba(236, 72, 153, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.floating-chat-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    0 12px 40px rgba(236, 72, 153, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.floating-chat-btn.panel-open {
  background: linear-gradient(135deg, #6b7280, #374151);
  transform: rotate(90deg);
}

.floating-chat-btn.panel-open:hover {
  background: linear-gradient(135deg, #374151, #1f2937);
  transform: rotate(90deg) scale(1.05);
}

.btn-icon {
  position: relative;
  z-index: 2;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 6px;
  border-radius: 12px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  z-index: 3;
  animation: badge-bounce 0.5s ease;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 2px solid rgba(236, 72, 153, 0.6);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
  z-index: 1;
}

.quick-tooltip {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 20px;
  max-width: 280px;
  margin-bottom: 8px;
  animation: tooltip-slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--gray-800);
  font-size: 14px;
}

.tooltip-header i {
  color: #ec4899;
  font-size: 16px;
}

.tooltip-actions {
  display: flex;
  gap: 8px;
}

.tooltip-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  background: white;
  color: var(--gray-700);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tooltip-btn:hover {
  border-color: #ec4899;
  color: #ec4899;
  background: #fdf2f8;
  transform: translateY(-1px);
}

.tooltip-btn i {
  font-size: 14px;
}

.tooltip-arrow {
  position: absolute;
  bottom: -8px;
  right: 32px;
  width: 16px;
  height: 16px;
  background: white;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transform: rotate(45deg);
  border-radius: 0 0 4px 0;
}

/* Animations */
@keyframes badge-bounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes tooltip-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Icon Flip Animation */
.icon-flip-enter-active, .icon-flip-leave-active {
  transition: all 0.3s ease;
}

.icon-flip-enter {
  opacity: 0;
  transform: rotateY(-90deg);
}

.icon-flip-leave-to {
  opacity: 0;
  transform: rotateY(90deg);
}

/* Responsive Design */
@media (max-width: 768px) {
  .floating-chat-container {
    bottom: 20px;
    right: 20px;
  }

  .floating-chat-btn {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }

  .quick-tooltip {
    max-width: 240px;
    padding: 16px;
    margin-bottom: 6px;
  }

  .tooltip-actions {
    flex-direction: column;
  }

  .tooltip-arrow {
    right: 28px;
  }
}

@media (max-width: 480px) {
  .floating-chat-container {
    bottom: 16px;
    right: 16px;
  }

  .quick-tooltip {
    max-width: 200px;
    padding: 12px;
  }

  .tooltip-header {
    font-size: 13px;
  }

  .tooltip-btn {
    font-size: 11px;
    padding: 8px 10px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .floating-chat-btn,
  .notification-badge,
  .pulse-ring,
  .quick-tooltip,
  .tooltip-btn {
    animation: none;
    transition: none;
  }
  
  .floating-chat-btn:hover {
    transform: none;
  }
}

/* Focus styles for keyboard navigation */
.floating-chat-btn:focus-visible,
.tooltip-btn:focus-visible {
  outline: 3px solid rgba(236, 72, 153, 0.5);
  outline-offset: 2px;
}
</style>
