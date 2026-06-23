const apiCardapio = "/cardapios";

const lista = document.getElementById("listaCardapios");
const btnSalvar = document.getElementById("salvar");

let idEdicao = null;

function listarCardapios() {
    fetch(apiCardapio)
        .then(res => res.json())
        .then(cardapios => {

            lista.innerHTML = "";

            cardapios.forEach(cardapio => {

                lista.innerHTML += `
                    <tr>
                        <td>${cardapio.data}</td>
                        <td>${cardapio.refeicao}</td>
                        <td>${cardapio.pratoPrincipal}</td>
                        <td>${cardapio.sobremesa}</td>
                        <td>
                            <button class="btn btn-warning btn-sm"
                                onclick="editarCardapio('${cardapio.id}')">
                                Editar
                            </button>

                            <button class="btn btn-danger btn-sm"
                                onclick="excluirCardapio('${cardapio.id}')">
                                Excluir
                            </button>
                        </td>
                    </tr>
                `;
            });
        });
}

btnSalvar.addEventListener("click", () => {

    const cardapio = {
        data: document.getElementById("data").value,
        refeicao: document.getElementById("refeicao").value,
        pratoPrincipal: document.getElementById("pratoPrincipal").value,
        acompanhamento: document.getElementById("acompanhamento").value,
        sobremesa: document.getElementById("sobremesa").value,
        quantidadePrevista: Number(document.getElementById("quantidade").value),
        observacao: document.getElementById("observacao").value,
        status: "Planejado"
    };

    if (idEdicao == null) {

        fetch(apiCardapio, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cardapio)
        })
            .then(() => {
                limparFormulario();
                listarCardapios();
            });

    } else {

        fetch(`${apiCardapio}/${idEdicao}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idEdicao,
                ...cardapio
            })
        })
            .then(() => {
                idEdicao = null;
                limparFormulario();
                listarCardapios();
            });
    }

});

function editarCardapio(id) {

    fetch(`${apiCardapio}/${id}`)
        .then(res => res.json())
        .then(cardapio => {

            document.getElementById("data").value = cardapio.data;
            document.getElementById("refeicao").value = cardapio.refeicao;
            document.getElementById("pratoPrincipal").value = cardapio.pratoPrincipal;
            document.getElementById("acompanhamento").value = cardapio.acompanhamento;
            document.getElementById("sobremesa").value = cardapio.sobremesa;
            document.getElementById("quantidade").value = cardapio.quantidadePrevista;
            document.getElementById("observacao").value = cardapio.observacao;

            idEdicao = id;
        });
}

function excluirCardapio(id) {

    fetch(`${apiCardapio}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            listarCardapios();
        });
}

function limparFormulario() {

    document.getElementById("data").value = "";
    document.getElementById("refeicao").value = "";
    document.getElementById("pratoPrincipal").value = "";
    document.getElementById("acompanhamento").value = "";
    document.getElementById("sobremesa").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("observacao").value = "";
}

listarCardapios();