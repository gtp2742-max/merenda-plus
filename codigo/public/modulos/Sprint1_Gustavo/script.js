
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
    const novoAlimento = {
        nome: nome,
        quantidade: quantidade
    };

    lista.innerHTML+= `
    
          
        <div class= "item-alimento">

            <div>
                ${nome}
            </div>

            <div>
                ${quantidade}kg
            </div>

            <div class="text-center">

                <button
                class="btn btn-danger btn-sm"
                onclick="this.closest('.item-alimento').remove()">
                Remover
                </button>

            </div>
        </div>
        
    `;

    document.getElementById("nomeAlimento").value = "";

    document.getElementById("quantidadeAlimento").value = "";

    areaAdicionar.style.display = "none";
})


dados[0].alimentos.forEach((alimento) => {
    listaAlimentos.innerHTML += `
        <div class ="item-alimento">

            <div>
                ${alimento.nome}
            </div>

            <div>
                ${alimento.quantidade}kg
            </div>

            <div>

                <button
                class="btn btn-danger btn-sm"
                onclick="this.closest('.item-alimento').remove()">
                 Remover
                </button>
            </div>
        </div>

        `;

    });

    const btnSalvar = 
        document.getElementById("btnSalvar");

    btnSalvar.addEventListener("click", () => {

        fetch(`http://localhost:3000/preparos/${dados[0].id}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados[0])
        })
        .then(() => {
            alert("Preparo salvo com sucesso!");
        });
    });
});