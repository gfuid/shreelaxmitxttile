import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi, ordersApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Award, 
  Check, 
  MapPin, 
  Sparkles, 
  Share2, 
  Info,
  ChevronRight,
  MessageSquare,
  Camera,
  Image as ImageIcon,
  X,
  Lock,
  CheckCircle2,
  UploadCloud,
  Maximize2,
  FileText
} from 'lucide-react';
import QuickOrderModal from '../components/QuickOrderModal';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Delivery check state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Verified Purchase & Review state
  const [purchaseStatus, setPurchaseStatus] = useState('none'); // 'none' | 'delivered' | 'in_transit'
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [zoomPhoto, setZoomPhoto] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productsApi.getById(id);
        if (res.data) {
          setProduct(res.data);
          setSelectedImage(Array.isArray(res.data.images) && res.data.images.length > 0 ? res.data.images[0] : '');
          if (res.relatedProducts) setRelatedProducts(res.relatedProducts);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Check if current user has ordered this product and if it has been delivered
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!user) {
        setPurchaseStatus('none');
        return;
      }
      setCheckingPurchase(true);
      try {
        const ordersRes = await ordersApi.getMyOrders();
        const orders = ordersRes.data || [];
        
        let foundStatus = 'none';
        for (const o of orders) {
          const items = o.orderItems || o.items || [];
          const hasThisProduct = items.some(
            (it) => it.product === id || it.product?._id === id || it.title === product?.title
          );
          if (hasThisProduct) {
            if (o.orderStatus === 'Delivered') {
              foundStatus = 'delivered';
              break;
            } else if (foundStatus !== 'delivered' && o.orderStatus !== 'Cancelled') {
              foundStatus = 'in_transit';
            }
          }
        }
        setPurchaseStatus(foundStatus);
      } catch (err) {
        setPurchaseStatus('none');
      } finally {
        setCheckingPurchase(false);
      }
    };

    if (product) {
      checkPurchaseStatus();
    }
  }, [user, product, id]);

  if (loading) {
    return (
      <div className="min-h-screen container py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#700B1A] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-serif text-gray-700 text-sm">Unfolding Royal Saree Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen container py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary text-xs font-bold px-6 py-2.5 rounded-full">
          Return to Saree Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    setOrderModalOpen(true);
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus({
        available: true,
        message: 'Delivery available in 2-4 business days | Cash on Delivery available',
      });
    } else {
      setPincodeStatus({
        available: false,
        message: 'Please enter a valid 6-digit Indian PIN code',
      });
    }
  };

  const compressImageFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const elem = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = elem.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.onerror = () => resolve(null);
    });
  };

  // Image Upload handler for customer review
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (uploadedPhotos.length + files.length > 3) {
      alert('You can upload a maximum of 3 photos of your saree drape.');
      return;
    }

    for (const file of files) {
      const compressed = await compressImageFile(file);
      if (compressed) {
        setUploadedPhotos((prev) => [...prev, compressed]);
      }
    }
  };

  const handleRemoveUploadedPhoto = (index) => {
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      await productsApi.addReview(product._id, {
        name: user?.name || 'Verified Buyer',
        rating: reviewRating,
        comment: reviewComment.trim(),
        images: uploadedPhotos,
      });
      setReviewMessage('Thank you! Your verified review and drape photos have been published.');
      setReviewComment('');
      setUploadedPhotos([]);
      // Refresh product details
      const res = await productsApi.getById(id);
      if (res.data) setProduct(res.data);
    } catch (err) {
      setReviewMessage(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-6 pb-24 md:pb-12">
      <div className="container">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#700B1A]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-[#700B1A]">Sarees</Link>
          <ChevronRight size={12} />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#700B1A]">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Featured Photo */}
            <div className="relative aspect-[3/4] bg-white rounded-3xl overflow-hidden border border-[#E8E2D9] shadow-sm">
              <img
                src={selectedImage || product.images?.[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Silk Mark Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-amber-300 shadow-sm flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Award size={14} className="text-[#D97706]" />
                <span>100% Silk Mark Certified</span>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-transform hover:scale-110 ${
                  isWishlisted ? 'text-[#BE185D]' : 'text-gray-600 hover:text-[#BE185D]'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
              </button>

              {/* Silk Mark Quality Badge */}
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-amber-200 font-bold text-xs py-1.5 px-3.5 rounded-2xl shadow-lg border border-amber-400/40 flex items-center gap-2">
                <Award size={14} className="text-amber-400" />
                <span>100% Pure Silk Mark Certified</span>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img ? 'border-[#700B1A] ring-2 ring-[#700B1A]/20 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Saree Specifications & Purchase Options */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & SKU */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
                  {product.category}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500 font-mono">SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating Bar */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.ratings || 4.8) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-100'}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-800">{product.ratings || 4.8} / 5.0</span>
                <span className="text-gray-300">|</span>
                <a href="#reviews" className="text-xs text-[#700B1A] font-bold hover:underline">
                  {product.numReviews || 0} Verified Reviews
                </a>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#700B1A]">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                Inclusive of all GST taxes. Free Express Shipping across India.
              </p>
            </div>

            {/* Fabric & Weave Highlight Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D9] text-xs">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Fabric</span>
                <span className="font-bold text-gray-800">{product.fabric || 'Pure Silk'}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D9] text-xs">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Zari / Work</span>
                <span className="font-bold text-gray-800">{product.workType || 'Gold Zari'}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D9] text-xs">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Blouse Piece</span>
                <span className="font-bold text-[#700B1A]">{product.blouseIncluded ? 'Included (0.8m)' : 'No'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs text-gray-600 leading-relaxed bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E2D9]">
              {product.description}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn btn-secondary text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 border-[#700B1A] text-[#700B1A] hover:bg-[#700B1A] hover:text-white transition-all shadow-xs"
                >
                  <ShoppingBag size={16} />
                  <span>{addedToCart ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 btn btn-primary text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <Sparkles size={16} />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Direct Online Order / Query Form (FlowConnect CRM) */}
              <button
                type="button"
                onClick={() => setOrderModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF4EE] border border-[#E5DDD0] hover:border-[#4A0E17] text-[#4A0E17] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs group cursor-pointer"
              >
                <FileText size={15} className="text-[#BE185D] group-hover:scale-110 transition-transform" />
                <span>Direct Saree Inquiry / Quick Order</span>
              </button>

              {/* WhatsApp Live Video Consultation Banner */}
              <a
                href={`https://wa.me/919394512326?text=${encodeURIComponent(`Hello Sri Vijay Laxmi, I would like to see live video / photos of ${product.title} (₹${product.price})`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] hover:from-[#DCFCE7] hover:to-[#F0FDF4] border-2 border-emerald-500/40 hover:border-emerald-600 text-[#065F46] font-bold text-xs flex items-center justify-between transition-all shadow-sm group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-sm shrink-0">
                    <MessageSquare size={16} />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-black text-[#065F46]">
                      💬 Need Live Video Call or Photos on WhatsApp?
                    </span>
                    <span className="block text-[10px] text-gray-600 font-normal">
                      Chat with our Hyderabad showroom team directly
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#059669] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Chat Now →
                </span>
              </a>
            </div>

            {/* Pincode Delivery Check */}
            <div className="p-4 bg-white rounded-2xl border border-[#E8E2D9] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <Truck size={15} className="text-[#700B1A]" />
                <span>Check Express Courier Delivery</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code"
                  className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#700B1A]"
                />
                <button type="submit" className="btn btn-primary text-xs font-bold px-4 py-2 rounded-xl">
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className={`text-[11px] font-medium ${pincodeStatus.available ? 'text-emerald-700' : 'text-red-600'}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500 pt-2 border-t border-gray-200">
              <div className="p-2">
                <ShieldCheck size={18} className="text-[#D97706] mx-auto mb-1" />
                <span className="font-bold block text-gray-800">100% Authentic</span>
                <span>Direct Varanasi Handloom</span>
              </div>
              <div className="p-2">
                <RotateCcw size={18} className="text-[#D97706] mx-auto mb-1" />
                <span className="font-bold block text-gray-800">7-Day Easy Return</span>
                <span>Hassle-free pickups</span>
              </div>
              <div className="p-2">
                <Truck size={18} className="text-[#D97706] mx-auto mb-1" />
                <span className="font-bold block text-gray-800">Free Express</span>
                <span>Orders over ₹999</span>
              </div>
            </div>

          </div>

        </div>

        {/* Customer Reviews Section with Verified Purchase Restriction & Drape Photos */}
        <div id="reviews" className="bg-white rounded-3xl border border-[#E8E2D9] p-6 sm:p-8 shadow-sm mb-12 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
            <div>
              <span className="text-xs font-bold text-[#700B1A] uppercase tracking-wider block mb-1">
                Authentic Customer Feedback
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900">
                Customer Ratings & Saree Drape Reviews ({product.reviews?.length || 0})
              </h3>
            </div>

            <div className="flex items-center gap-3 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8E2D9]">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400" />
                ))}
              </div>
              <span className="text-base font-black text-gray-900">{product.ratings || 4.8} / 5.0</span>
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                100% Verified
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Reviews List with Drape Photos */}
            <div className="lg:col-span-7 space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#700B1A]/40 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#700B1A] to-[#B91C1C] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {(rev.name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-gray-900 block">{rev.name}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={11} /> Verified Buyer
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < (rev.rating || 5) ? 'fill-amber-400' : 'text-gray-200 fill-gray-100'}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed italic bg-white p-3 rounded-xl border border-gray-100">
                      "{rev.comment}"
                    </p>

                    {/* Customer Uploaded Drape Photos */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                          <Camera size={12} className="text-[#D97706]" />
                          <span>Customer Drape Photos ({rev.images.length})</span>
                        </span>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {rev.images.map((imgUrl, imgIdx) => (
                            <div
                              key={imgIdx}
                              onClick={() => setZoomPhoto(imgUrl)}
                              className="relative w-16 h-20 rounded-xl overflow-hidden border-2 border-amber-300/60 shadow-xs cursor-pointer group hover:scale-105 transition-transform"
                            >
                              <img src={imgUrl} alt="Customer Saree Drape" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Maximize2 size={14} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Store Manager Reply */}
                    {rev.reply && (
                      <div className="ml-4 pl-3.5 border-l-2 border-[#D97706] bg-[#FFFBEB] p-3 rounded-r-xl text-xs space-y-0.5">
                        <span className="font-bold text-[#92400E] text-[11px] block">
                          Sri Vijaylaxmi Official Reply:
                        </span>
                        <p className="text-gray-800 text-[11px]">{rev.reply}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-dashed border-gray-300">
                  <MessageSquare size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">
                    No customer reviews yet. Be the first verified buyer to share your drape photos!
                  </p>
                </div>
              )}
            </div>

            {/* Right: Verified Review & Drape Photo Upload Form */}
            <div className="lg:col-span-5">
              
              {!isAuthenticated ? (
                /* Unauthenticated Guard */
                <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E2D9] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-[#92400E] flex items-center justify-center mx-auto shadow-xs">
                    <Lock size={20} />
                  </div>
                  <h4 className="font-serif font-bold text-gray-900 text-base">
                    Verified Customer Reviews
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Please sign in with your account to share your star rating, review, and saree drape photos.
                  </p>
                  <Link
                    to={`/login?redirect=/product/${product._id}`}
                    className="btn btn-primary text-xs font-bold px-6 py-2.5 rounded-xl inline-block shadow-sm"
                  >
                    Sign In to Review Saree
                  </Link>
                </div>
              ) : purchaseStatus === 'in_transit' ? (
                /* Order Placed / In Transit Guard */
                <div className="bg-[#EFF6FF] p-6 rounded-3xl border border-blue-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-xs">
                    <Truck size={24} />
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-blue-200 text-blue-900 text-[10px] font-bold uppercase tracking-wider">
                    Order In Transit 🚚
                  </div>
                  <h4 className="font-serif font-bold text-gray-900 text-base">
                    Review Unlocks Upon Delivery
                  </h4>
                  <p className="text-xs text-blue-900/80 leading-relaxed">
                    Your saree order is on its way! Once the delivery partner delivers your parcel, you can share your star rating and saree drape photos here.
                  </p>
                  <Link
                    to="/orders"
                    className="btn btn-secondary text-xs font-bold px-6 py-2.5 rounded-xl border-blue-300 text-blue-900 bg-white hover:bg-blue-50 inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Track My Saree Order</span>
                  </Link>
                </div>
              ) : purchaseStatus === 'none' ? (
                /* Non-buyer restriction guard */
                <div className="bg-[#FFFBEB] p-6 rounded-3xl border border-amber-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mx-auto shadow-xs">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                    Verified Buyers Policy
                  </div>
                  <h4 className="font-serif font-bold text-gray-900 text-base">
                    Order this Saree to Leave a Review
                  </h4>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    To maintain 100% genuine ratings and authentic customer saree drape photos, reviews can only be submitted after purchasing and receiving this saree.
                  </p>
                  <button
                    onClick={handleBuyNow}
                    className="btn btn-primary text-xs font-bold px-6 py-2.5 rounded-xl shadow-md"
                  >
                    Order Now (₹{product.price?.toLocaleString('en-IN')})
                  </button>
                </div>
              ) : (
                /* Verified Buyer (Delivered) Review Form with Photo Upload */
                <div className="bg-[#FDF2F4] p-6 rounded-3xl border border-[#F43F5E]/30 space-y-4 shadow-sm">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1.5">
                      <CheckCircle2 size={13} className="text-emerald-700" />
                      <span>Verified Saree Purchaser</span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-gray-900">
                      Share Your Drape Review & Photos
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Hello <strong>{user?.name}</strong>! How was the fabric feel, drape, and zari shine?
                    </p>
                  </div>

                  {reviewMessage && (
                    <div className="p-3 text-xs bg-emerald-50 text-emerald-800 font-semibold rounded-xl border border-emerald-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>{reviewMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
                    
                    {/* Star Rating */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Your Saree Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 hover:scale-125 transition-transform"
                          >
                            <Star
                              size={22}
                              className={
                                star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                              }
                            />
                          </button>
                        ))}
                        <span className="ml-2 font-bold text-xs text-gray-700">
                          {reviewRating === 5 ? '⭐⭐⭐⭐⭐ Outstanding' :
                           reviewRating === 4 ? '⭐⭐⭐⭐ Great Quality' :
                           reviewRating === 3 ? '⭐⭐⭐ Average' : '⭐ Needs Improvement'}
                        </span>
                      </div>
                    </div>

                    {/* Photo Upload Box */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        Upload Drape Photos (Optional, Max 3)
                      </label>
                      
                      {/* Upload button area */}
                      <label className="border-2 border-dashed border-[#700B1A]/40 bg-white hover:bg-rose-50/50 p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
                        <UploadCloud size={20} className="text-[#700B1A]" />
                        <span className="text-xs font-bold text-[#700B1A]">Click to add saree photos</span>
                        <span className="text-[10px] text-gray-400">JPG, PNG from camera or gallery</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Photo Previews with Delete */}
                      {uploadedPhotos.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          {uploadedPhotos.map((photo, idx) => (
                            <div key={idx} className="relative w-14 h-16 rounded-xl overflow-hidden border border-gray-300 group shadow-xs">
                              <img src={photo} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveUploadedPhoto(idx)}
                                className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                                title="Remove Photo"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Written Feedback */}
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Your Detailed Experience</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell other saree lovers about fabric weight, softness, color in real sunlight, zari luster, and compliments received..."
                        className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#700B1A] text-xs"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="w-full btn btn-primary text-xs font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {reviewSubmitting ? (
                        <span>Publishing Verified Review...</span>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Publish Verified Review</span>
                        </>
                      )}
                    </button>

                  </form>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Related Products Carousel */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
              You May Also Adore
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* =========================================================================
          MOBILE STICKY BOTTOM CONVERSION BAR (Price + 1-Tap Order + WhatsApp)
          ========================================================================= */}
      {product && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D9] px-3.5 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex items-center justify-between gap-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300">
          
          {/* Left: Thumbnail & Price */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-11 h-12 rounded-lg overflow-hidden border border-[#E8E2D9] shrink-0 bg-gray-100 shadow-2xs">
              <img
                src={selectedImage || (product.images && product.images[0])}
                alt={product.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-bold text-gray-900 truncate leading-tight">
                {product.title}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-black text-[#700B1A]">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[10px] text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[9px] text-emerald-700 bg-emerald-50 font-bold px-1 rounded">
                  Free Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Right: WhatsApp + 1-Tap Order Now + Bag Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick WhatsApp Inquiry */}
            <a
              href={`https://wa.me/919394512326?text=${encodeURIComponent(`Namaste Sri Vijay Laxmi, I am interested in ${product.title} (₹${product.price}). Please share live video/photos.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#065F46] hover:text-white border border-[#25D366]/40 flex items-center justify-center transition-all shrink-0"
              title="Chat on WhatsApp"
            >
              <MessageSquare size={17} />
            </a>

            {/* 1-Tap Direct Order Form (Zero Login) */}
            <button
              type="button"
              onClick={() => setOrderModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#4A0E17] to-[#BE185D] hover:from-[#32070D] hover:to-[#9F1239] text-white text-xs font-bold shadow-md flex items-center gap-1.5 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Sparkles size={13} className="text-amber-300 shrink-0" />
              <span>Order Now</span>
            </button>

            {/* Quick Add to Bag */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                addedToCart
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[#FAF7F2] text-[#4A0E17] border-[#E8E2D9] hover:bg-[#4A0E17] hover:text-white'
              }`}
              title="Add to Bag"
            >
              {addedToCart ? <Check size={16} /> : <ShoppingBag size={16} />}
            </button>
          </div>

        </div>
      )}

      {/* Customer Photo Zoom Modal */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setZoomPhoto(null)}
        >
          <div className="relative max-w-lg w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <img src={zoomPhoto} alt="Customer Saree Drape Fullscreen" className="w-full max-h-[80vh] object-contain mx-auto" />
            <button
              onClick={() => setZoomPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-white hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-3 bg-black/90 text-center text-xs text-amber-300 font-semibold border-t border-gray-800">
              📸 Verified Customer Saree Drape Photo
            </div>
          </div>
        </div>
      )}

      {/* Quick Direct Order Modal (Zero Login Required) */}
      <QuickOrderModal
        product={product}
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />

    </div>
  );
};

export default ProductDetailPage;
