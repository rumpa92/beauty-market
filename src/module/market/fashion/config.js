export const fashionMarketConfig = {
  marketId: 'fashion',
  marketName: 'Fashion Market',
  theme: {
    primary: '#1a1a1a',
    secondary: '#f5f5f5',
    accent: '#c9a876',
    surface: '#ffffff',
    text: '#333333',
    textLight: '#666666',
    border: '#e0e0e0',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
    accentGradient: 'linear-gradient(135deg, #c9a876 0%, #d4b896 100%)'
  },
  categories: [
    { id: 'women', name: "Women's Fashion", icon: 'fas fa-female' },
    { id: 'men', name: "Men's Fashion", icon: 'fas fa-male' },
    { id: 'shoes', name: 'Shoes & Footwear', icon: 'fas fa-shoe-prints' },
    { id: 'accessories', name: 'Accessories', icon: 'fas fa-gems' },
    { id: 'bags', name: 'Bags & Luggage', icon: 'fas fa-shopping-bag' },
    { id: 'jewelry', name: 'Jewelry & Watches', icon: 'fas fa-ring' },
    { id: 'activewear', name: 'Activewear', icon: 'fas fa-running' },
    { id: 'luxury', name: 'Luxury Fashion', icon: 'fas fa-crown' }
  ],
  filters: {
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'],
    color: ['Black', 'White', 'Gray', 'Navy', 'Brown', 'Red', 'Blue', 'Green', 'Pink', 'Purple', 'Yellow', 'Orange'],
    brand: ['Zara', 'H&M', 'Nike', 'Adidas', 'Gucci', 'Prada', 'Louis Vuitton', 'Versace', 'Armani', 'Calvin Klein'],
    priceRange: [
      { label: 'Under $25', min: 0, max: 25 },
      { label: '$25 - $50', min: 25, max: 50 },
      { label: '$50 - $100', min: 50, max: 100 },
      { label: '$100 - $200', min: 100, max: 200 },
      { label: '$200 - $500', min: 200, max: 500 },
      { label: 'Over $500', min: 500, max: 10000 }
    ],
    occasion: ['Casual', 'Formal', 'Party', 'Work', 'Sport', 'Wedding', 'Travel', 'Beach'],
    material: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Leather', 'Denim', 'Linen', 'Cashmere', 'Synthetic']
  },
  searchSuggestions: [
    'Black Dress', 'Leather Jacket', 'Sneakers', 'Jeans', 'T-Shirt',
    'Handbag', 'Watch', 'Sunglasses', 'Boots', 'Blazer',
    'Summer Collection', 'Winter Collection', 'Designer Bags', 'Sport Shoes'
  ],
  campaigns: [
    {
      id: 'summer-fashion',
      title: 'Summer Fashion Sale',
      subtitle: 'Up to 70% off on trendy summer wear',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      cta: 'Shop Summer Sale'
    },
    {
      id: 'new-arrivals',
      title: 'New Arrivals',
      subtitle: 'Fresh styles just landed',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
      cta: 'Explore New'
    },
    {
      id: 'luxury-collection',
      title: 'Luxury Collection',
      subtitle: 'Premium designer fashion',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
      cta: 'Shop Luxury'
    }
  ],
  voiceCommands: [
    'Show me black dresses',
    'Find Nike shoes',
    'Search for leather jackets',
    'Show new arrivals',
    'Filter by size medium'
  ]
};
