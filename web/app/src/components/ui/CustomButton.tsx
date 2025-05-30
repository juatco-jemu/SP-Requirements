import { VariantProps, cva } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(["transition-colors"], {
  variants: {
    variant: {
      default: ["bg-secondary", "hover:bg-secondary-hover"],
      ghost: ["hover:bg-gray-100"],
      cancel: ["ml-3 bg-up_maroon text-white", "hover:bg-up_maroon-hover text-white"],
      yellow: ["bg-up_yellow", "hover:bg-up_yellow-hover"],
      green: ["bg-up_green text-white", "hover:bg-up_green-hover text-white"],
    },
    size: {
      default: ["rounded", "p-2"],
      icon: ["rounded-full", "w-10", "h-10", "flex", "items-center", "justify-center", "p-2.5"],
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = VariantProps<typeof buttonStyles> & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function CustomButton({ variant, size, className, ...props }: ButtonProps) {
  return <button {...props} className={twMerge(buttonStyles({ variant, size }), className)} />;
}
