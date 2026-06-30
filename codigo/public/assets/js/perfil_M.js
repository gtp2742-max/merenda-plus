function carregarPerfil() {
    const usuario = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
    if (!usuario) {
        window.location.href = "/modulos/login/login.html";
        return;
    }
    document.getElementById("nome").textContent = usuario.nome;
    document.getElementById("nome-completo").textContent = usuario.nome;
    document.getElementById("login").textContent = usuario.login;
    document.getElementById("email").textContent = usuario.email || "—";
}

carregarPerfil();