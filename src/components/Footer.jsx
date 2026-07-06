import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube, Phone, Mail, Clock, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative mt-20 border-t border-[#E8DFD0] bg-[#F0EAE1]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-10">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full grid place-items-center bg-[#1C1924] text-white font-display font-semibold">A</span>
              <span className="font-display font-semibold text-[#1C1924] text-lg tracking-wide">ALAIRA HOUSE</span>
            </div>
            <p className="text-[13.5px] text-[#4A4652] max-w-sm leading-relaxed font-body">
              Thoughtful, hand-curated gifts for the couples who love across cities, countries, and time zones. Every parcel is love, delivered.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Facebook, href: "#" },
                { Icon: Youtube, href: "#" }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label="social"
                  data-testid={`footer-social-${i}`}
                  className="w-9 h-9 rounded-full bg-white border border-[#E8DFD0] text-[#1C1924] hover:bg-[#E5497C] hover:text-white hover:border-[#E5497C] transition-all duration-300 flex items-center justify-center shadow-sm"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 lg:ml-4">
            <h4 className="font-display text-[14px] font-bold text-[#C4A55A] uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-[13.5px] text-[#4A4652] font-body">
              <li><Link to="/" className="hover:text-[#E5497C] transition">Home</Link></li>
              <li><Link to="/shop" className="hover:text-[#E5497C] transition">Shop Gifts</Link></li>
              <li><Link to="/about" className="hover:text-[#E5497C] transition">About Us</Link></li>
              <li><Link to="/profile" className="hover:text-[#E5497C] transition">My Account</Link></li>
              <li><a href="#" className="hover:text-[#E5497C] transition">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Occasions */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-[14px] font-bold text-[#C4A55A] uppercase tracking-widest mb-4">
              Occasions
            </h4>
            <ul className="space-y-3 text-[13.5px] text-[#4A4652] font-body">
              <li><a href="#" className="hover:text-[#E5497C] transition">Birthday</a></li>
              <li><a href="#" className="hover:text-[#E5497C] transition">Anniversary</a></li>
              <li><a href="#" className="hover:text-[#E5497C] transition">Wedding</a></li>
              <li><a href="#" className="hover:text-[#E5497C] transition">Festival</a></li>
              <li><a href="#" className="hover:text-[#E5497C] transition">Baby Shower</a></li>
              <li><a href="#" className="hover:text-[#E5497C] transition">Thank You</a></li>
            </ul>
          </div>

          {/* Column 4: Get In Touch & Assurance */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-display text-[14px] font-bold text-[#C4A55A] uppercase tracking-widest mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-[13.5px] text-[#4A4652] font-body">
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#C4A55A] shrink-0" />
                <span>WhatsApp us anytime</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#C4A55A] shrink-0" />
                <a href="mailto:hello@alairahouse.com" className="hover:text-[#E5497C] transition">
                  hello@alairahouse.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram size={14} className="text-[#C4A55A] shrink-0" />
                <a href="#" className="hover:text-[#E5497C] transition">@alairahouse</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={14} className="text-[#C4A55A] shrink-0" />
                <span>Mon–Sat, 9am – 7pm</span>
              </li>
            </ul>

            {/* Payments Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-[#8b8790] font-body">
              <span className="px-2 py-1 border border-[#E8DFD0] rounded bg-white shadow-sm">Visa</span>
              <span className="px-2 py-1 border border-[#E8DFD0] rounded bg-white shadow-sm">MC</span>
              <span className="px-2 py-1 border border-[#E8DFD0] rounded bg-white shadow-sm">Amex</span>
              <span className="px-2 py-1 border border-[#E8DFD0] rounded bg-white shadow-sm">UPI</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-[#E8DFD0] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#8b8790] font-body">
            © {new Date().getFullYear()} Alaira House. All rights reserved.
          </p>

          <div className="text-[12.5px] text-[#C4A55A] font-semibold tracking-wide flex items-center gap-1 font-body">
            ✦ Because Every Gift Tells a Story ✦
          </div>

          <div className="flex gap-4 text-[13px] text-[#8b8790] font-body">
            <a href="#" className="hover:text-[#E5497C] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#E5497C] transition">Terms</a>
            <a href="#" className="hover:text-[#E5497C] transition">Shipping</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
