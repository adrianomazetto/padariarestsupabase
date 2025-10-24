# 🥖 Tutorial Supabase - Instruções de Execução

## 📋 Visão Geral
Este projeto é um tutorial completo para aprender Supabase com Node.js e JavaScript vanilla. Você criará uma aplicação de gerenciamento de produtos de padaria com backend e frontend.

## 🎯 O que você vai aprender
- Configurar e usar Supabase (Backend as a Service)
- Criar APIs REST com Node.js e Express
- Desenvolver frontend responsivo com JavaScript vanilla
- Conectar frontend e backend
- Operações CRUD (Create, Read, Update, Delete)

## 📁 Estrutura do Projeto
```
padaria/
├── backend/                 # Servidor Node.js + Express
│   ├── server.js           # Servidor principal
│   ├── package.json        # Dependências do backend
│   ├── .env.example        # Exemplo de configuração
│   └── README.md           # Documentação do backend
├── frontend/               # Interface do usuário
│   ├── index.html          # Página principal
│   ├── script.js           # Lógica JavaScript
│   ├── style.css           # Estilos personalizados
│   ├── docs.html           # Documentação
│   └── README.md           # Documentação do frontend
└── INSTRUCOES_EXECUCAO.md  # Este arquivo
```

## 🚀 Passo a Passo para Execução

### 1️⃣ Configurar o Supabase

1. **Criar conta no Supabase:**
   - Acesse: https://supabase.com
   - Clique em "Start your project"
   - Faça login com GitHub ou email

2. **Criar novo projeto:**
   - Clique em "New Project"
   - Escolha uma organização
   - Nome do projeto: `padaria-tutorial`
   - Senha do banco: `sua_senha_segura`
   - Região: `South America (São Paulo)`
   - Clique em "Create new project"

3. **Obter chaves de acesso:**
   - Vá em "Settings" → "API"
   - Copie a "URL" e "anon public"
   - Guarde essas informações

4. **Criar tabela de produtos:**
   - Vá em "Table Editor"
   - Clique em "Create a new table"
   - Nome: `produtos`
   - Colunas:
     ```sql
     id (int8, primary key, auto-increment)
     nome (text, required)
     preco (float8, required)
     descricao (text, optional)
     created_at (timestamptz, default: now())
     ```

5. **Configurar RLS (Row Level Security):**
   - Na tabela `produtos`, clique em "RLS disabled"
   - Ative o RLS
   - Adicione políticas:
     ```sql
     -- Permitir leitura para todos
     CREATE POLICY "Permitir leitura" ON produtos FOR SELECT USING (true);
     
     -- Permitir inserção para todos
     CREATE POLICY "Permitir inserção" ON produtos FOR INSERT WITH CHECK (true);
     
     -- Permitir exclusão para todos
     CREATE POLICY "Permitir exclusão" ON produtos FOR DELETE USING (true);
     ```

### 2️⃣ Configurar o Backend

1. **Navegar para a pasta backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente:**
   - Copie o arquivo `.env.example` para `.env`
   - Edite o arquivo `.env` com suas chaves do Supabase:
   ```env
   SUPABASE_URL=sua_url_do_supabase
   SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   PORT=3000
   ```

4. **Iniciar o servidor:**
   ```bash
   npm start
   ```

5. **Verificar se está funcionando:**
   - Abra: http://localhost:3000/api/test
   - Deve retornar: `{"success":true,"message":"API funcionando perfeitamente!"}`

### 3️⃣ Testar o Frontend

1. **Abrir a aplicação:**
   - Abra: http://localhost:3000
   - A página da padaria deve carregar

2. **Testar funcionalidades:**
   - **Cadastrar produto:** Preencha o formulário e clique em "Cadastrar"
   - **Listar produtos:** Os produtos aparecem automaticamente
   - **Excluir produto:** Clique no botão "Excluir" de qualquer produto

### 4️⃣ Verificar Funcionamento

1. **Status da conexão:**
   - No topo da página, deve aparecer "🟢 Conectado"
   - Se aparecer "🔴 Desconectado", verifique as configurações

2. **Operações CRUD:**
   - ✅ **Create:** Cadastrar novos produtos
   - ✅ **Read:** Listar produtos existentes
   - ✅ **Update:** (Não implementado neste tutorial)
   - ✅ **Delete:** Excluir produtos

3. **Responsividade:**
   - Teste em diferentes tamanhos de tela
   - A interface deve se adaptar automaticamente

## 🔧 Solução de Problemas

### ❌ Erro: "Conexão falhou"
- Verifique se o servidor backend está rodando
- Confirme se a URL da API está correta
- Verifique as configurações do Supabase

### ❌ Erro: "Permission denied"
- Verifique se o RLS está configurado corretamente
- Confirme se as políticas foram criadas
- Teste as chaves de API do Supabase

### ❌ Erro: "Cannot read properties of null"
- Limpe o cache do navegador (Ctrl + F5)
- Verifique se todos os arquivos estão carregando

### ❌ Servidor não inicia
- Verifique se o Node.js está instalado
- Confirme se as dependências foram instaladas
- Verifique se a porta 3000 não está em uso

## 📚 Próximos Passos

Após completar este tutorial, você pode:

1. **Adicionar autenticação:**
   - Implementar login/logout com Supabase Auth
   - Proteger rotas com autenticação

2. **Melhorar a interface:**
   - Adicionar edição de produtos
   - Implementar busca e filtros
   - Adicionar paginação

3. **Expandir funcionalidades:**
   - Upload de imagens dos produtos
   - Categorias de produtos
   - Relatórios e estatísticas

4. **Deploy:**
   - Hospedar no Vercel, Netlify ou Heroku
   - Configurar domínio personalizado

## 🆘 Suporte

Se encontrar problemas:

1. **Consulte a documentação:**
   - `backend/README.md` - Documentação do backend
   - `frontend/README.md` - Documentação do frontend
   - `frontend/docs.html` - Documentação interativa

2. **Recursos úteis:**
   - [Documentação oficial do Supabase](https://supabase.com/docs)
   - [Guia do Express.js](https://expressjs.com/pt-br/)
   - [MDN Web Docs](https://developer.mozilla.org/pt-BR/)

3. **Comunidade:**
   - [Discord do Supabase](https://discord.supabase.com/)
   - [Stack Overflow](https://stackoverflow.com/)

## ✅ Checklist de Conclusão

- [ ] Conta no Supabase criada
- [ ] Projeto Supabase configurado
- [ ] Tabela `produtos` criada
- [ ] RLS e políticas configuradas
- [ ] Backend rodando sem erros
- [ ] Frontend carregando corretamente
- [ ] Cadastro de produtos funcionando
- [ ] Listagem de produtos funcionando
- [ ] Exclusão de produtos funcionando
- [ ] Interface responsiva testada

## 🎉 Parabéns!

Você completou o tutorial Supabase! Agora você sabe como:
- Configurar um projeto Supabase
- Criar APIs REST com Node.js
- Desenvolver interfaces responsivas
- Conectar frontend e backend
- Implementar operações CRUD

Continue praticando e explorando novas funcionalidades!

---

**Desenvolvido para fins educacionais** 📚
**Versão:** 1.0 | **Data:** 2024