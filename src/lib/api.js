import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ 
  baseURL: API,
  withCredentials: true
});

// Attach Authorization header if token exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("alaira_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Bypass-Tunnel-Reminder"] = "true";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Map backend product representation to frontend expected model
export const mapProduct = (p) => {
  if (!p) return null;
  const id = p._id || p.id;
  const image = p.mainImage?.url || p.images?.[0]?.url || p.image || "";
  const images = p.images?.map(img => typeof img === 'string' ? img : img.url) || [image];
  const original_price = p.price;
  const price = p.discountPrice || p.price;
  const discount_pct = p.price > price ? Math.round(((p.price - price) / p.price) * 100) : 0;
  const on_sale = discount_pct > 0;
  const reviews_count = p.reviews?.length || p.reviews_count || 0;
  const name = p.title || p.name || "";
  const rating = p.ratings?.average || p.rating || 5.0;
  
  const reviews = p.reviews?.map(r => ({
    author: r.user?.name || "Anonymous",
    avatar: r.user?.avatar || "",
    rating: r.rating || 5,
    comment: r.comment || "",
    body: r.comment || "",
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Recently"
  })) || [];
  
  const videos = p.videos?.map(v => typeof v === 'string' ? v : v.url) || [];
  const declaration = p.declaration || "Certified Authentic Alaira Premium Quality Gift.";
  const shippingReturns = p.shippingReturns || "Ships within 24-48 hours. Returns accepted within 14 days under original wrapper conditions.";
  const faqs = p.faqs && p.faqs.length ? p.faqs : [
    { question: "Is this wrapped ready for gifting?", answer: "Yes, every Alaira order comes with our signature presentation wrap and a blank matching greeting card." }
  ];

  return {
    id,
    name,
    title: name,
    price,
    original_price,
    discount_pct,
    on_sale,
    image,
    images,
    videos,
    category: p.category,
    description: p.description,
    declaration,
    shippingReturns,
    faqs,
    fabric: p.fabric || "Soft Cotton",
    occasion: p.occasion || "Anniversary",
    color: p.color || "Multi",
    stock: p.stock || 10,
    rating,
    reviews_count,
    reviews,
    delivery_days: p.delivery_days || "3-5 days",
    badge: p.featured ? "Featured" : "",
    highlights: p.highlights || [
      "Premium luxury materials",
      "Handcrafted with love",
      "Signature presentation wrapping included"
    ]
  };
};

export const getCategories = () => api.get("/categories").then((r) => r.data);

export const getProducts = (params = {}) => 
  api.get("/products", { params }).then((r) => {
    const list = r.data.products || r.data;
    return Array.isArray(list) ? list.map(mapProduct) : [];
  });

export const getProduct = (id) => 
  api.get(`/products/${id}`).then((r) => {
    const prod = r.data.product || r.data;
    return mapProduct(prod);
  });

export const getCombos = () => api.get("/combos").then((r) => r.data);

export const createOrder = (payload) => api.post("/orders", payload).then((r) => r.data);

export const subscribeNewsletter = (email) => api.post("/newsletter", { email }).then((r) => r.data);

// Authentication actions
export const loginUser = (payload) => 
  api.post("/users/login", payload).then((r) => {
    if (r.data?.token) {
      localStorage.setItem("alaira_token", r.data.token);
    }
    return r.data;
  });

export const registerUser = (payload) => 
  api.post("/users/register", payload).then((r) => {
    if (r.data?.token) {
      localStorage.setItem("alaira_token", r.data.token);
    }
    return r.data;
  });

export const getCurrentUser = () => 
  api.get("/users/me").then((r) => r.data);

export const logoutUser = () => 
  api.post("/users/logout").then((r) => {
    localStorage.removeItem("alaira_token");
    return r.data;
  }).catch((err) => {
    localStorage.removeItem("alaira_token");
    throw err;
  });

export const submitProductReview = (id, payload) => 
  api.post(`/products/${id}/reviews`, payload).then((r) => {
    return {
      ratings: r.data.ratings,
      reviews: r.data.reviews?.map(rv => ({
        author: rv.user?.name || "Anonymous",
        avatar: rv.user?.avatar || "",
        rating: rv.rating || 5,
        comment: rv.comment || "",
        body: rv.comment || "",
        date: rv.createdAt ? new Date(rv.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Recently"
      })) || []
    };
  });

export const getMyOrders = () => 
  api.get("/orders/me").then((r) => r.data.orders || r.data);

