const apiUsuarios = "/usuarios";
const apiCardapios = "/cardapios";
const apiPorcoes = "/refeicoesPrevistas";
const apiConsumos = "/consumos";
const apiEstoque = "/estoque";

function getUsuarioLogadoId() {
    const usuarioCorrente = JSON.parse(
        sessionStorage.getItem("usuarioCorrente")
    );

    return usuarioCorrente?.id || null;
}

function getCardapioHoje(cardapios) {
    const hoje = new Date().toISOString().split("T")[0];
    return cardapios.find(c => c.data === hoje) || null;
}

function getUltimoDespericio(consumos) {
    if (!consumos || consumos.length === 0) return null;
    return consumos[consumos.length - 1].desperdicio;
}

function contarEstoqueBaixo(estoques) {
    return estoques.filter(e => e.quantidade <= 5).length;
}

function badgeStatus(status) {
    const mapa = {
        "Planejado": "badge-planejado",
        "Alterado": "badge-alterado",
        "Concluído": "badge-concluido",
        "Concluido": "badge-concluido"
    };
    const classe = mapa[status] || "badge-planejado";
    return `<span class="badge-status ${classe}">${status}</span>`;
}

function renderizarCardapio(cardapio) {
    const container = document.getElementById("cardapio-container");

    if (!cardapio) {
        container.innerHTML = `
            <div class="aviso-cardapio">
                ⚠️ Nenhum cardápio cadastrado para hoje. Verifique com a diretora.
            </div>`;
        return;
    }

    container.innerHTML = `
        <div class="cardapio-box">
            <div class="cardapio-linha">
                <span class="cardapio-chave">Prato Principal</span>
                <span class="cardapio-valor">${cardapio.pratoPrincipal}</span>
            </div>
            <div class="cardapio-linha">
                <span class="cardapio-chave">Acompanhamento</span>
                <span class="cardapio-valor">${cardapio.acompanhamento}</span>
            </div>
            <div class="cardapio-linha">
                <span class="cardapio-chave">Sobremesa</span>
                <span class="cardapio-valor">${cardapio.sobremesa}</span>
            </div>
            <div class="cardapio-linha">
                <span class="cardapio-chave">Status</span>
                <span class="cardapio-valor">${badgeStatus(cardapio.status)}</span>
            </div>
        </div>`;
}

function renderizarMetricas(porcoes, desperdicio, itensBaixo) {
    const grid = document.getElementById("grid-metricas");

    const classeDesperdicio = desperdicio === null
        ? ""
        : desperdicio > 15 ? "alerta" : desperdicio > 8 ? "atencao" : "";

    const classeEstoque = itensBaixo > 0 ? "alerta" : "";

    const valorDesperdicio = desperdicio === null
        ? "—"
        : `${desperdicio.toFixed(1)}%`;

    const subDesperdicio = desperdicio === null
        ? "sem registros ainda"
        : "último consumo registrado";

    grid.innerHTML = `
        <div class="card-metrica">
            <div class="metrica-label">Porções Previstas</div>
            <div class="metrica-valor">${porcoes}</div>
            <div class="metrica-sub">para hoje</div>
        </div>

        <div class="card-metrica ${classeDesperdicio}">
            <div class="metrica-label">Desperdício</div>
            <div class="metrica-valor">${valorDesperdicio}</div>
            <div class="metrica-sub">${subDesperdicio}</div>
        </div>

        <div class="card-metrica ${classeEstoque}">
            <div class="metrica-label">Estoque Baixo</div>
            <div class="metrica-valor">${itensBaixo}</div>
            <div class="metrica-sub">${itensBaixo === 0 ? "tudo em ordem" : "itens precisam de reposição"}</div>
        </div>
    `;
}
async function carregarPainel() {
    try {
        const id = getUsuarioLogadoId();

        const [resUsuarios, resCardapios, resPorcoes, resConsumos, resEstoque] = await Promise.all([
            fetch(apiUsuarios),
            fetch(apiCardapios),
            fetch(apiPorcoes),
            fetch(apiConsumos),
            fetch(apiEstoque)
        ]);

        const usuarios  = await resUsuarios.json();
        const cardapios = await resCardapios.json();
        const porcoes   = await resPorcoes.json();
        const consumos  = await resConsumos.json();
        const estoques  = await resEstoque.json();

        const usuario = usuarios.find(u => u.id == id);
        const saudacao = document.getElementById("saudacao");
        saudacao.textContent = usuario
            ? `Olá, ${usuario.nome}! Bom trabalho hoje.`
            : "Usuário não encontrado.";

        const cardapioHoje = getCardapioHoje(cardapios);
        const porcoesPrevistas = cardapioHoje?.quantidadePrevista || porcoes.porcoes;

        const desperdicio = getUltimoDespericio(consumos);
        const itensBaixo  = contarEstoqueBaixo(estoques);

        renderizarMetricas(porcoesPrevistas, desperdicio, itensBaixo);
        renderizarCardapio(cardapioHoje);

    } catch (erro) {
        console.error("Erro ao carregar painel:", erro);

        document.getElementById("grid-metricas").innerHTML = `
            <div class="estado-erro" style="grid-column: 1/-1;">
                Erro ao carregar os dados. Verifique a conexão com o servidor.
            </div>`;

        document.getElementById("cardapio-container").innerHTML = `
            <div class="estado-erro">
                Erro ao carregar o cardápio.
            </div>`;
    }
}

carregarPainel();