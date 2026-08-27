import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  MapPin, 
  Package, 
  Heart, 
  Trash2, 
  Plus, 
  Check, 
  Settings
} from 'lucide-react';

const AccountPage = () => {
  const { user, updateProfile, addAddress, deleteAddress } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ name, phone });
      setProfileMsg('Profile details updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (e) {
      setProfileMsg('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    await addAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({
      fullName: user?.name || '',
      phone: user?.phone || '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-16 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-[#E8E2D9] shadow-lg">
          <div className="w-16 h-16 rounded-full bg-[#FDF2F4] text-[#700B1A] flex items-center justify-center mx-auto mb-4">
            <User size={30} />
          </div>
          <h2 className="font-royal text-2xl font-bold text-gray-900 mb-2">Sign In to Your Account</h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Please sign in with your email and password to view and manage your profile details, past orders, and saved delivery addresses.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full bg-[#700B1A] hover:bg-[#580816] text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all text-center"
            >
              Sign In to Account
            </Link>
            <Link
              to="/register"
              className="block text-xs font-bold text-[#700B1A] hover:underline pt-1 text-center"
            >
              Don't have an account? Register Here
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8">
      <div className="container max-w-4xl">
        
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Account & Profile Settings
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage your personal details and delivery addresses</p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/orders" className="btn btn-secondary text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5">
              <Package size={14} />
              <span>My Orders</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left: Profile Information */}
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm">
            <h3 className="font-serif text-base font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4 flex items-center gap-2">
              <User size={18} className="text-[#700B1A]" />
              <span>Personal Information</span>
            </h3>

            {profileMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <Check size={14} />
                <span>{profileMsg}</span>
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div>
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'user@srivijaylaxmi.com'}
                  className="form-input text-xs bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="form-label">Mobile Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary text-xs font-bold py-2.5 px-5 rounded-lg"
              >
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Right: Saved Addresses Book */}
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-serif text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-[#700B1A]" />
                <span>Saved Addresses ({user?.addresses?.length || 1})</span>
              </h3>

              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-bold text-[#700B1A] hover:underline flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Address</span>
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {(user?.addresses || [
                {
                  _id: 'addr_1',
                  fullName: user?.name || 'Pooja Sharma',
                  phone: user?.phone || '+91 98112 34567',
                  street: 'Flat 402, Lotus Grandeur, Sector 62',
                  landmark: 'Opposite Cyber Park',
                  city: 'Noida',
                  state: 'Uttar Pradesh',
                  pincode: '201309',
                },
              ]).map((addr, i) => (
                <div key={addr._id || i} className="p-3.5 rounded-xl border border-gray-200 bg-[#FAF8F5] text-xs relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-gray-900 font-bold text-sm block">{addr.fullName}</strong>
                      <p className="text-gray-500">{addr.phone}</p>
                    </div>
                    {user?.addresses && user.addresses.length > 1 && (
                      <button
                        onClick={() => deleteAddress(addr._id)}
                        className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Address"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {addr.street} {addr.landmark && `(Near ${addr.landmark})`}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                  </p>
                </div>
              ))}
            </div>

            {/* Form */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="mt-4 pt-4 border-t border-gray-100 space-y-3 text-xs">
                <h4 className="font-bold text-gray-900 text-xs">Add New Delivery Location</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="form-input text-xs"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Street / Building"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="form-input text-xs"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="form-input text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="form-input text-xs"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="PIN Code"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="btn btn-secondary text-xs py-1.5 px-3"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary text-xs py-1.5 px-3 font-bold">
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AccountPage;
