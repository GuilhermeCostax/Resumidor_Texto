"use client";

import { motion } from "framer-motion";
import { UserPlus, Sparkles, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ElegantShape } from "@/components/ui/elegant-shape";
import React from "react";

// Animation variants

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut" as const,
    },
  },
} as const;

// Password strength checker
function getPasswordStrength(password: string) {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
  };

  strength = Object.values(checks).filter(Boolean).length;
  
  return {
    strength,
    checks,
    label: strength < 2 ? "Fraca" : strength < 3 ? "Média" : "Forte",
    color: strength < 2 ? "red" : strength < 3 ? "yellow" : "green",
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    if (passwordStrength.strength < 3) {
      setError("A senha deve ser mais forte.");
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Você deve aceitar os termos de uso.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao criar conta');
      }

      // Fazer login automático após registro
      const loginResponse = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        localStorage.setItem('token', loginData.access_token);
        router.push('/dashboard');
      } else {
        // Se o login automático falhar, redirecionar para login
        router.push('/login');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape delay={0.3} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-purple-400 to-pink-600 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SummarizeAI</span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle variant="button" size="sm" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
        className="relative z-10 w-full max-w-md mt-20"
      >
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Junte-se ao SummarizeAI e transforme textos longos em resumos inteligentes
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nome completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="transition-all duration-200 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="transition-all duration-200 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pr-10 transition-all duration-200 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Força da senha:</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength.color === 'red' ? 'text-red-500' :
                          passwordStrength.color === 'yellow' ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full ${
                              i < passwordStrength.strength
                                ? passwordStrength.color === 'red' ? 'bg-red-500' :
                                  passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="space-y-1">
                        {Object.entries(passwordStrength.checks).map(([key, passed]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              passed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`} />
                            <span className={`text-xs ${
                              passed ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
                            }`}>
                              {key === 'length' && '8+ caracteres'}
                              {key === 'lowercase' && 'Letra minúscula'}
                              {key === 'uppercase' && 'Letra maiúscula'}
                              {key === 'number' && 'Número'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className={`pr-10 transition-all duration-200 focus:ring-cyan-500/20 focus:border-cyan-500 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : ''
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500">As senhas não coincidem</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-border"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  Eu aceito os{" "}
                  <Link href="/terms" className="text-cyan-600 hover:text-cyan-500 transition-colors">
                    termos de uso
                  </Link>
                  {" "}e a{" "}
                  <Link href="/privacy" className="text-cyan-600 hover:text-cyan-500 transition-colors">
                    política de privacidade
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white transition-all duration-200"
                disabled={isLoading || !acceptTerms}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar conta
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link
                  href="/login"
                  className="text-cyan-600 hover:text-cyan-500 font-medium transition-colors"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}