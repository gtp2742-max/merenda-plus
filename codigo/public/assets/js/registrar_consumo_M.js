const apiUrl = "/consumos";


async function MostrarInformacoes() {
    const resposta = await fetch(apiUrl)
    const data = await resposta.json()

    if (data) {
        let textoHTML = `
                <tr>
                <th>ID</th>
                <th>Refeição do Dia</th>
                <th>Data</th>
                <th>Tipo</th>
                <th>Quantidade Servida</th>
                <th>Quantidade Sobra</th>
                <th>Desperdicio</th>
                </tr>
            `
        for (let index = 0; index < data.length; index++) {
            const dat = data[index]
            textoHTML += `
                        <tr>
                        <td>${dat.id}</td>
                        <td>${dat.refeicaoDoDia}</td>
                        <td>${dat.data}</td>
                        <td>${dat.refeicaoTipo}</td>
                        <td>${dat.quantidadeServida}</td>
                        <td>${dat.quantidadeSobra}</td>
                        <td>${dat.desperdicio}</td>
                        </tr>
                        
        `
        }

        document.querySelector("#tabela").innerHTML = `
                    ${textoHTML}
    `
    } 
}

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

function updateConsumo(id, consumo) {

    fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(consumo)
    })
        .then(() => {
            alert("Consumo alterado");
        });
}

function deleteConsumo(id) {

    fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            alert("Consumo removido");
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
    document.getElementById("desperdicio").value = desperdicio().toFixed(2);
});
sobras.addEventListener("input", function () {

    document.getElementById("desperdicio").value = desperdicio().toFixed(2);
});

qtdservida.addEventListener("input", function () {

    sobras.value = Number(porcoes.value) - Number(qtdservida.value);
    document.getElementById("desperdicio").value = desperdicio().toFixed(2);
});
let idConsumo

document.getElementById("tabela")
        .addEventListener("click", function (e) {

            if (e.target.tagName == "TD") {

                let linha = e.target.parentNode.querySelectorAll("td");

                idConsumo = linha[0].innerText
                document.getElementById("refeicao_dia").value = linha[1].innerText;
                document.getElementById("data").value = linha[2].innerText;
                let refeicao = linha[3].innerText;
                document.getElementById("qtdservida").value = Number(linha[4].innerText);
                document.getElementById("sobras").value = Number(linha[5].innerText);
                document.getElementById("desperdicio").value = Number(linha[6].innerText);

                 document.querySelector(
                `input[name="tipo"][value="${refeicao}"]`
                ).checked = true;

                document.getElementById("porcoes").value = Number(linha[4].innerText) + Number(linha[5].innerText);
            }

           
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

                refeicaoDoDia: document.getElementById("refeicao_dia").value,
                data: document.getElementById("data").value,
                refeicaoTipo: document.querySelector('input[name="tipo"]:checked').value,
                quantidadeServida: Number(document.getElementById("qtdservida").value),
                quantidadeSobra: Number(document.getElementById("sobras").value),
                desperdicio: Number(document.getElementById("desperdicio").value)
            };

            createConsumo(consumos);

            form1.reset();
            form2.reset();

        });

document.getElementById("btnAlterar")
.addEventListener("click", function () {
            let form1 = document.getElementById("form1");
            let form2 = document.getElementById("form2");

            if (!form1.checkValidity() && !form2.checkValidity()) {

                alert("Preencha os formulários");
                return;
            }

            let consumos = {

                id: "",

                refeicaoDoDia: document.getElementById("refeicao_dia").value,
                data: document.getElementById("data").value,
                refeicaoTipo: document.querySelector('input[name="tipo"]:checked').value,
                quantidadeServida: Number(document.getElementById("qtdservida").value),
                quantidadeSobra: Number(document.getElementById("sobras").value),
                desperdicio: Number(document.getElementById("desperdicio").value)
            };

            updateConsumo(idConsumo,consumos);

            form1.reset();
            form2.reset();

            document.getElementById("btnAlterar")
            .classList.toggle("d-none");

            document.getElementById("btnDeletar")
            .classList.toggle("d-none");

            document.getElementById("consumos")
            .classList.toggle("d-none");

            document.getElementById("btnEditar")
            .classList.remove("d-none");

        });

document.getElementById("btnEditar")
.addEventListener("click", async function () {

        document.getElementById("btnAlterar")
            .classList.remove("d-none");

        document.getElementById("btnDeletar")
            .classList.remove("d-none");

        document.getElementById("consumos")
            .classList.remove("d-none");

        document.getElementById("btnEditar")
            .classList.toggle("d-none");
            
        
    });

document.getElementById("btnDeletar")
        .addEventListener("click", function () {

            let form1 = document.getElementById("form1");
            let form2 = document.getElementById("form2");

            deleteConsumo(idConsumo);

            form1.reset();
            form2.reset();

            document.getElementById("btnAlterar")
            .classList.toggle("d-none");

            document.getElementById("btnDeletar")
            .classList.toggle("d-none");

            document.getElementById("consumos")
            .classList.toggle("d-none");

            document.getElementById("btnEditar")
            .classList.remove("d-none");
        });

MostrarInformacoes();

function voltar() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "home_M.html";
    }
}