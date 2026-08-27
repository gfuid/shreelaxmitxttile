import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { productsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist, wishlistCount } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const res = await productsApi.getAll();
        if (res.data) {
          const filtered = res.data.filter((p) => wishlist.includes(p._id));
          setProducts(filtered);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistProducts();
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8">
      <div className="container">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              My Saved Sarees & Wishlist
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{wishlistCount} sarees in your wishlist</p>
          </div>

          <Link to="/shop" className="text-xs font-bold text-[#700B1A] hover:underline flex items-center gap-1">
            <span>Explore More Weaves</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E2D9] p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-[#BE185D] flex items-center justify-center text-3xl mx-auto mb-3">
              ❤️
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h3>
            <p className="text-xs text-gray-500 mb-6">
              Save your favorite wedding silks and party wear sarees by clicking the heart icon on any product.
            </p>
            <Link to="/shop" className="btn btn-primary text-xs font-bold px-6 py-2.5 rounded-full">
              Discover Handcrafted Sarees
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

        {/* Quick View Modal */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
