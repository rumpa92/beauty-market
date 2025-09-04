<template>
  <div class="ai-chat-widget">
    <!-- AI Chat Icon -->
    <button 
      @click="toggleChat"
      class="ai-chat-icon"
      :class="{ 'chat-open': isChatOpen }"
      aria-label="Open AI Chat"
    >
      <transition name="icon-rotate" mode="out-in">
        <i
          v-if="!isChatOpen"
          key="chat"
          class="fas fa-robot"
        ></i>
        <i 
          v-else 
          key="close"
          class="fas fa-times"
        ></i>
      </transition>
    </button>

    <!-- AI Chat Panel -->
    <transition name="chat-slide">
      <div v-if="isChatOpen" class="ai-chat-panel">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="ai-info">
            <div class="ai-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="ai-details">
              <h4>Beauty AI Assistant</h4>
              <span class="ai-status">🟢 Online & Ready to Help</span>
            </div>
          </div>
          <button @click="toggleChat" class="close-chat-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Chat Messages -->
        <div class="chat-messages" ref="messagesContainer">
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message"
            :class="message.type"
          >
            <div v-if="message.type === 'ai'" class="message-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="message-bubble">
              <p>{{ message.text }}</p>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="message ai">
            <div class="message-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="message-bubble typing">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Suggestions -->
        <div v-if="showSuggestions" class="quick-suggestions">
          <button 
            v-for="suggestion in suggestions" 
            :key="suggestion"
            @click="sendMessage(suggestion)"
            class="suggestion-btn"
          >
            {{ suggestion }}
          </button>
        </div>

        <!-- Message Input -->
        <div class="chat-input">
          <div class="input-container">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage()"
              type="text"
              placeholder="Ask me anything about beauty..."
              class="message-input"
              :disabled="isTyping"
            >
            <button 
              @click="sendMessage()"
              class="send-btn"
              :disabled="!newMessage.trim() || isTyping"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AIChatWidget',
  data() {
    return {
      isChatOpen: false,
      newMessage: '',
      isTyping: false,
      showSuggestions: true,
      messages: [
        {
          id: 1,
          type: 'ai',
          text: "Hi there! 👋 I'm your AI beauty assistant. How can I help you today?",
          timestamp: new Date()
        }
      ],
      suggestions: [
        "Help me find the perfect foundation",
        "What's good for dry skin?",
        "Show me trending makeup",
        "Skincare routine advice"
      ]
    };
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
      if (this.isChatOpen) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    async sendMessage(messageText = null) {
      const text = messageText || this.newMessage.trim();
      if (!text || this.isTyping) return;

      // Hide suggestions after first message
      this.showSuggestions = false;

      // Add user message
      this.messages.push({
        id: Date.now(),
        type: 'user',
        text: text,
        timestamp: new Date()
      });

      this.newMessage = '';
      this.scrollToBottom();

      // Show typing indicator
      this.isTyping = true;

      // Simulate AI response delay
      setTimeout(() => {
        this.isTyping = false;
        
        // Add AI response
        this.messages.push({
          id: Date.now() + 1,
          type: 'ai',
          text: this.generateAIResponse(text),
          timestamp: new Date()
        });

        this.scrollToBottom();
      }, 1500);
    },

    generateAIResponse(userMessage) {
      const message = userMessage.toLowerCase();
      
      if (message.includes('foundation') || message.includes('makeup base')) {
        return "For the perfect foundation match, I recommend trying our virtual try-on tool! 💄 Consider your skin tone - warm, cool, or neutral undertones. Would you like me to show you our best-selling foundations?";
      }
      
      if (message.includes('dry skin') || message.includes('moisturizer')) {
        return "For dry skin, I suggest a gentle hydrating routine! 💧 Start with a cream cleanser, followed by a hyaluronic acid serum, and finish with a rich moisturizer. Don't forget SPF during the day!";
      }
      
      if (message.includes('trending') || message.includes('popular')) {
        return "The latest beauty trends include dewy makeup, bold liner looks, and glass skin! ✨ Cream blushes and tinted moisturizers are super popular right now. Want to see our trending products?";
      }
      
      if (message.includes('skincare') || message.includes('routine')) {
        return "A great skincare routine is: Cleanse ➜ Tone ➜ Treat ➜ Moisturize ➜ Protect! 🧴 The key is consistency and using products suited for your skin type. What's your main skin concern?";
      }
      
      if (message.includes('acne') || message.includes('breakout')) {
        return "For acne-prone skin, look for ingredients like salicylic acid, niacinamide, and benzoyl peroxide! 🌟 Remember to introduce new products gradually and always use SPF. Shall I recommend some specific products?";
      }
      
      return "That's a great question! 😊 I'm here to help with all your beauty needs - from skincare advice to makeup tips and product recommendations. Could you tell me more about what you're looking for?";
    },

    formatTime(timestamp) {
      const now = new Date();
      const time = new Date(timestamp);
      const diffInMinutes = (now - time) / (1000 * 60);
      
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)}m ago`;
      } else {
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  }
};
</script>

<style scoped>
.ai-chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.ai-chat-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  box-shadow:
    0 8px 32px rgba(99, 102, 241, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}

.ai-chat-icon:hover {
  transform: translateY(-3px) scale(1.08);
  box-shadow:
    0 12px 40px rgba(99, 102, 241, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.ai-chat-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.ai-chat-icon:hover::before {
  left: 100%;
}

.ai-chat-icon.chat-open {
  background: linear-gradient(135deg, #6b7280, #374151);
}

.ai-chat-panel {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--gray-200);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fdf2f8, #f3e8ff);
  border-bottom: 1px solid var(--gray-200);
}

.ai-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.ai-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 2px;
}

.ai-status {
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

.close-chat-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-chat-btn:hover {
  background: white;
  color: var(--gray-800);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
}

.message.ai .message-bubble {
  background: var(--gray-100);
  color: var(--gray-800);
}

.message.user .message-bubble {
  background: #ec4899;
  color: white;
}

.message-bubble p {
  margin: 0 0 4px;
  font-size: 14px;
  line-height: 1.4;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
}

.message-bubble.typing {
  padding: 16px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray-400);
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.quick-suggestions {
  padding: 12px 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-btn {
  padding: 8px 12px;
  border: 1px solid var(--gray-300);
  border-radius: 16px;
  background: white;
  color: var(--gray-700);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  border-color: #ec4899;
  background: #fdf2f8;
  color: #ec4899;
}

.chat-input {
  padding: 16px 20px;
  border-top: 1px solid var(--gray-200);
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: #ec4899;
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #ec4899;
  color: white;
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
}

/* Animations */
.icon-rotate-enter-active, .icon-rotate-leave-active {
  transition: all 0.3s ease;
}

.icon-rotate-enter {
  opacity: 0;
  transform: rotate(-180deg);
}

.icon-rotate-leave-to {
  opacity: 0;
  transform: rotate(180deg);
}

.chat-slide-enter-active, .chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-slide-enter {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Responsive Design */
@media (max-width: 768px) {
  .ai-chat-widget {
    bottom: 16px;
    right: 16px;
  }

  .ai-chat-panel {
    width: calc(100vw - 32px);
    max-width: 350px;
    height: 450px;
  }

  .ai-chat-icon {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .ai-chat-panel {
    width: calc(100vw - 20px);
    height: 400px;
  }

  .chat-messages {
    padding: 12px 16px;
  }

  .chat-input {
    padding: 12px 16px;
  }
}

/* Accessibility */
.ai-chat-icon:focus-visible,
.send-btn:focus-visible,
.suggestion-btn:focus-visible {
  outline: 3px solid rgba(236, 72, 153, 0.5);
  outline-offset: 2px;
}
</style>
