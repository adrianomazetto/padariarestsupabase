// ===================================
// JAVASCRIPT FRONTEND - TUTORIAL SUPABASE
// ===================================
// Este arquivo contém toda a lógica do frontend
// Aqui fazemos a comunicação com a API backend

// 1. CONFIGURAÇÕES GLOBAIS
// URL base da API (ajuste se necessário)
const API_BASE_URL = 'http://localhost:3000/api';

// Variáveis globais
let produtos = [];
let produtoParaExcluir = null;

// 2. ELEMENTOS DO DOM
// Aqui pegamos referências para os elementos HTML que vamos manipular
const elementos = {
    // Formulário
    formProduto: document.getElementById('form-produto'),
    inputNome: document.getElementById('nome'),
    inputPreco: document.getElementById('preco'),
    inputDescricao: document.getElementById('descricao'),
    btnCadastrar: document.getElementById('btn-cadastrar'),
    btnTexto: document.getElementById('btn-texto'),
    btnLoading: document.getElementById('btn-loading'),
    
    // Lista de produtos
    gridProdutos: document.getElementById('grid-produtos'),
    listaVazia: document.getElementById('lista-vazia'),
    loadingProdutos: document.getElementById('loading-produtos'),
    contadorProdutos: document.getElementById('contador-produtos'),
    totalProdutos: document.getElementById('total-produtos'),
    btnAtualizar: document.getElementById('btn-atualizar'),
    
    // Status da conexão
    statusConexao: document.getElementById('status-conexao'),
    statusIcon: document.getElementById('status-icon'),
    statusTexto: document.getElementById('status-texto'),
    
    // Modal de confirmação
    modalConfirmacao: document.getElementById('modal-confirmacao'),
    produtoNome: document.getElementById('produto-nome'),
    btnCancelar: document.getElementById('btn-cancelar'),
    btnConfirmar: document.getElementById('btn-confirmar'),
    
    // Notificações
    notificacoes: document.getElementById('notificacoes')
};

// 3. FUNÇÕES UTILITÁRIAS
// Funções auxiliares que usamos em várias partes do código

/**
 * Exibe uma notificação na tela
 * @param {string} mensagem - Texto da notificação
 * @param {string} tipo - Tipo: 'sucesso', 'erro', 'info'
 * @param {number} duracao - Tempo em ms (padrão: 5000)
 */
