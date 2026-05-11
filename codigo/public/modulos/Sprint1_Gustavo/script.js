
fetch("http://localhost:3000/preparos")
    .then(resposta => resposta.json())
    .then(dados => {
        document.getElementById("dataPreparo").textContent = dados[0].data
        document.getElementById("refeicao").textContent = dados[0].refeicao
        document.getElementById("prato").textContent = dados[0].prato

const listaAlimentos = document.getElementById("listaAlimentos")

const btnMostrar = document.getElementById("btnMostrar");
const areaAdicionar =
        document.getElementById("areaAdicionar");
    btnMostrar.addEventListener("click", () => {
        areaAdicionar.style.display = "block";
    })
const botao = document.getElementById("btnAdicionar");
botao.addEventListener("click", () => {

    const nome = document.getElementById("nomeAlimento").value;
    const quantidade = document.getElementById("quantidadeAlimento").value;
    const lista = document.getElementById("listaAlimentos");

    lista.innerHTML+= `
    
          
        <div class="row border-bottom py-2">

            <div class="col-6">
                ${nome}
            </div>

            <div class="col-6 text-center">
                ${quantidade}kg
            </div>

        </div>
    `;

    document.getElementById("nomeAlimento").value = "";

    document.getElementById("quantidadeAlimento").value = "";

    areaAdicionar.style.display = "none";
})


dados[0].alimentos.forEach(alimento => {
    listaAlimentos.innerHTML += `
        <div class ="row border-bottom p-2">

            <div class="col-6">
            ${alimento.nome}
            </div>

            <div class="col-6 text-center">
            ${alimento.quantidade}kg
            </div>
        </div>

        `;

    });
});