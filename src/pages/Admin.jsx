import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getAdminStats,
  getAdminOrders,
  updateOrderStatus,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "@/lib/api";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Ticket,
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  TrendingUp,
  IndianRupee
} from "lucide-react";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Tabs state: 'overview' | 'products' | 'orders' | 'coupons'
  const [activeTab, setActiveTab] = useState("overview");

  // Loaders
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Product Form states
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "Flowers",
    stock: "10",
    fabric: "Soft Cotton",
    occasion: "Anniversary",
    color: "Multi",
    images: "" // Comma-separated list
  });

  // Coupon Form states
  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "percentage",
    discount: "",
    minimumOrder: "0"
  });

  // Redirect if not authorized
  useEffect(() => {
    if (!authLoading) {
      if (!user || (user.email?.toLowerCase() !== "yedageshantanu@gmail.com" && user.role !== "admin")) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
      }
    }
  }, [user, authLoading, navigate]);

  // Fetch tab data
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const statsData = await getAdminStats();
        const ordersData = await getAdminOrders();
        setStats(statsData);
        setOrders(ordersData || []);
      } else if (activeTab === "products") {
        const prodsData = await getProducts();
        setProducts(prodsData || []);
      } else if (activeTab === "orders") {
        const ordersData = await getAdminOrders();
        setOrders(ordersData || []);
      } else if (activeTab === "coupons") {
        const couponsData = await getCoupons();
        setCoupons(couponsData || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
      toast.error("Failed to load admin panel data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === "admin" || user.email?.toLowerCase() === "yedageshantanu@gmail.com")) {
      fetchData();
    }
  }, [user, activeTab]);

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated successfully");
      // Refresh orders list
      const updated = await getAdminOrders();
      setOrders(updated || []);
      if (activeTab === "overview") {
        const statsData = await getAdminStats();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update order status");
    }
  };

  // Product Form Actions
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.description || !productForm.price) {
      toast.error("Title, Description and Price are required");
      return;
    }

    // Format payload
    const imageList = productForm.images
      ? productForm.images.split(",").map(url => url.trim()).filter(Boolean)
      : [];

    const payload = {
      title: productForm.title,
      description: productForm.description,
      price: Number(productForm.price),
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
      category: productForm.category,
      stock: Number(productForm.stock),
      fabric: productForm.fabric,
      occasion: productForm.occasion,
      color: productForm.color,
      images: imageList
    };

    try {
      if (isEditingProduct) {
        await updateProduct(editingProductId, payload);
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully");
      }

      // Reset form
      setProductForm({
        title: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "Flowers",
        stock: "10",
        fabric: "Soft Cotton",
        occasion: "Anniversary",
        color: "Multi",
        images: ""
      });
      setIsEditingProduct(false);
      setEditingProductId(null);
      // Reload products list
      const prodsData = await getProducts();
      setProducts(prodsData || []);
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product details");
    }
  };

  const handleEditProduct = (prod) => {
    // Convert back array of image URLs to comma separated string
    const imagesStr = Array.isArray(prod.images)
      ? prod.images.join(", ")
      : prod.image || "";

    setProductForm({
      title: prod.name || prod.title || "",
      description: prod.description || "",
      price: prod.original_price || prod.price || "",
      discountPrice: prod.price < prod.original_price ? prod.price : "",
      category: prod.category || "Flowers",
      stock: String(prod.stock || 10),
      fabric: prod.fabric || "Soft Cotton",
      occasion: prod.occasion || "Anniversary",
      color: prod.color || "Multi",
      images: imagesStr
    });
    setEditingProductId(prod.id);
    setIsEditingProduct(true);
    // Scroll to form
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      const prodsData = await getProducts();
      setProducts(prodsData || []);
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product");
    }
  };

  // Coupon Form Actions
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discount) {
      toast.error("Code and Discount are required");
      return;
    }

    const payload = {
      code: couponForm.code.toUpperCase().trim(),
      type: couponForm.type,
      discount: Number(couponForm.discount),
      minimumOrder: Number(couponForm.minimumOrder || 0),
      isActive: true
    };

    try {
      await createCoupon(payload);
      toast.success("Coupon created successfully");
      setCouponForm({
        code: "",
        type: "percentage",
        discount: "",
        minimumOrder: "0"
      });
      // Reload coupons list
      const couponsData = await getCoupons();
      setCoupons(couponsData || []);
    } catch (err) {
      console.error("Failed to create coupon:", err);
      toast.error("Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted successfully");
      const couponsData = await getCoupons();
      setCoupons(couponsData || []);
    } catch (err) {
      console.error("Failed to delete coupon:", err);
      toast.error("Failed to delete coupon");
    }
  };

  if (authLoading || !user) {
    return (
      <main className="pt-32 min-h-screen bg-[#FAF8F5] grid place-items-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gold border-t-transparent animate-spin mx-auto mb-4" />
          <p className="font-display font-medium text-[#1C1924]">Verifying credentials...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#E8DFD0] pb-6 mb-8 gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-widest font-bold text-gold font-body">Control Center</p>
            <h1 className="mt-1 font-display font-semibold text-[32px] md:text-[42px] tracking-tight text-[#1C1924]">
              Admin Dashboard
            </h1>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "products", label: "Products", icon: Package },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "coupons", label: "Coupons", icon: Ticket }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#1C1924] border-[#1C1924] text-white shadow-md"
                      : "bg-white border-[#EEE7FA] text-[#4A4652] hover:bg-[#FCF9F3]"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Tabs */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 rounded-full border-4 border-gold border-t-transparent animate-spin mx-auto mb-4" />
            <p className="font-display font-medium text-[#1C1924]">Loading dashboard contents...</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && stats && (
              <div className="space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Revenue", value: formatINR(stats.revenue), icon: IndianRupee, color: "bg-emerald-50 text-emerald-600" },
                    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-indigo-50 text-indigo-600" },
                    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, color: "bg-amber-50 text-amber-600 animate-pulse" },
                    { label: "Active Products", value: stats.totalProducts, icon: Package, color: "bg-rose-50 text-rose-600" }
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <div key={idx} className="bg-white border border-[#EEE7FA] rounded-[24px] p-6 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-[12px] text-[#8b8790] font-semibold uppercase tracking-wider font-body">{card.label}</p>
                          <h3 className="mt-2 font-display font-bold text-[22px] md:text-[28px] text-[#1C1924]">{card.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color}`}>
                          <Icon size={20} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Orders Section */}
                <div className="bg-white border border-[#EEE7FA] rounded-[28px] p-6 shadow-sm">
                  <h3 className="font-display font-semibold text-[20px] text-[#1C1924] mb-5">
                    Recent Activity & Orders
                  </h3>
                  {orders.length === 0 ? (
                    <p className="text-[14px] text-[#8b8790] py-4">No recent orders found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[13.5px]">
                        <thead>
                          <tr className="border-b border-[#EEE7FA] pb-3 text-[#8b8790] font-body uppercase text-[11px] tracking-wider">
                            <th className="pb-3">Order ID</th>
                            <th className="pb-3">Customer</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Total</th>
                            <th className="pb-3">Delivery Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEE7FA]/60">
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order._id || order.id} className="hover:bg-[#FAF8F5]/50">
                              <td className="py-3.5 font-semibold text-[#1C1924]">{order.orderId || `VA-${order._id?.slice(-5)}`}</td>
                              <td className="py-3.5 capitalize">{order.shippingAddress?.fullName || order.customer || "Guest User"}</td>
                              <td className="py-3.5 text-[#8b8790]">
                                {new Date(order.createdAt || order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </td>
                              <td className="py-3.5 font-semibold text-[#E5497C]">{formatINR(order.total)}</td>
                              <td className="py-3.5">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  order.deliveryStatus === "Delivered" ? "bg-green-50 text-green-600" :
                                  order.deliveryStatus === "Shipped" ? "bg-indigo-50 text-indigo-600" :
                                  order.deliveryStatus === "Cancelled" ? "bg-red-50 text-red-600" :
                                  "bg-amber-50 text-amber-600"
                                }`}>
                                  {order.deliveryStatus || "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Form to Create/Edit Product */}
                <div className="lg:col-span-5 bg-white border border-[#EEE7FA] rounded-[28px] p-6 shadow-sm">
                  <h3 className="font-display font-semibold text-[20px] text-[#1C1924] mb-6">
                    {isEditingProduct ? "Edit Product Details" : "Create New Product"}
                  </h3>
                  <form onSubmit={handleProductSubmit} className="space-y-4 text-[13.5px]">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Product Title</label>
                      <input
                        type="text"
                        value={productForm.title}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                        placeholder="e.g. Elegant Rose Gold Ring"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Base Price (INR)</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                          placeholder="Original price"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Discount Price (INR)</label>
                        <input
                          type="number"
                          value={productForm.discountPrice}
                          onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                          placeholder="Sale price"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                        >
                          <option value="Flowers">Flowers</option>
                          <option value="Jewelry">Jewelry</option>
                          <option value="Toys">Toys</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Stock Qty</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Fabric/Material</label>
                        <input
                          type="text"
                          value={productForm.fabric}
                          onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Occasion</label>
                        <input
                          type="text"
                          value={productForm.occasion}
                          onChange={(e) => setProductForm({ ...productForm, occasion: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Color</label>
                        <input
                          type="text"
                          value={productForm.color}
                          onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Images List (Comma separated URLs)</label>
                      <textarea
                        value={productForm.images}
                        onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none h-16 resize-none"
                        placeholder="/flowers/IMG_3520.JPG.jpeg, /flowers/IMG_3521.JPG.jpeg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none h-24"
                        placeholder="Detail information about product..."
                        required
                      />
                    </div>
                    
                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-[#1C1924] text-white py-3 rounded-full font-semibold hover:bg-black transition cursor-pointer"
                      >
                        {isEditingProduct ? "Update Product" : "Publish Product"}
                      </button>
                      {isEditingProduct && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProduct(false);
                            setEditingProductId(null);
                            setProductForm({
                              title: "",
                              description: "",
                              price: "",
                              discountPrice: "",
                              category: "Flowers",
                              stock: "10",
                              fabric: "Soft Cotton",
                              occasion: "Anniversary",
                              color: "Multi",
                              images: ""
                            });
                          }}
                          className="px-4 py-3 border border-[#E8DFD0] text-[#1C1924] rounded-full hover:bg-gray-50 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Products Table list */}
                <div className="lg:col-span-7 bg-white border border-[#EEE7FA] rounded-[28px] p-6 shadow-sm">
                  <h3 className="font-display font-semibold text-[20px] text-[#1C1924] mb-5">
                    Catalog Items ({products.length})
                  </h3>
                  <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full text-left text-[13px]">
                      <thead>
                        <tr className="border-b border-[#EEE7FA] pb-3 text-[#8b8790] uppercase font-body text-[10px] tracking-wider">
                          <th className="pb-3">Item</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3 text-center">Stock</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EEE7FA]/60">
                        {products.map((prod) => (
                          <tr key={prod.id} className="hover:bg-[#FAF8F5]/30">
                            <td className="py-3 flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-12 object-cover rounded-lg border border-[#EEE7FA]"
                              />
                              <div>
                                <p className="font-semibold text-[#1C1924] truncate max-w-[150px]">{prod.name}</p>
                                <p className="text-[11px] text-[#8b8790]">{prod.id}</p>
                              </div>
                            </td>
                            <td className="py-3 text-[#4A4652]">{prod.category}</td>
                            <td className="py-3 font-semibold text-[#E5497C]">
                              {formatINR(prod.price)}
                            </td>
                            <td className="py-3 text-center font-medium">{prod.stock}</td>
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditProduct(prod)}
                                  className="w-8 h-8 rounded-full border border-gray-150 flex items-center justify-center text-[#1C1924] hover:bg-gray-100 transition cursor-pointer"
                                  aria-label="Edit product"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="w-8 h-8 rounded-full border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition cursor-pointer"
                                  aria-label="Delete product"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="bg-white border border-[#EEE7FA] rounded-[28px] p-6 shadow-sm">
                <h3 className="font-display font-semibold text-[20px] text-[#1C1924] mb-5">
                  Order Management ({orders.length})
                </h3>
                {orders.length === 0 ? (
                  <p className="text-[14px] text-[#8b8790] py-4">No orders placed yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13.5px]">
                      <thead>
                        <tr className="border-b border-[#EEE7FA] pb-3 text-[#8b8790] font-body uppercase text-[11px] tracking-wider">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Products</th>
                          <th className="pb-3">Total</th>
                          <th className="pb-3">Payment</th>
                          <th className="pb-3">Delivery Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EEE7FA]/60">
                        {orders.map((order) => (
                          <tr key={order._id || order.id} className="hover:bg-[#FAF8F5]/30">
                            <td className="py-4 font-semibold text-[#1C1924]">
                              {order.orderId || `VA-${order._id?.slice(-5)}`}
                            </td>
                            <td className="py-4 text-[#8b8790]">
                              {new Date(order.createdAt || order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="py-4 font-medium">
                              <p className="capitalize">{order.shippingAddress?.fullName || order.customer || "Guest User"}</p>
                              <p className="text-[11.5px] text-[#8b8790] font-normal">{order.shippingAddress?.phone || order.phone}</p>
                            </td>
                            <td className="py-4 max-w-[200px]">
                              <p className="text-[12.5px] text-[#4A4652] truncate">
                                {order.products?.map((p) => `${p.title || p.name} (x${p.quantity || p.qty})`).join(", ")}
                              </p>
                            </td>
                            <td className="py-4 font-semibold text-[#E5497C]">
                              {formatINR(order.total)}
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                order.paymentStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {order.paymentStatus || "Pending"}
                              </span>
                            </td>
                            <td className="py-4">
                              <select
                                value={order.deliveryStatus || "Pending"}
                                onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)}
                                className={`px-2.5 py-1.5 rounded-xl border border-[#E8DFD0] text-[12px] font-semibold outline-none focus:ring-1 focus:ring-gold ${
                                  order.deliveryStatus === "Delivered" ? "bg-green-50 text-green-600 border-green-200" :
                                  order.deliveryStatus === "Shipped" ? "bg-indigo-50 text-indigo-600 border-indigo-200" :
                                  order.deliveryStatus === "Cancelled" ? "bg-red-50 text-red-600 border-red-200" :
                                  "bg-amber-50 text-amber-600 border-amber-200"
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === "coupons" && (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Form to Create Coupon */}
                <div className="lg:col-span-5 bg-white border border-[#EEE7FA] rounded-[28px] p-6 shadow-sm">
                  <h3 className="font-display font-semibold text-[20px] text-[#1C1924] mb-5">
                    Create Promo Coupon
                  </h3>
                  <form onSubmit={handleCouponSubmit} className="space-y-4 text-[13.5px]">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Coupon Code</label>
                      <input
                        type="text"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none uppercase font-semibold"
                        placeholder="e.g. WELCOME10"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Discount Type</label>
                        <select
                          value={couponForm.type}
                          onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Discount Value</label>
                        <input
                          type="number"
                          value={couponForm.discount}
                          onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                          placeholder="e.g. 10 or 500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#8b8790] mb-1">Minimum Order Total (₹)</label>
                      <input
                        type="number"
                        value={couponForm.minimumOrder}
                        onChange={(e) => setCouponForm({ ...couponForm, minimumOrder: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD0] focus:ring-1 focus:ring-gold focus:border-gold outline-none"
                        placeholder="e.g. 1000"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-[#1C1924] text-white py-3 rounded-full font-semibold hover:bg-black transition mt-2 cursor-pointer"
                    >
                      Create Coupon
                    </button>
                  </form>
                </div>

                {/* Coupons Table list */}
                <div className="lg:col-span-7 bg-white border border-[#EEE7FA] rounded-[28px] p-6 shadow-sm">
                  <h3 className="font-display font-semibold text-[20px] text-[#1C1924] mb-5">
                    Promo Coupons ({coupons.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13.5px]">
                      <thead>
                        <tr className="border-b border-[#EEE7FA] pb-3 text-[#8b8790] uppercase font-body text-[11px] tracking-wider">
                          <th className="pb-3">Code</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Discount</th>
                          <th className="pb-3">Min Order</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EEE7FA]/60">
                        {coupons.map((coupon) => (
                          <tr key={coupon._id || coupon.id} className="hover:bg-[#FAF8F5]/30">
                            <td className="py-3 font-semibold text-[#1C1924]">{coupon.code}</td>
                            <td className="py-3 text-capitalize">{coupon.type}</td>
                            <td className="py-3 font-semibold text-[#E5497C]">
                              {coupon.type === "percentage" ? `${coupon.discount}%` : formatINR(coupon.discount)}
                            </td>
                            <td className="py-3">{formatINR(coupon.minimumOrder || 0)}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDeleteCoupon(coupon._id || coupon.id)}
                                className="w-8 h-8 rounded-full border border-red-150 text-red-500 hover:bg-red-50 transition cursor-pointer flex items-center justify-center ml-auto"
                                aria-label="Delete coupon"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
