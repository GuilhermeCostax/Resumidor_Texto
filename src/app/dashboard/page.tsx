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