"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-3 py-4 sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close modal backdrop"
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "relative flex flex-col max-h-[calc(100dvh-2.5rem)] w-full max-w-md overflow-hidden rounded-[20px] border border-brand-border bg-white shadow-2xl sm:max-h-[calc(100vh-5rem)]",
              className,
            )}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 p-6 sm:p-8 border-b border-brand-border bg-beige-soft/10">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl leading-none">
                {title}
              </h2>
              <button
                aria-label="Close modal"
                className="rounded-full border border-brand-border p-2 text-brand-muted transition hover:border-ink hover:text-ink hover:bg-beige-soft"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
