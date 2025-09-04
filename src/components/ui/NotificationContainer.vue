<template>
  <teleport to="body">
    <div class="notification-container">
      <transition-group name="notification" tag="div">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification"
          :class="[`notification-${notification.type}`]"
        >
          <div class="notification-icon">
            <i :class="getIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <div v-if="notification.title" class="notification-title">
              {{ notification.title }}
            </div>
            <div class="notification-message">
              {{ notification.message }}
            </div>
          </div>
          <button 
            class="notification-close"
            @click="removeNotification(notification.id)"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NotificationContainer',
  computed: {
    ...mapGetters('ui', ['notifications'])
  },
  methods: {
    ...mapActions('ui', ['removeNotification']),
    getIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      };
      return icons[type] || icons.info;
    }
  }
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 3000;
  max-width: 400px;
  width: 100%;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: var(--shadow-lg);
  border-left: 4px solid;
  min-height: 60px;
}

.notification-success {
  border-left-color: var(--success-500);
}

.notification-error {
  border-left-color: var(--error-500);
}

.notification-warning {
  border-left-color: var(--warning-500);
}

.notification-info {
  border-left-color: var(--primary-500);
}

.notification-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-top: 2px;
}

.notification-success .notification-icon {
  color: var(--success-500);
}

.notification-error .notification-icon {
  color: var(--error-500);
}

.notification-warning .notification-icon {
  color: var(--warning-500);
}

.notification-info .notification-icon {
  color: var(--primary-500);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
  font-size: 14px;
}

.notification-message {
  color: var(--gray-600);
  font-size: 14px;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  color: var(--gray-600);
}

/* Animations */
.notification-enter-active, .notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .notification-container {
    top: 80px;
    left: 16px;
    right: 16px;
    max-width: none;
  }
  
  .notification {
    padding: 12px;
  }
}
</style>
