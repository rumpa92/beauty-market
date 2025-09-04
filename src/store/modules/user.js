const state = {
  isAuthenticated: true,
  authToken: null,
  profile: {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '9775637590',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    skinType: 'combination',
    hairType: 'curly',
    preferences: {
      brands: ['The Ordinary', 'CeraVe', 'Neutrogena'],
      categories: ['skincare', 'makeup'],
      priceRange: [0, 200],
      skinConcerns: ['acne', 'dryness'],
      allergies: ['fragrance']
    }
  },
  wishlist: [],
  recentlyViewed: [
    {
      id: 1,
      name: 'Vitamin C Brightening Serum',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1556229174-f25e97436b3d?w=300',
      viewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      name: 'Hydrating Face Moisturizer',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
      viewedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  ],
  skinQuizCompleted: true,
  notifications: {
    email: true,
    push: true,
    sales: true,
    newProducts: false,
    orderUpdates: true,
    promotions: true,
    stockAlerts: true
  },
  addresses: [],
  paymentMethods: [],
  language: 'en',
  currency: 'USD',
  country: 'US',
  privacySettings: {
    personalization: true,
    analytics: true,
    marketing: false
  },
  deliveryPreferences: {
    contactless: false,
    leaveAtDoor: false,
    callOnArrival: true,
    preferredTime: 'afternoon',
    instructions: ''
  },
  orders: [
    {
      id: '12346',
      status: 'In Transit',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      address: '123 Beauty St, Glamour City, GC 12345',
      canReschedule: true,
      items: [
        { name: 'Vitamin C Serum', quantity: 1, price: 24.99 },
        { name: 'Hydrating Moisturizer', quantity: 1, price: 18.99 }
      ]
    }
  ],
  refunds: [
    {
      id: 1,
      orderId: '12345',
      amount: 45.99,
      status: 'Completed',
      reason: 'Product damaged',
      method: 'Original payment method',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      notes: 'Refund processed successfully'
    },
    {
      id: 2,
      orderId: '12340',
      amount: 29.99,
      status: 'Pending',
      reason: 'Wrong item received',
      method: 'Store credit',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      notes: 'Processing refund...'
    }
  ]
};

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  authToken: state => state.authToken,
  userProfile: state => state.profile,
  wishlistItems: state => state.wishlist,
  recentlyViewedItems: state => state.recentlyViewed,
  skinQuizStatus: state => state.skinQuizCompleted,
  notificationSettings: state => state.notifications,
  userOrders: state => state.orders,
  userRefunds: state => state.refunds,
  userLanguage: state => state.language,
  userCurrency: state => state.currency,
  userCountry: state => state.country,
  privacySettings: state => state.privacySettings,
  deliveryPreferences: state => state.deliveryPreferences,
  isInWishlist: state => productId =>
    state.wishlist.some(item => item.id === productId),
  getSkinTypeRecommendations: state => {
    // Simple logic for skin type recommendations
    const skinType = state.profile.skinType;
    if (skinType === 'dry') {
      return ['moisturizers', 'serums', 'face-oils'];
    } else if (skinType === 'oily') {
      return ['cleansers', 'toners', 'clay-masks'];
    } else if (skinType === 'combination') {
      return ['gentle-cleansers', 'balancing-toners', 'lightweight-moisturizers'];
    } else if (skinType === 'sensitive') {
      return ['gentle-products', 'fragrance-free', 'hypoallergenic'];
    }
    return [];
  },
  personalizedProducts: (state, getters, rootState) => {
    const products = rootState.products.products;
    const userPreferences = state.profile.preferences;

    return products.filter(product => {
      // Filter by preferred brands
      if (userPreferences.brands.length > 0 &&
          !userPreferences.brands.includes(product.brand)) {
        return false;
      }

      // Filter by preferred categories
      if (userPreferences.categories.length > 0 &&
          !userPreferences.categories.includes(product.category)) {
        return false;
      }

      // Filter by price range
      if (product.price < userPreferences.priceRange[0] ||
          product.price > userPreferences.priceRange[1]) {
        return false;
      }

      return true;
    });
  },
  getRecommendationReason: (state) => (productId) => {
    const product = state.recentlyViewed.find(p => p.id === productId);
    if (product) return 'Based on your recent views';

    const userPreferences = state.profile.preferences;
    if (userPreferences.brands.includes(product?.brand)) {
      return `You love ${product.brand} products`;
    }

    if (state.profile.skinType && product?.suitableFor?.includes(state.profile.skinType)) {
      return `Perfect for ${state.profile.skinType} skin`;
    }

    return 'Recommended for you';
  },
  activeOrders: state => state.orders.filter(order =>
    ['Processing', 'Shipped', 'In Transit', 'Out for Delivery'].includes(order.status)
  ),
  completedOrders: state => state.orders.filter(order =>
    order.status === 'Delivered'
  ),
  totalRefunds: state => state.refunds.reduce((sum, refund) => sum + refund.amount, 0),
  yearlyRefunds: state => {
    const thisYear = new Date().getFullYear();
    return state.refunds
      .filter(refund => refund.date.getFullYear() === thisYear)
      .reduce((sum, refund) => sum + refund.amount, 0);
  },
  pendingRefunds: state => state.refunds
    .filter(refund => refund.status === 'Pending')
    .reduce((sum, refund) => sum + refund.amount, 0)
};

