"use client";

import { motion } from "framer-motion";
import React from "react";

interface ElegantShapeProps {
  delay?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  color?: "cyan-blue" | "purple-pink" | "green-teal";
  size?: "sm" | "md" | "lg";
  opacity?: number;
}

export function ElegantShape({
  delay = 0,
  position = "top-right",
  color = "cyan-blue",
  size = "lg",
  opacity = 0.1,
}: ElegantShapeProps) {
  // Position classes
  const positionClasses = {
    "top-right": "-top-20 -right-20",
    "top-left": "-top-20 -left-20",
    "bottom-right": "-bottom-20 -right-20",
    "bottom-left": "-bottom-20 -left-20",
  };

  // Color gradient classes
  const colorClasses = {
    "cyan-blue": "from-cyan-400 to-blue-600",
    "purple-pink": "from-purple-400 to-pink-600",
    "green-teal": "from-green-400 to-teal-600",
  };

  // Size classes
  const sizeClasses = {
    sm: "w-64 h-64",
    md: "w-80 h-80",
    lg: "w-96 h-96",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity, scale: 1, rotate: 0 }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} bg-gradient-to-br ${colorClasses[color]} rounded-full blur-3xl`}
    />
  );
}