function mostrarNotificacao(mensagem, tipo = 'info', duracao = 5000) {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo} p-4 rounded-lg shadow-lg animate-slideIn`;
    
    // Ícones para cada tipo
    const icones = {
        sucesso: '✅',
        erro: '❌',
        info: 'ℹ️'
    };
    
    notificacao.innerHTML = `
        <div class="flex items-center space-x-3">
            <span class="text-xl">${icones[tipo]}</span>
            <span class="font-medium">${mensagem}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-white hover:text-gray-200">
                ✕
            </button>
        </div>
    `;
    
    elementos.notificacoes.appendChild(notificacao);
    
    // Remover automaticamente após o tempo especificado
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.remove();
        }
    }, duracao);
}

/**
 * Formata um valor para moeda brasileira
 * @param {number} valor - Valor numérico
 * @returns {string} Valor formatado (ex: "R$ 2,50")
 */
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

/**
 * Formata uma data para o padrão brasileiro
 * @param {string} dataISO - Data no formato ISO
 * @returns {string} Data formatada (ex: "15/01/2024 às 10:30")
 */
function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Atualiza o status da conexão com a API
 * @param {string} status - 'online', 'offline', 'loading'
 * @param {string} mensagem - Mensagem a exibir
 */
function atualizarStatusConexao(status, mensagem) {
    elementos.statusConexao.className = `mb-6 p-4 rounded-lg border status-${status}`;
    elementos.statusConexao.classList.remove('hidden');
    
    const icones = {
        online: '✅',
        offline: '❌',
        loading: '⏳'
    };
    
    elementos.statusIcon.textContent = icones[status];
    elementos.statusTexto.textContent = mensagem;
}

// 4. FUNÇÕES DE API
// Funções que fazem comunicação com o backend

/**
 * Testa a conexão com a API
 */
async function testarConexao() {
    try {
        atualizarStatusConexao('loading', 'Verificando conexão com a API...');
        
        const response = await fetch(`${API_BASE_URL}/test`);
        const data = await response.json();
        
        if (data.success) {
            atualizarStatusConexao('online', 'Conectado com sucesso à API!');
            setTimeout(() => {
                elementos.statusConexao.classList.add('hidden');
            }, 3000);
        } else {
            throw new Error('API retornou erro');
        }
    } catch (error) {
        console.error('Erro ao testar conexão:', error);
        atualizarStatusConexao('offline', 'Erro de conexão. Verifique se o backend está rodando.');
        mostrarNotificacao('Erro de conexão com a API. Verifique se o backend está rodando na porta 3000.', 'erro');
    }
}

/**
 * Busca todos os produtos da API
 */
async function buscarProdutos() {
    try {
        console.log('🔍 Buscando produtos...');
        
        // Mostrar loading
        elementos.loadingProdutos.classList.remove('hidden');
        elementos.gridProdutos.classList.add('hidden');
        elementos.listaVazia.classList.add('hidden');
        
        const response = await fetch(`${API_BASE_URL}/produtos`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar produtos');
        }
        
        produtos = data.data || [];
        console.log(`✅ ${produtos.length} produtos encontrados`);
        
        renderizarProdutos();
        
    } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error);
        mostrarNotificacao(`Erro ao carregar produtos: ${error.message}`, 'erro');
        
        // Esconder loading e mostrar lista vazia
        elementos.loadingProdutos.classList.add('hidden');
        elementos.listaVazia.classList.remove('hidden');
    }
}

/**
 * Cadastra um novo produto
 * @param {Object} dadosProduto - Dados do produto {nome, preco, descricao}
 */
async function cadastrarProduto(dadosProduto) {
    try {
        console.log('➕ Cadastrando produto:', dadosProduto);
        
        const response = await fetch(`${API_BASE_URL}/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosProduto)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao cadastrar produto');
        }
        
        console.log('✅ Produto cadastrado:', data.data);
        mostrarNotificacao('Produto cadastrado com sucesso!', 'sucesso');
        
        // Limpar formulário
        elementos.formProduto.reset();
        
        // Atualizar lista
        await buscarProdutos();
        
    } catch (error) {
        console.error('❌ Erro ao cadastrar produto:', error);
        mostrarNotificacao(`Erro ao cadastrar produto: ${error.message}`, 'erro');
    }
}

/**
 * Exclui um produto
 * @param {number} id - ID do produto
 */
async function excluirProduto(id) {
    try {
        console.log('🗑️ Excluindo produto ID:', id);
        
        const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro ao excluir produto');
        }
        
        console.log('✅ Produto excluído:', data.data);
        mostrarNotificacao('Produto excluído com sucesso!', 'sucesso');
        
        // Atualizar lista
        await buscarProdutos();
        
    } catch (error) {
        console.error('❌ Erro ao excluir produto:', error);
        mostrarNotificacao(`Erro ao excluir produto: ${error.message}`, 'erro');
    }
}

// 5. FUNÇÕES DE INTERFACE
// Funções que manipulam a interface do usuário

/**
 * Renderiza a lista de produtos na tela
 */
function renderizarProdutos() {
    // Esconder loading
    elementos.loadingProdutos.classList.add('hidden');
    
    if (produtos.length === 0) {
        // Mostrar mensagem de lista vazia
        elementos.listaVazia.classList.remove('hidden');
        elementos.gridProdutos.classList.add('hidden');
        elementos.contadorProdutos.classList.add('hidden');
    } else {
        // Mostrar grid de produtos
        elementos.listaVazia.classList.add('hidden');
        elementos.gridProdutos.classList.remove('hidden');
        elementos.contadorProdutos.classList.remove('hidden');
        
        // Gerar HTML dos produtos
        elementos.gridProdutos.innerHTML = produtos.map(produto => `
            <div class="produto-card bg-white p-6 rounded-lg shadow-md animate-fadeIn">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h3 class="text-lg font-bold text-gray-800 mb-2">${produto.nome}</h3>
                        <p class="text-2xl font-bold text-padaria-green mb-2">${formatarMoeda(produto.preco)}</p>
                    </div>
                    <button 
                        onclick="confirmarExclusao(${produto.id}, '${produto.nome}')"
                        class="text-padaria-red hover:bg-red-50 p-2 rounded-lg transition tooltip"
                        data-tooltip="Excluir produto"
                    >
                        🗑️
                    </button>
                </div>
                
                ${produto.descricao ? `
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">${produto.descricao}</p>
                ` : ''}
                
                <div class="text-xs text-gray-400 border-t pt-3">
                    📅 Cadastrado em ${formatarData(produto.created_at)}
                </div>
            </div>
        `).join('');
        
        // Atualizar contador
        elementos.totalProdutos.textContent = produtos.length;
    }
}

