"use client";

import {
  Bell,
  CreditCard,
  Globe,
  KeyRound,
  Mail,
  Palette,
  Save,
  Settings as SettingsIcon,
  Shield,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "brand", label: "Brand", icon: Palette },
  { id: "store", label: "Store info", icon: Globe },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "email", label: "Email & SMS", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "api", label: "API keys", icon: KeyRound },
];

export default function SettingsPage() {
  const [active, setActive] = useState("brand");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
          Configuration
        </p>
        <h1 className="mt-1.5 text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.1] tracking-tight text-[#0f172a]">
          Settings
        </h1>
        <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#475569] sm:text-[14px]">
          Configure your store, brand, payments, shipping, and team access. All
          changes are saved automatically and synced across the storefront.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar nav */}
        <aside className="rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-sm">
          <nav className="flex flex-col gap-0.5">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = active === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActive(section.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition duration-300",
                    isActive
                      ? "bg-[#0f172a] text-white shadow-md shadow-[#0f172a]/20"
                      : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-lg transition",
                      isActive
                        ? "bg-white/10 text-white"
                        : "bg-[#f1f5f9] text-[#64748b]",
                    )}
                  >
                    <Icon size={14} />
                  </span>
                  <span className="flex-1 truncate">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active section content */}
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <SectionContent id={active} />
        </div>
      </div>
    </div>
  );
}

function SectionContent({ id }: { id: string }) {
  if (id === "brand") {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Brand identity"
          description="Logo, colors, and typography used across the storefront."
        />
        <FieldGroup
          fields={[
            { label: "Brand name", value: "Alaira Half Saree House" },
            { label: "Tagline", value: "Crafted for grace" },
            { label: "Primary color", value: "#7a0010" },
            { label: "Accent color", value: "#d4a373" },
          ]}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <ColorSwatch label="Maroon" value="#7a0010" />
          <ColorSwatch label="Gold" value="#d4a373" />
          <ColorSwatch label="Ivory" value="#f8f3eb" />
          <ColorSwatch label="Oxblood" value="#26070b" />
        </div>
        <SaveBar />
      </div>
    );
  }

  if (id === "store") {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Store information"
          description="Public-facing store details shown on invoices, emails, and the contact page."
        />
        <FieldGroup
          fields={[
            { label: "Store name", value: "VastraAura" },
            { label: "Contact email", value: "hello@vastraaura.in" },
            { label: "Phone", value: "+91 98765 43210" },
            { label: "Address", value: "Mumbai, Maharashtra, India" },
          ]}
        />
        <SaveBar />
      </div>
    );
  }

  if (id === "payments") {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Payment gateways"
          description="Configure how customers pay at checkout."
        />
        <GatewayRow
          name="Razorpay"
          description="UPI, cards, netbanking, wallets"
          status="active"
        />
        <GatewayRow
          name="Stripe"
          description="International cards & Apple Pay"
          status="available"
        />
        <GatewayRow
          name="Cash on Delivery"
          description="Pay on delivery (India only)"
          status="active"
        />
        <SaveBar />
      </div>
    );
  }

  if (id === "shipping") {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Shipping methods"
          description="Manage carriers, rates, and delivery zones."
        />
        <FieldGroup
          fields={[
            { label: "Free shipping threshold", value: "₹4,999" },
            { label: "Standard delivery", value: "3–5 business days" },
            { label: "Express delivery", value: "1–2 business days" },
            { label: "International", value: "7–14 business days" },
          ]}
        />
        <SaveBar />
      </div>
    );
  }

  if (id === "email") {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Email & SMS"
          description="Templates and sender settings for transactional messages."
        />
        <FieldGroup
          fields={[
            { label: "From name", value: "Alaira Half Saree House" },
            { label: "From email", value: "orders@vastraaura.in" },
            { label: "SMS sender ID", value: "VASTRAA" },
          ]}
        />
        <SaveBar />
      </div>
    );
  }

  if (id === "notifications") {
    return (
      <div className="space-y-4">
        <SectionHeader
          title="Notification preferences"
          description="Choose which alerts get sent to your inbox and the team."
        />
        <ToggleRow label="New order placed" defaultOn />
        <ToggleRow label="Order shipped" defaultOn />
        <ToggleRow label="Low stock alert" defaultOn />
        <ToggleRow label="Customer review submitted" defaultOn />
        <ToggleRow label="Refund requested" />
        <ToggleRow label="New customer signup" />
        <SaveBar />
      </div>
    );
  }

  if (id === "security") {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Security"
          description="Two-factor authentication, sessions, and password policies."
        />
        <SecurityRow
          label="Two-factor authentication"
          description="Require a second factor at sign-in"
          status="Enabled"
        />
        <SecurityRow
          label="Session timeout"
          description="Auto sign-out after inactivity"
          status="30 minutes"
        />
        <SecurityRow
          label="Password policy"
          description="Minimum length and complexity"
          status="Strong"
        />
        <SaveBar />
      </div>
    );
  }

  // api
  return (
    <div className="space-y-6">
      <SectionHeader
        title="API keys"
        description="Programmatic access to your store. Keep these private."
      />
      <div className="space-y-2">
        <ApiKey label="Public key" value="pk_live_••••••••3a4f" />
        <ApiKey label="Secret key" value="sk_live_••••••••9b21" />
        <ApiKey label="Webhook secret" value="whsec_••••••••e7c2" />
      </div>
      <SaveBar />
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-[#e2e8f0] pb-4">
      <h2 className="text-[15px] font-bold text-[#0f172a]">{title}</h2>
      <p className="mt-1 text-[12px] text-[#64748b]">{description}</p>
    </div>
  );
}

