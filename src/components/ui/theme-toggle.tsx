"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

// Theme icons mapping
const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

// Theme types
export type ThemeToggleVariant = "button" | "switch" | "dropdown" | "tabs" | "grid" | "radial" | "cards";
export type ThemeToggleSize = "sm" | "md" | "lg";
export type Theme = "light" | "dark" | "system";

// Props interface
interface ThemeToggleProps {
  variant?: ThemeToggleVariant;
  size?: ThemeToggleSize;
  showLabel?: boolean;
  themes?: Theme[];
  className?: string;
}

// Theme toggle component
export function ThemeToggle({
  variant = "button",
  size = "md",
  showLabel = false,
  themes = ["light", "dark", "system"],
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-10 w-10 text-base",
  };

  // Evita problemas de hidratação aguardando a montagem do componente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Retorna um placeholder durante a hidratação
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          sizeClasses[size],
          "rounded-md transition-colors hover:bg-accent",
          className
        )}
        aria-label="Carregando tema..."
        disabled
      >
        <Monitor className="h-4 w-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme as Theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  if (variant === "button") {
    const currentTheme = (theme as Theme) || "system";
    const Icon = themeIcons[currentTheme] || themeIcons.system;

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={cycleTheme}
        className={cn(
          sizeClasses[size],
          "rounded-md transition-colors hover:bg-accent",
          className
        )}
        aria-label="Alternar tema"
      >
        <Icon className="h-4 w-4" />
        {showLabel && (
          <span className="ml-2 capitalize">{currentTheme}</span>
        )}
      </Button>
    );
  }

  return null;
}