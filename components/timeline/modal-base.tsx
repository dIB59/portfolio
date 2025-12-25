"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal Root - Orchestrates the Radix Dialog state
 */
export function Modal({
    children,
    isOpen,
    onClose
}: {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AnimatePresence>
                {isOpen && children}
            </AnimatePresence>
        </DialogPrimitive.Root>
    );
}

/**
 * Modal Content - Handles the backdrop, centering, and animations
 */
export function ModalContent({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-background/90 z-50 backdrop-blur-sm"
                />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
                <m.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={cn(
                        "fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full md:max-h-[85vh] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col",
                        className
                    )}
                >
                    {children}
                </m.div>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
}

/**
 * Modal Header - Standardized layout for title and close button
 */
export function ModalHeader({
    title,
    subtitle,
    onClose
}: {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
                {subtitle && (
                    <span className="text-sm text-muted-foreground block mb-0.5">
                        {subtitle}
                    </span>
                )}
                <DialogPrimitive.Title className="text-2xl font-bold text-foreground">
                    {title}
                </DialogPrimitive.Title>
            </div>
            <DialogPrimitive.Close asChild>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close</span>
                </button>
            </DialogPrimitive.Close>
        </div>
    );
}

/**
 * Modal Body - Scrollable content area
 */
export function ModalBody({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex-1 overflow-y-auto p-6 space-y-6", className)}>
            {children}
        </div>
    );
}

/**
 * Modal Footer - Sticky bottom area for actions
 */
export function ModalFooter({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("p-6 border-t border-border flex gap-3", className)}>
            {children}
        </div>
    );
}

/**
 * Modal Section - Reusable titled section for content organization
 */
export function ModalSection({
    title,
    children,
    className
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("space-y-4", className)}>
            <h3 className="text-lg font-semibold text-foreground">
                {title}
            </h3>
            <div className="text-muted-foreground leading-relaxed">
                {children}
            </div>
        </div>
    );
}
