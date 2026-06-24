const apiUsuarios = "/usuarios";
const apiCardapio = "/cardapios";
const apiPorcoes = "/refeicoesPrevistas";

let id = 4;

async function MostrarInformacoes() {
    const respostaUsuarios = await fetch(apiUsuarios);
    const usuarios = await respostaUsuarios.json();

    const respostaCardapio = await fetch(apiCardapio);
    const cardapios = await respostaCardapio.json();

    const respostaPorcoes = await fetch(apiPorcoes);
    const porcoes = await respostaPorcoes.json();

    const usuario = usuarios.find(u => u.id == id);
    const oi = document.getElementById('ola');
    const registroPorcoes = document.getElementById('porcoes');
    const cardapio = document.getElementById('cardapio');

 if (!usuario) {
        oi.innerHTML = "Usuário não encontrado";
        return;
    }

    oi.innerHTML = `
        <h4>Olá, ${usuario.nome}</h4>
    `;

    registroPorcoes.innerHTML = `
        <strong>Refeições previstas:</strong>
        ${porcoes.porcoes}
    `;

    const hoje = cardapios[0];

    cardapio.innerHTML = `
        <li><strong>Prato Principal:</strong> ${hoje.pratoPrincipal}</li>
        <li><strong>Acompanhamento:</strong> ${hoje.acompanhamento}</li>
        <li><strong>Sobremesa:</strong> ${hoje.sobremesa}</li>
        <li><strong>Status:</strong> ${hoje.status}</li>
    `;
}

MostrarInformacoes();