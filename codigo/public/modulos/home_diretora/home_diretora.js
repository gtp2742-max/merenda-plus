const apiUsuarios = "/usuarios";
const apiEstoque = "/estoque";
const apiConsumos = "/consumos";
const apiRelatorios = "/retalorios";
const apiProblemas = "/estoque";

let id = 3

async function MostrarInformacoes() {
    const resposta_usuarios = await fetch(apiUsuarios)
    const usuarios = await resposta_usuarios.json()

    const resposta_refeicoes = await fetch(apiConsumos)
    const consumos = await resposta_refeicoes.json()

    const resposta_estoque = await fetch(apiEstoque)
    const estoques = await resposta_estoque.json()

    let usuario = usuarios.find(function (elem) { return elem.id == id })
    let consumo = consumos[consumos.length - 1]
    let oi = document.getElementById('ola')
    let refeicao = document.getElementById('refeicoes')
    let desperdicio = document.getElementById('desperdicio')
    
    if (usuario) {
        oi.innerHTML = `<p>Olá, ${usuario.nome}</p>
                        `
        refeicao.innerHTML = `<h5>Total de refeições: </h5>
                              <p>${consumo.quantidadeServida}</p>
                        `
        desperdicio.innerHTML = `<h5>Desperdício: </h5>
                              <p>${consumo.desperdicio}</p>
                        `


    } else {
        oi.innerHTML = "Usuario não encontrado"
    }
}


MostrarInformacoes()