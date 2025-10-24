# 🔧 Backend - API REST com Supabase

Este é o backend do projeto tutorial. Aqui você aprenderá a criar uma API REST que se conecta ao Supabase.

## 📋 O que este backend faz

- ✅ Conecta com o banco de dados Supabase
- ✅ Fornece endpoints para o frontend
- ✅ Gerencia produtos da padaria (CRUD)
- ✅ Trata erros e valida dados

## 🏗️ Arquitetura

```
Backend/
├── server.js          # Servidor principal com todas as rotas
├── package.json       # Dependências do projeto
├── .env.example       # Exemplo de configuração
└── README.md          # Esta documentação
```

## 🚀 Passo a Passo para Executar

### 1. Configurar o Supabase

Antes de executar o backend, você precisa configurar o Supabase:

#### 1.1 Criar conta no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub ou email

#### 1.2 Criar novo projeto
1. Clique em "New Project"
2. Escolha uma organização
3. Dê um nome ao projeto (ex: "padaria-tutorial")
4. Crie uma senha forte para o banco
5. Escolha uma região próxima
6. Clique em "Create new project"

#### 1.3 Obter as chaves de acesso
1. Aguarde o projeto ser criado (1-2 minutos)
2. Vá em Settings > API
3. Copie a "URL" e a "anon public" key

#### 1.4 Criar a tabela de produtos
1. Vá em SQL Editor
2. Cole e execute este código:

```sql
-- Criar tabela de produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar RLS (Row Level Security)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública" ON produtos
    FOR SELECT USING (true);

-- Política para permitir inserção pública
CREATE POLICY "Permitir inserção pública" ON produtos
    FOR INSERT WITH CHECK (true);

-- Política para permitir exclusão pública
CREATE POLICY "Permitir exclusão pública" ON produtos
    FOR DELETE USING (true);

-- Conceder permissões
GRANT SELECT, INSERT, DELETE ON produtos TO anon;
GRANT SELECT, INSERT, DELETE ON produtos TO authenticated;
GRANT USAGE ON SEQUENCE produtos_id_seq TO anon;
GRANT USAGE ON SEQUENCE produtos_id_seq TO authenticated;

-- Dados iniciais para demonstração
INSERT INTO produtos (nome, preco, descricao) VALUES
('Pão Francês', 0.50, 'Pão tradicional brasileiro crocante por fora e macio por dentro'),
('Croissant', 3.50, 'Croissant francês artesanal com massa folhada'),
('Bolo de Chocolate', 25.00, 'Bolo de chocolate com cobertura cremosa');
```

### 2. Configurar o Backend

#### 2.1 Instalar dependências
```bash
cd backend
npm install
```

#### 2.2 Configurar variáveis de ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar o arquivo .env com suas chaves do Supabase
# Use qualquer editor de texto (Notepad, VS Code, etc.)
```

No arquivo `.env`, substitua pelos seus valores reais:
```env
SUPABASE_URL=https://seu-projeto-id.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon-aqui
PORT=3000
```

#### 2.3 Iniciar o servidor
```bash
npm start
```

Se tudo estiver correto, você verá:
```
🚀 ================================
🥖 SERVIDOR PADARIA INICIADO!
🚀 ================================
📡 Servidor rodando na porta: 3000
🌐 URL local: http://localhost:3000
📋 API disponível em: http://localhost:3000/api
```

## 📡 Endpoints da API

### GET /api/test
Testa se a API está funcionando.

**Resposta:**
```json
{
  "success": true,
  "message": "API funcionando perfeitamente!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/produtos
Lista todos os produtos cadastrados.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Pão Francês",
      "preco": 0.50,
      "descricao": "Pão tradicional brasileiro",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

### POST /api/produtos
Cadastra um novo produto.

**Requisição:**
```json
{
  "nome": "Sonho",
  "preco": 2.00,
  "descricao": "Sonho recheado com doce de leite"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Produto cadastrado com sucesso!",
  "data": {
    "id": 4,
    "nome": "Sonho",
    "preco": 2.00,
    "descricao": "Sonho recheado com doce de leite",
    "created_at": "2024-01-15T10:35:00Z"
  }
}
```

### DELETE /api/produtos/:id
Exclui um produto pelo ID.

**Resposta:**
```json
{
  "success": true,
  "message": "Produto excluído com sucesso!",
  "data": {
    "id": 4,
    "nome": "Sonho",
    "preco": 2.00
  }
}
```

## 🧪 Testando a API

### Usando o navegador
1. Abra: `http://localhost:3000/api/test`
2. Abra: `http://localhost:3000/api/produtos`

### Usando curl (terminal)
```bash
# Testar API
curl http://localhost:3000/api/test

# Listar produtos
curl http://localhost:3000/api/produtos

# Cadastrar produto
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Pão de Mel","preco":3.00,"descricao":"Pão de mel caseiro"}'

# Excluir produto (substitua 1 pelo ID real)
curl -X DELETE http://localhost:3000/api/produtos/1
```

## 🆘 Problemas Comuns

### ❌ Erro: "Configurações do Supabase não encontradas"
**Solução:** Verifique se o arquivo `.env` existe e contém as chaves corretas.

### ❌ Erro: "permission denied for table produtos"
**Solução:** Execute novamente o SQL de criação da tabela, especialmente as políticas RLS.

### ❌ Erro: "EADDRINUSE: address already in use"
**Solução:** A porta 3000 já está em uso. Mude a porta no `.env` ou pare outros serviços.

### ❌ Erro: "Cannot find module"
**Solução:** Execute `npm install` para instalar as dependências.

### ❌ Frontend não consegue acessar a API
**Solução:** Verifique se o CORS está configurado e se o backend está rodando.

## 📚 Conceitos Aprendidos

- **Express.js**: Framework para criar APIs REST
- **Supabase**: Banco de dados como serviço
- **CORS**: Permitir acesso entre domínios diferentes
- **Middleware**: Funções que processam requisições
- **Environment Variables**: Configurações seguras
- **REST API**: Padrão de comunicação HTTP
- **CRUD**: Create, Read, Update, Delete

## 🎯 Próximos Passos

1. ✅ Backend funcionando
2. ➡️ Criar o frontend
3. ➡️ Conectar frontend com backend
4. ➡️ Testar a aplicação completa

---

**Parabéns! Você criou sua primeira API REST com Supabase! 🎉**