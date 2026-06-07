"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type AccordionItem = {
  title: string;
  content?: string;
  children?: ReactNode;
};

const renderText = (content?: string) => {
  const lines = content?.trim().split(/\n+/).filter(Boolean) ?? [];

  if (!lines.length) {
    return (
      <p className="text-sm leading-7 text-brand-muted">
        Product information will be updated soon.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {lines.map((line, index) => (
        <p key={`${line}-${index}`} className="text-sm leading-7 text-brand-muted">
          {line}
        </p>
      ))}
    </div>
  );
};

function AccordionSection({ item }: { item: AccordionItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-brand-border last:border-b">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:text-gold-dark"
        aria-expanded={open}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-ink">
          {item.title}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-ink transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-6 pr-2">{item.children ?? renderText(item.content)}</div>
        </div>
      </div>
    </div>
  );
}

function FaqAccordions({ faqs }: { faqs: NonNullable<Product["faqs"]> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs.length) {
    return renderText("");
  }

  return (
    <div className="space-y-2">
      {faqs.map((faq, index) => {
        const open = openIndex === index;

        return (
          <div key={`${faq.question}-${index}`} className="border-b border-brand-border/80 pb-2">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-3 text-left text-sm font-semibold text-ink transition hover:text-gold-dark"
              aria-expanded={open}
            >
              <span>{faq.question}</span>
              <ChevronDown
                size={16}
                className={cn("shrink-0 transition-transform duration-300", open && "rotate-180")}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-sm leading-7 text-brand-muted">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProductAccordions({ product }: { product: Product }) {
  const faqs = (product.faqs ?? []).filter((faq) => faq.question || faq.answer);
  const items: AccordionItem[] = [
    {
      title: "Description",
      content: product.descriptionSections || product.description,
    },
    {
      title: "Product Declaration",
      content: product.declaration,
    },
    {
      title: "Shipping & Returns",
      content: product.shippingReturns,
    },
    {
      title: "FAQs",
      children: <FaqAccordions faqs={faqs} />,
    },
  ];

  return (
    <div className="mt-8 bg-white">
      {items.map((item) => (
        <AccordionSection key={item.title} item={item} />
      ))}
    </div>
  );
}
