"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  User, 
  LogOut, 
  Plus, 
  Clock, 
  Sparkles,
  Send,
  Copy,
  Download,
  Trash2,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import React from "react";
import { cn } from "@/lib/utils";

// Interfaces

// Interfaces
interface Summary {
  id: string;
  title: string;
  originalText: string;
  summaryText: string;
  createdAt: string;
  wordCount: number;
  charCount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

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

export default function DashboardPage() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  
  // Mock user data - em produção viria da autenticação
  const [user] = useState<User>({
    id: "1",
    name: "João Silva",
    email: "joao@email.com",
    avatar: ""
  });

  // Contadores
  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  // Mock data para histórico
  useEffect(() => {
    const mockSummaries: Summary[] = [
      {
        id: "1",
        title: "Artigo sobre IA",
        originalText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        summaryText: "Resumo sobre inteligência artificial e suas aplicações.",
        createdAt: "2024-01-15T10:30:00Z",
        wordCount: 150,
        charCount: 850
      },
      {
        id: "2",
        title: "Relatório de vendas",
        originalText: "Relatório detalhado sobre as vendas do último trimestre...",
        summaryText: "Vendas aumentaram 25% no último trimestre.",
        createdAt: "2024-01-14T14:20:00Z",
        wordCount: 200,
        charCount: 1200
      }
    ];
    setSummaries(mockSummaries);
  }, []);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Por favor, insira um texto para resumir.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Aqui você faria a chamada para a API
      // const response = await fetch('/api/summarize', { ... });
      
      // Simulação de delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock do resumo
      const mockSummary = "Este é um resumo gerado automaticamente do texto fornecido. A IA analisou o conteúdo e extraiu os pontos principais para criar este resumo conciso e informativo.";
      setSummaryText(mockSummary);
      
      // Adicionar ao histórico
      const newSummary: Summary = {
        id: Date.now().toString(),
        title: `Resumo ${summaries.length + 1}`,
        originalText: inputText,
        summaryText: mockSummary,
        createdAt: new Date().toISOString(),
        wordCount,
        charCount
      };
      
      setSummaries(prev => [newSummary, ...prev]);
      
    } catch {
      setError("Erro ao gerar resumo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Aqui você limparia o token de autenticação
    router.push("/");
  };

  const handleNewSummary = () => {
    setInputText("");
    setSummaryText("");
    setSelectedSummary(null);
    setError("");
  };

  const handleSelectSummary = (summary: Summary) => {
    setSelectedSummary(summary);
    setInputText(summary.originalText);
    setSummaryText(summary.summaryText);
  };

  const handleCopySummary = () => {
    if (summaryText) {
      navigator.clipboard.writeText(summaryText);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-80 bg-card border-r border-border flex flex-col"
      >
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">SummarizeAI</span>
          </div>
          
          {/* Perfil do usuário */}
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="p-4 border-b border-border">
          <Button 
            onClick={handleNewSummary}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white mb-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Resumo
          </Button>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle variant="button" size="sm" />
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Histórico de resumos */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Resumos Recentes
            </h3>
            
            <div className="space-y-2">
              {summaries.map((summary) => (
                <motion.div
                  key={summary.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50",
                    selectedSummary?.id === summary.id ? "bg-muted border-cyan-500" : "bg-card border-border"
                  )}
                  onClick={() => handleSelectSummary(summary)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium truncate flex-1">{summary.title}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {summary.summaryText}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{summary.wordCount} palavras</span>
                    <span>{formatDate(summary.createdAt)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Botão de logout */}
        <div className="p-4 border-t border-border">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </motion.aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border-b border-border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Transforme textos longos em resumos inteligentes</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total de resumos</p>
                <p className="text-2xl font-bold text-cyan-600">{summaries.length}</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Área de trabalho */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Área de entrada de texto */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Texto Original
                  </CardTitle>
                  <CardDescription>
                    Cole ou digite o texto que você deseja resumir
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Cole seu texto aqui..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                    
                    {/* Contadores */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>{charCount} caracteres</span>
                        <span>{wordCount} palavras</span>
                      </div>
                      
                      <Button
                        onClick={handleSummarize}
                        disabled={!inputText.trim() || isLoading}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? "Resumindo..." : "Resumir Texto"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mensagem de erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Área do resumo */}
            {summaryText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-cyan-500" />
                          Resumo Gerado
                        </CardTitle>
                        <CardDescription>
                          Resumo inteligente do seu texto
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopySummary}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-foreground leading-relaxed">{summaryText}</p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <span>Resumo gerado com IA</span>
                      <span>{summaryText.split(' ').length} palavras no resumo</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}