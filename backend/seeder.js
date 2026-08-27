import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Coupon from './models/Coupon.js';
import Banner from './models/Banner.js';
import connectDB from './config/db.js';
import { getParsedProducts } from './data/productsCatalog.js';

dotenv.config();

const categoriesData = [
  {
    name: 'Designer Pattu Gadwal',
    slug: 'designer-pattu-gadwal',
    description: 'Heritage Gadwal silk sarees with pure zari borders, contrast pallu and timeless handloom artistry.',
    image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg',
    displayOrder: 1,
  },
  {
    name: 'Dharmavaram Pattu',
    slug: 'dharmavaram-pattu',
    description: 'Auspicious grand Dharmavaram bridal silk sarees with heavy gold zari borders and temple motifs.',
    image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OQr5R5elEx3F9ZTcwJ0.jpg',
    displayOrder: 2,
  },
  {
    name: 'Banaras Wed Cream',
    slug: 'banaras-wed-cream',
    description: 'Opulent Banarasi wedding cream and gold silk sarees handwoven for brides and auspicious ceremonies.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    displayOrder: 3,
  },
  {
    name: 'COTTON NARAYANPET',
    slug: 'cotton-narayanpet',
    description: 'Authentic Narayanpet handloom cotton sarees with traditional buta, checks, and vibrant contrast borders.',
    image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-Oxz1jj4Yca3qLJ0MJW3.jpg',
    displayOrder: 4,
  },
  {
    name: 'Fancy Ghagara',
    slug: 'fancy-ghagara',
    description: 'Glamorous festive partywear & big size ghagaras with flared resham embroidery and zari borders.',
    image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-Olv0mNDF0bIMMRKjEPG.jpg',
    displayOrder: 5,
  },
  {
    name: 'Baby Ghagara',
    slug: 'baby-ghagara',
    description: 'Adorable kids & baby festive ghagara cholis with pure soft resham flares and rich borders.',
    image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-Olv3N1RcUGDBn_byQm7.jpg',
    displayOrder: 6,
  },
  {
    name: 'Wedding Ghagara',
    slug: 'wedding-ghagara',
    description: 'Stunning bridal and festive wedding ghagaras, lehenga cholis with heavy resham embroidery and zari flares.',
    image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OVr8xe0qy6e5m-oTGDt.jpg',
    displayOrder: 7,
  },
  {
    name: 'Surat Pouch',
    slug: 'surat-pouch',
    description: 'Comfortable everyday and gifting soft silk sarees in luxury pouch packing with traditional motifs.',
    image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-Ox5SbJ78Va4rRaIz45u.jpg',
    displayOrder: 8,
  },
  {
    name: 'Surat Printed',
    slug: 'surat-printed',
    description: 'Lightweight digital printed floral georgette, chiffon, and Kasturi crepe sarees for daily elegance.',
    image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OUEaRa2W-YKrUNH1FUB.jpg',
    displayOrder: 9,
  },
  {
    name: 'Surat Pattu',
    slug: 'surat-pattu',
    description: 'Rich lustrous Surat Pattu silk sarees with golden zari weaving and festive dual-tone borders.',
    image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OZDgVsJRcjIBxHcybqq.jpg',
    displayOrder: 10,
  },
  {
    name: 'Single Colour Offer',
    slug: 'single-colour-offer',
    description: 'Exclusive manufacturer wholesale single color specials on pure Dharmavaram silk sarees.',
    image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OdsOBarhJkNk_LvqNyC.jpg',
    displayOrder: 11,
  },
];

