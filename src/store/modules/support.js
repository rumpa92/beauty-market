const state = {
  // Support Panel State
  isPanelOpen: false,
  activeTab: 'chat', // 'chat', 'faq', 'tickets'
  hasUnreadMessages: false,
  notificationCount: 0,

  // Chat State
  chatMode: 'ai', // 'ai' or 'live'
  isAgentOnline: true,
  agentTyping: false,
  chatHistory: [
    {
      id: 1,
      type: 'ai',
      message: "Hi there! 👋 I'm your beauty assistant. How can I help you today?",
      timestamp: new Date(Date.now() - 30000),
      sender: {
        name: 'Beauty AI',
        avatar: '🤖',
        type: 'bot'
      }
    }
  ],
  quickReplies: [
    'Track my order',
    'Return policy',
    'Product recommendations',
    'Beauty tips'
  ],

  // Live Chat State
  agent: {
    name: 'Emma Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    status: 'online',
    department: 'Beauty Consultant'
  },

  // FAQ State
  faqSearchQuery: '',
  faqCategories: [
    {
      id: 'orders',
      title: 'Orders & Shipping',
      icon: 'fas fa-box',
      color: '#ec4899',
      questions: [
        {
          id: 1,
          question: 'How can I track my order?',
          answer: 'You can track your order by visiting the "My Orders" section in your account or using the tracking number sent to your email.',
          helpful: null,
          views: 245
        },
        {
          id: 2,
          question: 'What are your shipping options?',
          answer: 'We offer free standard shipping (5-7 days), express shipping (2-3 days), and same-day delivery in select areas.',
          helpful: null,
          views: 189
        },
        {
          id: 3,
          question: 'Can I change my shipping address?',
          answer: 'You can change your shipping address within 2 hours of placing your order. Contact support for assistance.',
          helpful: null,
          views: 156
        }
      ]
    },
    {
      id: 'returns',
      title: 'Returns & Refunds',
      icon: 'fas fa-undo',
      color: '#8b5cf6',
      questions: [
        {
          id: 4,
          question: 'What is your return policy?',
          answer: 'We accept returns within 30 days of purchase. Items must be unopened and in original packaging for hygiene reasons.',
          helpful: null,
          views: 298
        },
        {
          id: 5,
          question: 'How do I initiate a return?',
          answer: 'Go to "My Orders", select the order, and click "Return Items". Follow the guided process to print your return label.',
          helpful: null,
          views: 201
        }
      ]
    },
    {
      id: 'beauty',
      title: 'Beauty Advice',
      icon: 'fas fa-sparkles',
      color: '#f59e0b',
      questions: [
        {
          id: 6,
          question: 'How do I choose the right foundation shade?',
          answer: 'Use our virtual try-on tool or order shade samples. Consider your undertone: cool (pink), warm (yellow), or neutral.',
          helpful: null,
          views: 445
        },
        {
          id: 7,
          question: 'What skincare routine is best for my skin type?',
          answer: 'Take our skin quiz to get personalized recommendations. Generally: cleanse, tone, treat, moisturize, and protect with SPF.',
          helpful: null,
          views: 387
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Account',
      icon: 'fas fa-credit-card',
      color: '#10b981',
      questions: [
        {
          id: 8,
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and buy-now-pay-later options like Klarna.',
          helpful: null,
          views: 167
        },
        {
          id: 9,
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard SSL encryption and never store your full credit card details on our servers.',
          helpful: null,
          views: 134
        }
      ]
    }
  ],

  // Ticketing State
  tickets: [
    {
      id: 'TICK-2024-001',
      status: 'open',
      subject: 'Product damaged during shipping',
      category: 'orders',
      priority: 'high',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      messages: [
        {
          id: 1,
          message: 'My makeup palette arrived broken. The mirror is cracked and some eyeshadows are shattered.',
          sender: 'user',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          attachments: []
        },
        {
          id: 2,
          message: 'Hi! I\'m so sorry to hear about the damaged palette. We\'ll send you a replacement right away. Please keep the damaged item for our records.',
          sender: 'agent',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          attachments: []
        }
      ]
    }
  ],
  currentTicket: {
    step: 1,
    issueType: '',
    subject: '',
    description: '',
    priority: 'medium',
    attachments: []
  },

  // Products for AI recommendations
  recommendedProducts: [
    {
      id: 1,
      name: 'Vitamin C Brightening Serum',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1556229174-f25e97436b3d?w=300',
      rating: 4.8,
      category: 'skincare'
    },
    {
      id: 2,
      name: 'Hydrating Face Moisturizer',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
      rating: 4.6,
      category: 'skincare'
    },
    {
      id: 3,
      name: 'Long-lasting Lipstick',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300',
      rating: 4.7,
      category: 'makeup'
    }
  ]
};

const getters = {
  isPanelOpen: state => state.isPanelOpen,
  activeTab: state => state.activeTab,
  hasUnreadMessages: state => state.hasUnreadMessages,
  notificationCount: state => state.notificationCount,
  chatHistory: state => state.chatHistory,
  chatMode: state => state.chatMode,
  isAgentOnline: state => state.isAgentOnline,
  agentTyping: state => state.agentTyping,
  quickReplies: state => state.quickReplies,
  agent: state => state.agent,
  faqCategories: state => state.faqCategories,
  faqSearchQuery: state => state.faqSearchQuery,
  filteredFAQs: state => {
    if (!state.faqSearchQuery) return state.faqCategories;
    
    const query = state.faqSearchQuery.toLowerCase();
    return state.faqCategories.map(category => ({
      ...category,
      questions: category.questions.filter(q => 
        q.question.toLowerCase().includes(query) ||
        q.answer.toLowerCase().includes(query)
      )
    })).filter(category => category.questions.length > 0);
  },
  tickets: state => state.tickets,
  currentTicket: state => state.currentTicket,
  recommendedProducts: state => state.recommendedProducts
};

const mutations = {
  SET_PANEL_OPEN(state, isOpen) {
    state.isPanelOpen = isOpen;
    if (isOpen) {
      state.hasUnreadMessages = false;
      state.notificationCount = 0;
    }
  },

  SET_ACTIVE_TAB(state, tab) {
    state.activeTab = tab;
  },

  SET_NOTIFICATION_COUNT(state, count) {
    state.notificationCount = count;
    state.hasUnreadMessages = count > 0;
  },

  ADD_CHAT_MESSAGE(state, message) {
    state.chatHistory.push({
      id: Date.now(),
      timestamp: new Date(),
      ...message
    });
  },

  SET_CHAT_MODE(state, mode) {
    state.chatMode = mode;
  },

  SET_AGENT_TYPING(state, typing) {
    state.agentTyping = typing;
  },

  SET_AGENT_STATUS(state, status) {
    state.agent.status = status;
    state.isAgentOnline = status === 'online';
  },

  SET_FAQ_SEARCH_QUERY(state, query) {
    state.faqSearchQuery = query;
  },

  UPDATE_FAQ_HELPFUL(state, { categoryId, questionId, helpful }) {
    const category = state.faqCategories.find(c => c.id === categoryId);
    if (category) {
      const question = category.questions.find(q => q.id === questionId);
      if (question) {
        question.helpful = helpful;
      }
    }
  },

  SET_CURRENT_TICKET_STEP(state, step) {
    state.currentTicket.step = step;
  },

  UPDATE_CURRENT_TICKET(state, updates) {
    state.currentTicket = { ...state.currentTicket, ...updates };
  },

  ADD_TICKET_ATTACHMENT(state, attachment) {
    state.currentTicket.attachments.push(attachment);
  },

  REMOVE_TICKET_ATTACHMENT(state, index) {
    state.currentTicket.attachments.splice(index, 1);
  },

  CREATE_TICKET(state, ticket) {
    state.tickets.unshift({
      id: `TICK-${new Date().getFullYear()}-${String(state.tickets.length + 1).padStart(3, '0')}`,
      status: 'open',
      priority: state.currentTicket.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...ticket
    });
    
    // Reset current ticket
    state.currentTicket = {
      step: 1,
      issueType: '',
      subject: '',
      description: '',
      priority: 'medium',
      attachments: []
    };
  },

  CLEAR_CHAT_HISTORY(state) {
    state.chatHistory = [
      {
        id: 1,
        type: 'ai',
        message: "Hi there! 👋 I'm your beauty assistant. How can I help you today?",
        timestamp: new Date(),
        sender: {
          name: 'Beauty AI',
          avatar: '🤖',
          type: 'bot'
        }
      }
    ];
  }
};

const actions = {
  openPanel({ commit }, tab = 'chat') {
    commit('SET_PANEL_OPEN', true);
    commit('SET_ACTIVE_TAB', tab);
  },

  closePanel({ commit }) {
    commit('SET_PANEL_OPEN', false);
  },

  switchTab({ commit }, tab) {
    commit('SET_ACTIVE_TAB', tab);
  },

  sendMessage({ commit, state }, { message, type = 'user' }) {
    // Add user message
    commit('ADD_CHAT_MESSAGE', {
      type: 'user',
      message,
      sender: {
        name: 'You',
        avatar: '👤',
        type: 'user'
      }
    });

    // Simulate AI/agent response
    setTimeout(() => {
      if (state.chatMode === 'ai') {
        commit('ADD_CHAT_MESSAGE', {
          type: 'ai',
          message: generateAIResponse(message),
          sender: {
            name: 'Beauty AI',
            avatar: '🤖',
            type: 'bot'
          }
        });
      } else {
        commit('SET_AGENT_TYPING', true);
        setTimeout(() => {
          commit('SET_AGENT_TYPING', false);
          commit('ADD_CHAT_MESSAGE', {
            type: 'agent',
            message: generateAgentResponse(message),
            sender: {
              name: state.agent.name,
              avatar: state.agent.avatar,
              type: 'agent'
            }
          });
        }, 2000);
      }
    }, 1000);
  },

  switchChatMode({ commit }, mode) {
    commit('SET_CHAT_MODE', mode);
    
    if (mode === 'live') {
      commit('ADD_CHAT_MESSAGE', {
        type: 'system',
        message: `You're now connected with ${this.state.support.agent.name} from our Beauty team! 💄`,
        sender: {
          name: 'System',
          avatar: '🔄',
          type: 'system'
        }
      });
    }
  },

  searchFAQ({ commit }, query) {
    commit('SET_FAQ_SEARCH_QUERY', query);
  },

  markFAQHelpful({ commit }, { categoryId, questionId, helpful }) {
    commit('UPDATE_FAQ_HELPFUL', { categoryId, questionId, helpful });
  },

  updateTicketStep({ commit }, step) {
    commit('SET_CURRENT_TICKET_STEP', step);
  },

  updateTicket({ commit }, updates) {
    commit('UPDATE_CURRENT_TICKET', updates);
  },

  addAttachment({ commit }, file) {
    const attachment = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    };
    commit('ADD_TICKET_ATTACHMENT', attachment);
  },

  removeAttachment({ commit }, index) {
    commit('REMOVE_TICKET_ATTACHMENT', index);
  },

  submitTicket({ commit, state }) {
    const ticket = {
      subject: state.currentTicket.subject,
      category: state.currentTicket.issueType,
      messages: [{
        id: 1,
        message: state.currentTicket.description,
        sender: 'user',
        timestamp: new Date(),
        attachments: state.currentTicket.attachments
      }]
    };
    
    commit('CREATE_TICKET', ticket);
    return ticket;
  },

  addNotification({ commit, state }) {
    commit('SET_NOTIFICATION_COUNT', state.notificationCount + 1);
  }
};

// Helper functions
function generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('track') || message.includes('order')) {
    return "I can help you track your order! 📦 Please provide your order number, or I can look it up using your email address.";
  }
  
  if (message.includes('return') || message.includes('refund')) {
    return "Our return policy allows returns within 30 days! 🔄 Would you like me to help you start a return or explain our policy in detail?";
  }
  
  if (message.includes('recommend') || message.includes('product')) {
    return "I'd love to recommend some products for you! ✨ What type of products are you looking for? Skincare, makeup, or hair care?";
  }
  
  if (message.includes('beauty') || message.includes('tip')) {
    return "Here are some beauty tips! 💄 For best results, always cleanse your face before applying makeup, and don't forget SPF daily!";
  }
  
  return "I understand! Let me help you with that. Can you provide a bit more detail about what you're looking for? 😊";
}

function generateAgentResponse(userMessage) {
  const responses = [
    "Thanks for reaching out! I'm here to help you with any beauty questions or concerns.",
    "I'd be happy to assist you with that! Let me look into this for you.",
    "Great question! I can definitely help you find the perfect solution.",
    "I appreciate your patience! Let me get you the information you need."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
