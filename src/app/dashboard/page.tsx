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
import { apiGet, apiPost, apiDelete, API_ENDPOINTS } from "@/lib/api";
import { Pagination } from "@/components/ui/pagination";
import { PageSizeSelector } from "@/components/ui/page-size-selector";

// Interfaces

// Interfaces
interface Summary {
  id: number;
  original_text: string;
  summary_text: string;
  created_at: string;
}

interface User {
  id: string;
  name?: string;
  username?: string;
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
  
  // Estados para dados reais da API
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Contadores
  const charCount = inputText ? inputText.length : 0;
  const wordCount = inputText && inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  // Carregar dados do usuário e histórico
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalSummaries, setTotalSummaries] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [historyError, setHistoryError] = useState<string>("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const response = await apiGet(API_ENDPOINTS.auth.me);

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        router.push('/');
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    loadUserData();
    loadHistory(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, currentPage, pageSize]);

  const loadHistory = async (page: number = 1, limit: number = pageSize) => {
    try {
      setIsLoadingHistory(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setHistoryError('Você precisa estar logado para ver seu histórico');
        return;
      }

      const skip = (page - 1) * limit;
      const response = await apiGet(`${API_ENDPOINTS.summaries.list}?skip=${skip}&limit=${limit}`);

      if (response.ok) {
        const data = await response.json();
        setSummaries(data.items);
        setTotalSummaries(data.total);
        setCurrentPage(page);
      } else {
        setHistoryError('Erro ao carregar histórico');
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setHistoryError('Erro ao carregar histórico');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSummarize = async () => {
    if (!inputText || !inputText.trim()) {
      setError("Por favor, insira um texto para resumir.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Chamada para a API do backend
      const response = await apiPost(API_ENDPOINTS.summaries.create, {
        texto_a_resumir: inputText
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      const resumoGerado = data.resumo;
      
      setSummaryText(resumoGerado);
      
      // Adicionar ao histórico local
      const newSummary: Summary = {
        id: data.id,
        original_text: inputText,
        summary_text: data.resumo,
        created_at: data.created_at
      };
      setSummaries(prev => [newSummary, ...prev]);
      
      // Atualizar o total de resumos
      setTotalSummaries(prev => prev + 1);
      
      // Voltar para a primeira página
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        // Se já estiver na primeira página, recarregar o histórico
        loadHistory(1, pageSize);
      }
      
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      setError("Erro ao gerar resumo. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Limpar o token de autenticação
    localStorage.removeItem('token');
    router.push("/");
  };

  const handleSettings = () => {
    // Placeholder para funcionalidade de configurações
    alert('Funcionalidade de configurações em desenvolvimento!');
  };

  const handleNewSummary = () => {
    setInputText("");
    setSummaryText("");
    setSelectedSummary(null);
    setError("");
  };

  const handleSelectSummary = (summary: Summary) => {
    setSelectedSummary(summary);
    setInputText(summary?.original_text || '');
    setSummaryText(summary?.summary_text || '');
  };

  const handleDeleteSummary = async (summaryId: number) => {
    try {
      const response = await apiDelete(API_ENDPOINTS.summaries.delete(summaryId));

      if (response.ok) {
        // Remove do estado local
        setSummaries(prev => prev.filter(s => s.id !== summaryId));
        // Atualizar o total de resumos
        setTotalSummaries(prev => prev - 1);
        
        // Se o resumo deletado estava selecionado, limpa a seleção
        if (selectedSummary?.id === summaryId) {
          setSelectedSummary(null);
          setInputText("");
          setSummaryText("");
        }
        
        // Se após a exclusão a página atual ficar vazia e não for a primeira página,
        // voltar para a página anterior
        if (summaries && summaries.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          // Recarregar a página atual
          loadHistory(currentPage, pageSize);
        }
      } else {
        console.error('Erro ao deletar resumo');
      }
    } catch (error) {
      console.error('Erro ao deletar resumo:', error);
    }
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
            {isLoadingUser ? (
              <div className="animate-pulse flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ) : user ? (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name?.charAt(0) || user.username?.charAt(0) || user.email.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name || user.username || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Erro ao carregar</p>
                </div>
              </div>
            )}
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
              onClick={handleSettings}
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
              {isLoadingHistory ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse p-3 rounded-lg border bg-card">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : historyError ? (
                <div className="text-center py-8 text-red-500">
                  <p className="text-sm">{historyError}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => loadHistory(currentPage, pageSize)}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : (summaries && summaries.length > 0) ? (
                summaries.map((summary, index) => (
                  <motion.div
                    key={summary?.id || `summary-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 group",
                      selectedSummary?.id === summary.id ? "bg-muted border-cyan-500" : "bg-card border-border"
                    )}
                    onClick={() => handleSelectSummary(summary)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium truncate flex-1">
                      {(summary && summary.original_text) ? summary.original_text.substring(0, 50) : 'Resumo sem título'}...
                    </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (summary?.id) {
                            handleDeleteSummary(summary.id);
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {summary && summary.summary_text ? summary.summary_text : ''}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{(summary && summary.original_text) ? summary.original_text.split(' ').length : 0} palavras</span>
                      <span>{(summary && summary.created_at) ? formatDate(summary.created_at) : ''}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum resumo encontrado</p>
                  <p className="text-xs">Crie seu primeiro resumo!</p>
                </div>
              )}
              
              {/* Paginação e Seletor de Tamanho */}
                {totalSummaries > 0 && (
                  <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={Math.ceil(totalSummaries / pageSize)}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                    <PageSizeSelector 
                      pageSize={pageSize}
                      onPageSizeChange={(size) => {
                        setPageSize(size);
                        setCurrentPage(1); // Voltar para a primeira página ao mudar o tamanho
                      }}
                    />
                  </div>
                )}
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
                <p className="text-2xl font-bold text-cyan-600">{summaries ? summaries.length : 0}</p>
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
                        disabled={!inputText || !inputText.trim() || isLoading}
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
                      <span>{(summaryText && typeof summaryText === 'string') ? summaryText.split(' ').length : 0} palavras no resumo</span>
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