let estoque = [];

const botaoBuscar = document.getElementById('buscar');
const pesquisa = document.getElementById('pesquisa') ;
const tabela = document.getElementById('tabela-estoque');


fetch("http://localhost:3000/estoque")
    .then(resposta => resposta.json())
    .then(dados => {

        estoque = dados;
        console.log("estoque carregado: " , estoque);

    });



botaoBuscar.addEventListener('click', function(e){

    const alimento = pesquisa.value.toLowerCase();
     
    const encontrado = estoque.filter(item => item.nome.toLowerCase().includes(alimento)
    );    
   
   tabela.innerHTML = "";

   if (encontrado.length > 0){
     encontrado.forEach(encontrado => {
        
    const novaLinha = document.createElement('tr');

    novaLinha.innerHTML = ` 
    <td> ${encontrado.nome}</td>
    <td>${encontrado.quantidade}</td>
    <td>${encontrado.unidade}</td>

    `;
    tabela.appendChild(novaLinha);
     });    
     
    }
    else{ alert("Alimentado não encontrado");

    } 

    pesquisa.value = ""; 

});


    




