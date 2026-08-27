import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categoryConfig = {
  // 1. Dharmavaram Pattu
  'dharmavaram_pattu_kuttu_products.json': {
    category: 'Dharmavaram Pattu',
    subCategory: 'Dharmavaram Kuttu Special Silk Saree',
    fabric: 'Pure Dharmavaram Silk',
    occasion: 'Bridal & Wedding',
    defaultPrice: 1500,
    colors: ['Peacock Blue', 'Deep Maroon', 'Royal Magenta', 'Crimson Red', 'Mustard Gold', 'Teal Green']
  },
  // 2. Banaras Wed Cream
  'banaras_wedding_cream_products.json': {
    category: 'Banaras Wed Cream',
    subCategory: 'Banarasi Wedding Cream Silk Saree',
    fabric: 'Banarasi Katan Silk',
    occasion: 'Bridal & Wedding',
    defaultPrice: 1110,
    colors: ['Cream & Gold', 'Golden Beige', 'Ivory Pearl', 'Cream & Crimson Zari', 'Off-White Brocade']
  },
  // 3. Fancy Ghagara (Vol 1 & Vol 2)
  'fancy_ghagara_vol1_products.json': {
    category: 'Fancy Ghagara',
    subCategory: 'Big Ghagara 1100 Vol 1',
    fabric: 'Heavy Resham Silk Georgette',
    occasion: 'Party & Reception',
    defaultPrice: 999,
    colors: ['Deep Wine', 'Royal Blue', 'Emerald Green', 'Maroon Red', 'Navy Blue', 'Magenta Purple']
  },
  'fancy_ghagara_vol2_products.json': {
    category: 'Fancy Ghagara',
    subCategory: 'Big Size Ghagara Vol 2',
    fabric: 'Heavy Resham Silk Georgette',
    occasion: 'Party & Reception',
    defaultPrice: 999,
    colors: ['Crimson Red', 'Peacock Green', 'Royal Violet', 'Sunset Orange', 'Maroon Gold']
  },
  // 4. Baby Ghagara
  'baby_ghagara_products.json': {
    category: 'Baby Ghagara',
    subCategory: 'Baby Ghagara Kids Festive Flare',
    fabric: 'Resham Silk & Velvet Flare',
    occasion: 'Festive & Puja',
    defaultPrice: 699,
    colors: ['Rani Pink', 'Sunset Yellow', 'Crimson Red', 'Peacock Blue', 'Emerald Green', 'Golden Mustard']
  },
  // 5. Wedding Ghagara
  'wedding_bridal_ghagara_products.json': {
    category: 'Wedding Ghagara',
    subCategory: 'Big Ghagara RR Special Designer Bridal',
    fabric: 'Heavy Resham Zari & Velvet',
    occasion: 'Bridal & Wedding',
    defaultPrice: 1775,
    colors: ['Bridal Crimson', 'Royal Maroon', 'Peacock Royal', 'Deep Wine', 'Ruby Red']
  },
  // 6. Surat Pouch
  'surat_pouch_products.json': {
    category: 'Surat Pouch',
    subCategory: 'Surat Pouch Handloom Saree',
    fabric: 'Surat Soft Silk Blend',
    occasion: 'Casual & Daily',
    defaultPrice: 425,
    colors: ['Pastel Pink', 'Sky Blue', 'Mint Green', 'Lemon Yellow', 'Peach Coral']
  },
  'surat_pouch_vol2_products.json': {
    category: 'Surat Pouch',
    subCategory: 'Surat Pouch Floral Saree Vol 2',
    fabric: 'Surat Soft Silk Blend',
    occasion: 'Casual & Daily',
    defaultPrice: 425,
    colors: ['Lavender Purple', 'Sea Green', 'Dusty Rose', 'Golden Mustard', 'Steel Blue']
  },
  // 7. Surat Printed
  'surat_printed_products.json': {
    category: 'Surat Printed',
    subCategory: 'Surat Kasturi Printed Saree',
    fabric: 'Pure Georgette & Crepe',
    occasion: 'Casual & Daily',
    defaultPrice: 260,
    colors: ['Multi Floral', 'Beige Floral', 'Navy Digital', 'Teal Abstract', 'Rose Pink']
  },
  // 8. Surat Pattu
  'surat_pattu_products.json': {
    category: 'Surat Pattu',
    subCategory: 'Surat Pattu Silk Saree',
    fabric: 'Surat Pattu Silk',
    occasion: 'Festive & Puja',
    defaultPrice: 735,
    colors: ['Turquoise Blue', 'Magenta Pink', 'Crimson Red', 'Olive Green', 'Royal Blue']
  },
  // 9. Single Colour Offer
  'single_color_offer_dharmavaram_products.json': {
    category: 'Single Colour Offer',
    subCategory: 'Original Pattu Dharmavaram Kuttu Wholesale',
    fabric: 'Pure Dharmavaram Silk',
    occasion: 'Festive & Wedding',
    defaultPrice: 1500,
    colors: ['Rani Pink', 'Peacock Blue', 'Deep Maroon', 'Bottle Green', 'Mustard Yellow']
  },
  // 10. Designer Pattu Gadwal
  'designer_pattu_gadwal_products.json': {
    category: 'Designer Pattu Gadwal',
    subCategory: 'Gadwal Pattu Silk Saree',
    fabric: 'Pure Gadwal Silk',
    occasion: 'Bridal & Wedding',
    defaultPrice: 4850,
    colors: ['Crimson Red & Mustard', 'Peacock Blue & Gold', 'Emerald Green & Maroon', 'Royal Magenta & Purple', 'Sunset Orange & Pink', 'Deep Maroon & Zari', 'Off-White & Red Border', 'Turquoise & Copper Zari', 'Bottle Green & Pink', 'Wine Violet & Gold']
  },
  // 11. Cotton Narayanpet
  'cotton_narayanpet_products.json': {
    category: 'COTTON NARAYANPET',
    subCategory: 'Narayanpet Handloom Cotton Saree',
    fabric: 'Pure Handloom Cotton',
    occasion: 'Festive & Puja',
    defaultPrice: 890,
    colors: ['Mustard Yellow & Maroon', 'Forest Green & Red', 'Navy Blue & Orange', 'Rani Pink & Parrot Green', 'Earth Brown & Gold', 'Violet & Lemon Yellow', 'Teal Blue & Crimson', 'Maroon & Mustard Check']
  }
};

