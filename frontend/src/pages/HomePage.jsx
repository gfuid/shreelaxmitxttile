import React, { useState, useEffect } from 'react';
import { productsApi } from '../services/api';
import HeroArches from '../components/HeroArches';
import TrustPerksBar from '../components/TrustPerksBar';
import MarqueeRibbon from '../components/MarqueeRibbon';
import FeaturedCollections from '../components/FeaturedCollections';
import OccasionShowcase from '../components/OccasionShowcase';
import CategoryGrid from '../components/CategoryGrid';
import DualPromoBanner from '../components/DualPromoBanner';
import FlashDeals from '../components/FlashDeals';
import ArtisanCraftJourney from '../components/ArtisanCraftJourney';
import CustomerReviewsSection from '../components/CustomerReviewsSection';
import SareeKnowledgeHub from '../components/SareeKnowledgeHub';
import VideoShoppingBanner from '../components/VideoShoppingBanner';
import HomeOrderQuerySection from '../components/HomeOrderQuerySection';
import HeritageSection from '../components/HeritageSection';
import QuickViewModal from '../components/QuickViewModal';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsApi.getAll();
        if (res.data) setProducts(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      {/* 1. Hero 4 Mughal Scalloped Arch Windows matching image.png */}
      <HeroArches />

      {/* 2. Trust & Value Propositions Bar */}
      <TrustPerksBar />

      {/* 2.5 Infinite Moving Wholesale & Trust Marquee Ribbon */}
      <MarqueeRibbon />

      {/* 3. Featured Collections 5-Column Grid with Price Pills matching image.png */}
      <FeaturedCollections
        products={products}
        loading={loading}
        onQuickView={setQuickViewProduct}
      />

      {/* 4. Shop by Occasion & Wedding Trousseau */}
      <OccasionShowcase />

      {/* 5. Signature Saree Weave Categories Circles */}
      <CategoryGrid />

      {/* 6. Dual Editorial Banners: Banarasi vs Kanjivaram Grandeur */}
      <DualPromoBanner />

      {/* 7. Deals of the Day Flash Sale */}
      <FlashDeals
        products={products}
        onQuickView={setQuickViewProduct}
      />

      {/* 8. Artisan Craft Journey: From Loom to Luxury */}
      <ArtisanCraftJourney />

      {/* 9. Real Brides & Connoisseur Reviews */}
      <CustomerReviewsSection />

      {/* 10. The Saree Connoisseur Knowledge & Care Hub */}
      <SareeKnowledgeHub />

      {/* 11. Virtual Video Shopping Consultation Banner */}
      <VideoShoppingBanner />

      {/* 12. Direct Manufacturer Order & Custom Saree Query Form (FlowConnect CRM Embed) */}
      <HomeOrderQuerySection />

      {/* 13. Editorial About Us & VIP Club Newsletter matching image.png */}
      <HeritageSection />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
