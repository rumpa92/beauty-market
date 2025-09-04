import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import TestHome from '../views/TestHome.vue';
import Products from '../views/Products.vue';
import ProductDetail from '../views/ProductDetail.vue';
import Cart from '../views/Cart.vue';
import Wishlist from '../views/Wishlist.vue';
import Profile from '../views/Profile.vue';
import Orders from '../views/Orders.vue';
import Checkout from '../views/Checkout.vue';
import OrderConfirmation from '../views/OrderSuccess.vue';
import OrderTracking from '../views/OrderTracking.vue';
import OrderDetails from '../views/OrderDetails.vue';
import OrderDetailsTest from '../views/OrderDetailsTest.vue';
import OrderDetailsSimple from '../views/OrderDetailsSimple.vue';
import OrderDetailsFixed from '../views/OrderDetailsFixed.vue';
import OrderDetailsMinimal from '../views/OrderDetailsMinimal.vue';
import OrderDetailsWorking from '../views/OrderDetailsWorking.vue';
import OrderDetailsFinal from '../views/OrderDetailsFinal.vue';
import OrderDetailsSimpleTest from '../views/OrderDetailsSimpleTest.vue';
import SimpleOrderDetails from '../views/SimpleOrderDetails.vue';
import TestPage from '../views/TestPage.vue';
import PrivacyPolicy from '../views/PrivacyPolicy.vue';
import TermsOfService from '../views/TermsOfService.vue';
import RatingsReviews from '../views/RatingsReviews.vue';
import SelectAddress from '../views/SelectAddress.vue';
import EditAddress from '../views/EditAddress.vue';
import AddAddress from '../views/AddAddress.vue';
import Returns from '../views/Returns.vue';
import RefundDemo from '../views/RefundDemo.vue';
import CartDemo from '../views/CartDemo.vue';
import ModernProductDetail from '../views/ModernProductDetail.vue';
import ProductDemo from '../views/ProductDemo.vue';
import ProductDetailTest from '../views/ProductDetailTest.vue';
import TestProductNavigation from '../views/TestProductNavigation.vue';
import ProductNavigationDemo from '../views/ProductNavigationDemo.vue';
import QuickViewTest from '../views/QuickViewTest.vue';
import AuthDemo from '../views/AuthDemo.vue';
import AuthTest from '../views/AuthTest.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Beauty Market - Premium Beauty & Personal Care' }
  },
  {
    path: '/test',
    name: 'TestHome',
    component: TestHome,
    meta: { title: 'Test Home - Beauty Market' }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { title: 'All Products - Beauty Market' }
  },
  {
    path: '/products/:category',
    name: 'ProductsByCategory',
    component: Products,
    props: true,
    meta: { title: 'Products - Beauty Market' }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
    meta: { title: 'Product Details - Beauty Market' }
  },
  {
    path: '/product/:productId/ratings-reviews',
    name: 'RatingsReviews',
    component: RatingsReviews,
    props: true,
    meta: { title: 'Ratings & Reviews - Beauty Market' }
  },
  {
    path: '/select-address',
    name: 'SelectAddress',
    component: SelectAddress,
    meta: { title: 'Select Address - Beauty Market' }
  },
  {
    path: '/edit-address',
    name: 'EditAddress',
    component: EditAddress,
    meta: { title: 'Edit Address - Beauty Market' }
  },
  {
    path: '/add-address',
    name: 'AddAddress',
    component: AddAddress,
    meta: { title: 'Add New Address - Beauty Market' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { title: 'Shopping Cart - Beauty Market' }
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: Wishlist,
    meta: { title: 'My Wishlist - Beauty Market' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: 'My Profile - Beauty Market' }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { title: 'My Orders - Beauty Market' }
  },
  {
    path: '/returns',
    name: 'Returns',
    component: Returns,
    meta: { title: 'Returns & Refunds - Beauty Market' }
  },
  {
    path: '/refund-demo',
    name: 'RefundDemo',
    component: RefundDemo,
    meta: { title: 'Refund Demo - Beauty Market' }
  },
  {
    path: '/cart-demo',
    name: 'CartDemo',
    component: CartDemo,
    meta: { title: 'Cart Demo - Beauty Market' }
  },
  {
    path: '/modern-product/:productId',
    name: 'ModernProductDetail',
    component: ModernProductDetail,
    props: true,
    meta: { title: 'Product Details - Beauty Market' }
  },
  {
    path: '/product-demo',
    name: 'ProductDemo',
    component: ProductDemo,
    meta: { title: 'Product Demo - Beauty Market' }
  },
  {
    path: '/product-detail-test',
    name: 'ProductDetailTest',
    component: ProductDetailTest,
    meta: { title: 'Product Detail Test - Beauty Market' }
  },
  {
    path: '/test-navigation',
    name: 'TestProductNavigation',
    component: TestProductNavigation,
    meta: { title: 'Test Product Navigation - Beauty Market' }
  },
  {
    path: '/navigation-demo',
    name: 'ProductNavigationDemo',
    component: ProductNavigationDemo,
    meta: { title: 'Product Navigation Demo - Beauty Market' }
  },
  {
    path: '/quick-view-test',
    name: 'QuickViewTest',
    component: QuickViewTest,
    meta: { title: 'Quick View Test - Beauty Market' }
  },
  {
    path: '/auth-demo',
    name: 'AuthDemo',
    component: AuthDemo,
    meta: { title: 'Authentication Demo - Beauty Market' }
  },
  {
    path: '/auth-test',
    name: 'AuthTest',
    component: AuthTest,
    meta: { title: 'Authentication Test - Beauty Market' }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { title: 'Checkout - Beauty Market' }
  },
  {
    path: '/order-confirmation/:orderId',
    name: 'OrderConfirmation',
    component: OrderConfirmation,
    props: true,
    meta: { title: 'Order Confirmation - Beauty Market' }
  },
  {
    path: '/order-tracking/:orderId',
    name: 'OrderTracking',
    component: OrderTracking,
    props: true,
    meta: { title: 'Track Your Order - Beauty Market' }
  },
  {
    path: '/order-details/:orderId',
    name: 'OrderDetails',
    component: SimpleOrderDetails,
    props: true,
    meta: { title: 'Order Details - Beauty Market' }
  },
  {
    path: '/order-test/:orderId',
    name: 'OrderDetailsTest',
    component: OrderDetailsTest,
    props: true,
    meta: { title: 'Order Details Test - Beauty Market' }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: { title: 'Privacy Policy - Beauty Market' }
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    component: TermsOfService,
    meta: { title: 'Terms of Service - Beauty Market' }
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Beauty Market';
  next();
});

export default router;
