import {
  brandAddressLines,
  brandEmail,
  brandInstagramHandle,
  brandInstagramUrl,
  brandName,
  brandPhone,
  brandTagline,
} from "./brand";

export const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/collection", label: "COLLECTIONS" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export const brandInfo = {
  name: brandName,
  tagline: brandTagline,
  description:
    "Premium half sarees blending modern aesthetics with traditional Indian craftsmanship.",
};

export const contactDetails = {
  email: brandEmail,
  phone: brandPhone,
  addressLines: brandAddressLines,
  instagramHandle: brandInstagramHandle,
  instagramUrl: brandInstagramUrl,
  hours: "Mon-Sat, 10am-7pm",
};

export const marqueeItems = [
  "New Arrivals",
  "Bridal Collection",
  "Festive Wear",
  "Traditional Silk",
  "Free Shipping Above Rs. 999",
];
