let estoque = [];
let filtrados = [];
let indexAtual = 0;
const limite = 2;

const botaoAdd = document.getElementById('adicionar');
const botaoBuscar = document.getElementById('buscar');
const botaoMais = document.getElementById('mostrar');
const pesquisa = document.getElementById('pesquisa');
const tabela = document.getElementById('tabela-estoque');
const tabelaValidade = document.getElementById("tabela-validade");

// carregar estoque
fetch("http://localhost:3000/estoque")
  .then(res => res.json())
  .then(dados => {
    console.log("Dados:",JSON.stringify(dados,null,2));
    estoque = dados;
   renderizar(estoque);
    carregarValidade();
  })
  .catch(err => console.log("Erro fetch:", err));


function renderizar(lista) {
    tabela.innerHTML = "",
    lista.forEach(item => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.quantidade}</td>
      <td>${item.unidade}</td>
    `;

    tabela.appendChild(tr);
  });
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

// validade próxima
function carregarValidade() {
  const hoje = new Date();

  const proximos = estoque.filter(item => {
    const data = new Date(item.validade);
    const diff = (data - hoje) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  renderizarValidade(proximos);
}

// buscar
botaoBuscar.addEventListener('click', function () {
  tabela.innerHTML = "";
  indexAtual = 0;

  const termo = pesquisa.value.toLowerCase();

  filtrados = estoque.filter(item =>
    item.nome.toLowerCase().includes(termo)
  );

  if (filtrados.length > 0) {
    mostrarMais();
  } else {
    alert("Alimento não encontrado");
  }

  pesquisa.value = "";
});

// mostrar mais
function mostrarMais () {
  const parte = filtrados.slice(indexAtual, indexAtual + limite);
  renderizar(parte);
  indexAtual += limite;
}

// botão mostrar mais
botaoMais.addEventListener('click', mostrarMais);

// botão adicionar (simples)
botaoAdd.addEventListener('click', () => {
  const nome = prompt("Nome:");
  const quantidade = prompt("Quantidade:");
  const unidade = prompt("Unidade:");
  const validade = prompt("Validade (YYYY-MM-DD):");

  estoque.push({ nome, quantidade, unidade, validade });

  alert("Adicionado (local)");
});