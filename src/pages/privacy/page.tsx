'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Shield } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ElegantShape } from '@/components/ui/elegant-shape';

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
      ease: 'easeOut' as const,
    },
  },
} as const;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape delay={0.3} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
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
        className="relative z-10 w-full max-w-4xl mt-20 mb-10"
      >
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Política de Privacidade</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2>1. Introdução</h2>
              <p>
                Esta Política de Privacidade descreve como o SummarizeAI coleta, usa e compartilha suas informações pessoais quando você utiliza nosso serviço. Respeitamos sua privacidade e estamos comprometidos em proteger suas informações pessoais.
              </p>

              <h2>2. Informações que Coletamos</h2>
              <p>
                Coletamos os seguintes tipos de informações:
              </p>
              <ul>
                <li><strong>Informações de Conta:</strong> Nome, endereço de e-mail e senha quando você se registra.</li>
                <li><strong>Conteúdo do Usuário:</strong> Textos que você submete para resumo.</li>
                <li><strong>Dados de Uso:</strong> Informações sobre como você interage com nosso serviço.</li>
                <li><strong>Informações do Dispositivo:</strong> Tipo de navegador, sistema operacional e endereço IP.</li>
              </ul>

              <h2>3. Como Usamos Suas Informações</h2>
              <p>
                Utilizamos suas informações para:
              </p>
              <ul>
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Processar e completar transações</li>
                <li>Enviar informações técnicas, atualizações e mensagens de suporte</li>
                <li>Monitorar o uso de nossos serviços</li>
                <li>Detectar, prevenir e resolver problemas técnicos</li>
                <li>Personalizar sua experiência</li>
              </ul>

              <h2>4. Compartilhamento de Informações</h2>
              <p>
                Não vendemos suas informações pessoais a terceiros. Podemos compartilhar suas informações nas seguintes circunstâncias:
              </p>
              <ul>
                <li>Com provedores de serviços que nos ajudam a operar nosso serviço</li>
                <li>Para cumprir obrigações legais</li>
                <li>Para proteger os direitos e a segurança de nossa empresa e usuários</li>
                <li>Em conexão com uma fusão, venda de ativos ou aquisição</li>
              </ul>

              <h2>5. Segurança de Dados</h2>
              <p>
                Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro.
              </p>

              <h2>6. Seus Direitos</h2>
              <p>
                Dependendo da sua localização, você pode ter certos direitos relacionados às suas informações pessoais, incluindo:
              </p>
              <ul>
                <li>Acessar e receber uma cópia de suas informações</li>
                <li>Retificar informações imprecisas</li>
                <li>Solicitar a exclusão de suas informações</li>
                <li>Restringir ou opor-se ao processamento de suas informações</li>
                <li>Portabilidade de dados</li>
              </ul>

              <h2>7. Retenção de Dados</h2>
              <p>
                Mantemos suas informações pessoais pelo tempo necessário para fornecer nossos serviços e cumprir nossas obrigações legais. Quando não tivermos mais uma necessidade comercial legítima de processar suas informações pessoais, excluiremos ou anonimizaremos essas informações.
              </p>

              <h2>8. Crianças</h2>
              <p>
                Nosso serviço não se destina a pessoas com menos de 13 anos. Não coletamos intencionalmente informações pessoais de crianças menores de 13 anos. Se tomarmos conhecimento de que coletamos informações pessoais de uma criança menor de 13 anos, tomaremos medidas para remover essas informações.
              </p>

              <h2>9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e atualizando a data de &quot;última atualização&quot;.
              </p>

              <h2>10. Contato</h2>
              <p>
                Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco pelo e-mail: privacidade@summarizeai.com.br
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/register"
                className="text-cyan-600 hover:text-cyan-500 font-medium transition-colors"
              >
                Voltar para o cadastro
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}