const mutations = {
  SET_AUTHENTICATION(state, { isAuthenticated, token = null }) {
    state.isAuthenticated = isAuthenticated;
    state.authToken = token;
  },
  SET_USER_PROFILE(state, profile) {
    state.profile = { ...state.profile, ...profile };
  },
  SET_SKIN_TYPE(state, skinType) {
    state.profile.skinType = skinType;
  },
  SET_HAIR_TYPE(state, hairType) {
    state.profile.hairType = hairType;
  },
  UPDATE_PREFERENCES(state, preferences) {
    state.profile.preferences = { ...state.profile.preferences, ...preferences };
  },
  ADD_TO_WISHLIST(state, product) {
    const exists = state.wishlist.find(item => item.id === product.id);
    if (!exists) {
      state.wishlist.push({
        ...product,
        addedToWishlistAt: new Date().toISOString()
      });
    }
  },
  REMOVE_FROM_WISHLIST(state, productId) {
    state.wishlist = state.wishlist.filter(item => item.id !== productId);
  },
  ADD_TO_RECENTLY_VIEWED(state, product) {
    // Remove if already exists
    state.recentlyViewed = state.recentlyViewed.filter(item => item.id !== product.id);

    // Add to beginning
    state.recentlyViewed.unshift({
      ...product,
      viewedAt: new Date().toISOString()
    });

    // Keep only last 10 items
    if (state.recentlyViewed.length > 10) {
      state.recentlyViewed = state.recentlyViewed.slice(0, 10);
    }
  },
  CLEAR_RECENTLY_VIEWED(state) {
    state.recentlyViewed = [];
  },
  COMPLETE_SKIN_QUIZ(state) {
    state.skinQuizCompleted = true;
  },
  UPDATE_NOTIFICATIONS(state, settings) {
    state.notifications = { ...state.notifications, ...settings };
  },
  ADD_ADDRESS(state, address) {
    state.addresses.push({
      ...address,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
  },
  UPDATE_ADDRESS(state, { id, address }) {
    const index = state.addresses.findIndex(addr => addr.id === id);
    if (index !== -1) {
      state.addresses[index] = { ...state.addresses[index], ...address };
    }
  },
  REMOVE_ADDRESS(state, addressId) {
    state.addresses = state.addresses.filter(addr => addr.id !== addressId);
  },
  SET_LANGUAGE(state, language) {
    state.language = language;
  },
  SET_CURRENCY(state, currency) {
    state.currency = currency;
  },
  SET_COUNTRY(state, country) {
    state.country = country;
  },
  UPDATE_PRIVACY_SETTINGS(state, settings) {
    state.privacySettings = { ...state.privacySettings, ...settings };
  },
  UPDATE_DELIVERY_PREFERENCES(state, preferences) {
    state.deliveryPreferences = { ...state.deliveryPreferences, ...preferences };
  },
  ADD_ORDER(state, order) {
    state.orders.unshift({
      ...order,
      id: order.id || Date.now().toString(),
      date: order.date || new Date()
    });
  },
  UPDATE_ORDER_STATUS(state, { orderId, status }) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
    }
  },
  RESCHEDULE_ORDER(state, { orderId, newDate, newTime }) {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      order.estimatedDelivery = new Date(newDate);
      order.deliveryTime = newTime;
    }
  },
  ADD_REFUND(state, refund) {
    state.refunds.unshift({
      ...refund,
      id: refund.id || Date.now(),
      date: refund.date || new Date()
    });
  },
  UPDATE_REFUND_STATUS(state, { refundId, status }) {
    const refund = state.refunds.find(r => r.id === refundId);
    if (refund) {
      refund.status = status;
    }
  }
};

