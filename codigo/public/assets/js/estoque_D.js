const API = "/estoque";

const tabelaEstoque = document.getElementById("tabela-estoque");
const tabelaValidade = document.getElementById("tabela-validade");



function formatarData(data) {

    const dataObj = new Date(data);

    return dataObj.toLocaleDateString("pt-BR");
}



function diasParaVencer(data) {

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    const validade = new Date(data);

    validade.setHours(0, 0, 0, 0);

    return Math.ceil(
        (validade - hoje) /
        (1000 * 60 * 60 * 24)
    );
}

async function carregarEstoque() {

    try {

        const resposta = await fetch(API);
        const estoque = await resposta.json();

        tabelaEstoque.innerHTML = "";

        estoque.forEach(item => {

            const dias = diasParaVencer(item.validade);

            let classeLinha = "";

            if (dias < 0) {
                classeLinha = "table-danger";
            } else if (dias <= 14) {
                classeLinha = "table-warning";
            }

            tabelaEstoque.innerHTML += `
                <tr class="${classeLinha}">
                    <td>${item.nome}</td>
                    <td>${item.quantidade} ${item.unidade}</td>
                    <td>${formatarData(item.validade)}</td>

                    <td class="text-center">

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="removerAlimento('${item.id}')">

                            <i class="bi bi-trash"></i>

                        </button>

                    </td>
                </tr>
            `;
        });

        return estoque;

    } catch (erro) {

        console.error(erro);
        alert("Erro ao carregar estoque.");

    }
}


async function removerAlimento(id) {

    const confirmar = confirm(
        "Deseja realmente remover este alimento?"
    );

    if (!confirmar) return;

    try {

        await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        alert("Alimento removido com sucesso!");

        carregarEstoque();

    } catch (erro) {

        console.error(erro);
        alert("Erro ao remover alimento.");

    }
}


document
.getElementById("mostrar_total")
.addEventListener("click", async () => {

    const estoque = await carregarEstoque();

    document.getElementById("total-produtos")
        .textContent = estoque.length;

});



document
.getElementById("mostrar_baixo_estoque")
.addEventListener("click", async () => {

    const estoque = await carregarEstoque();

    const baixoEstoque = estoque.filter(
        item => item.quantidade <= 5
    );

    document.getElementById("baixo-estoque")
        .textContent = baixoEstoque.length;

});

document
.getElementById("mostrar_vencimento")
.addEventListener("click", async () => {

    const estoque = await carregarEstoque();

    tabelaValidade.innerHTML = "";

    const proximos = estoque.filter(item => {

        const dias = diasParaVencer(item.validade);

        return dias >= 0 && dias <= 14;

    });

    document.getElementById("proximos-vencer")
        .textContent = proximos.length;

    if (proximos.length === 0) {

        tabelaValidade.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    Nenhum produto próximo do vencimento.
                </td>
            </tr>
        `;

        return;
    }

    proximos.forEach(item => {

        const dias = diasParaVencer(item.validade);

        tabelaValidade.innerHTML += `
            <tr class="table-warning">
                <td>${item.nome}</td>
                <td>${item.quantidade} ${item.unidade}</td>
                <td>${formatarData(item.validade)}</td>
                <td>${dias} dias</td>
            </tr>
        `;
    });

});

document
.getElementById("buscar")
.addEventListener("click", async () => {

    const termo =
        document.getElementById("pesquisa")
        .value
        .toLowerCase();

    const estoque = await carregarEstoque();

    const resultado = estoque.filter(item =>
        item.nome.toLowerCase().includes(termo)
    );

    tabelaEstoque.innerHTML = "";

    resultado.forEach(item => {

        tabelaEstoque.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.quantidade} ${item.unidade}</td>
                <td>${formatarData(item.validade)}</td>

                <td class="text-center">

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="removerAlimento('${item.id}')">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>
            </tr>
        `;
    });

});


document
.getElementById("btnAdicionarAlimento")
.addEventListener("click", async () => {

    const nome =
        document.getElementById("nomeAlimento").value;

    const quantidade =
        Number(
            document.getElementById(
                "quantidadeAlimento"
            ).value
        );

    const unidade =
        document.getElementById(
            "unidadeAlimento"
        ).value;

    const validade =
        document.getElementById(
            "validadeAlimento"
        ).value;

    if (
        !nome ||
        !quantidade ||
        !unidade ||
        !validade
    ) {

        alert("Preencha todos os campos.");
        return;
    }

    const novoItem = {
        nome,
        quantidade,
        unidade,
        validade
    };

    try {

        await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify(novoItem)

        });

        alert("Alimento adicionado!");

        document.getElementById("nomeAlimento").value = "";
        document.getElementById("quantidadeAlimento").value = "";
        document.getElementById("unidadeAlimento").value = "";
        document.getElementById("validadeAlimento").value = "";

        carregarEstoque();

    } catch (erro) {

        console.error(erro);
        alert("Erro ao adicionar alimento.");

    }

});


document
.getElementById("mostrar")
.addEventListener(
    "click",
    carregarEstoque
);

function voltar() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "home_D.html";
    }
}

carregarEstoque();