import FashionLayout from './layout/FashionLayout.vue';
import FashionHome from './pages/FashionHome.vue';
import FashionProducts from './pages/FashionProducts.vue';
import FashionProductDetail from './pages/FashionProductDetail.vue';
import FashionCart from './pages/FashionCart.vue';
import FashionWishlist from './pages/FashionWishlist.vue';
import FashionProfile from './pages/FashionProfile.vue';
import FashionAuth from './pages/FashionAuth.vue';
import FashionFlash from './pages/FashionFlash.vue';
import FashionLocation from './pages/FashionLocation.vue';
import FashionSearch from './pages/FashionSearch.vue';

export const fashionRoutes = {
  path: '/fashion',
  component: FashionLayout,
  children: [
    {
      path: '',
      name: 'FashionHome',
      component: FashionHome,
      meta: { title: 'Fashion Market - Trendy Clothes & Accessories' }
    },
    {
      path: 'flash',
      name: 'FashionFlash',
      component: FashionFlash,
      meta: { title: 'Fashion Market', hideLayout: true }
    },
    {
      path: 'auth',
      name: 'FashionAuth',
      component: FashionAuth,
      meta: { title: 'Sign In - Fashion Market' }
    },
    {
      path: 'location',
      name: 'FashionLocation',
      component: FashionLocation,
      meta: { title: 'Select Location - Fashion Market' }
    },
    {
      path: 'search',
      name: 'FashionSearch',
      component: FashionSearch,
      meta: { title: 'Search - Fashion Market' }
    },
    {
      path: 'products',
      name: 'FashionProducts',
      component: FashionProducts,
      meta: { title: 'All Products - Fashion Market' }
    },
    {
      path: 'products/:category',
      name: 'FashionProductsByCategory',
      component: FashionProducts,
      props: true,
      meta: { title: 'Products - Fashion Market' }
    },
    {
      path: 'product/:id',
      name: 'FashionProductDetail',
      component: FashionProductDetail,
      props: true,
      meta: { title: 'Product Details - Fashion Market' }
    },
    {
      path: 'cart',
      name: 'FashionCart',
      component: FashionCart,
      meta: { title: 'Shopping Cart - Fashion Market' }
    },
    {
      path: 'wishlist',
      name: 'FashionWishlist',
      component: FashionWishlist,
      meta: { title: 'My Wishlist - Fashion Market' }
    },
    {
      path: 'profile',
      name: 'FashionProfile',
      component: FashionProfile,
      meta: { title: 'My Profile - Fashion Market' }
    }
  ]
};
