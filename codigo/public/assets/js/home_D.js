const apiUsuarios = "/usuarios";
const apiEstoque = "/estoque";
const apiConsumos = "/consumos";
const apiProblemas = "/reportes_Problemas";

function formatarData(dataISO) {
    if (!dataISO) return "—";
    const partes = dataISO.split("-");
    if (partes.length !== 3) return dataISO;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
function calcularSaudeEstoque(estoques) {
    const total = estoques.length;
    if (total === 0) return { porcentagem: 0, normais: 0, baixo: 0, total: 0 };
 
    const normais = estoques.filter(e => e.quantidade >= 5).length;
    const baixo = total - normais;
    const porcentagem = (normais / total) * 100;
 
    return { porcentagem, normais, baixo, total };
}

function totalRefeicoesMes(consumos) {
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();
 
    return consumos
        .filter(c => {
            if (!c.data) return false;
            const d = new Date(c.data);
            return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
        })
        .reduce((acc, c) => acc + (c.quantidadeServida || 0), 0);
}

function mediaDesperdicioMes(consumos) {
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();
 
    const doMes = consumos.filter(c => {
        if (!c.data) return false;
        const d = new Date(c.data);
        return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    });
 
    if (doMes.length === 0) {
        const ultimo = consumos[consumos.length - 1];
        return ultimo ? ultimo.desperdicio : 0;
    }
 
    const soma = doMes.reduce((acc, c) => acc + (c.desperdicio || 0), 0);
    return soma / doMes.length;
}

function renderizarMetricas(totalRef, saude, desperdicio, totalAlertas) {
    const grid = document.getElementById("grid-metricas");
 
    const classeEstoque = saude.porcentagem < 50 ? "alerta" : saude.porcentagem < 75 ? "atencao" : "";
    const classeDesperdicio = desperdicio > 15 ? "alerta" : desperdicio > 8 ? "atencao" : "";
    const classeAlertas = totalAlertas > 0 ? "alerta" : "";
 
    grid.innerHTML = `
        <div class="card-metrica">
            <div class="metrica-label">Refeições no Mês</div>
            <div class="metrica-valor">${totalRef}</div>
            <div class="metrica-sub">porções servidas</div>
        </div>
 
        <div class="card-metrica ${classeEstoque}">
            <div class="metrica-label">Saúde do Estoque</div>
            <div class="metrica-valor">${saude.porcentagem.toFixed(0)}%</div>
            <div class="metrica-sub">${saude.normais} ok · ${saude.baixo} em baixo</div>
        </div>
 
        <div class="card-metrica ${classeDesperdicio}">
            <div class="metrica-label">Desperdício Médio</div>
            <div class="metrica-valor">${desperdicio.toFixed(1)}%</div>
            <div class="metrica-sub">média do mês</div>
        </div>
 
        <div class="card-metrica ${classeAlertas}">
            <div class="metrica-label">Alertas Pendentes</div>
            <div class="metrica-valor">${totalAlertas}</div>
            <div class="metrica-sub">${totalAlertas === 0 ? "nenhum pendente" : "aguardando resolução"}</div>
        </div>
    `;
}
function renderizarAlertas(problemas) {
    const container = document.getElementById("lista-alertas");
    const pendentes = problemas.filter(p => p.status === "Pendente");
 
    if (pendentes.length === 0) {
        container.innerHTML = `
            <div class="sem-alertas">
                ✅ Nenhum alerta pendente no momento.
            </div>`;
        return;
    }
 
    container.innerHTML = pendentes.map(p => `
        <div class="item-alerta">
            <div>
                <div class="alerta-tipo">${p.tipos.join(", ")}</div>
                <div class="alerta-desc">${p.descricao}</div>
                <div class="alerta-data">Reportado em ${p.data}</div>
            </div>
        </div>
    `).join("");
}
async function carregarPainel() {
    try {
        const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
 
        const [resConsumos, resEstoque, resProblemas] = await Promise.all([
            fetch(apiConsumos),
            fetch(apiEstoque),
            fetch(apiProblemas)
        ]);

        const consumos = await resConsumos.json();
        const estoques = await resEstoque.json();
        const problemas = await resProblemas.json();
 
        const saudacao = document.getElementById("saudacao");
        if (usuarioLogado) {
            saudacao.textContent = `Olá, ${usuarioLogado.nome}! Aqui está o resumo de hoje.`;
        } else {
            saudacao.textContent = "Usuário não encontrado.";
        }
 
        const totalRef = totalRefeicoesMes(consumos);
        const saude = calcularSaudeEstoque(estoques);
        const desperdicio = mediaDesperdicioMes(consumos);
        const totalAlertas = problemas.filter(p => p.status === "Pendente").length;
 
        renderizarMetricas(totalRef, saude, desperdicio, totalAlertas);
 
        renderizarAlertas(problemas);
 
    } catch (erro) {
        console.error("Erro ao carregar painel:", erro);
 
        document.getElementById("grid-metricas").innerHTML = `
            <div class="estado-erro" style="grid-column: 1/-1;">
                Erro ao carregar os dados. Verifique a conexão com o servidor.
            </div>`;
 
        document.getElementById("lista-alertas").innerHTML = `
            <div class="estado-erro">
                Erro ao carregar alertas.
            </div>`;
    }
}
 
carregarPainel();