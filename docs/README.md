# Documentação do Projeto SummarizeAI

Esta pasta contém documentação importante para o projeto SummarizeAI, incluindo guias de melhores práticas, padrões de código, instruções de deploy e outras informações relevantes para o desenvolvimento e manutenção do projeto.

## Conteúdo

### Guias de Melhores Práticas
- [Melhores Práticas](./BEST_PRACTICES.md) - Guia de melhores práticas para evitar erros de compilação e garantir a qualidade do código.

### Guias de Deploy
- [Guia de Deploy Geral](./DEPLOY.md) - Instruções gerais para deploy da aplicação.
- [Deploy na Vercel](./DEPLOY_VERCEL.md) - Instruções específicas para deploy do frontend na Vercel.
- [Deploy no Render](./DEPLOY_RENDER.md) - Instruções específicas para deploy no Render.

### Checklists e Verificações
- [Checklist de Produção](./PRODUCTION_CHECKLIST.md) - Lista de verificações antes do deploy em produção.

## Objetivo

O objetivo desta documentação é fornecer orientações claras para todos os desenvolvedores que trabalham no projeto, garantindo consistência, qualidade e evitando problemas comuns durante o desenvolvimento e deploy.

## Configurações Importantes

### Vercel
O projeto inclui configurações específicas para garantir um deploy bem-sucedido na Vercel:

- `vercel.json` - Configura o processo de build para executar o linter antes do build.
- `.eslintrc.json` - Detecta problemas de indentação e outros erros comuns.
- `.prettierrc` - Garante uma formatação consistente do código.
- `.vscode/settings.json` - Ajuda a visualizar espaços em branco e indentação.
- `.husky/pre-commit` - Verifica o código antes de cada commit.

### Render
O projeto também inclui configurações para deploy no Render:

- `render.yaml` - Configuração completa para deploy do backend, frontend e banco de dados.

## Contribuição

Sinta-se à vontade para contribuir com esta documentação, adicionando novos guias, atualizando informações existentes ou corrigindo erros. Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para suas alterações
3. Envie um pull request com suas contribuições

## Contato

Se tiver dúvidas ou sugestões sobre a documentação, entre em contato com a equipe de desenvolvimento.