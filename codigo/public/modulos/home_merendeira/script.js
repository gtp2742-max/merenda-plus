const apiUsuarios = "http://localhost:3000/usuarios";
const apiCardapio = "http://localhost:3000/cardapio";
const apiPorcoes = "http://localhost:3000/refeicoesPrevistas";

let id = 4

async function MostrarInformacoes() {
    const resposta_usuarios = await fetch(apiUsuarios)
    const usuarios = await resposta_usuarios.json()

    const resposta_cardapio = await fetch(apiCardapio)
    const cardapios = await resposta_cardapio.json()

    const resposta_porcoes = await fetch(apiPorcoes)
    const porcoes = await resposta_porcoes.json()

    let usuario = usuarios.find(function (elem) { return elem.id == id })
    let oi = document.getElementById('ola')
    let registro_porcoes = document.getElementById('porcoes')
    let cardapio = document.getElementById('cardapio')

    if (usuario) {
        oi.innerHTML = `<p>Olá, ${usuario.nome}</p>
                        <button class="btn btn-outline-dark rounded-pill">Voltar</button>
                        `
        registro_porcoes.innerHTML = `<p>Refeições previstas: ${porcoes.porcoes}</p>
                        `

        cardapio.innerHTML = `<li><strong>Prato principal:</strong> ${cardapios.pratoPrincipal}</li>
                              <li><strong>Acompanhamento:</strong> ${cardapios.acompanhamento}</li>
                              <li><strong>Fruta:</strong> ${cardapios.fruta}</li>
                             `

    } else {
        oi.innerHTML = "Usuario não encontrado"
    }
}

function updateCardapio(cardapio) {

    fetch(apiCardapio, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cardapio)
    })
    .then(() => {
        alert("Cardápio alterado com sucesso");
    });
}

function updateCardapio(cardapio) {

    fetch(apiCardapio, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cardapio)
    })
    .then(() => {
        alert("Cardápio alterado com sucesso");
    });
}

function updatePorcoes(porcoes) {

    fetch(apiPorcoes, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(porcoes)
    })
    .then(() => {
        alert("Porções alterado com sucesso");
    });
}

document.getElementById("editarPorcoes")
    .addEventListener("click", async function () {

        document.getElementById("formPorcoes")
            .classList.remove("d-none");

        document.getElementById("principal")
            .classList.toggle("d-none");
            
        const resposta = await fetch(
            apiPorcoes
        );

        const refeicoes = await resposta.json();

        document.getElementById("inputPorcoes").value =
            refeicoes.porcoes;
    });

document.getElementById("salvarPorcoes")
        .addEventListener("click", function () {


            let porcao = {

                porcoes: document.getElementById("inputPorcoes").value
            };

            updatePorcoes(porcao);

            document.getElementById("formPorcoes")
            .classList.toggle("d-none");

            document.getElementById("principal")
            .classList.remove("d-none");
        });

document.getElementById("editarCardapio")
    .addEventListener("click", async function () {

        document.getElementById("formCardapio")
            .classList.remove("d-none");

        document.getElementById("principal")
            .classList.toggle("d-none");
            
        const resposta = await fetch(
            apiCardapio
        );

        const refeicoes = await resposta.json();

        document.getElementById("inputPrincipal").value = refeicoes.pratoPrincipal;

        document.getElementById("inputAcompanhamento").value =
            refeicoes.acompanhamento;

        document.getElementById("inputFruta").value =
            refeicoes.fruta;
    });

document.getElementById("salvarCardapio")
        .addEventListener("click", function () {


            let cardapio = {

                pratoPrincipal: document.getElementById("inputPrincipal").value,
                acompanhamento: document.getElementById("inputAcompanhamento").value,
                fruta: document.getElementById("inputFruta").value
            };

            updateCardapio(cardapio);

            document.getElementById("formCardapio")
            .classList.toggle("d-none");

            document.getElementById("principal")
            .classList.remove("d-none");
        });

MostrarInformacoes()