import React, { useState } from "react";
import { Mail, Phone, MapPin, Instagram, Clock, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    // Simulate API request
    toast.success("Enquiry submitted successfully!");
    setSubmitted(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <main data-testid="contact-page" className="pt-28 pb-24 bg-[#FAF8F5] min-h-screen grain-overlay">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C4A55A] bg-[#C4A55A]/10 px-3 py-1 rounded-full">Get In Touch</span>
          <h1 className="font-display font-semibold text-[#1C1924] text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            We'd Love to <span className="font-serif-italic text-[#E5497C] font-medium">Hear</span> from You.
          </h1>
          <p className="text-[14.5px] text-[#8b8790] max-w-md mx-auto leading-relaxed">
            Have questions about custom hampers, corporate gifts, or delivery? Reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8DFD0] rounded-3xl p-8 space-y-8 shadow-sm">
              <h3 className="font-display font-bold text-[#1C1924] text-xl">Contact Information</h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF4F7] text-[#E5497C] flex items-center justify-center shrink-0 shadow-sm">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#8b8790]">Email Us</p>
                    <a href="mailto:alairamaison@gmail.com" className="text-[#1C1924] text-[15px] font-medium hover:text-[#E5497C] transition">
                      alairamaison@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDFBF7] text-[#C4A55A] flex items-center justify-center shrink-0 shadow-sm">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#8b8790]">Call / WhatsApp</p>
                    <a href="tel:+919876543210" className="text-[#1C1924] text-[15px] font-medium hover:text-[#C4A55A] transition">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF5FF] text-[#3182CE] flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#8b8790]">Location</p>
                    <p className="text-[#1C1924] text-[15px] font-medium">
                      Mumbai, Maharashtra, India
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#F4F0FF] text-[#6B47C1] flex items-center justify-center shrink-0 shadow-sm">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-wider text-[#8b8790]">Business Hours</p>
                    <p className="text-[#1C1924] text-[15px] font-medium">
                      Mon–Sat: 9am – 7pm IST
                    </p>
                  </div>
                </div>
              </div>

              {/* Instagram link */}
              <div className="pt-6 border-t border-[#EEE7FA]">
                <a
                  href="https://www.instagram.com/alairaluxe?igsh=cnJ6anh4cXExMHRp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#1C1924] text-white rounded-2xl text-[14px] font-semibold hover:bg-[#E5497C] transition duration-300 shadow-md"
                >
                  <Instagram size={16} /> Follow us on @alairaluxe
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E8DFD0] rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7C7DC] rounded-full filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
              
              <h3 className="font-display font-bold text-[#1C1924] text-xl mb-2">Send an Enquiry</h3>
              <p className="text-[13.5px] text-[#8b8790] mb-8 font-body">We usually respond within a few hours.</p>

              {submitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center shadow-inner">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-display font-bold text-[#1C1924] text-2xl">Thank You!</h4>
                  <p className="text-[14.5px] text-[#4A4652] max-w-sm">
                    Your enquiry has been received. Our team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[13px] font-semibold text-[#1C1924]" htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        required
                        placeholder=""
                        className="w-full px-4 py-3 rounded-2xl border border-[#E8DFD0] bg-[#FAF8F5] focus:outline-none focus:border-[#E5497C] focus:bg-white text-[14px] text-[#1C1924] transition duration-200"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-[13px] font-semibold text-[#1C1924]" htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        required
                        placeholder=""
                        className="w-full px-4 py-3 rounded-2xl border border-[#E8DFD0] bg-[#FAF8F5] focus:outline-none focus:border-[#E5497C] focus:bg-white text-[14px] text-[#1C1924] transition duration-200"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#1C1924]" htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder=""
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8DFD0] bg-[#FAF8F5] focus:outline-none focus:border-[#E5497C] focus:bg-white text-[14px] text-[#1C1924] transition duration-200"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-[#1C1924]" htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      required
                      rows="4"
                      placeholder=""
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8DFD0] bg-[#FAF8F5] focus:outline-none focus:border-[#E5497C] focus:bg-white text-[14px] text-[#1C1924] transition duration-200 resize-none"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#1C1924] text-white rounded-2xl text-[14px] font-semibold hover:bg-[#E5497C] transition duration-300 shadow-md flex items-center justify-center gap-2 group"
                  >
                    <Send size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> Submit Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
