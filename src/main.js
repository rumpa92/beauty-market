import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// Global error handler to prevent Event object logging
Vue.config.errorHandler = function (err, vm, info) {
  // Handle the error gracefully
  console.error('Vue error:', err.message || err);
  console.error('Error info:', info);
  if (err.stack) {
    console.error('Stack trace:', err.stack);
  }
};

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Override console.error to handle Event objects properly
const originalConsoleError = console.error;
console.error = function(...args) {
  const processedArgs = args.map(arg => {
    if (arg && typeof arg === 'object' && arg.constructor && arg.constructor.name === 'Event') {
      return `Event(${arg.type})`;
    }
    return arg;
  });
  originalConsoleError.apply(console, processedArgs);
};

console.log('Vue app is initializing...');

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    console.log('Vue app mounted successfully');
  },
  errorCaptured(err, instance, info) {
    console.error('Component error captured:', err.message || err);
    return false; // Prevent the error from propagating further
  }
}).$mount('#app');
