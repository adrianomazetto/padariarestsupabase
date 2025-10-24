// ===================================
// SERVIDOR BACKEND - TUTORIAL SUPABASE
// ===================================
// Este arquivo contém toda a lógica do servidor backend
// Aqui criamos uma API REST que se conecta ao Supabase

// 1. IMPORTAR DEPENDÊNCIAS
// Importamos todas as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 2. CONFIGURAR O SERVIDOR EXPRESS
// Express é o framework que nos ajuda a criar a API
const app = express();
const PORT = process.env.PORT || 3000;

// 3. CONFIGURAR MIDDLEWARES
// Middlewares são funções que processam as requisições

// CORS: permite que o frontend acesse nossa API
app.use(cors());

// JSON: permite que o servidor entenda dados em formato JSON
app.use(express.json());

// 4. CONFIGURAR CONEXÃO COM SUPABASE
// Aqui conectamos com o banco de dados Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Verificar se as configurações existem
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERRO: Configurações do Supabase não encontradas!');
    console.log('📝 Verifique se o arquivo .env existe e contém:');
    console.log('   - SUPABASE_URL');
    console.log('   - SUPABASE_ANON_KEY');
    process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Conexão com Supabase configurada!');

// 5. ROTAS DA API
// Aqui definimos os endpoints que o frontend pode chamar

// ROTA DE TESTE
// GET /api/test - Verifica se a API está funcionando
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API funcionando perfeitamente!',
        timestamp: new Date().toISOString()
    });
});

// BUSCAR TODOS OS PRODUTOS
// GET /api/produtos - Retorna lista de todos os produtos
app.get('/api/produtos', async (req, res) => {
    try {
        console.log('📋 Buscando produtos...');
        
        // Fazer consulta no Supabase
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .order('created_at', { ascending: false });

        // Verificar se houve erro
        if (error) {
            console.error('❌ Erro ao buscar produtos:', error);
            return res.status(400).json({
                success: false,
                message: 'Erro ao buscar produtos',
                error: error.message
            });
        }

        console.log(`✅ ${data.length} produtos encontrados`);
        
        // Retornar produtos encontrados
        res.json({
            success: true,
            data: data,
            total: data.length
        });

    } catch (error) {
        console.error('❌ Erro interno:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// CADASTRAR NOVO PRODUTO
// POST /api/produtos - Adiciona um novo produto
app.post('/api/produtos', async (req, res) => {
    try {
        // Extrair dados do corpo da requisição
        const { nome, preco, descricao } = req.body;
        
        console.log('➕ Cadastrando produto:', { nome, preco, descricao });

        // Validar dados obrigatórios
        if (!nome || !preco) {
            return res.status(400).json({
                success: false,
                message: 'Nome e preço são obrigatórios'
            });
        }

        // Validar se preço é um número
        if (isNaN(preco) || preco <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Preço deve ser um número maior que zero'
            });
        }

        // Inserir produto no Supabase
        const { data, error } = await supabase
            .from('produtos')
            .insert([
                {
                    nome: nome.trim(),
                    preco: parseFloat(preco),
                    descricao: descricao ? descricao.trim() : null
                }
            ])
            .select();

        // Verificar se houve erro
        if (error) {
            console.error('❌ Erro ao cadastrar produto:', error);
            return res.status(400).json({
                success: false,
                message: 'Erro ao cadastrar produto',
                error: error.message
            });
        }

        console.log('✅ Produto cadastrado com sucesso:', data[0]);

        // Retornar produto criado
        res.status(201).json({
            success: true,
            message: 'Produto cadastrado com sucesso!',
            data: data[0]
        });

    } catch (error) {
        console.error('❌ Erro interno:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// EXCLUIR PRODUTO
// DELETE /api/produtos/:id - Remove um produto pelo ID
app.delete('/api/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('🗑️ Excluindo produto ID:', id);

        // Validar se ID é um número
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID deve ser um número válido'
            });
        }

        // Excluir produto do Supabase
        const { data, error } = await supabase
            .from('produtos')
            .delete()
            .eq('id', parseInt(id))
            .select();

        // Verificar se houve erro
        if (error) {
            console.error('❌ Erro ao excluir produto:', error);
            return res.status(400).json({
                success: false,
                message: 'Erro ao excluir produto',
                error: error.message
            });
        }

        // Verificar se produto foi encontrado
        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        console.log('✅ Produto excluído com sucesso:', data[0]);

        // Retornar confirmação
        res.json({
            success: true,
            message: 'Produto excluído com sucesso!',
            data: data[0]
        });

    } catch (error) {
        console.error('❌ Erro interno:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// ROTA PARA SERVIR ARQUIVOS ESTÁTICOS (FRONTEND)
// Serve os arquivos HTML, CSS e JS do frontend
app.use(express.static('../frontend'));

// ROTA PADRÃO (404)
// Captura todas as rotas não definidas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        availableRoutes: [
            'GET /api/test',
            'GET /api/produtos',
            'POST /api/produtos',
            'DELETE /api/produtos/:id'
        ]
    });
});

// 6. INICIAR SERVIDOR
// Aqui o servidor começa a "escutar" por requisições
app.listen(PORT, () => {
    console.log('🚀 ================================');
    console.log('🥖 SERVIDOR PADARIA INICIADO!');
    console.log('🚀 ================================');
    console.log(`📡 Servidor rodando na porta: ${PORT}`);
    console.log(`🌐 URL local: http://localhost:${PORT}`);
    console.log(`📋 API disponível em: http://localhost:${PORT}/api`);
    console.log('🚀 ================================');
    console.log('');
    console.log('📝 Rotas disponíveis:');
    console.log('   GET  /api/test          - Testar API');
    console.log('   GET  /api/produtos      - Listar produtos');
    console.log('   POST /api/produtos      - Cadastrar produto');
    console.log('   DELETE /api/produtos/:id - Excluir produto');
    console.log('');
    console.log('⏹️  Para parar o servidor: Ctrl + C');
    console.log('🚀 ================================');
});