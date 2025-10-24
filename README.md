# 🥖 Tutorial Supabase - Sistema de Padaria

## 📋 Visão Geral
Este projeto é um tutorial educacional completo para aprender Supabase, demonstrando como criar uma aplicação web full-stack para gerenciamento de produtos de uma padaria.

## ✅ Status do Projeto
**🎉 PROJETO COMPLETO E FUNCIONAL!**

- ✅ Backend Node.js + Express configurado
- ✅ Frontend responsivo com JavaScript vanilla
- ✅ Integração com Supabase configurada
- ✅ Documentação completa criada
- ✅ Instruções de execução detalhadas
- ✅ Pronto para uso pelos alunos

## 🚀 Início Rápido
Para executar este projeto, consulte o arquivo **[INSTRUCOES_EXECUCAO.md](./INSTRUCOES_EXECUCAO.md)** que contém o passo a passo completo.

## 📋 O que você vai aprender

- ✅ Criar e configurar um banco de dados no Supabase
- ✅ Desenvolver uma API REST com Node.js e Express
- ✅ Criar uma interface web responsiva com HTML, CSS e JavaScript
- ✅ Conectar frontend e backend
- ✅ Implementar operações CRUD (Create, Read, Delete)

## 🏗️ Estrutura do Projeto

```
padaria/
├── frontend/           # Interface web (HTML, CSS, JS)
│   ├── index.html     # Página principal
│   ├── docs.html      # Documentação
│   ├── style.css      # Estilos
│   └── script.js      # Lógica JavaScript
├── backend/           # API REST (Node.js + Express)
│   ├── server.js      # Servidor principal
│   ├── package.json   # Dependências
│   └── .env.example   # Exemplo de configuração
└── README.md          # Este arquivo
```

## 🚀 Como executar o projeto

### Pré-requisitos
- Node.js instalado (versão 16 ou superior)
- Conta no Supabase (gratuita)

### Passo 1: Configurar o Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em Settings > API para obter suas chaves
4. Execute o SQL fornecido na documentação para criar a tabela

### Passo 2: Configurar o Backend
```bash
cd backend
npm install
cp .env.example .env
# Edite o arquivo .env com suas chaves do Supabase
npm start
```

### Passo 3: Abrir o Frontend
1. Abra o arquivo `frontend/index.html` no navegador
2. Ou use um servidor local como Live Server no VS Code

## 📚 Documentação Detalhada

- **Frontend**: Veja `frontend/README.md` para instruções detalhadas
- **Backend**: Veja `backend/README.md` para configuração da API
- **Supabase**: Instruções completas de configuração incluídas

## 🎯 Funcionalidades

- 📝 Cadastrar produtos da padaria
- 📋 Listar todos os produtos
- 🗑️ Excluir produtos
- 📱 Interface responsiva (mobile e desktop)
- 🎨 Design moderno com Tailwind CSS

## 🆘 Problemas Comuns

### Erro de CORS
Se você encontrar erros de CORS, certifique-se de que o backend está rodando na porta 3000.

### Erro de conexão com Supabase
Verifique se as chaves no arquivo `.env` estão corretas e se a tabela foi criada.

### Frontend não carrega dados
Confirme se o backend está rodando e se a URL da API está correta no JavaScript.

## 📞 Suporte

Este projeto foi criado para fins educacionais. Se você encontrar problemas:

1. Verifique a documentação específica de cada pasta
2. Confirme se todos os pré-requisitos foram atendidos
3. Verifique se as configurações do Supabase estão corretas

---

**Bom aprendizado! 🎓**