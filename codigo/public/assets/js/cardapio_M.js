const apiCardapio = "/cardapios";

const lista = document.getElementById("listaCardapios");
const btnRegistrar = document.getElementById("registrarAlteracao");
const avisoSelecao = document.getElementById("avisoSelecao");

let cardapioSelecionado = null;

function formatarData(dataISO) {
    if (!dataISO) return "—";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

function badgeStatus(status) {
    const mapa = {
        "Planejado":  "badge-planejado",
        "Alterado":   "badge-alterado",
        "Concluído":  "badge-concluido",
        "Concluido":  "badge-concluido"
    };
    const classe = mapa[status] || "badge-planejado";
    return `<span class="badge-status ${classe}">${status}</span>`;
}

async function listarCardapios() {
    try {
        const res = await fetch(apiCardapio);
        const cardapios = await res.json();

        if (!cardapios || cardapios.length === 0) {
            lista.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">
                        Nenhum cardápio cadastrado.
                    </td>
                </tr>`;
            return;
        }

        lista.innerHTML = cardapios.map(c => `
            <tr>
                <td>${formatarData(c.data)}</td>
                <td>${c.refeicao}</td>
                <td>${c.pratoPrincipal}</td>
                <td>${c.acompanhamento}</td>
                <td>${c.sobremesa}</td>
                <td>${badgeStatus(c.status)}</td>
                <td>
                    <button class="btn-alterar" onclick="selecionarCardapio('${c.id}')">
                        Alterar
                    </button>
                </td>
            </tr>
        `).join("");

    } catch (erro) {
        console.error("Erro ao listar cardápios:", erro);
        lista.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    Erro ao carregar cardápios.
                </td>
            </tr>`;
    }
}

async function selecionarCardapio(id) {
    try {
        const res = await fetch(`${apiCardapio}/${id}`);
        cardapioSelecionado = await res.json();

        document.getElementById("idCardapio").value = cardapioSelecionado.id;
        document.getElementById("observacaoMerendeira").value =
            cardapioSelecionado.observacao || "";

        // Habilita o botão e esconde o aviso
        btnRegistrar.disabled = false;
        avisoSelecao.style.display = "none";

        document.getElementById("observacaoMerendeira").scrollIntoView({
            behavior: "smooth", block: "center"
        });

    } catch (erro) {
        console.error("Erro ao selecionar cardápio:", erro);
        alert("Erro ao carregar o cardápio. Tente novamente.");
    }
}

btnRegistrar.addEventListener("click", async () => {
    if (!cardapioSelecionado) {
        alert("Selecione um cardápio na tabela.");
        return;
    }

    const observacao = document.getElementById("observacaoMerendeira").value.trim();

    if (!observacao) {
        alert("Descreva a alteração antes de registrar.");
        return;
    }

    const atualizado = {
        ...cardapioSelecionado,
        observacao,
        status: "Alterado"
    };

    try {
        const res = await fetch(`${apiCardapio}/${cardapioSelecionado.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(atualizado)
        });

        if (!res.ok) throw new Error("Erro ao salvar.");

        document.getElementById("observacaoMerendeira").value = "";
        document.getElementById("idCardapio").value = "";
        cardapioSelecionado = null;
        btnRegistrar.disabled = true;
        avisoSelecao.style.display = "block";

        alert("Alteração registrada com sucesso!");
        listarCardapios();

    } catch (erro) {
        console.error("Erro ao registrar alteração:", erro);
        alert("Erro ao registrar a alteração. Tente novamente.");
    }
});

function voltar() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "home_M.html";
    }
}

listarCardapios();