export const getParsedProducts = () => {
  const allExtractedProducts = [];
  const files = Object.keys(categoryConfig);
  let skuCounter = 1001;

  for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;

    const config = categoryConfig[file];
    const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const validItems = rawData.filter(
      (p) =>
        p.title !== 'My Account' &&
        p.title !== 'powered by' &&
        p.image_url &&
        !p.image_url.includes('powered_by') &&
        !p.image_url.includes('close-black')
    );

    validItems.forEach((item, index) => {
      let price = config.defaultPrice;
      if (item.price && item.price !== 'N/A') {
        const parsed = parseInt(String(item.price).replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) {
          price = parsed;
        }
      }

      const originalPrice = Math.round(price * 1.35); // 35% discount margin
      const color = config.colors[index % config.colors.length];
      const baseTitle =
        item.title && item.title !== 'Sri Vijay Laxmi Textiles (India) P Ltd'
          ? item.title
          : config.subCategory;
      const cleanTitle = baseTitle.includes(color) ? baseTitle : `${baseTitle} - ${color}`;

      const slug = `${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${skuCounter}`;

      allExtractedProducts.push({
        title: cleanTitle,
        slug,
        sku: `SVL-${skuCounter++}`,
        category: config.category,
        fabric: config.fabric,
        occasion: config.occasion,
        color,
        price,
        originalPrice,
        discountPercent: Math.round(((originalPrice - price) / originalPrice) * 100),
        images: [item.image_url],
        description: `Exquisite ${cleanTitle} crafted with heritage handloom artistry by Sri Vijay Laxmi Textiles. Perfect for ${config.occasion.toLowerCase()}, featuring premium ${config.fabric} with shimmering finish, soft drape, and traditional zari borders.`,
        stock: 25,
        ratings: +(4.7 + ((index % 3) * 0.1)).toFixed(1),
        numReviews: 12 + (index * 3),
        isFeatured: index < 2,
        isBestSeller: index === 0,
        tags: [config.category, config.fabric, config.occasion, color, 'Handloom', 'Silk Mark'],
        sourceUrl: item.url || '',
      });
    });
  }

  return allExtractedProducts;
};

export default getParsedProducts;