/**
 * Confirma a exclusão de um produto
 * @param {number} id - ID do produto
 * @param {string} nome - Nome do produto
 */
function confirmarExclusao(id, nome) {
    produtoParaExcluir = id;
    elementos.produtoNome.textContent = nome;
    elementos.modalConfirmacao.classList.remove('hidden');
    elementos.modalConfirmacao.classList.add('flex');
}

/**
 * Cancela a exclusão
 */
function cancelarExclusao() {
    produtoParaExcluir = null;
    elementos.modalConfirmacao.classList.add('hidden');
    elementos.modalConfirmacao.classList.remove('flex');
}

/**
 * Confirma e executa a exclusão
 */
async function executarExclusao() {
    if (produtoParaExcluir) {
        cancelarExclusao();
        await excluirProduto(produtoParaExcluir);
    }
}

/**
 * Alterna o estado de loading do botão de cadastrar
 * @param {boolean} loading - Se está carregando
 */
function toggleLoadingCadastro(loading) {
    if (loading) {
        elementos.btnTexto.classList.add('hidden');
        elementos.btnLoading.classList.remove('hidden');
        elementos.btnCadastrar.disabled = true;
    } else {
        elementos.btnTexto.classList.remove('hidden');
        elementos.btnLoading.classList.add('hidden');
        elementos.btnCadastrar.disabled = false;
    }
}

// 6. EVENT LISTENERS
// Aqui configuramos os eventos da página

// Quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página carregada, iniciando aplicação...');
    
    // Testar conexão e carregar produtos
    testarConexao();
    buscarProdutos();
});

// Formulário de cadastro
elementos.formProduto.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Pegar dados do formulário
    const dadosProduto = {
        nome: elementos.inputNome.value.trim(),
        preco: parseFloat(elementos.inputPreco.value),
        descricao: elementos.inputDescricao.value.trim() || null
    };
    
    // Validações básicas
    if (!dadosProduto.nome) {
        mostrarNotificacao('Nome do produto é obrigatório', 'erro');
        elementos.inputNome.focus();
        return;
    }
    
    if (!dadosProduto.preco || dadosProduto.preco <= 0) {
        mostrarNotificacao('Preço deve ser maior que zero', 'erro');
        elementos.inputPreco.focus();
        return;
    }
    
    // Ativar loading
    toggleLoadingCadastro(true);
    
    try {
        await cadastrarProduto(dadosProduto);
    } finally {
        toggleLoadingCadastro(false);
    }
});

// Botão de atualizar
elementos.btnAtualizar.addEventListener('click', function() {
    buscarProdutos();
});

// Modal de confirmação
elementos.btnCancelar.addEventListener('click', cancelarExclusao);
elementos.btnConfirmar.addEventListener('click', executarExclusao);

// Fechar modal clicando fora
elementos.modalConfirmacao.addEventListener('click', function(e) {
    if (e.target === elementos.modalConfirmacao) {
        cancelarExclusao();
    }
});

// Tecla ESC para fechar modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !elementos.modalConfirmacao.classList.contains('hidden')) {
        cancelarExclusao();
    }
});

// 7. FUNÇÕES GLOBAIS
// Funções que podem ser chamadas de qualquer lugar (incluindo HTML)

// Tornar funções disponíveis globalmente para uso no HTML
window.confirmarExclusao = confirmarExclusao;
window.cancelarExclusao = cancelarExclusao;
window.executarExclusao = executarExclusao;

// 8. TRATAMENTO DE ERROS GLOBAIS
// Captura erros não tratados

window.addEventListener('error', function(e) {
    console.error('❌ Erro não tratado:', e.error);
    mostrarNotificacao('Ocorreu um erro inesperado. Verifique o console.', 'erro');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Promise rejeitada:', e.reason);
    mostrarNotificacao('Erro de conexão. Verifique se o backend está rodando.', 'erro');
});

// 9. LOGS PARA DEBUG
// Logs úteis para desenvolvimento

console.log('🎯 Script carregado com sucesso!');
console.log('📡 API Base URL:', API_BASE_URL);
console.log('🔧 Para debug, use: window.produtos, window.elementos');

// Disponibilizar para debug
window.produtos = produtos;
window.elementos = elementos;