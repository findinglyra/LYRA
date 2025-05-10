import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader } from "lucide-react";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        babyBlue: "bg-[#68bbe3] text-white hover:bg-[#68bbe3]/90",
        blueGrotto: "bg-[#0e86d4] text-white hover:bg-[#0e86d4]/90",
        mediumBlue: "bg-[#055c9d] text-white hover:bg-[#055c9d]/90",
        navyBlue: "bg-[#003060] text-white hover:bg-[#003060]/90",
        gradient: "bg-gradient-to-r from-[#0e86d4] to-[#68bbe3] text-white hover:shadow-lg transition-shadow",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, loadingText, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading && 'cursor-not-allowed opacity-75',
          'relative transition-all duration-200 ease-in-out'
        )}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="h-4 w-4 animate-spin" />
          </div>
        )}
        <span className={cn(isLoading && 'opacity-0')}>
          {props.children}
        </span>
        {isLoading && loadingText && (
          <span className="sr-only">{loadingText}</span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button"

export { Button, buttonVariants }
