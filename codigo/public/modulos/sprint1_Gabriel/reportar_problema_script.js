const form = document.getElementById("formProblema")
const mensagem = document.getElementById("mensagem")

form.addEventListener("submit", function(event) {
    event.preventDefault();
    const descricao = document.getElementById("descricao").value.trim();
    const opcoesSelecionadas = document.querySelectorAll(
        `input[name="opcoes[]"]:checked`
    );

    if (opcoesSelecionadas.length === 0 || descricao === ""){
        mensagem.innerHTML = `
        <div class="alert alert-danger">
            Selecione pelo menos um problema e preencha a descrição.
        </div>`;
        return;
    }

    const tipos = [];
    opcoesSelecionadas.forEach(function(opcao) {
        tipos.push(opcao.value);
    });

    const reporte = {
        tipos: tipos,
        descricao: descricao,
        data: new Date().toLocaleDateString("pt-BR"),
        status: "Enviado"
    };

    console.log(reporte);
    mensagem.innerHTML = `
    <div class="alert alert-success">
        Reporte enviado com sucesso!
    </div>`;

    form.reset();
});

function voltar(){
    alert("Voltando para a tela anterior...")
}