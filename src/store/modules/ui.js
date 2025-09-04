const state = {
  loading: false,
  mobileMenuOpen: false,
  searchOpen: false,
  filterPanelOpen: false,
  currentView: 'grid', // 'grid' or 'list'
  theme: 'light',
  notifications: [],
  modals: {
    productQuickView: {
      open: false,
      product: null
    },
    skinQuiz: {
      open: false,
      step: 1
    },
    newsletter: {
      open: false,
      dismissed: localStorage.getItem('newsletter-dismissed') === 'true'
    },
    cartConfirmation: {
      open: false,
      product: null,
      quantity: 1
    }
  }
};

const getters = {
  isLoading: state => state.loading,
  isMobileMenuOpen: state => state.mobileMenuOpen,
  isSearchOpen: state => state.searchOpen,
  isFilterPanelOpen: state => state.filterPanelOpen,
  currentView: state => state.currentView,
  theme: state => state.theme,
  notifications: state => state.notifications,
  activeModals: state => {
    return Object.keys(state.modals).filter(modal => state.modals[modal].open);
  },
  getModal: state => modalName => state.modals[modalName]
};

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  TOGGLE_MOBILE_MENU(state) {
    state.mobileMenuOpen = !state.mobileMenuOpen;
  },
  SET_MOBILE_MENU(state, open) {
    state.mobileMenuOpen = open;
  },
  TOGGLE_SEARCH(state) {
    state.searchOpen = !state.searchOpen;
  },
  SET_SEARCH_OPEN(state, open) {
    state.searchOpen = open;
  },
  TOGGLE_FILTER_PANEL(state) {
    state.filterPanelOpen = !state.filterPanelOpen;
  },
  SET_FILTER_PANEL(state, open) {
    state.filterPanelOpen = open;
  },
  SET_VIEW(state, view) {
    state.currentView = view;
  },
  SET_THEME(state, theme) {
    state.theme = theme;
    localStorage.setItem('beauty-market-theme', theme);
  },
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'info',
      autoClose: true,
      duration: 5000,
      ...notification
    });
  },
  REMOVE_NOTIFICATION(state, notificationId) {
    state.notifications = state.notifications.filter(n => n.id !== notificationId);
  },
  CLEAR_NOTIFICATIONS(state) {
    state.notifications = [];
  },
  OPEN_MODAL(state, { modalName, data = null }) {
    if (state.modals[modalName]) {
      state.modals[modalName].open = true;
      if (data && modalName === 'productQuickView') {
        state.modals[modalName].product = data;
      }
      if (data && modalName === 'cartConfirmation') {
        state.modals[modalName].product = data.product;
        state.modals[modalName].quantity = data.quantity || 1;
      }
    }
  },
  CLOSE_MODAL(state, modalName) {
    if (state.modals[modalName]) {
      state.modals[modalName].open = false;
      if (modalName === 'productQuickView') {
        state.modals[modalName].product = null;
      }
      if (modalName === 'cartConfirmation') {
        state.modals[modalName].product = null;
        state.modals[modalName].quantity = 1;
      }
    }
  },
  CLOSE_ALL_MODALS(state) {
    Object.keys(state.modals).forEach(modalName => {
      state.modals[modalName].open = false;
      if (modalName === 'productQuickView') {
        state.modals[modalName].product = null;
      }
      if (modalName === 'cartConfirmation') {
        state.modals[modalName].product = null;
        state.modals[modalName].quantity = 1;
      }
    });
  },
  SET_SKIN_QUIZ_STEP(state, step) {
    state.modals.skinQuiz.step = step;
  },
  DISMISS_NEWSLETTER(state) {
    state.modals.newsletter.dismissed = true;
    localStorage.setItem('newsletter-dismissed', 'true');
  }
};

const actions = {
  setLoading({ commit }, loading) {
    commit('SET_LOADING', loading);
  },
  toggleMobileMenu({ commit }) {
    commit('TOGGLE_MOBILE_MENU');
  },
  closeMobileMenu({ commit }) {
    commit('SET_MOBILE_MENU', false);
  },
  toggleSearch({ commit }) {
    commit('TOGGLE_SEARCH');
  },
  openSearch({ commit }) {
    commit('SET_SEARCH_OPEN', true);
  },
  closeSearch({ commit }) {
    commit('SET_SEARCH_OPEN', false);
  },
  toggleFilterPanel({ commit }) {
    commit('TOGGLE_FILTER_PANEL');
  },
  openFilterPanel({ commit }) {
    commit('SET_FILTER_PANEL', true);
  },
  closeFilterPanel({ commit }) {
    commit('SET_FILTER_PANEL', false);
  },
  setView({ commit }, view) {
    commit('SET_VIEW', view);
  },
  setTheme({ commit }, theme) {
    commit('SET_THEME', theme);
  },
  showNotification({ commit }, notification) {
    const id = Date.now();
    const notificationWithId = { ...notification, id };
    commit('ADD_NOTIFICATION', notificationWithId);

    if (notification.autoClose !== false) {
      setTimeout(() => {
        commit('REMOVE_NOTIFICATION', id);
      }, notification.duration || 5000);
    }
  },
  removeNotification({ commit }, notificationId) {
    commit('REMOVE_NOTIFICATION', notificationId);
  },
  clearAllNotifications({ commit }) {
    commit('CLEAR_NOTIFICATIONS');
  },
  openModal({ commit }, payload) {
    commit('OPEN_MODAL', payload);
  },
  closeModal({ commit }, modalName) {
    commit('CLOSE_MODAL', modalName);
  },
  closeAllModals({ commit }) {
    commit('CLOSE_ALL_MODALS');
  },
  openProductQuickView({ commit }, product) {
    commit('OPEN_MODAL', { modalName: 'productQuickView', data: product });
  },
  showCartConfirmation({ commit }, { product, quantity = 1 }) {
    commit('OPEN_MODAL', { modalName: 'cartConfirmation', data: { product, quantity } });

    // Auto-close after 10 seconds
    setTimeout(() => {
      commit('CLOSE_MODAL', 'cartConfirmation');
    }, 10000);
  },
  closeCartConfirmation({ commit }) {
    commit('CLOSE_MODAL', 'cartConfirmation');
  },
  openSkinQuiz({ commit }) {
    commit('OPEN_MODAL', { modalName: 'skinQuiz' });
    commit('SET_SKIN_QUIZ_STEP', 1);
  },
  nextSkinQuizStep({ commit, state }) {
    commit('SET_SKIN_QUIZ_STEP', state.modals.skinQuiz.step + 1);
  },
  previousSkinQuizStep({ commit, state }) {
    if (state.modals.skinQuiz.step > 1) {
      commit('SET_SKIN_QUIZ_STEP', state.modals.skinQuiz.step - 1);
    }
  },
  showNewsletterModal({ commit, state }) {
    if (!state.modals.newsletter.dismissed) {
      setTimeout(() => {
        commit('OPEN_MODAL', { modalName: 'newsletter' });
      }, 10000); // Show after 10 seconds
    }
  },
  dismissNewsletter({ commit }) {
    commit('DISMISS_NEWSLETTER');
    commit('CLOSE_MODAL', 'newsletter');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
