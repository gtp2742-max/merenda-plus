let estoque = [];
let filtrados = [];
let indexAtual = 0;
const limite = 2;

const botaoAdd = document.getElementById('btnAdicionarAlimento');
const botaoBuscar = document.getElementById('buscar');
const botaoMais = document.getElementById('mostrar');
const pesquisa = document.getElementById('pesquisa');
const tabela = document.getElementById('tabela-estoque');
const tabelaValidade = document.getElementById('tabela-validade');

const dadosSalvos = localStorage.getItem('meuEstoque');

// --- 1. CHAMADA DA API / BACKEND ---
fetch("http://localhost:3000/estoque")
  .then(res => res.json())
  .then(dados => {
    console.log("Conectado ao Banco de Dados com sucesso!");
    estoque = dados;
    salvarNoLocal();
    renderizarIniciando(estoque);
    carregarValidade(); 
  })
  .catch(err => {
    console.log("Banco de dados offline. Tentando carregar do LocalStorage...", err);

    if (dadosSalvos) {
      estoque = JSON.parse(dadosSalvos);
      renderizarIniciando(estoque);
      carregarValidade(); 
    } else {
      alert("Erro: Banco offline e nenhum dado guardado localmente.");
    }
  });


// --- 2. FUNÇÕES DE APOIO GLOBAIS ---

function salvarNoLocal(){
   localStorage.setItem('meuEstoque', JSON.stringify(estoque));
}

function renderizar(lista, limpar = false) {

  if (limpar) tabela.innerHTML = "";

  lista.forEach(item => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.quantidade}</td>
      <td>${item.unidade}</td>
      <td>${item.validade}</td>
    `;

    tabela.appendChild(tr);
  });

}

function renderizarIniciando(lista) {
  indexAtual = 0;
  renderizar(lista.slice(0, limite), true);
  indexAtual = limite;
}

function renderizarValidade(lista) {
  tabelaValidade.innerHTML = "";
  lista.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.validade}</td>
    `;
    tabelaValidade.appendChild(tr);
  });
}

function carregarValidade() {
  const hoje = new Date();
  const proximos = estoque.filter(item => {
    const data = new Date(item.validade);
    const diff = (data - hoje) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= -1;
  });
  renderizarValidade(proximos);
}


// --- 3. EVENTOS DE CLIQUES (BOTÕES) ---

function mostrarMais (deveLimpar = false) {
  const termoNaTela = pesquisa.value.toLowerCase().trim();
  const base = termoNaTela !== "" ? filtrados : estoque;

  if (indexAtual >= base.length && !deveLimpar) {
    alert("Fim dos registros");
    return;
  }

  const parte = base.slice(indexAtual, indexAtual + limite);
  renderizar(parte, deveLimpar);
  indexAtual += limite;
}

// Botão Mostrar Mais
botaoMais.addEventListener('click', () => mostrarMais(false));

// Botão Buscar Alimento
botaoBuscar.addEventListener('click', () => {
  const termo = pesquisa.value.toLowerCase().trim();
  
  if (termo === "") {
    filtrados = [];
    renderizarIniciando(estoque);
    return; 
  }
  
  tabela.innerHTML = "";
  filtrados = estoque.filter(item =>
    item.nome.toLowerCase().includes(termo)
  );
  
  indexAtual = 0;

  if (filtrados.length > 0) {
    mostrarMais(true); 
  } else {
    alert("Alimento não encontrado");
    renderizarIniciando(estoque); 
  }
});

// Botão Adicionar Alimento
// Botão Adicionar Alimento
// Botão Adicionar Alimento
botaoAdd.addEventListener('click', () => {

  const nome = document.getElementById("nomeAlimento").value;
  const quantidade = document.getElementById("quantidadeAlimento").value;
  const unidade = document.getElementById("unidadeAlimento").value;
  const validade = document.getElementById("validadeAlimento").value;

  if (!nome || !quantidade || !unidade || !validade) {
    alert("Preencha todos os campos.");
    return;
  }

  const novoItem = {
    nome,
    quantidade: Number(quantidade),
    unidade,
    validade
  };

  fetch("http://localhost:3000/estoque", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novoItem)
  })
  .then(res => res.json())
  .then(itemCriado => {

    estoque.push(itemCriado);

    salvarNoLocal();

    renderizarIniciando(estoque);

    carregarValidade();

    document.getElementById("nomeAlimento").value = "";
    document.getElementById("quantidadeAlimento").value = "";
    document.getElementById("unidadeAlimento").value = "";
    document.getElementById("validadeAlimento").value = "";

    alert("Alimento adicionado com sucesso!");

  })
  .catch(error => {

    console.error(error);

    alert("Erro ao salvar no banco de dados.");

  });

});