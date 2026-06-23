document.addEventListener('DOMContentLoaded', async () => {

  const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioCorrente")
);


console.log(usuarioLogado);

    const apiUrl = "http://localhost:3000/usuarios";


    let usuariosTodos = [];



    async function carregarUsuarios() {

        const resposta = await fetch(apiUrl);


        if (!resposta.ok) {

            throw new Error("Erro ao buscar usuários");

        }


        return await resposta.json();

    }





    function renderTabela(usuarios) {


        const tbody = document.getElementById("tabela-body");

        const semResultados = document.getElementById("sem-resultados");

       const contagem = document.getElementById("contagem-filtro");
        if (contagem) {
         contagem.textContent = `${usuarios.length} registro(s) encontrado(s)`;
}

        if (!tbody) return;



        tbody.innerHTML = "";



        if (usuarios.length === 0) {


            if (semResultados) {

                semResultados.classList.remove("d-none");

            }


            return;

        }



        if (semResultados) {

            semResultados.classList.add("d-none");

        }





        usuarios.forEach(usuario => {


            const tr = document.createElement("tr");



            tr.innerHTML = `


                <td class="ps-4">
                    ${usuario.id}
                </td>


                <td>
                    <strong>
                        ${usuario.login}
                    </strong>
                </td>


                <td>
                    Sistema Escolar
                </td>


                <td>
                    -
                </td>


                <td>
                    -
                </td>


                <td>


                    ${
                       usuario.status === "ativo"?`
                      <span class="badge bg-success">Ativo</span>`:
                      `
                      <div class="d-flex gap-2 align-items-center">

                     <span class="badge bg-warning">Pendente</span>

                    <button class="btn btn-sm btn-success btn-aceitar" data-id="${usuario.id}">
                      Aceitar
                    </button>

                    <button class="btn btn-sm btn-danger btn-recusar" data-id="${usuario.id}">
                    Recusar
                    </button>

                  </div>`
                    
                }


                </td>


            `;



            tbody.appendChild(tr);


        });


    }
document.addEventListener("click", async (e) => {


   

    if(e.target.classList.contains("btn-aceitar")){


        const id = e.target.dataset.id;


        await fetch(`http://localhost:3000/usuarios/${id}`, {

            method: "PATCH",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({
                status:"ativo"
            })

        });


        alert("Usuário aprovado!");

        usuariosTodos = await carregarUsuarios();

        renderTabela(usuariosTodos);


    }




   

    if(e.target.classList.contains("btn-recusar")){


        const id = e.target.dataset.id;


        await fetch(`http://localhost:3000/usuarios/${id}`, {

            method:"DELETE"

        });


        alert("Usuário recusado!");


        usuariosTodos = await carregarUsuarios();

        renderTabela(usuariosTodos);


    }


});
     

   




    function popularUsuarios(lista) {


        const select = document.getElementById("filtro-professor");


        if (!select) return;



        select.innerHTML = `

            <option value="">
                Todos os Usuários
            </option>

        `;



        lista.forEach(usuario => {


            const option = document.createElement("option");


            option.value = usuario.login;

            option.textContent = usuario.login;



            select.appendChild(option);


        });


    }






    function aplicarFiltros() {


        const busca = document
            .getElementById("filtro-busca")
            .value
            .toLowerCase();



        const status = document
            .getElementById("filtro-status")
            .value;



        const login = document
            .getElementById("filtro-professor")
            .value;





        let filtrados = usuariosTodos;




        if(busca){


            filtrados = filtrados.filter(usuario =>


                usuario.login
                .toLowerCase()
                .includes(busca)


            );


        }





        if(status){


            filtrados = filtrados.filter(usuario =>


                usuario.status === status


            );


        }





        if(login){


            filtrados = filtrados.filter(usuario =>


                usuario.login === login


            );


        }




        renderTabela(filtrados);


    }







    try {


        usuariosTodos = await carregarUsuarios();



        console.log("Usuários carregados:", usuariosTodos);



        renderTabela(usuariosTodos);



        popularUsuarios(usuariosTodos);



    }

    catch(erro){


        console.error("Erro:", erro);


    }








    document
    .getElementById("filtro-busca")
    ?.addEventListener(
        "input",
        aplicarFiltros
    );




    document
    .getElementById("filtro-status")
    ?.addEventListener(
        "change",
        aplicarFiltros
    );




    document
    .getElementById("filtro-professor")
    ?.addEventListener(
        "change",
        aplicarFiltros
    );






    document
    .getElementById("btn-limpar")
    ?.addEventListener(
        "click",
        ()=>{


            document.getElementById("filtro-busca").value="";

            document.getElementById("filtro-status").value="";

            document.getElementById("filtro-professor").value="";



            renderTabela(usuariosTodos);


        }
    );

function carregarPerfil(){

    const usuario = JSON.parse(
        sessionStorage.getItem("usuarioCorrente")
    );


    if(!usuario){

        window.location.href =
        "/modulos/login/login.html";

        return;
    }



    document.getElementById("nome").textContent =
        usuario.nome;


    document.getElementById("email").textContent =
        usuario.email;

}


carregarPerfil();

});