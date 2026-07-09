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
  { href: "/", label: "Home" },
  { href: "/collection", label: "Shop" },
  { href: "/collection?category=Romantic+Combos", label: "Combos" },
  { href: "/#personalize", label: "Personalize" },
];

export const brandInfo = {
  name: brandName,
  tagline: brandTagline,
  description:
    "Luxury long-distance love gifts. Send warmth, sweetness, and softness across any miles.",
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
  "Send love across any distance",
  "Hand-wrapped, hand-delivered",
  "Free premium gift wrapping on every order",
  "Same-day dispatch before 3PM",
];
