fetch("http://localhost:3000/relatorios")
    .then(res => res.json())
    .then(dados => {

        const relatorio = dados[0]

        document.getElementById("total_refeicoes").textContent = relatorio.totalRefeicoes

        document.getElementById("porcentagem_desp").textContent = relatorio.desperdicioPercentual + "%"

        document.getElementById("porcentagem_cardapio").textContent = relatorio.cardapioCumprido + "%"

        const desperdicio = relatorio.desperdicioSemanal

        const grafico = document.getElementById("grafico")

        // desperdicio.forEach((item) => {

        //     grafico.innerHTML += `
        //         <p>${item.semana}</p>
                
        //     `;
            
        // })
    })