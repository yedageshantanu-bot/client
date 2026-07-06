import React, { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";
import { Mail, Check } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setState("loading");
    try {
      const res = await subscribeNewsletter(email);
      setState("done");
      toast.success(res.status === "already_subscribed" ? "You’re already on the list" : "Welcome to Alaira House");
      setTimeout(() => { setState("idle"); setEmail(""); }, 2200);
    } catch {
      setState("idle");
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <section data-testid="newsletter-section" className="relative py-20 md:py-28 pastel-mesh">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-white grid place-items-center shadow-sm"><Mail className="text-[#E5497C]" size={18} /></div>
        <h2 className="mt-6 font-display font-semibold text-[#1C1924] text-3xl md:text-5xl tracking-tight">Stay close, even from miles away.</h2>
        <p className="mt-4 text-[#4A4652] text-[16px] max-w-lg mx-auto">Love notes, new drops, seasonal boxes and quiet little discounts. Never spam. Always warm.</p>

        <form onSubmit={submit} data-testid="newsletter-form" className="mt-8 mx-auto max-w-md flex items-center gap-2 glass-card rounded-full p-1.5">
          <input
            data-testid="newsletter-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="your@email.com"
            required
            className="flex-1 bg-transparent px-5 py-3 outline-none text-[#1C1924] placeholder:text-[#8b8790] text-[14.5px]"
          />
          <button
            data-testid="newsletter-submit"
            type="submit"
            disabled={state === "loading"}
            className="btn-primary !py-2.5 !px-5 text-[13px]"
          >
            {state === "loading" ? "Sending…" : state === "done" ? (<><Check size={14} /> Joined</>) : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
