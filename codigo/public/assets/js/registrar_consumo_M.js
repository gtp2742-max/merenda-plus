const apiConsumos = "/consumos";
const apiCardapios = "/cardapios";
const apiPorcoes = "/refeicoesPrevistas";

async function carregarDadosIniciais() {
    try {
        const [respostaCardapio, respostaPorcoes] = await Promise.all([
            fetch(apiCardapios),
            fetch(apiPorcoes)
        ]);

        const cardapios = await respostaCardapio.json();
        const porcoes = await respostaPorcoes.json();

        const hoje = new Date().toISOString().split("T")[0];
        const cardapioHoje = cardapios.find(c => c.data === hoje);

        if (!cardapioHoje) {
            document.getElementById("avisoSemCardapio").classList.remove("d-none");
        }
        const cardapio = cardapioHoje || cardapios[cardapios.length - 1];

        if (cardapio) {
            document.getElementById("refeicao_dia").textContent =
                `${cardapio.pratoPrincipal} | ${cardapio.acompanhamento} | ${cardapio.sobremesa}`;

            document.getElementById("porcoes").textContent =
                cardapio.quantidadePrevista || porcoes.porcoes;

            const selectTipo = document.getElementById("tipo");
            if (cardapio.refeicao) {
                for (let opt of selectTipo.options) {
                    if (opt.value === cardapio.refeicao) {
                        opt.selected = true;
                        break;
                    }
                }
            }
        } else {
            document.getElementById("refeicao_dia").textContent = "Nenhum cardápio cadastrado.";
            document.getElementById("porcoes").textContent = porcoes.porcoes || "—";
        }

        document.getElementById("data").value = hoje;

    } catch (erro) {
        console.error("Erro ao carregar dados iniciais:", erro);
        document.getElementById("refeicao_dia").textContent = "Erro ao carregar cardápio.";
    }
}

function calcularDesperdicio() {
    const previstas = Number(document.getElementById("porcoes").textContent);
    const sobras = Number(document.getElementById("sobras").value);

    if (!previstas || isNaN(sobras) || sobras === 0) {
        document.getElementById("desperdicio").value = "";
        return;
    }

    if (sobras > previstas) {
        document.getElementById("desperdicio").value = "Valor inválido";
        return;
    }

    const percentual = (sobras / previstas) * 100;
    document.getElementById("desperdicio").value = percentual.toFixed(2) + "%";
}

document.getElementById("qtdservida").addEventListener("input", calcularDesperdicio);
document.getElementById("sobras").addEventListener("input", calcularDesperdicio);

async function listarConsumos() {
    try {
        const resposta = await fetch(apiConsumos);
        const consumos = await resposta.json();
        const tbody = document.getElementById("tabela");

        if (!consumos || consumos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        Nenhum consumo registrado ainda.
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = consumos.map(consumo => `
            <tr>
                <td>${formatarData(consumo.data)}</td>
                <td>${consumo.refeicaoDoDia}</td>
                <td>${consumo.refeicaoTipo}</td>
                <td>${consumo.quantidadeServida}</td>
                <td>${consumo.quantidadeSobra}</td>
                <td>${consumo.desperdicio}%</td>
            </tr>
        `).join("");

    } catch (erro) {
        console.error("Erro ao listar consumos:", erro);
    }
}

function formatarData(dataISO) {
    if (!dataISO) return "—";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

document.getElementById("btnSalvar").addEventListener("click", async () => {
    const refeicaoDoDia = document.getElementById("refeicao_dia").textContent.trim();
    const data = document.getElementById("data").value;
    const tipo = document.getElementById("tipo").value;
    const qtdServida = Number(document.getElementById("qtdservida").value);
    const sobras = Number(document.getElementById("sobras").value);
    const desperdicioTexto = document.getElementById("desperdicio").value;

    if (!data) {
        alert("Informe a data do consumo.");
        return;
    }
    if (!qtdServida || qtdServida <= 0) {
        alert("Informe a quantidade servida.");
        return;
    }
    if (isNaN(sobras) || sobras < 0) {
        alert("Informe um valor válido para sobras.");
        return;
    }
    if (sobras > qtdServida) {
        alert("As sobras não podem ser maiores que a quantidade servida.");
        return;
    }
    if (desperdicioTexto === "Valor inválido" || desperdicioTexto === "") {
        alert("Verifique os valores antes de salvar.");
        return;
    }

    const desperdicio = parseFloat(desperdicioTexto.replace("%", ""));

    const consumo = {
        refeicaoDoDia,
        data,
        refeicaoTipo: tipo,
        quantidadeServida: qtdServida,
        quantidadeSobra: sobras,
        desperdicio
    };

    try {
        const resposta = await fetch(apiConsumos, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(consumo)
        });

        if (!resposta.ok) throw new Error("Erro ao salvar.");

        alert("Consumo registrado com sucesso!");

        document.getElementById("qtdservida").value = "";
        document.getElementById("sobras").value = "";
        document.getElementById("desperdicio").value = "";

        listarConsumos();

    } catch (erro) {
        console.error("Erro ao salvar consumo:", erro);
        alert("Erro ao salvar o consumo. Tente novamente.");
    }
});

function voltar() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "home_M.html";
    }
}

carregarDadosIniciais();
listarConsumos();