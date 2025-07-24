'use client'

// Importações do React e Next.js
import { useState } from 'react'
import Link from 'next/link'

// Importações de bibliotecas externas
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Send } from 'lucide-react'

// Importações de componentes UI
import { 
  Button,
  Input,
  Label,
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Alert, AlertDescription 
} from '@/components/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('http://localhost:8001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
      } else {
        setError(data.detail || 'Erro ao solicitar recuperação de senha')
      }
    } catch (error) {
      console.error('Erro:', error)
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-bold">Recuperar Senha</CardTitle>
            <CardDescription className="text-center">
              Digite seu e-mail para receber um link de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-50 text-red-600 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message ? (
              <div className="text-center space-y-4">
                <Alert className="bg-green-50 text-green-600 border-green-200">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
                <div className="mt-4">
                  <Link
                    href="/login"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="h-10"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Link de Recuperação
                    </>
                  )}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    href="/login"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}