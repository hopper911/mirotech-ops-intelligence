import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  variant?: "default" | "strong" | "app";
  lift?: boolean;
};

const variantClass = {
  default: "glass",
  strong: "glass-strong",
  app: "glass-app",
} as const;

export function GlassCard({
  children,
  className = "",
  as: Tag = "div",
  variant = "default",
  lift = false,
}: GlassCardProps) {
  return (
    <Tag
      className={`rounded-2xl ${variantClass[variant]} ${lift ? "glass-lift" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
