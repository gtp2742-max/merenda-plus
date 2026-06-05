const apiUrl = "http://localhost:3000/reportes_Problemas";

const form = document.getElementById("formProblema");
const mensagem = document.getElementById("mensagem");
const listaReportes = document.getElementById("listaReportes");
const checkOutro = document.getElementById("checkOutro");
const campoOutro = document.getElementById("campoOutro");
const outroProblema = document.getElementById("outroProblema");
const descricao = document.getElementById("descricao");

let reportes = [];
let idEditando = null;

carregarReportes();

checkOutro.addEventListener("change", function () {
  campoOutro.classList.toggle("d-none", !checkOutro.checked);

  if (!checkOutro.checked) {
    outroProblema.value = "";
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const textoDescricao = descricao.value.trim();
  const opcoesSelecionadas = document.querySelectorAll(`input[name="opcoes[]"]:checked`);

  if (opcoesSelecionadas.length === 0) {
    mostrarMensagem("Selecione pelo menos um tipo de problema.", "danger");
    return;
  }

  if (textoDescricao.length < 10) {
    mostrarMensagem("A descrição deve ter pelo menos 10 caracteres.", "danger");
    return;
  }

  const tipos = [];

  opcoesSelecionadas.forEach(function (opcao) {
    if (opcao.value === "Outro") {
      if (outroProblema.value.trim() !== "") {
        tipos.push(outroProblema.value.trim());
      }
    } else {
      tipos.push(opcao.value);
    }
  });

  if (checkOutro.checked && outroProblema.value.trim() === "") {
    mostrarMensagem("Informe qual é o outro tipo de problema.", "danger");
    return;
  }

  if (idEditando) {
    salvarEdicao(idEditando, tipos, textoDescricao);
  } else {
    criarReporte(tipos, textoDescricao);
  }
});

function carregarReportes() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(dados => {
      reportes = dados;
      renderizarReportes();
    })
    .catch(() => {
      mostrarMensagem("Erro ao carregar reportes. Verifique se o JSON Server está ligado.", "danger");
    });
}

function criarReporte(tipos, descricao) {
  const novoReporte = {
    tipos,
    descricao,
    data: new Date().toLocaleDateString("pt-BR"),
    status: "Pendente"
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novoReporte)
  })
    .then(() => {
      mostrarMensagem("Reporte enviado com sucesso!", "success");
      limparFormulario();
      carregarReportes();
    });
}

function salvarEdicao(id, tipos, descricao) {
  const reporteAntigo = reportes.find(reporte => String(reporte.id) === String(id));

  const reporteAtualizado = {
    ...reporteAntigo,
    tipos,
    descricao
  };

  fetch(`${apiUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reporteAtualizado)
  })
    .then(() => {
      mostrarMensagem("Reporte editado com sucesso!", "success");
      limparFormulario();
      carregarReportes();
    });
}

function renderizarReportes() {
  listaReportes.innerHTML = "";

  if (reportes.length === 0) {
    listaReportes.innerHTML = `
      <p class="text-muted">Nenhum problema reportado até o momento.</p>
    `;
    return;
  }

  reportes.forEach(function (reporte) {

    const statusClasse =
      reporte.status === "Resolvido"
        ? "status-resolvido"
        : "status-pendente";

    const cardClasse =
      reporte.status === "Resolvido"
        ? "reporte-card resolvido"
        : "reporte-card";

    let botoesAcoes = "";

    if (reporte.status !== "Resolvido") {
      botoesAcoes = `
        <div class="acoes">
          <button class="btn btn-sm btn-warning btn-editar" data-id="${reporte.id}">
            Editar
          </button>

          <button class="btn btn-sm btn-danger btn-remover" data-id="${reporte.id}">
            Remover
          </button>
        </div>
      `;
    } else {
      botoesAcoes = `
        <span class="badge bg-success">
          Ocorrência Resolvida
        </span>
      `;
    }

    listaReportes.innerHTML += `
      <div class="${cardClasse}">
        <p><strong>Tipo:</strong> ${reporte.tipos.join(", ")}</p>
        <p><strong>Descrição:</strong> ${reporte.descricao}</p>
        <p><strong>Data:</strong> ${reporte.data}</p>

        <p>
          <strong>Status:</strong>
          <span class="status ${statusClasse}">
            ${reporte.status}
          </span>
        </p>

        ${botoesAcoes}
      </div>
    `;
  });
}

listaReportes.addEventListener("click", function (event) {
  const id = event.target.dataset.id;

  if (event.target.classList.contains("btn-editar")) {
    prepararEdicao(id);
  }

  if (event.target.classList.contains("btn-remover")) {
    removerReporte(id);
  }
});

function prepararEdicao(id) {
  const reporte = reportes.find(item => String(item.id) === String(id));

  if (!reporte) {
    mostrarMensagem("Reporte não encontrado.", "danger");
    return;
  }

  idEditando = id;
  descricao.value = reporte.descricao;

  const checkboxes = document.querySelectorAll(`input[name="opcoes[]"]`);

  checkboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });

  campoOutro.classList.add("d-none");
  outroProblema.value = "";

  reporte.tipos.forEach(function (tipo) {
    let encontrou = false;

    checkboxes.forEach(function (checkbox) {
      if (checkbox.value === tipo) {
        checkbox.checked = true;
        encontrou = true;
      }
    });

    if (!encontrou) {
      checkOutro.checked = true;
      campoOutro.classList.remove("d-none");
      outroProblema.value = tipo;
    }
  });

  const botaoSubmit = form.querySelector('button[type="submit"]');
  botaoSubmit.textContent = "Salvar Alterações";
  botaoSubmit.classList.remove("btn-success");
  botaoSubmit.classList.add("btn-warning");

  mostrarMensagem("Modo edição ativado. Altere os dados e clique em Salvar Alterações.", "warning");

  form.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function removerReporte(id) {
  if (!confirm("Deseja remover este reporte?")) return;

  fetch(`${apiUrl}/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      mostrarMensagem("Reporte removido com sucesso.", "warning");
      carregarReportes();
    });
}

function limparFormulario() {
  form.reset();
  campoOutro.classList.add("d-none");
  outroProblema.value = "";
  idEditando = null;

  const botaoSubmit = form.querySelector('button[type="submit"]');
  botaoSubmit.textContent = "Enviar Reporte";
  botaoSubmit.classList.remove("btn-warning");
  botaoSubmit.classList.add("btn-success");
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
  window.location.href = "dashboard.html";
}


  