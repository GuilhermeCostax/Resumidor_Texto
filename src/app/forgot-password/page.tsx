"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, ArrowLeft, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { API_ENDPOINTS, apiPost } from "@/lib/api";

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
} as const;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiPost(API_ENDPOINTS.auth.forgotPassword, {
        email,
      });

      if (response.success) {
        setSuccess(true);
      } else {
        setError("Erro ao enviar e-mail de recuperação. Tente novamente.");
      }
    } catch (err: any) {
      console.error("Erro ao solicitar recuperação de senha:", err);
      setError(
        err.message || "Erro ao enviar e-mail de recuperação. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <KeyRound className="h-5 w-5" />
            <span>AI Text Summarizer</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="mx-auto max-w-md"
          >
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Recuperar senha</CardTitle>
                <CardDescription>
                  Digite seu e-mail para receber um link de recuperação de senha
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {success ? (
                  <div className="text-center space-y-4">