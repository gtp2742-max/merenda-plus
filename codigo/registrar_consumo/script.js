const apiUrl = "http://localhost:3000/consumos";




function createConsumo(consumo) {

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(consumo)
    })
        .then(() => {
            alert("Consumo inserido com sucesso");
        });
}


function desperdicio(){
    let porcoes = Number(document.getElementById("porcoes").value)
    let sobras = Number(document.getElementById("sobras").value)

    const valor = ( sobras / porcoes) * 100
    return valor
}

let qtdservida = document.getElementById("qtdservida")
let porcoes = document.getElementById("porcoes")
let sobras = document.getElementById("sobras");

porcoes.addEventListener("input", function () {
    
    sobras.value = Number(porcoes.value) - Number(qtdservida.value);
    document.getElementById("desperdicio").value = desperdicio().toFixed(0);
});
sobras.addEventListener("input", function () {

    document.getElementById("desperdicio").value = desperdicio().toFixed(0);
});

qtdservida.addEventListener("input", function () {

    sobras.value = Number(porcoes.value) - Number(qtdservida.value);
    document.getElementById("desperdicio").value = desperdicio().toFixed(0);
});

document.getElementById("btnSalvar")
.addEventListener("click", function () {
            let form1 = document.getElementById("form1");
            let form2 = document.getElementById("form2");

            if (!form1.checkValidity() && !form2.checkValidity()) {

                alert("Preencha os formulários");
                return;
            }

            let consumos = {

                id: "",

                data: document.getElementById("data").value,
                refeicao: document.querySelector('input[name="tipo"]:checked').value,
                quantidadeServida: Number(document.getElementById("qtdservida").value),
                quantidadeSobra: Number(document.getElementById("sobras").value)
            };

            createConsumo(consumos);

            form1.reset();
            form2.reset();

        });