import React, { useState, useMemo } from 'react';
import { X, PlusCircle, Upload, Trash2, CheckCircle2, ShieldAlert, MapPin } from 'lucide-react';
import {
  Category,
  City,
  Condition,
  UserProfile,
  Listing,
  SiteSettings,
  District,
  Tehsil,
  AreaLocation,
} from '../types';
import { INITIAL_DISTRICTS, INITIAL_TEHSILS, INITIAL_AREAS } from '../data/locationData';
import { api } from '../services/api';

interface PostAdModalProps {
  currentUser: UserProfile;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitAd: (adData: Omit<Listing, 'id' | 'views' | 'createdAt'>) => void;
  onOpenActivation: () => void;
  settings?: SiteSettings;
  districts?: District[];
  tehsils?: Tehsil[];
  areas?: AreaLocation[];
}

export const PostAdModal: React.FC<PostAdModalProps> = ({
  currentUser,
  categories,
  isOpen,
  onClose,
  onSubmitAd,
  onOpenActivation,
  settings,
  districts = INITIAL_DISTRICTS,
  tehsils = INITIAL_TEHSILS,
  areas = INITIAL_AREAS,
}) => {
  const maxImages = settings?.maxImagesPerListing || 3;
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<Condition>('Used');

  // Location Hierarchy State: District -> Tehsil -> Area
  // Find initial district (default to Sargodha id: 1)
  const initialDistrictId = useMemo(() => {
    const match = districts.find((d) => d.name.toLowerCase() === currentUser.city.toLowerCase());
    return match ? match.id : 1;
  }, [districts, currentUser.city]);

  const [districtId, setDistrictId] = useState<number>(initialDistrictId);

  // Available Tehsils for selected District
  const availableTehsils = useMemo(() => {
    return tehsils.filter((t) => t.districtId === districtId && t.isActive);
  }, [tehsils, districtId]);

  const [tehsilId, setTehsilId] = useState<number>(() => {
    return availableTehsils[0]?.id || 1;
  });

  // Available Areas for selected Tehsil
  const availableAreas = useMemo(() => {
    return areas.filter((a) => a.tehsilId === tehsilId && a.isActive);
  }, [areas, tehsilId]);

  const [area, setArea] = useState(currentUser.area || '');
  const [exactLocation, setExactLocation] = useState('');
  const [phone, setPhone] = useState(currentUser.mobile || '');
  const [whatsapp, setWhatsapp] = useState(currentUser.mobile || '');
  const [sellerWhatsappGroup, setSellerWhatsappGroup] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Dedicated Clothing Selling Fields
  const [clothingSizes, setClothingSizes] = useState<string[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [clothingColors, setClothingColors] = useState<string[]>([]);
  const [customColorInput, setCustomColorInput] = useState('');
  const [clothingVarieties, setClothingVarieties] = useState('');
  const [clothingStock, setClothingStock] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [isWholesaleAvailable, setIsWholesaleAvailable] = useState(false);
  const [minWholesaleQty, setMinWholesaleQty] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState('');

  const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Unstitched (4.5m)', 'Free Size'];
  const POPULAR_COLORS = ['Black', 'White', 'Off-White', 'Navy Blue', 'Maroon', 'Sky Blue', 'Olive Green', 'Grey', 'Multicolor'];

  const toggleSize = (sz: string) => {
    setClothingSizes((prev) => (prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]));
  };

  const toggleColor = (col: string) => {
    setClothingColors((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]));
  };

  const addCustomSize = () => {
    if (customSizeInput.trim() && !clothingSizes.includes(customSizeInput.trim())) {
      setClothingSizes([...clothingSizes, customSizeInput.trim()]);
      setCustomSizeInput('');
    }
  };

  const addCustomColor = () => {
    if (customColorInput.trim() && !clothingColors.includes(customColorInput.trim())) {
      setClothingColors([...clothingColors, customColorInput.trim()]);
      setCustomColorInput('');
    }
  };

  // Handle District Change
  const handleDistrictChange = (newDistId: number) => {
    setDistrictId(newDistId);
    const related = tehsils.filter((t) => t.districtId === newDistId && t.isActive);
    if (related.length > 0) {
      setTehsilId(related[0].id);
    }
  };

  if (!isOpen) return null;

  // If user is not activated yet, show activation notice
  if (currentUser.activationStatus !== 'active') {
    const feeFormatted = `Rs. ${(settings?.activationFee || 1000).toLocaleString()}`;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-white border border-amber-200 rounded-3xl p-6 text-center shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Lifetime Activation Required</h3>
          <p className="text-slate-600 text-xs mb-6 font-medium">
            To prevent spam and maintain a clean local community, sellers pay a one-time <strong className="text-cyan-700">{feeFormatted} lifetime fee</strong> and follow our official WhatsApp channel. Once active, post unlimited ads directly for life!
          </p>
          <button
            onClick={() => {
              onClose();
              onOpenActivation();
            }}
            className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all"
          >
            Activate Account ({feeFormatted} Once)
          </button>
        </div>
      </div>
    );
  }

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed per product.`);
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB.');
        return;
      }
      setUploadingImage(true);
      try {
        const uploadRes = await api.storage.uploadImage(file, 'listings');
        if (uploadRes.success && uploadRes.url) {
          setImages([...images, uploadRes.url].slice(0, maxImages));
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            setImages([...images, event.target?.result as string].slice(0, maxImages));
          };
          reader.readAsDataURL(file);
        }
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages([...images, event.target?.result as string].slice(0, maxImages));
        };
        reader.readAsDataURL(file);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !description.trim()) {
      setError('Please fill out all required fields.');
      return;
    }
    if (images.length === 0) {
      setError('Please upload at least 1 photo of the product (Max 3).');
      return;
    }

    const selectedCat = categories.find((c) => c.id === categoryId);
    const selectedDist = districts.find((d) => d.id === districtId);
    const selectedTeh = tehsils.find((t) => t.id === tehsilId);
    const distName = selectedDist?.name || 'Sargodha';
    const tehName = selectedTeh?.name || 'Sargodha';

    onSubmitAd({
      userId: currentUser.id,
      sellerName: currentUser.name,
      sellerPhone: phone,
      sellerCity: distName as City,
      sellerArea: area.trim() || tehName,
      sellerWhatsappGroup: sellerWhatsappGroup.trim() ? sellerWhatsappGroup : undefined,
      title: title.trim(),
      categoryId,
      categoryName: selectedCat?.name || 'Other',
      subcategory: subcategory.trim() ? subcategory : undefined,
      price: Number(price),
      condition,
      description: description.trim(),
      city: distName as City,
      area: area.trim() || tehName,
      exactLocation: exactLocation.trim() || undefined,
      divisionId: 1,
      districtId,
      tehsilId,
      districtName: distName,
      tehsilName: tehName,
      status: 'published', // Direct public listing
      isFeatured: false,
      sellerVerified: !!currentUser.isVerified,
      images,
      clothingSizes: clothingSizes.length > 0 ? clothingSizes : undefined,
      clothingColors: clothingColors.length > 0 ? clothingColors : undefined,
      clothingVarieties: clothingVarieties.trim() || undefined,
      clothingStock: clothingStock ? Number(clothingStock) : undefined,
      salePrice: salePrice ? Number(salePrice) : undefined,
      isWholesaleAvailable: isWholesaleAvailable || undefined,
      minWholesaleQty: isWholesaleAvailable && minWholesaleQty ? Number(minWholesaleQty) : undefined,
      deliveryInfo: deliveryInfo.trim() || undefined,
    });

    onClose();
  };

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-cyan-200 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.25)] my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-600" /> Post a Product (Direct Public Listing)
          </h2>
          <p className="text-slate-500 text-xs font-medium">
            Your listing goes live immediately across Sargodha, Shaheenabad, and Sillanwali.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs mb-4 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Photos Upload (Max 3) */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Product Photos ({images.length}/3) — Maximum 3 photos allowed *
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
                  <img src={img} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-xs"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {images.length < 3 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-cyan-300 hover:border-cyan-500 flex flex-col items-center justify-center text-slate-500 hover:text-cyan-700 cursor-pointer bg-cyan-50/50 hover:bg-cyan-50 transition-all shadow-xs">
                  <Upload className="w-5 h-5 mb-1 text-cyan-600" />
                  <span className="text-[10px] font-bold">Add Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Product Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sahiwal Cow 16L, Honda 125 2024, Kinnow 10kg box..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_10px_rgba(6,182,212,0.15)] font-medium"
              required
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Subcategory</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
              >
                <option value="">Select Subcategory</option>
                {selectedCategoryObj?.subcategories.map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Price (PKR) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_10px_rgba(6,182,212,0.15)] font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
              >
                <option value="New">New (Brand New / Fresh)</option>
                <option value="Used">Used</option>
                <option value="Like New">Like New</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>
          </div>

          {/* DEDICATED CLOTHING & FABRICS VARIETIES & SIZES SECTION */}
          {(selectedCategoryObj?.name.toLowerCase().includes('clothing') || categoryId === 12) && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-fuchsia-50/70 via-purple-50/50 to-pink-50/70 border border-fuchsia-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-fuchsia-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👔</span>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      Clothing & Fabrics Selling Specifications
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Configure sizes, colors, fabric varieties, wholesale & delivery options
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-fuchsia-100 text-fuchsia-800 px-2 py-0.5 rounded-full border border-fuchsia-200">
                  Cloth Bazaar
                </span>
              </div>

              {/* 1. Sizes */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 text-xs">
                  Available Sizes & Cutting
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {STANDARD_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                        clothingSizes.includes(sz)
                          ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-fuchsia-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    placeholder="Add other size (e.g. 38, 40, Kids 6-7Y)..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={addCustomSize}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* 2. Colors */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 text-xs">
                  Available Colors
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {POPULAR_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => toggleColor(col)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                        clothingColors.includes(col)
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customColorInput}
                    onChange={(e) => setCustomColorInput(e.target.value)}
                    placeholder="Add custom color (e.g. Mustard, Plum, Teal)..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={addCustomColor}
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700"
                  >
                    + Add Color
                  </button>
                </div>
              </div>

              {/* 3. Varieties & Stock & Sale Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1 text-xs">
                    Fabric / Variety Design
                  </label>
                  <input
                    type="text"
                    value={clothingVarieties}
                    onChange={(e) => setClothingVarieties(e.target.value)}
                    placeholder="e.g. Lawn 3pc, Wash & Wear, Cotton..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1 text-xs">
                    Available Stock (Suits/Pieces)
                  </label>
                  <input
                    type="number"
                    value={clothingStock}
                    onChange={(e) => setClothingStock(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1 text-xs">
                    Discount / Sale Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="Optional lower sale price"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-emerald-700 font-bold"
                  />
                </div>
              </div>

              {/* 4. Retail vs Wholesale & Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-white rounded-xl border border-fuchsia-100 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isWholesaleAvailable}
                      onChange={(e) => setIsWholesaleAvailable(e.target.checked)}
                      className="w-4 h-4 text-fuchsia-600 rounded border-slate-300"
                    />
                    <span className="text-xs font-bold text-slate-900">
                      Wholesale Supply Available
                    </span>
                  </label>
                  {isWholesaleAvailable && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        Minimum Wholesale Quantity
                      </label>
                      <input
                        type="number"
                        value={minWholesaleQty}
                        onChange={(e) => setMinWholesaleQty(e.target.value)}
                        placeholder="e.g. 5 or 10 suits"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  )}
                </div>

                <div className="p-3 bg-white rounded-xl border border-fuchsia-100">
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Delivery & Shipping Details
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo}
                    onChange={(e) => setDeliveryInfo(e.target.value)}
                    placeholder="e.g. Cash on Delivery in Sargodha, Rs. 150 courier..."
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Structured Location Hierarchy: Division -> District -> Tehsil -> Area */}
          <div className="p-4 rounded-2xl bg-cyan-50/40 border border-cyan-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-600" />
                <span>Posting Location (Sargodha Division Hierarchy)</span>
              </span>
              <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100/80 px-2 py-0.5 rounded-full border border-cyan-200">
                District → Tehsil → Area
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Step 1: District */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1 text-[11px]">
                  Step 1: Select District *
                </label>
                <select
                  value={districtId}
                  onChange={(e) => handleDistrictChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {districts.filter((d) => d.isActive).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} District
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Tehsil (Dependent on District) */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1 text-[11px]">
                  Step 2: Select Tehsil *
                </label>
                <select
                  value={tehsilId}
                  onChange={(e) => setTehsilId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-cyan-500 font-medium"
                >
                  {availableTehsils.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} Tehsil
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Area / Town / Village / Locality */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1 text-[11px]">
                Step 3: Area / Town / Village / Locality *
              </label>

              {/* Quick Area Chips (e.g. Shaheenabad, Satellite Town) */}
              {availableAreas.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {availableAreas.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setArea(a.name)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                        area === a.name
                          ? 'bg-cyan-600 text-white border-cyan-600 font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-400'
                      }`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              )}

              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Shaheenabad, Satellite Town, Mandi Bazaar, Main Road..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                required
              />
            </div>

            {/* Step 4: Optional exact address / shop / mohallah */}
            <div>
              <label className="block font-semibold text-slate-600 mb-1 text-[11px]">
                Exact Address / Mohallah / Landmark (Optional)
              </label>
              <input
                type="text"
                value={exactLocation}
                onChange={(e) => setExactLocation(e.target.value)}
                placeholder="e.g. Near Shell Pump, Shop #12, Grain Market..."
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-[11px] focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Calling Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03001234567"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">WhatsApp Number *</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="03001234567"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                required
              />
            </div>
          </div>

          {/* Seller WhatsApp Group Link (Optional) */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Seller WhatsApp Group or Channel Link (Optional)
            </label>
            <input
              type="url"
              value={sellerWhatsappGroup}
              onChange={(e) => setSellerWhatsappGroup(e.target.value)}
              placeholder="https://chat.whatsapp.com/... or https://whatsapp.com/channel/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete details including condition, specs, reason for selling, viewing time..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
              required
            ></textarea>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 hover:from-cyan-400 hover:via-blue-500 hover:to-fuchsia-500 text-white shadow-lg shadow-cyan-500/25 flex items-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Publish Directly to Public
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
