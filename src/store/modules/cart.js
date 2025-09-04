const state = {
  items: [],
  isOpen: false,
  shipping: {
    standard: { name: 'Standard', price: 5.99, days: '5-7' },
    express: { name: 'Express', price: 12.99, days: '2-3' },
    overnight: { name: 'Overnight', price: 24.99, days: '1' }
  },
  selectedShipping: 'standard',
  promoCode: '',
  promoDiscount: 0,
  validPromoCodes: {
    'WELCOME10': 10,
    'BEAUTY20': 20,
    'FREESHIP': 0
  }
};

const getters = {
  cartItems: state => state.items,
  cartTotal: state => {
    const subtotal = state.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    return subtotal;
  },
  cartSubtotal: state => {
    return state.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },
  shippingCost: (state, getters) => {
    if (state.promoCode === 'FREESHIP') return 0;
    // Free shipping for orders over $50
    if (getters.cartSubtotal >= 50) return 0;
    return state.shipping[state.selectedShipping].price;
  },
  discountAmount: (state, getters) => {
    return (getters.cartSubtotal * state.promoDiscount) / 100;
  },
  finalTotal: (state, getters) => {
    const subtotal = getters.cartSubtotal;
    const shipping = getters.shippingCost;
    const discount = getters.discountAmount;
    return subtotal + shipping - discount;
  },
  cartItemCount: state => state.items.reduce((count, item) => count + item.quantity, 0),
  isCartOpen: state => state.isOpen,
  getItemById: state => id => state.items.find(item => item.id === id),
  shippingOptions: state => state.shipping,
  selectedShipping: state => state.selectedShipping,
  promoCode: state => state.promoCode,
  promoDiscount: state => state.promoDiscount,
  freeShippingThreshold: () => 50,
  amountForFreeShipping: (state, getters) => {
    const threshold = getters.freeShippingThreshold;
    const remaining = threshold - getters.cartSubtotal;
    return remaining > 0 ? remaining : 0;
  },
  qualifiesForFreeShipping: (state, getters) => {
    return getters.cartSubtotal >= getters.freeShippingThreshold;
  }
};

const mutations = {
  ADD_TO_CART(state, product) {
    const existingItem = state.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      state.items.push({
        ...product,
        quantity: product.quantity || 1,
        addedAt: new Date().toISOString()
      });
    }
  },
  REMOVE_FROM_CART(state, productId) {
    state.items = state.items.filter(item => item.id !== productId);
  },
  UPDATE_QUANTITY(state, { productId, quantity }) {
    const item = state.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== productId);
      } else {
        item.quantity = quantity;
      }
    }
  },
  CLEAR_CART(state) {
    state.items = [];
  },
  TOGGLE_CART(state) {
    state.isOpen = !state.isOpen;
  },
  SET_CART_OPEN(state, isOpen) {
    state.isOpen = isOpen;
  },
  SET_SHIPPING_METHOD(state, method) {
    state.selectedShipping = method;
  },
  APPLY_PROMO_CODE(state, { code, discount }) {
    state.promoCode = code;
    state.promoDiscount = discount;
  },
  REMOVE_PROMO_CODE(state) {
    state.promoCode = '';
    state.promoDiscount = 0;
  }
};

const actions = {
  async addToCart({ commit, dispatch }, product) {
    try {
      commit('ADD_TO_CART', product);

      // Show cart confirmation popup instead of opening sidebar
      await dispatch('ui/showCartConfirmation', {
        product: product,
        quantity: product.quantity || 1
      }, { root: true });

      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },
  removeFromCart({ commit }, productId) {
    commit('REMOVE_FROM_CART', productId);
  },
  updateQuantity({ commit }, payload) {
    commit('UPDATE_QUANTITY', payload);
  },
  clearCart({ commit }) {
    commit('CLEAR_CART');
  },
  toggleCart({ commit }) {
    commit('TOGGLE_CART');
  },
  openCart({ commit }) {
    commit('SET_CART_OPEN', true);
  },
  closeCart({ commit }) {
    commit('SET_CART_OPEN', false);
  },
  setShippingMethod({ commit }, method) {
    commit('SET_SHIPPING_METHOD', method);
  },
  applyPromoCode({ commit, state }, code) {
    const upperCode = code.toUpperCase();
    if (state.validPromoCodes[upperCode] !== undefined) {
      commit('APPLY_PROMO_CODE', {
        code: upperCode,
        discount: state.validPromoCodes[upperCode]
      });
      return { success: true, message: `Promo code applied! ${state.validPromoCodes[upperCode]}% discount` };
    } else {
      return { success: false, message: 'Invalid promo code' };
    }
  },
  removePromoCode({ commit }) {
    commit('REMOVE_PROMO_CODE');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
