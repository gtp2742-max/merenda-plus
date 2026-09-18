const apiEstoque = "/estoque";
const apiReportes = "/reportes_Problemas";
const apiHistorico = "/historico_alertas";
const apiUsuarios = "/usuarios";

const listaAlertas = document.getElementById("listaAlertas");
const mensagem = document.getElementById("mensagem");
const botoesFiltro = document.querySelectorAll(".filtro");

let filtroAtual = "Todos";
let estoque = [];
let reportes = [];
let itensTela = [];
let nomeMerendeira = "Merendeira";

carregarDados();

botoesFiltro.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesFiltro.forEach(function (btn) {
      btn.classList.remove("ativo");
    });

    botao.classList.add("ativo");
    filtroAtual = botao.dataset.filtro;
    renderizarItens();
  });
});

function carregarDados() {
  Promise.all([
    fetch(apiEstoque).then(res => res.json()),
    fetch(apiReportes).then(res => res.json()),
    fetch(apiUsuarios).then(res => res.json())
  ])
    .then(function (dados) {
      estoque = dados[0];
      reportes = dados[1];

      const usuarios = dados[2];
      const merendeira = usuarios.find(function (usuario) {
        return usuario.login === "merendeira";
    });

    if (merendeira) {
      nomeMerendeira = merendeira.nome;
    }
    montarItensDaTela();
    renderizarItens();
  })
  .catch(function (){
    mostrarMensagem(
      "Erro ao carregar dados. Verifique se o JSON Server está rodando.",
      "danger"
    )
  })
}

function montarItensDaTela() {
  const hoje = new Date();

  const alertasEstoque = [];

  estoque.forEach(function (item) {
    const validade = new Date(item.validade);
    const diasParaVencer = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));

    if (Number(item.quantidade) <= 5) {
      alertasEstoque.push({
        id: item.id,
        origem: "estoque",
        tipo: "Crítico",
        categoria: "Estoque",
        mensagem: `${item.nome} está com baixo estoque: ${item.quantidade} ${item.unidade}`,
        status: "Pendente",
        acao: "Ver estoque"
      });
    }

    if (diasParaVencer <= 7 && diasParaVencer >= 0) {
      alertasEstoque.push({
        id: item.id,
        origem: "estoque",
        tipo: "Crítico",
        categoria: "Validade",
        mensagem: `${item.nome} vence em ${diasParaVencer} dia(s). Validade: ${item.validade}`,
        status: "Pendente",
        acao: "Ver estoque"
      });
    }
  });

  const reportesFormatados = reportes.map(function (reporte) {
    return {
      id: reporte.id,
      origem: "reportes_Problemas",
      tipo: "Ocorrência",
      categoria: "Reporte da merendeira",
      mensagem: reporte.descricao,
      status: reporte.status,
      tiposProblema: reporte.tipos,
      data: reporte.data,
      acao: "Ver reporte"
    };
  });

  itensTela = [...alertasEstoque, ...reportesFormatados];
}

function renderizarItens() {
  listaAlertas.innerHTML = "";

  let listaFiltrada = itensTela;

  if (filtroAtual === "Crítico") {
    listaFiltrada = itensTela.filter(item => item.tipo === "Crítico");
  }

  if (filtroAtual === "Pendente") {
    listaFiltrada = itensTela.filter(item => item.status === "Pendente");
  }

  if (filtroAtual === "Resolvido") {
    listaFiltrada = itensTela.filter(item => item.status === "Resolvido");
  }

  if (listaFiltrada.length === 0) {
    listaAlertas.innerHTML = `
      <p class="text-muted">Nenhum alerta ou ocorrência encontrado.</p>
    `;
    return;
  }

  listaFiltrada.forEach(function (item) {
    const statusClasse =
      item.status === "Resolvido" ? "status-resolvido" : "status-pendente";

    let cardClasse = "alerta-card";

    if (item.tipo === "Crítico" || item.tipo === "Ocorrência") {
      cardClasse += " critico";
    }

    if (item.status === "Resolvido") {
      cardClasse += " resolvido";
    }

    let detalhesReporte = "";

    if (item.origem === "reportes_Problemas") {
      detalhesReporte = `
        <p><strong>Tipo do problema:</strong> ${item.tiposProblema.join(", ")}</p>
        <p><strong>Data:</strong> ${item.data}</p>
      `;
    }

    let botoes = "";

    if (item.origem === "estoque") {
      botoes = `
        <button class="btn btn-sm btn-success btn-ver-estoque">
          Ver estoque
        </button>
      `;
    }

    if (item.origem === "reportes_Problemas") {
      botoes = `
        <button class="btn btn-sm btn-success btn-ver-reporte" data-id="${item.id}">
          Ver reporte
        </button>
      `;

      if (item.status !== "Resolvido") {
        botoes += `
          <button 
            class="btn btn-sm btn-outline-success btn-resolver" 
            data-id="${item.id}">
            Marcar como resolvido
          </button>
        `;
      } else {
        botoes += `
          <span class="badge bg-success">Resolvido</span>
        `;
      }
    }

    listaAlertas.innerHTML += `
      <div class="${cardClasse}">
        <p class="tipo">${item.tipo}</p>
        <p><strong>Categoria:</strong> ${item.categoria}</p>
        ${detalhesReporte}
        <p><strong>Descrição:</strong> ${item.mensagem}</p>

        <p>
          <strong>Status:</strong>
          <span class="status ${statusClasse}">
            ${item.status}
          </span>
        </p>

        <div class="acoes">
          ${botoes}
        </div>
      </div>
    `;
  });
}

listaAlertas.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn-ver-estoque")) {
    window.location.href = "estoque_D.html";
  }

  if (event.target.classList.contains("btn-ver-reporte")) {
    const id = event.target.dataset.id;
    window.location.href = `reportes_D.html?id=${id}`;
  }

  if (event.target.classList.contains("btn-resolver")) {
    const id = event.target.dataset.id;
    marcarReporteComoResolvido(id);
  }
});

async function marcarReporteComoResolvido(id) {
  const reporte = reportes.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!reporte) {
    mostrarMensagem("Reporte não encontrado.", "danger");
    return;
  }

  if (reporte.status === "Resolvido") {
    mostrarMensagem("Este reporte já está resolvido.", "warning");
    return;
  }

  const reporteAtualizado = {
    ...reporte,
    status: "Resolvido"
  };

  try {
    await fetch(`${apiReportes}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reporteAtualizado)
    });

    const historico = {
      origem: "Reporte de Merendeira",
      referenciaId: reporte.id,
      merendeira: nomeMerendeira,
      tipos: reporte.tipos,
      descricao: reporte.descricao,
      dataReporte: reporte.data,
      dataResolucao: new Date().toLocaleDateString("pt-BR"),
      status: "Resolvido"
    };

    await fetch(apiHistorico, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(historico)
    });

    mostrarMensagem("Reporte marcado como resolvido e salvo no histórico.", "success");

    carregarDados();

  } catch (erro) {
    mostrarMensagem("Erro ao atualizar o reporte.", "danger");
    console.error(erro);
  }
}

function mostrarMensagem(texto, tipo) {
  mensagem.innerHTML = `
    <div class="alert alert-${tipo}">
      ${texto}
    </div>
  `;

  setTimeout(function () {
    mensagem.innerHTML = "";
  }, 3000);
}

function voltar() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "home_D.html";
    }
}