const actions = {
  async createAccount({ commit }, userData) {
    // Simulate account creation
    const authToken = 'mock_token_' + Date.now();

    // Set authentication state
    commit('SET_AUTHENTICATION', { isAuthenticated: true, token: authToken });

    // Set user profile
    const fullName = userData.firstName && userData.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : userData.name || 'User';

    commit('SET_USER_PROFILE', {
      name: fullName,
      email: userData.email,
      avatar: userData.avatar || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      preferences: {
        ...state.profile.preferences,
        categories: userData.interests || []
      }
    });

    // Store in localStorage for persistence
    const userProfile = {
      name: fullName,
      email: userData.email,
      avatar: userData.avatar || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      preferences: {
        ...state.profile.preferences,
        categories: userData.interests || []
      }
    };

    localStorage.setItem('beauty_market_token', authToken);
    localStorage.setItem('beauty_market_user', JSON.stringify(userProfile));

    return { success: true, user: userData };
  },

  async signIn({ commit }, userData) {
    // Simulate sign in
    const authToken = 'mock_token_' + Date.now();

    // Mock user data - in real app, this would come from API
    const mockUserProfile = {
      name: 'Sarah Johnson',
      email: userData.email,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      skinType: 'combination',
      hairType: 'curly',
      preferences: {
        brands: ['The Ordinary', 'CeraVe', 'Neutrogena'],
        categories: ['skincare', 'makeup'],
        priceRange: [0, 200],
        skinConcerns: ['acne', 'dryness'],
        allergies: ['fragrance']
      }
    };

    // Set authentication state
    commit('SET_AUTHENTICATION', { isAuthenticated: true, token: authToken });
    commit('SET_USER_PROFILE', mockUserProfile);

    // Store in localStorage for persistence
    if (userData.rememberMe) {
      localStorage.setItem('beauty_market_token', authToken);
      localStorage.setItem('beauty_market_user', JSON.stringify(mockUserProfile));
    }

    return { success: true, user: mockUserProfile };
  },

  async socialSignIn({ commit }, userData) {
    // Simulate social sign in
    const authToken = 'social_token_' + Date.now();

    const userProfile = {
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || '',
      provider: userData.provider,
      skinType: 'combination',
      hairType: 'wavy',
      preferences: {
        brands: [],
        categories: [],
        priceRange: [0, 200],
        skinConcerns: [],
        allergies: []
      }
    };

    commit('SET_AUTHENTICATION', { isAuthenticated: true, token: authToken });
    commit('SET_USER_PROFILE', userProfile);

    // Store in localStorage
    localStorage.setItem('beauty_market_token', authToken);
    localStorage.setItem('beauty_market_user', JSON.stringify(userProfile));

    return { success: true, user: userProfile };
  },

  async logout({ commit }) {
    // Clear authentication state
    commit('SET_AUTHENTICATION', { isAuthenticated: false, token: null });

    // Clear user profile
    commit('SET_USER_PROFILE', {
      name: '',
      email: '',
      avatar: '',
      skinType: '',
      hairType: '',
      preferences: {
        brands: [],
        categories: [],
        priceRange: [0, 200],
        skinConcerns: [],
        allergies: []
      }
    });

    // Clear localStorage
    localStorage.removeItem('beauty_market_token');
    localStorage.removeItem('beauty_market_user');

    // Clear other user data
    commit('CLEAR_RECENTLY_VIEWED');

    return { success: true };
  },

  async initializeAuth({ commit }) {
    // Check if user is already authenticated
    const token = localStorage.getItem('beauty_market_token');
    const userData = localStorage.getItem('beauty_market_user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        commit('SET_AUTHENTICATION', { isAuthenticated: true, token });
        commit('SET_USER_PROFILE', user);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('beauty_market_token');
        localStorage.removeItem('beauty_market_user');
      }
    }
  },

  updateProfile({ commit }, profile) {
    commit('SET_USER_PROFILE', profile);

    // Update localStorage if authenticated
    if (state.isAuthenticated) {
      const currentUser = JSON.parse(localStorage.getItem('beauty_market_user') || '{}');
      localStorage.setItem('beauty_market_user', JSON.stringify({
        ...currentUser,
        ...profile
      }));
    }
  },
  setSkinType({ commit }, skinType) {
    commit('SET_SKIN_TYPE', skinType);
  },
  setHairType({ commit }, hairType) {
    commit('SET_HAIR_TYPE', hairType);
  },
  updatePreferences({ commit }, preferences) {
    commit('UPDATE_PREFERENCES', preferences);
  },
  toggleWishlist({ commit, state }, product) {
    const isInWishlist = state.wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      commit('REMOVE_FROM_WISHLIST', product.id);
      return { added: false, message: 'Removed from wishlist' };
    } else {
      commit('ADD_TO_WISHLIST', product);
      return { added: true, message: 'Added to wishlist' };
    }
  },
  addToRecentlyViewed({ commit }, product) {
    commit('ADD_TO_RECENTLY_VIEWED', product);
  },
  clearRecentlyViewed({ commit }) {
    commit('CLEAR_RECENTLY_VIEWED');
  },
  completeSkinQuiz({ commit }, quizResults) {
    commit('SET_SKIN_TYPE', quizResults.skinType);
    commit('UPDATE_PREFERENCES', {
      skinConcerns: quizResults.concerns,
      allergies: quizResults.allergies
    });
    commit('COMPLETE_SKIN_QUIZ');
  },
  updateNotificationSettings({ commit }, settings) {
    commit('UPDATE_NOTIFICATIONS', settings);
  },
  addAddress({ commit }, address) {
    commit('ADD_ADDRESS', address);
  },
  updateAddress({ commit }, payload) {
    commit('UPDATE_ADDRESS', payload);
  },
  removeAddress({ commit }, addressId) {
    commit('REMOVE_ADDRESS', addressId);
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language);
  },
  setCurrency({ commit }, currency) {
    commit('SET_CURRENCY', currency);
  },
  setCountry({ commit }, country) {
    commit('SET_COUNTRY', country);
  },
  updatePrivacySettings({ commit }, settings) {
    commit('UPDATE_PRIVACY_SETTINGS', settings);
  },
  updateDeliveryPreferences({ commit }, preferences) {
    commit('UPDATE_DELIVERY_PREFERENCES', preferences);
  },
  placeOrder({ commit }, order) {
    commit('ADD_ORDER', order);
  },
  updateOrderStatus({ commit }, payload) {
    commit('UPDATE_ORDER_STATUS', payload);
  },
  rescheduleOrder({ commit }, payload) {
    commit('RESCHEDULE_ORDER', payload);
  },
  requestRefund({ commit }, refund) {
    commit('ADD_REFUND', refund);
  },
  updateRefundStatus({ commit }, payload) {
    commit('UPDATE_REFUND_STATUS', payload);
  },
  logout({ commit }) {
    // Clear sensitive user data on logout
    commit('SET_USER_PROFILE', {
      name: '',
      email: '',
      avatar: '',
      skinType: '',
      hairType: '',
      preferences: {
        brands: [],
        categories: [],
        priceRange: [0, 200],
        skinConcerns: [],
        allergies: []
      }
    });
    commit('CLEAR_RECENTLY_VIEWED');
    // Redirect will be handled by the component
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
