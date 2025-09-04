<template>
  <div class="chat-interface">
    <!-- Chat Mode Switcher -->
    <div class="chat-mode-switcher">
      <button 
        @click="switchChatMode('ai')"
        class="mode-btn"
        :class="{ active: chatMode === 'ai' }"
      >
        <i class="fas fa-robot"></i>
        <span>AI Assistant</span>
        <div class="mode-indicator"></div>
      </button>
      <button 
        @click="switchChatMode('live')"
        class="mode-btn"
        :class="{ active: chatMode === 'live' }"
      >
        <div class="agent-avatar">
          <img :src="agent.avatar" :alt="agent.name">
          <div class="status-dot" :class="agent.status"></div>
        </div>
        <div class="agent-info">
          <span class="agent-name">{{ agent.name }}</span>
          <span class="agent-status">{{ agent.status === 'online' ? 'Online' : 'Offline' }}</span>
        </div>
      </button>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in chatHistory" 
        :key="message.id"
        class="message-wrapper"
        :class="message.type"
      >
        <div class="message">
          <div class="message-avatar">
            <img 
              v-if="message.sender.avatar && !message.sender.avatar.includes('🤖')" 
              :src="message.sender.avatar" 
              :alt="message.sender.name"
            >
            <span v-else class="emoji-avatar">{{ message.sender.avatar }}</span>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="sender-name">{{ message.sender.name }}</span>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="message-text">{{ message.message }}</div>
          </div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="agentTyping" class="message-wrapper ai">
        <div class="message">
          <div class="message-avatar">
            <img :src="agent.avatar" :alt="agent.name">
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Replies -->
    <div v-if="quickReplies.length > 0" class="quick-replies">
      <button 
        v-for="reply in quickReplies" 
        :key="reply"
        @click="sendQuickReply(reply)"
        class="quick-reply-btn"
      >
        {{ reply }}
      </button>
    </div>

    <!-- Message Input -->
    <div class="message-input-container">
      <div class="input-wrapper">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type your message..."
          class="message-input"
          :disabled="isLoading"
        >
        <button 
          @click="sendMessage"
          class="send-btn"
          :disabled="!newMessage.trim() || isLoading"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ChatInterface',
  data() {
    return {
      newMessage: '',
      isLoading: false
    };
  },
  computed: {
    ...mapGetters('support', [
      'chatHistory',
      'chatMode',
      'agent',
      'agentTyping',
      'quickReplies'
    ])
  },
  methods: {
    ...mapActions('support', [
      'sendMessage',
      'switchChatMode'
    ]),

    async sendMessage() {
      if (!this.newMessage.trim() || this.isLoading) return;
      
      const message = this.newMessage.trim();
      this.newMessage = '';
      this.isLoading = true;

      try {
        await this.sendMessage({ message });
      } finally {
        this.isLoading = false;
      }

      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    sendQuickReply(reply) {
      this.newMessage = reply;
      this.sendMessage();
    },

    formatTime(timestamp) {
      const now = new Date();
      const msgTime = new Date(timestamp);
      const diffInHours = (now - msgTime) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        const minutes = Math.floor((now - msgTime) / (1000 * 60));
        return minutes < 1 ? 'Just now' : `${minutes}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        return msgTime.toLocaleDateString();
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  },

  mounted() {
    this.scrollToBottom();
  },

  watch: {
    chatHistory() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    }
  }
};
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 600px;
  background: white;
}

.chat-mode-switcher {
  display: flex;
  padding: 20px 24px 0;
  gap: 12px;
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: 20px;
}

.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  background: white;
  color: var(--gray-700);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-size: 14px;
}

.mode-btn:hover {
  border-color: #ec4899;
  background: #fdf2f8;
}

.mode-btn.active {
  border-color: #ec4899;
  background: #ec4899;
  color: white;
}

.mode-btn i {
  font-size: 16px;
}

.agent-avatar {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.agent-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border: 2px solid white;
  border-radius: 50%;
}

.status-dot.online {
  background: #10b981;
}

.status-dot.offline {
  background: #6b7280;
}

.agent-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.agent-name {
  font-weight: 600;
  font-size: 13px;
}

.agent-status {
  font-size: 11px;
  opacity: 0.8;
}

.mode-btn.active .agent-info {
  color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-wrapper {
  display: flex;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message-wrapper.user .message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.emoji-avatar {
  font-size: 20px;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.sender-name {
  font-weight: 600;
  font-size: 12px;
  color: var(--gray-700);
}

.message-time {
  font-size: 11px;
  color: var(--gray-500);
}

.message-text {
  background: var(--gray-100);
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--gray-800);
}

.message-wrapper.user .message-text {
  background: #ec4899;
  color: white;
}

.message-wrapper.user .message-header {
  justify-content: flex-end;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: var(--gray-100);
  border-radius: 16px;
  width: fit-content;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray-400);
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.quick-replies {
  padding: 16px 24px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-reply-btn {
  padding: 8px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 20px;
  background: white;
  color: var(--gray-700);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-reply-btn:hover {
  border-color: #ec4899;
  background: #fdf2f8;
  color: #ec4899;
}

.message-input-container {
  padding: 20px 24px 24px;
  border-top: 1px solid var(--gray-200);
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: #ec4899;
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #ec4899;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  background: #db2777;
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-interface {
    height: calc(100vh - 200px);
  }

  .chat-mode-switcher {
    padding: 16px 20px 0;
  }

  .chat-messages {
    padding: 0 20px;
  }

  .message {
    max-width: 90%;
  }

  .quick-replies {
    padding: 12px 20px 0;
  }

  .message-input-container {
    padding: 16px 20px 20px;
  }
}
</style>
