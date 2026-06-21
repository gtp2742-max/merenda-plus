const apiUsuarios = "/usuarios";
const apiEstoque = "/estoque";
const apiConsumos = "/consumos";
const apiRelatorios = "/retalorios";
const apiProblemas = "/reportes_Problemas";

let id = 2

async function MostrarInformacoes() {
    const resposta_usuarios = await fetch(apiUsuarios)
    const usuarios = await resposta_usuarios.json()

    const resposta_refeicoes = await fetch(apiConsumos)
    const consumos = await resposta_refeicoes.json()

    const resposta_estoque = await fetch(apiEstoque)
    const estoques = await resposta_estoque.json()

    const resposta_problemas = await fetch(apiProblemas)
    const problemas = await resposta_problemas.json()

    let usuario = usuarios.find(function (elem) { return elem.id == id })
    let consumo = consumos[consumos.length - 1]
    let problema = problemas.filter(function (elem) { return elem.status == "Pendente" })
    let normal = estoques.filter(function (elem) { return elem.quantidade >= 5 })
    let baixo = estoques.filter(function (elem) { return elem.quantidade < 5 })
    let porcentagem = Porcetagem_estoque(normal.length,baixo.length).toFixed(2)
    let oi = document.getElementById('ola')
    let refeicao = document.getElementById('refeicoes')
    let estoque = document.getElementById('estoque')
    let alerta = document.getElementById('alertas')
    let desperdicio = document.getElementById('desperdicio')
    
    if (usuario) {
        oi.innerHTML = `<p>Olá, ${usuario.nome}</p>
                        `
        refeicao.innerHTML = `<h5>Total de refeições: </h5>
                              <p class="text-center">${consumo.quantidadeServida}</p>
                        `
        estoque.innerHTML = `<h5>Porcetagem estoque: </h5>
                              <p class="text-center">${porcentagem}%</p>
                        `
        alerta.innerHTML = `<h5>Total de alertas: </h5>
                              <p class="text-center">${problema.length}</p>
                        `
        desperdicio.innerHTML = `<h5>Desperdício: </h5>
                              <p class="text-center">${consumo.desperdicio}%</p>
                        `


    } else {
        oi.innerHTML = "Usuario não encontrado"
    }
}

function Porcetagem_estoque(normal, baixo){
    let total
    if (normal == 0 || baixo == 0) {
        total = 100
    }else{
        total = (normal / baixo) * 100
    }
    return total
}

MostrarInformacoes()