const bannersData = [
  {
    title: 'Designer Pattu Gadwal & Dharmavaram',
    subtitle: 'Direct Silk Mark Certified Manufacturer Weaves from Hyderabad',
    badgeText: 'FESTIVE WEDDING COLLECTION 2026',
    discountText: 'DIRECT WHOLESALE PRICES',
    image: 'https://do9uy4stciz2v.cloudfront.net/-NXLNLGNrL_A2urc7cXg/products/-OdarSY_BnF4pM-wXkgc.jpg',
    link: '/shop?category=Designer+Pattu+Gadwal',
    category: 'Designer Pattu Gadwal',
    bgGradient: 'linear-gradient(135deg, #580816 0%, #1A0005 100%)',
    displayOrder: 1,
    isActive: true,
  },
  {
    title: 'Banaras Wed Cream & Fancy Ghagaras',
    subtitle: 'Opulent Gold Zari Borders & Auspicious Heritage Drapes',
    badgeText: 'BRIDAL EXCLUSIVE',
    discountText: 'FLAT 40% OFF',
    image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-OVr8xe0qy6e5m-oTGDt.jpg',
    link: '/shop?category=Wedding+Ghagara',
    category: 'Wedding Ghagara',
    bgGradient: 'linear-gradient(135deg, #1C1917 0%, #451A03 100%)',
    displayOrder: 2,
    isActive: true,
  },
  {
    title: 'Cotton Narayanpet & Surat Pouch Sarees',
    subtitle: 'Authentic Handloom Buta, Checks & Featherlight Partywear',
    badgeText: 'DAILY ELEGANCE',
    discountText: 'STARTING AT ₹260',
    image: 'https://cdn.quicksell.co/-NXLNLGNrL_A2urc7cXg/products_400/-Ox5SbJ78Va4rRaIz45u.jpg',
    link: '/shop?category=Surat+Pouch',
    category: 'Surat Pouch',
    bgGradient: 'linear-gradient(135deg, #022C22 0%, #064E3B 100%)',
    displayOrder: 3,
    isActive: true,
  },
];

const couponsData = [
  {
    code: 'WELCOME10',
    description: '10% instant discount for new customers on all sarees',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 999,
    maxDiscount: 1000,
    expiryDate: new Date('2027-12-31'),
    isActive: true,
    usedCount: 14,
    usageLimit: 1000,
  },
  {
    code: 'FESTIVE500',
    description: 'Flat ₹500 off on festive and bridal purchases over ₹2,999',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 2999,
    maxDiscount: 500,
    expiryDate: new Date('2027-12-31'),
    isActive: true,
    usedCount: 8,
    usageLimit: 500,
  },
  {
    code: 'ROYAL15',
    description: '15% off on pure Dharmavaram & Gadwal silk collection',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 4999,
    maxDiscount: 2000,
    expiryDate: new Date('2027-12-31'),
    isActive: true,
    usedCount: 5,
    usageLimit: 200,
  },
];

const importData = async () => {
  try {
    await connectDB();

    const existingOrders = await Order.find().lean();
    console.log(`Found ${existingOrders.length} existing orders to preserve...`);

    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();
    await Banner.deleteMany();

    console.log('Previous Data Cleared...');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Mohan Kumar Agrawal (Admin)',
      email: 'srivijaylaxmitextiles@gmail.com',
      password: 'password123',
      role: 'admin',
      phone: '+919394512326',
    });

    const sampleCustomer = await User.create({
      name: 'Sagar Punia',
      email: 'sagarpunia163@gmail.com',
      password: 'password123',
      role: 'customer',
      phone: '+919876543210',
    });

    console.log('Admin & Customer Users Created...');

    // 2. Create Categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`${createdCategories.length} Categories Created...`);

    // 3. Load and Seed Real Categorized Products from backend/data/*.json
    const parsedProducts = getParsedProducts();
    const productsToInsert = parsedProducts.map((prod) => ({
      ...prod,
      user: adminUser._id,
    }));

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`✅ ${createdProducts.length} Real Catalog Products Seeded across all 11 Categories!`);

    // Update Category Item Counts
    for (const cat of createdCategories) {
      const count = await Product.countDocuments({ category: cat.name });
      cat.itemCount = count;
      await cat.save();
    }

    // 4. Create Coupons
    await Coupon.insertMany(couponsData);
    console.log('Coupons Created...');

    // 5. Create Banners
    await Banner.insertMany(bannersData);
    console.log('Banners Created...');

    console.log('🎉 DATA IMPORT SUCCESSFUL FOR SRI VIJAY LAXMI TEXTILES (INDIA) P LTD!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
