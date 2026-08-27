import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extraCategories = {
  'designer_pattu_gadwal_products.json': {
    category: 'Designer Pattu Gadwal',
    subCategory: 'Gadwal Pattu Silk Saree',
    fabric: 'Pure Gadwal Silk',
    occasion: 'Bridal & Wedding',
    defaultPrice: 4850,
    images: [
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OQr5R5elEx3F9ZTcwJ0.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OxVQ3YVjPjgkTg5w3lx.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OPu9UyO-V5FlFxqh-xA.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Odax93M6rmDkTLwpId_.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OfaasJRnw-y8oD1OD-V.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OZ8ZfNqFsPIa2dd7F1_.jpg'
    ],
    colors: ['Crimson Red & Mustard', 'Peacock Blue & Gold', 'Emerald Green & Maroon', 'Royal Magenta & Purple', 'Sunset Orange & Pink', 'Deep Maroon & Zari', 'Off-White & Red Border', 'Turquoise & Copper Zari', 'Bottle Green & Pink', 'Wine Violet & Gold']
  },
  'cotton_narayanpet_products.json': {
    category: 'COTTON NARAYANPET',
    subCategory: 'Narayanpet Handloom Cotton Saree',
    fabric: 'Pure Handloom Cotton',
    occasion: 'Festive & Puja',
    defaultPrice: 890,
    images: [
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Oxz1jj4Yca3qLJ0MJW3.jpg',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OxVQ3YVjPjgkTg5w3lx.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OPu9UyO-V5FlFxqh-xA.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OfaasJRnw-y8oD1OD-V.jpg'
    ],
    colors: ['Mustard Yellow & Maroon', 'Forest Green & Red', 'Navy Blue & Orange', 'Rani Pink & Parrot Green', 'Earth Brown & Gold', 'Violet & Lemon Yellow', 'Teal Blue & Crimson', 'Maroon & Mustard Check']
  },
  'mau_rich_pallu_products.json': {
    category: 'Mau Rich pallu',
    subCategory: 'Mau Festive Rich Pallu Saree',
    fabric: 'Mau Rich Silk Blend',
    occasion: 'Festive & Party',
    defaultPrice: 1250,
    images: [
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OxVQ3YVjPjgkTg5w3lx.jpg',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OPu9UyO-V5FlFxqh-xA.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Odax93M6rmDkTLwpId_.jpg'
    ],
    colors: ['Deep Wine & Brocade Pallu', 'Royal Emerald & Gold', 'Imperial Blue & Silver', 'Sunset Crimson & Zari', 'Plum Violet & Copper', 'Magenta & Gold Buta']
  },
  'mau_venkatgiri_buta_products.json': {
    category: 'Mau Venkatgiri buta',
    subCategory: 'Mau Venkatgiri All-Over Buta Saree',
    fabric: 'Mau Venkatagiri Silk',
    occasion: 'Festive & Party',
    defaultPrice: 1180,
    images: [
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OPu9UyO-V5FlFxqh-xA.jpg',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OxVQ3YVjPjgkTg5w3lx.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Odax93M6rmDkTLwpId_.jpg'
    ],
    colors: ['Peacock Green & Coin Buta', 'Magenta Pink & Zari Buti', 'Sapphire Blue & Silver', 'Scarlet Red & Temple', 'Turquoise & Gold Motif', 'Maroon & Floral Buta']
  },
  'mau_pattu_buti_products.json': {
    category: 'MAU PATTU BUTI',
    subCategory: 'Mau Pattu Traditional Buti Saree',
    fabric: 'Mau Pattu Silk',
    occasion: 'Festive & Wedding',
    defaultPrice: 1350,
    images: [
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Odax93M6rmDkTLwpId_.jpg',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OfaasJRnw-y8oD1OD-V.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OZ8ZfNqFsPIa2dd7F1_.jpg'
    ],
    colors: ['Crimson Red & Mango Buti', 'Deep Navy & Golden Grid', 'Emerald Green & Copper', 'Royal Maroon & Peacocks', 'Dark Wine & Silver Bloom', 'Rani Pink & Gold Border']
  },
  'tranding_sarees_products.json': {
    category: 'Tranding Sarees',
    subCategory: 'Bollywood Viral Trending Partywear',
    fabric: 'Organza & Shimmer Georgette',
    occasion: 'Party & Reception',
    defaultPrice: 1450,
    images: [
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OZ8ZfNqFsPIa2dd7F1_.jpg',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OfaasJRnw-y8oD1OD-V.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Odax93M6rmDkTLwpId_.jpg'
    ],
    colors: ['Sequin Lavender', 'Rose Gold Shimmer', 'Midnight Emerald', 'Champagne Pearl', 'Ruby Wine Glitter', 'Metallic Teal']
  },
  'mau_md_3535_products.json': {
    category: 'Mau MD 3535',
    subCategory: 'Mau MD 3535 Precision Series',
    fabric: 'Mau MD Silk Weave',
    occasion: 'Festive & Daily',
    defaultPrice: 850,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg'
    ],
    colors: ['Dual-Tone Green & Teal', 'Maroon & Copper Sheen', 'Royal Blue & Mustard', 'Wine & Golden Warp']
  },
  'mau_buti_3636_products.json': {
    category: 'Mau Buti 3636',
    subCategory: 'Mau Buti 3636 Compact Series',
    fabric: 'Mau Buti Silk',
    occasion: 'Festive & Puja',
    defaultPrice: 890,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OPu9UyO-V5FlFxqh-xA.jpg',
      'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Odax93M6rmDkTLwpId_.jpg'
    ],
    colors: ['Compact Gold Buti Crimson', 'Peacock Blue & Silver Grid', 'Emerald Green & Gold', 'Plum & Fine Buta']
  }
};

for (const [fileName, cfg] of Object.entries(extraCategories)) {
  const filePath = path.join(__dirname, fileName);
  const items = [];
  
  const count = cfg.images.length;
  for (let i = 0; i < count; i++) {
    const color = cfg.colors[i % cfg.colors.length];
    items.push({
      category: cfg.category,
      title: `${cfg.subCategory} - ${color}`,
      price: `₹${cfg.defaultPrice}`,
      status: 'In Stock',
      image_url: cfg.images[i],
      url: `https://srivijaylaxmitextile.catalog.to/s/gallery/sri-vijay-laxmi-textiles-india----p-ltd/${cfg.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/product/${i + 1}`
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
  console.log('✅ Generated category file:', fileName, 'with', items.length, 'products');
}
