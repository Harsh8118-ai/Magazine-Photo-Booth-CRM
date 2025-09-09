// ./components/ui/index.jsx
import React from "react";

// helper for merging classNames
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-2xl border border-gray-200 bg-white shadow-sm", className)}
    {...props}
  />
));
Card.displayName = "Card";

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const Button = ({ className, ...props }) => (
  <button
    className={cn(
      "px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition",
      className
    )}
    {...props}
  />
);

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