function FieldGroup({
  fields,
}: {
  fields: { label: string; value: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <label key={f.label} className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
            {f.label}
          </span>
          <input
            defaultValue={f.value}
            className="h-10 w-full rounded-xl border border-[#e2e8f0] bg-white px-3 text-[13px] text-[#0f172a] outline-none transition focus:border-[#0f172a] focus:ring-4 focus:ring-[#0f172a]/10"
          />
        </label>
      ))}
    </div>
  );
}

function ColorSwatch({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white p-3">
      <span
        className="h-10 w-10 shrink-0 rounded-lg border border-[#e2e8f0]"
        style={{ background: value }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-[#0f172a]">{label}</p>
        <p className="font-mono text-[11px] text-[#64748b]">{value}</p>
      </div>
    </div>
  );
}

function GatewayRow({
  name,
  description,
  status,
}: {
  name: string;
  description: string;
  status: "active" | "available";
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div>
        <p className="text-[13px] font-semibold text-[#0f172a]">{name}</p>
        <p className="text-[11px] text-[#64748b]">{description}</p>
      </div>
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
          status === "active"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-[#f1f5f9] text-[#64748b]",
        )}
      >
        {status === "active" ? "Active" : "Available"}
      </span>
    </div>
  );
}

function ToggleRow({
  label,
  defaultOn,
}: {
  label: string;
  defaultOn?: boolean;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-3">
      <span className="text-[13px] font-medium text-[#0f172a]">{label}</span>
      <span
        className={cn(
          "relative h-6 w-11 rounded-full border transition",
          defaultOn
            ? "border-[#0f172a] bg-[#0f172a]"
            : "border-[#e2e8f0] bg-[#f1f5f9]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 grid h-4 w-4 place-items-center rounded-full bg-white transition-all",
            defaultOn ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
    </label>
  );
}

function SecurityRow({
  label,
  description,
  status,
}: {
  label: string;
  description: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-4">
      <div>
        <p className="text-[13px] font-semibold text-[#0f172a]">{label}</p>
        <p className="text-[11px] text-[#64748b]">{description}</p>
      </div>
      <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
        {status}
      </span>
    </div>
  );
}

function ApiKey({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748b]">
          {label}
        </p>
        <p className="mt-0.5 font-mono text-[12px] text-[#0f172a]">{value}</p>
      </div>
      <button
        type="button"
        className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0f172a] transition hover:bg-[#f8fafc]"
      >
        Reveal
      </button>
    </div>
  );
}

function SaveBar() {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-[#e2e8f0] pt-4">
      <button
        type="button"
        className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#0f172a] transition hover:bg-[#f8fafc]"
      >
        Discard
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f172a] px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition duration-300 hover:bg-[#1e293b]"
      >
        <Save size={12} /> Save changes
      </button>
    </div>
  );
}
