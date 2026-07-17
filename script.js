// Inicializa a lista de chamados pegando do LocalStorage (se existir) ou vazia
let chamados = JSON.parse(localStorage.getItem('chamados')) || [];

function adicionarChamado() {
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const prioridade = document.getElementById('prioridade').value;
    const categoria = document.getElementById('categoria').value;

    if (!titulo || !descricao) {
        alert("Por favor, preencha o título e a descrição do chamado.");
        return;
    }

    // Cria o objeto do chamado com um ID único baseado no tempo atual
    const novoChamado = {
        id: Date.now(),
        titulo,
        descricao,
        prioridade,
        categoria,
        status: 'Aberto',
        dataCriacao: new Date().toLocaleDateString('pt-BR')
    };

    chamados.push(novoChamado);
    atualizarArmazenamento();
    renderizarChamados();
    limparFormulario();
}

function alterarStatus(id, novoStatus) {
    chamados = chamados.map(chamado => {
        if (chamado.id === id) {
            chamado.status = novoStatus;
        }
        return chamado;
    });
    atualizarArmazenamento();
    renderizarChamados();
}

function excluirChamado(id) {
    chamados = chamados.filter(chamado => chamado.id !== id);
    atualizarArmazenamento();
    renderizarChamados();
}

function atualizarArmazenamento() {
    localStorage.setItem('chamados', JSON.stringify(chamados));
}

function renderizarChamados() {
    const lista = document.getElementById('lista-chamados');
    lista.innerHTML = '';

    const filtroStatus = document.getElementById('filtro-status').value;

    chamados.forEach(chamado => {
        // Aplica o filtro de status selecionado na tela
        if (filtroStatus !== 'Todos' && chamado.status !== filtroStatus) return;

        const card = document.createElement('div');
        card.className = `chamado-card prioridade-${chamado.prioridade.toLowerCase()}`;
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${chamado.titulo}</h3>
                <span class="badge-status status-${chamado.status.toLowerCase().replace(' ', '-')}">${chamado.status}</span>
            </div>
            <p class="desc">${chamado.descricao}</p>
            <div class="meta-info">
                <span>📁 ${chamado.categoria}</span> | <span>⚠️ Prioridade: ${chamado.prioridade}</span> | <span>📅 ${chamado.dataCriacao}</span>
            </div>
            <div class="card-acoes">
                <select onchange="alterarStatus(${chamado.id}, this.value)">
                    <option value="Aberto" ${chamado.status === 'Aberto' ? 'selected' : ''}>Aberto</option>
                    <option value="Em Atendimento" ${chamado.status === 'Em Atendimento' ? 'selected' : ''}>Em Atendimento</option>
                    <option value="Concluído" ${chamado.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                </select>
                <button class="btn-excluir" onclick="excluirChamado(${chamado.id})">Excluir</button>
            </div>
        `;
        lista.appendChild(card);
    });
}

function limparFormulario() {
    document.getElementById('titulo').value = '';
    document.getElementById('descricao').value = '';
}

// Renderiza os chamados assim que a página carrega pela primeira vez
renderizarChamados();
