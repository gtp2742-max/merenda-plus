const apiUsuarios = "http://localhost:3000/usuarios";
const apiCardapio = "http://localhost:3000/cardapio";
const apiPorcoes = "http://localhost:3000/refeicoes_previstas";

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

        cardapio.innerHTML = `<li>Prato principal: ${cardapios.pratoPrincipal}</li>
                              <li>Acompanhamento: ${cardapios.acompanhamento}</li>
                              <li>Fruta: ${cardapios.fruta}</li>
                             `

    } else {
        oi.innerHTML = "Usuario não encontrado"
    }
}

MostrarInformacoes()