const apiReportes = "http://localhost:3000/reportes_Problemas";
const apiUsuarios = "http://localhost:3000/usuarios";
const apiHistorico = "http://localhost:3000/historico_alertas";

const listaReportes = document.getElementById("listaReportes");
const mensagem = document.getElementById("mensagem");

const parametros = new URLSearchParams(window.location.search);
const idSelecionado = parametros.get("id");

let reportes = [];
let merendeiras = [];
let nomeMerendeira = "Merendeira";

carregarDados();

function carregarDados(){
    Promise.all([
        fetch(apiReportes).then(function (res){
            return res.json();
        }),
        fetch(apiUsuarios).then(function (res){
            return res.json();
        })
    ])
        .then(function(dados){
            reportes = dados[0];
            const usuarios = dados[1];
            const merendeira = usuarios.find(function(usuario){
                return usuario.login === "merendeira";
            });
            if (merendeira){
                nomeMerendeira = merendeira.nome;
            }
            renderizarReportes()
        })
        .catch(function (){
            mostrarMensagem("Erro ao carregar reportes. Verifique se o JSON Server está rodando.", "danger");
        });
}

function renderizarReportes(){
    listaReportes.innerHTML = "";
    if (reportes.length === 0){
        listaReportes.innerHTML = `
        <p class="text-muted">Nenhum reporte encontrado.</p>
        `;
        return;
    }

    const reportesOrdenados = [...reportes];
    reportesOrdenados.sort(function(a, b){
        if(String(a.id) === String(idSelecionado)) return -1;
        if(String(b.id) === String(idSelecionado)) return 1;
        return 0;
    })

    reportesOrdenados.forEach(function(reporte){
        const selecionado = String(reporte.id) === String(idSelecionado);
        const resolvido = reporte.status === "Resolvido";
        let cardClasse = "reporte-card";

        if(resolvido){
            cardClasse += " resolvido";
        } else {
            cardClasse += " pendente";
        }

        if(selecionado){
            cardClasse += " selecionado";
        }
        if (resolvido){
            cardClasse += " resolvido";
        }
        const statusClasse = resolvido ? "status-resolvido" : "status-pendente";
        let badgeSelecionado ="";
        if (selecionado){
            badgeSelecionado = `
            <span class="badge-selecionado">Reporte selecionado</span>
            `;
        }
        let botoes = "";
        if(!resolvido){
            botoes = `
            <button class="btn btn-sm btn-outline-success btn-resolver" data-id="${reporte.id}">
                Marcar como resolvido 
            </button>
            `;
        } else{
            botoes = `
            <span class="badge bg-success">Ocorrência Resolvida</span>
            `;
        }
    
        listaReportes.innerHTML += `
            <div class="${cardClasse}">
                ${badgeSelecionado}
        
                <p><strong>Merendeira:</strong>${nomeMerendeira}</p>
                <p><strong>Tipo do problema:</strong>${reporte.tipos.join(", ")}</p>
                <p><strong>Descrição:</strong>${reporte.descricao}</p>
                <p><strong>Data:</strong>${reporte.data}</p>

                <p>
                    <strong>Status:</strong>
                    <span class="status ${statusClasse}">
                        ${reporte.status}
                    </span>
                </p>
                <div class="acoes">
                ${botoes}
                </div>
            </div>
        `;
    });
}

listaReportes.addEventListener("click", function (event){
    if (event.target.classList.contains("btn-resolver")){
        const id = event.target.dataset.id;
        marcarComoResolvido(id);
    }
});

async function marcarComoResolvido(id){
    const reporte = reportes.find(function (item){
        return String(item.id) === String(id);
    });

    if(!reporte){
        mostrarMensagem("Reporte não encontrado.", "danger");
    }

    if(reporte.status === "Resolvido"){
        mostrarMensagem("Este reporte já esta resolvido.", "warning");
        return;
    }

    const reporteAtualizado = {
        ...reporte,
        status: "Resolvido"
    };

    try {
        const respostaPut = await fetch(`${apiReportes}/${id}`, {
            method: "PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reporteAtualizado)
        });

        if (!respostaPut.ok){
            throw new Error("Erro ao atualizar reporte: " + respostaPut.status);
        }
        
        const historico = {
            origem: "Reporte de Merendeira",
            referenciaId: reporte.id,
            merendeira: nomeMerendeira,
            tipos: reporte.tipos,
            descricao: reporte.descricao,
            dataReporte: reporte.data,
            dataResolucao: new Date().toLocaleDateString("pt-BR"),
            status: "Resolvido"
        };

        const respostaHistorico = await fetch(apiHistorico,{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(historico)
        });

        if(!respostaHistorico.ok){
            throw new Error("Erro ao salvar histórico: " + respostaHistorico.status)
        }

        mostrarMensagem("Reporte marcado como resolvido e salvo no histórico.", "success");

        carregarDados();

    } catch (erro){
        mostrarMensagem("Erro ao atualizar o reporte.", "danger");
        console.error(erro);
    }
}

function mostrarMensagem(texto,tipo){
    mensagem.innerHTML = `
    <div classs="alert alert-${tipo}">
        ${texto}
    </div>
    `;
    setTimeout(function (){
        mensagem.innerHTML = "";
    }, 3000);
}

function voltar(){
    window.location.href = "alertas_diretora.html";
}


