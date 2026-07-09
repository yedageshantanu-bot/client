"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { contactDetails } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Enter your phone number"),
  message: z.string().min(10, "Tell us a little more"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const submit = async (data: ContactForm) => {
    const mailto = `mailto:${contactDetails.email}?subject=Alaira House enquiry from ${encodeURIComponent(data.name)}&body=${encodeURIComponent(`${data.message}\n\nPhone: ${data.phone}\nEmail: ${data.email}`)}`;
    window.open(mailto, "_self");
    toast.success("Opening your email app with the message ready.");
    reset();
  };

  return (
    <div className="bg-[var(--color-ivory)] pt-24">
      <div className="container-page py-14">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[var(--color-maroon)]">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-6xl md:text-7xl">Visit or write to us</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={handleSubmit(submit)} className="rounded-lg border border-[rgba(201,168,76,0.28)] bg-[var(--color-ivory-3)] p-5 shadow-[0_1rem_2.5rem_rgba(61,12,12,0.06)] sm:p-6">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Send a message</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["name", "Name"],
                ["email", "Email"],
                ["phone", "Phone"],
              ].map(([name, label]) => (
                <label key={name} className={name === "phone" ? "sm:col-span-2 lg:col-span-1" : ""}>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-brand-muted)]">{label}</span>
                  <input
                    {...register(name as keyof ContactForm)}
                    type={name === "email" ? "email" : "text"}
                    className="mt-2 h-12 w-full rounded-lg border border-[rgba(201,168,76,0.28)] bg-[var(--color-ivory)] px-4 outline-none focus:border-[var(--color-gold)]"
                  />
                  {errors[name as keyof ContactForm] && <p className="mt-1 text-xs text-[var(--color-maroon)]">{errors[name as keyof ContactForm]?.message}</p>}
                </label>
              ))}
              <label className="sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-brand-muted)]">Message</span>
                <textarea {...register("message")} rows={7} className="mt-2 w-full rounded-lg border border-[rgba(201,168,76,0.28)] bg-[var(--color-ivory)] p-4 outline-none focus:border-[var(--color-gold)]" />
                {errors.message && <p className="mt-1 text-xs text-[var(--color-maroon)]">{errors.message.message}</p>}
              </label>
            </div>
            <Button className="mt-6 min-h-12 w-full bg-[var(--color-maroon)] text-[var(--color-ivory)] hover:bg-[var(--color-gold)] hover:text-[var(--color-oxblood)] sm:w-auto" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </form>

          <aside className="rounded-lg border border-[rgba(255,117,143,0.15)] bg-[var(--color-maroon)] p-5 text-[var(--color-ivory-3)] sm:p-6 shadow-md">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl text-white">Alaira House</h2>
            <div className="mt-6 grid gap-4 text-sm leading-6 text-pink-50">
              <a href={`mailto:${contactDetails.email}`} className="flex min-w-0 gap-3 break-all hover:underline"><Mail className="mt-1 shrink-0 text-[var(--color-gold-soft)]" size={18} /> {contactDetails.email}</a>
              <a href={`tel:${contactDetails.phone.replace(/\s/g, "")}`} className="flex gap-3 hover:underline"><Phone className="mt-1 text-[var(--color-gold-soft)]" size={18} /> {contactDetails.phone}</a>
              <span className="flex gap-3"><MapPin className="mt-1 shrink-0 text-[var(--color-gold-soft)]" size={18} /> {contactDetails.addressLines.join(" ")}</span>
              <a href={contactDetails.instagramUrl} target="_blank" rel="noreferrer" className="flex gap-3 hover:underline"><Camera className="mt-1 shrink-0 text-[var(--color-gold-soft)]" size={18} /> {contactDetails.instagramHandle}</a>
              <p className="border-t border-pink-300 pt-4">Working hours: {contactDetails.hours}</p>
            </div>
            <div className="mt-8 overflow-hidden rounded-lg border border-[rgba(201,168,76,0.24)]">
              <iframe title="Alaira map" src="https://maps.google.com/maps?q=Wai%2C%20Maharashtra&t=&z=13&ie=UTF8&iwloc=&output=embed" className="h-64 w-full sm:h-80" loading="lazy" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
