const apiPreparo = "/preparos";

fetch(apiPreparo)
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
    });

// Renderizar 

    function renderizarAlimentos(){
         
        listaAlimentos.innerHTML = "";
        
        dados[0].alimentos.forEach((alimento, index) => {
            
            listaAlimentos.innerHTML += `


        <div class ="item-alimento">

            <div>
                ${alimento.nome}
            </div>

            <div>
                ${alimento.quantidade}
            </div>

            <div class= "acoes">
                <button
                class="btn btn-warning btn-sm me-2"
                onclick="editarAlimentos(${index})">
                Editar
                </button>

                <button
                class="btn btn-danger btn-sm"
                onclick="removerAlimentos(${index})">               
                 Remover
                </button>
            </div>
        </div>

        `;
        });
    }

    renderizarAlimentos();

    const botao = document.getElementById("btnAdicionar");
    botao.addEventListener("click", () => {

    const nome = document.getElementById("nomeAlimento").value;
    const quantidade = document.getElementById("quantidadeAlimento").value;
    
    const novoAlimento = {
        nome: nome,
        quantidade: quantidade
    };

    if(nome === "" || quantidade === ""){
    alert("Preencha todos os campos");
    return;
}
    dados[0].alimentos.push(novoAlimento);

    fetch(`/preparos/${dados[0].id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados[0])
    })

    .then(() => {

        renderizarAlimentos();

        document.getElementById("nomeAlimento").value = "";

        document.getElementById("quantidadeAlimento").value = "";

        areaAdicionar.style.display = "none";

    });

});


// Remover

window.removerAlimentos = function(index){
    dados[0].alimentos.splice(index, 1);

    fetch(`/preparos/${dados[0].id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(dados[0])

    })
    .then(() => {
        renderizarAlimentos();

    });
}

//Editar

let indexEditando = null;


window.editarAlimentos = function(index){

    indexEditando = index;

    document.getElementById("areaEditar").style.display = "block";

    document.getElementById("editarNome").value =
    dados[0].alimentos[index].nome;

    document.getElementById("editarQuantidade").value =
    dados[0].alimentos[index].quantidade;

}

const btnConfirmarEdicao =
document.getElementById("btnConfirmarEdicao");

btnConfirmarEdicao.addEventListener("click", () => {

    dados[0].alimentos[indexEditando].nome =
    document.getElementById("editarNome").value;

    dados[0].alimentos[indexEditando].quantidade =
    document.getElementById("editarQuantidade").value;

    fetch(`/preparos/${dados[0].id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(dados[0])

    })

    .then(() => {

        renderizarAlimentos();

        document.getElementById("areaEditar").style.display = "none";

        });

    });

});

function voltar(){
  window.location.href = "home_M.html";
}