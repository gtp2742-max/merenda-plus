const apiCardapio = "/cardapios";

const lista = document.getElementById("listaCardapios");

let cardapioSelecionado = null;

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
                        <td>${cardapio.acompanhamento}</td>
                        <td>${cardapio.sobremesa}</td>
                        <td>${cardapio.status}</td>
                        <td>
                            <button class="btn btn-warning btn-sm"
                                onclick="selecionarCardapio('${cardapio.id}')">
                                Alterar
                            </button>
                        </td>
                    </tr>
                `;
            });

        });
}

function selecionarCardapio(id) {

    fetch(`${apiCardapio}/${id}`)
        .then(res => res.json())
        .then(cardapio => {

            cardapioSelecionado = cardapio;

            document.getElementById("idCardapio").value = cardapio.id;

            document.getElementById("observacaoMerendeira").value =
                cardapio.observacao || "";
        });
}

document.getElementById("registrarAlteracao")
    .addEventListener("click", () => {

        const observacao =
            document.getElementById("observacaoMerendeira").value;

        if (!cardapioSelecionado) {
            alert("Selecione um cardápio.");
            return;
        }

        const atualizado = {
            ...cardapioSelecionado,
            observacao: observacao,
            status: "Alterado"
        };

        fetch(`${apiCardapio}/${cardapioSelecionado.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(atualizado)
        })
            .then(() => {

                document.getElementById("observacaoMerendeira").value = "";

                listarCardapios();

                alert("Alteração registrada.");
            });
    });

listarCardapios();

function voltar() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "home_M.html";
    }
}