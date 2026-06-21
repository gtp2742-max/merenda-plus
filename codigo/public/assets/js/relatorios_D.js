const botao = document.getElementById("filtro")

const apiRelatorio = "/relatorios";

let grafico = null

function mostrarDados(mes) {

    fetch(apiRelatorio)
        .then(res => res.json())
        .then(dados => {
            const mesEscolhido = dados.filter((item) => {
                return item.mes == mes
            })

            const refeicoes = document.getElementById("total_refeicoes")
            refeicoes.textContent = mesEscolhido[0].totalRefeicoes + " Refeições"

            const porcentagemDesperdicio = document.getElementById("porcentagem_desp")
            porcentagemDesperdicio.textContent = mesEscolhido[0].desperdicioPercentual + "% de Desperdício"

            const porcentagemCardapio = document.getElementById("porcentagem_cardapio")
            porcentagemCardapio.textContent = mesEscolhido[0].cardapioCumprido + "% Concluído"

            const semanas = []
            const kilo = []
            mesEscolhido[0].desperdicioSemanal.forEach(element => {
                semanas.push(element.semana)
                kilo.push(element.kg)

            });

            console.log(grafico)

            if (grafico != null) {
                grafico.destroy()
            }

            let ctx = document.getElementById("grafico").getContext("2d")
            grafico = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: semanas,
                    datasets: [{
                        label: "Desperdício (kg)",
                        data: kilo
                    }]
                }
            })

            const observacao = document.getElementById("observacao")
            observacao.innerHTML =
                `
                    <strong>Observação:</strong><br>
                    ${mesEscolhido[0].observacao}
                `;

        })
}
botao.addEventListener("click", () => {
    const mesSele = document.getElementById("mes_filtro").value
    mostrarDados(mesSele)

})


document.getElementById("pdf").addEventListener("click", () => {
    window.print()
})

mostrarDados("1")        