'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, FileText } from 'lucide-react';
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

export default function TermsPage() {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Termos de Uso</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o SummarizeAI, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.
              </p>

              <h2>2. Descrição do Serviço</h2>
              <p>
                O SummarizeAI é uma ferramenta de resumo de texto baseada em inteligência artificial que permite aos usuários transformar textos longos em resumos concisos e informativos.
              </p>

              <h2>3. Contas de Usuário</h2>
              <p>
                Para utilizar determinados recursos do SummarizeAI, você precisará criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrerem em sua conta.
              </p>

              <h2>4. Uso Aceitável</h2>
              <p>
                Você concorda em usar o SummarizeAI apenas para fins legais e de acordo com estes Termos. Você não deve:
              </p>
              <ul>
                <li>Violar quaisquer leis aplicáveis ou regulamentos</li>
                <li>Infringir direitos de propriedade intelectual</li>
                <li>Tentar obter acesso não autorizado aos nossos sistemas</li>
                <li>Usar o serviço para distribuir malware ou conteúdo prejudicial</li>
                <li>Sobrecarregar intencionalmente nossa infraestrutura</li>
              </ul>

              <h2>5. Propriedade Intelectual</h2>
              <p>
                O SummarizeAI e todo o seu conteúdo, recursos e funcionalidades são de propriedade da nossa empresa e estão protegidos por leis de propriedade intelectual. Você não pode reproduzir, distribuir, modificar ou criar trabalhos derivados sem nossa permissão expressa.
              </p>

              <h2>6. Limitação de Responsabilidade</h2>
              <p>
                O SummarizeAI é fornecido &quot;como está&quot; e &quot;conforme disponível&quot;, sem garantias de qualquer tipo. Não garantimos que o serviço será ininterrupto, seguro ou livre de erros.
              </p>

              <h2>7. Alterações nos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação dos Termos atualizados. O uso continuado do serviço após tais alterações constitui sua aceitação dos novos Termos.
              </p>

              <h2>8. Rescisão</h2>
              <p>
                Podemos encerrar ou suspender sua conta e acesso ao SummarizeAI imediatamente, sem aviso prévio, por qualquer motivo, incluindo, sem limitação, violação destes Termos.
              </p>

              <h2>9. Lei Aplicável</h2>
              <p>
                Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem considerar seus princípios de conflitos de leis.
              </p>

              <h2>10. Contato</h2>
              <p>
                Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelo e-mail: contato@summarizeai.com.br
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