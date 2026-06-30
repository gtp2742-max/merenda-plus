const apiURL = "/usuarios";
let usuariosTodos = [];

function carregarPerfil() {
    const usuario = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
    if (!usuario) {
        window.location.href = "/modulos/login/login.html";
        return;
    }
    document.getElementById("nome").textContent = usuario.nome;
    document.getElementById("nome-completo").textContent = usuario.nome;
    document.getElementById("login").textContent = usuario.login;
    document.getElementById("email").textContent = usuario.email || "-";
}

async function carregarUsuarios() {
    const resposta = await fetch(apiURL);
    if(!resposta.ok) throw new Error("Erro ao buscar usuários");
    return await resposta.json();
}

function renderTabela(usuarios) {
    const tbody = document.getElementById("tabela-body");
    const semResultados = document.getElementById("sem-resultados");
    const contagem = document.getElementById("contagem-filtro");

    if (contagem) contagem.textContent = `${usuarios.length} usuário(s) encontrado(s)`;
    if (!tbody) return;

    tbody.innerHTML = "";

    if (usuarios.length === 0) {
        semResultados.classList.remove("d-none");
        return;
    }
    semResultados?.classList.add("d-none");

    usuarios.forEach(usuario => {
        const roles = Array.isArray(usuario.role) ? usuario.role.join(", ") : (usuario.role || "-");
        const tr = document.createElement("tr");
        const statusHtml = usuario.status === "ativo"
            ? `<span class="status-badge ativo">Ativo</span>`
            : usuario.status === "pendente"
                ? `<span class="status-badge pendente">Pendente</span>`
                : `<span class="status-badge pendente">Sem status</span>`;

        const acaoHtml = usuario.status === "pendente"
            ? `<div class="acoes-wrap">
                <button class="btn-aceitar-js" data-id="${usuario.id}">Aceitar</button>
                <button class="btn-recusar-js" data-id="${usuario.id}">Recusar</button>
               </div>`
            : `—`;

        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td><strong>${usuario.login}</strong></td>
            <td>${roles}</td>
            <td>${statusHtml}</td>
            <td>${acaoHtml}</td>
        `;
        tbody.appendChild(tr);
    });
}

function popularUsuarios(lista) {
    const select = document.getElementById("filtro-professor");
    if (!select) return;
    select.innerHTML = `
        <option value="">
            Todos os Usuários
        </option>
    `;
    lista.forEach(usuario => { 
        const option = document.createElement("option");
        option.value = usuario.login;
        option.textContent = usuario.login;
        select.appendChild(option);
    });
}

function aplicarFiltros() {
    const busca = document.getElementById("filtro-busca").value.toLowerCase();
    const status = document.getElementById("filtro-status").value;
    const login = document.getElementById("filtro-professor").value;

    let filtrados = usuariosTodos;
    if (busca) {filtrados = filtrados.filter(usuario =>
        (usuario.login || "").toLowerCase().includes(busca) || (usuario.nome || "").toLowerCase().includes(busca));
    }
    if (status) {filtrados = filtrados.filter(usuario =>
        usuario.status === status );
    }
    if (login) {filtrados = filtrados.filter(usuario =>
        usuario.login === login);
    }
    renderTabela(filtrados);
} 

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-aceitar-js")) {
        const id = e.target.dataset.id;
        await fetch(`/usuarios/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            status: "ativo"
            })
        });
        alert("Usuário aprovado!");
        usuariosTodos = await carregarUsuarios();
        renderTabela(usuariosTodos);
    }
    if (e.target.classList.contains("btn-recusar-js")) {
        const id = e.target.dataset.id;
        if (!confirm("Tem certeza que deseja recusar e remover este usuário?")) 
            return;
        await fetch(`/usuarios/${id}`, {
            method: "DELETE"
        });
        alert("Usuário recusado!");
        usuariosTodos = await carregarUsuarios();
        renderTabela(usuariosTodos);
    }
});

document.getElementById("filtro-busca")?.addEventListener("input",aplicarFiltros);
document.getElementById("filtro-status")?.addEventListener("change",aplicarFiltros);
document.getElementById("filtro-professor")?.addEventListener("change", aplicarFiltros);
document.getElementById("btn-limpar")?.addEventListener("click", () => {
    document.getElementById("filtro-busca").value = "";
    document.getElementById("filtro-status").value = "";
    document.getElementById("filtro-professor").value = "";
    renderTabela(usuariosTodos);
});

async function init(){
    try {
        carregarPerfil();
        usuariosTodos = await carregarUsuarios();
        renderTabela(usuariosTodos);
        popularUsuarios(usuariosTodos);
    } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
    }
}

init();