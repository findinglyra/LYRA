import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Add LYRA-specific card variants
const LyraCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'babyBlue' | 'blueGrotto' | 'mediumBlue' | 'navyBlue' | 'gradient' | 'glass' }
>(({ className, variant, ...props }, ref) => {
  const variantClasses = {
    babyBlue: "bg-[#68bbe3]/10 border-[#68bbe3]/20 text-[#003060]",
    blueGrotto: "bg-[#0e86d4]/10 border-[#0e86d4]/20 text-[#003060]",
    mediumBlue: "bg-[#055c9d]/10 border-[#055c9d]/20 text-white",
    navyBlue: "bg-[#003060]/10 border-[#003060]/20 text-white",
    gradient: "bg-gradient-to-br from-[#68bbe3]/10 to-[#003060]/20 border-[#0e86d4]/20 text-[#003060]",
    glass: "bg-white/10 backdrop-blur-md border-white/20 text-white",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border shadow-sm",
        variant ? variantClasses[variant] : "bg-card text-card-foreground",
        className
      )}
      {...props}
    />
  )
})
LyraCard.displayName = "LyraCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, LyraCard }
