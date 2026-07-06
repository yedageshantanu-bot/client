import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getMyOrders } from "@/lib/api";
import { formatINR } from "@/lib/format";
import { User, MapPin, Package, Calendar, Tag, ChevronRight, ArrowRight } from "lucide-react";

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      getMyOrders()
        .then((data) => {
          setOrders(data || []);
        })
        .catch((err) => {
          console.error("Failed to load orders:", err);
        })
        .finally(() => {
          setFetchingOrders(false);
        });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <main className="pt-32 min-h-screen bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="h-8 w-48 skeleton mb-6" />
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 h-96 skeleton rounded-[24px]" />
            <div className="lg:col-span-8 h-96 skeleton rounded-[24px]" />
          </div>
        </div>
      </main>
    );
  }

  // Get status color classes
  const getDeliveryStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Packed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Failed":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <main data-testid="profile-page" className="pt-28 min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] text-[#8b8790] mb-8 flex-wrap">
          <Link to="/" className="hover:text-[#1C1924] transition">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#1C1924] font-medium">My Profile</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: User info & Addresses */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* User details card */}
            <div className="bg-white border border-[#EEE7FA] rounded-[28px] p-6 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#FFF4F7] border border-[#EEE7FA] text-[#E5497C] font-display font-semibold text-[24px] grid place-items-center mb-4">
                {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <h2 className="font-display font-semibold text-[22px] text-[#1C1924] capitalize">{user.name}</h2>
              <p className="text-[13.5px] text-[#8b8790] mt-0.5">{user.email}</p>
              
              {user.role === "admin" && (
                <span className="mt-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#1C1924] text-white">
                  Admin
                </span>
              )}

              <button
                onClick={logout}
                className="mt-6 w-full py-3 rounded-full border border-red-200 text-red-600 font-semibold text-[13px] uppercase tracking-wider hover:bg-red-50 transition cursor-pointer font-body"
              >
                Sign Out
              </button>
            </div>

            {/* Saved addresses card */}
            <div className="bg-white border border-[#EEE7FA] rounded-[28px] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-[#EEE7FA] pb-3">
                <MapPin size={18} className="text-[#E5497C]" />
                <h3 className="font-display font-semibold text-[16px] text-[#1C1924] uppercase tracking-wider">
                  Saved Address
                </h3>
              </div>

              {user.addresses && user.addresses.length > 0 ? (
                <div className="space-y-4">
                  {user.addresses.map((addr, idx) => (
                    <div key={idx} className="p-4 border border-[#EEE7FA] rounded-2xl bg-[#FAF8F5] relative">
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider bg-[#E5497C]/10 text-[#E5497C] px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                      <p className="font-semibold text-[13.5px] text-[#1C1924]">{addr.fullName}</p>
                      <p className="text-[13px] text-[#4A4652] mt-1">{addr.address}</p>
                      <p className="text-[13px] text-[#4A4652]">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-[12.5px] text-[#8b8790] mt-2">Ph: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-[13.5px] text-[#8b8790]">No saved addresses yet.</p>
                  <p className="text-[12px] text-[#a4a0a9] mt-0.5">Add an address during checkout.</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Order History list */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white border border-[#EEE7FA] rounded-[28px] p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-[#EEE7FA] pb-4">
                <Package size={20} className="text-[#E5497C]" />
                <h3 className="font-display font-semibold text-[18px] text-[#1C1924] uppercase tracking-wider">
                  Order History ({orders.length})
                </h3>
              </div>

              {fetchingOrders ? (
                <div className="space-y-4 py-4">
                  <div className="h-20 skeleton rounded-2xl animate-pulse bg-gray-200" />
                  <div className="h-20 skeleton rounded-2xl animate-pulse bg-gray-200" />
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id || order.id} className="border border-[#EEE7FA] rounded-2xl overflow-hidden bg-white shadow-sm">
                      
                      {/* Order info header */}
                      <div className="bg-[#FAF8F5] border-b border-[#EEE7FA] px-5 py-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-[12px] font-bold text-[#1C1924] uppercase tracking-wide font-body">
                            Order ID: <span className="text-[#E5497C]">{order.orderId || order.orderNumber}</span>
                          </p>
                          <div className="flex items-center gap-1.5 text-[12.5px] text-[#8b8790]">
                            <Calendar size={13} />
                            <span>
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Recently"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${getPaymentStatusClass(order.paymentStatus)}`}>
                            Payment: {order.paymentStatus}
                          </span>
                          <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${getDeliveryStatusClass(order.deliveryStatus)}`}>
                            Delivery: {order.deliveryStatus}
                          </span>
                        </div>
                      </div>

                      {/* Order items list */}
                      <div className="p-5 space-y-4">
                        {order.products?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl border border-[#EEE7FA] overflow-hidden shrink-0 bg-white p-1 flex items-center justify-center">
                              <img
                                src={item.productId?.images?.[0]?.url || item.productId?.thumbnail?.url || item.productId?.mainImage?.url || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=100"}
                                alt={item.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-semibold text-[#1C1924] truncate uppercase tracking-wide font-body">
                                {item.title}
                              </p>
                              <p className="text-[12.5px] text-[#8b8790] font-body">
                                Qty: {item.quantity} · Price: {formatINR(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[14px] font-semibold text-[#1C1924] font-body">
                                {formatINR(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order summary footer */}
                      <div className="bg-[#FAF8F5]/40 border-t border-[#EEE7FA] px-5 py-4 flex items-center justify-between">
                        <div className="text-[12.5px] text-[#8b8790]">
                          {order.couponCode && (
                            <span className="flex items-center gap-1 font-body">
                              <Tag size={12} className="text-[#E5497C]" />
                              Coupon applied: <strong className="text-[#E5497C]">{order.couponCode}</strong> (-{formatINR(order.couponDiscount || 0)})
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-[12.5px] text-[#8b8790] font-body">Total Amount:</span>
                          <span className="ml-2 font-display text-[18px] font-bold text-[#E5497C]">
                            {formatINR(order.total || order.subtotal)}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#EEE7FA] text-[#8b8790] grid place-items-center mx-auto mb-4">
                    <Package size={24} />
                  </div>
                  <h4 className="font-display font-semibold text-[18px] text-[#1C1924]">No orders placed yet</h4>
                  <p className="text-[13.5px] text-[#8b8790] mt-1 font-body">Explore our range of premium hampers, flowers and jewelry.</p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1.5 mt-6 px-6 py-3 rounded-full bg-[#1C1924] text-white font-semibold text-[12.5px] uppercase tracking-widest hover:bg-black transition cursor-pointer"
                  >
                    Start Shopping <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
