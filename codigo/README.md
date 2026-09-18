# Merenda+ — Código da Aplicação

Esta pasta contém a implementação do **Merenda+**, uma aplicação web desenvolvida para apoiar o gerenciamento da alimentação escolar, integrando informações de estoque, cardápios, preparo, consumo, reportes e alertas.

A aplicação foi desenvolvida com **HTML, CSS e JavaScript** no frontend e utiliza **JSON Server** como uma API REST para persistência dos dados durante a execução.

> O backend baseado em JSON Server e o fluxo de autenticação foram desenvolvidos para fins acadêmicos e de demonstração. A aplicação não utiliza mecanismos de autenticação e segurança adequados para um ambiente de produção.

## Estrutura

```text
codigo/
├── db/
│   └── db.json
├── public/
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   ├── modulos/
│   │   ├── diretora/
│   │   ├── login/
│   │   └── merendeira/
│   └── index.html
├── index.js
├── package.json
└── package-lock.json
```

### `db/`

Contém o arquivo `db.json`, utilizado pelo JSON Server para armazenar os dados da aplicação.

Entre os principais recursos utilizados pelo sistema estão:

- usuários;
- estoque;
- cardápios;
- preparos;
- consumos;
- reportes de problemas;
- relatórios;
- refeições previstas;
- histórico de alertas e ocorrências.

### `public/`

Contém o frontend da aplicação.

Os arquivos são organizados em:

- `assets/css/` — estilos das páginas;
- `assets/js/` — lógica e integração com a API;
- `modulos/diretora/` — telas destinadas ao perfil de diretora;
- `modulos/merendeira/` — telas destinadas ao perfil de merendeira;
- `modulos/login/` — autenticação e identificação do perfil do usuário.

## Perfis da aplicação

O Merenda+ possui dois perfis principais.

### Diretora

A diretora possui acesso às funcionalidades administrativas, incluindo:

- acompanhamento do estoque;
- gerenciamento de cardápios;
- visualização de relatórios;
- acompanhamento de reportes;
- alertas de estoque baixo e produtos próximos ao vencimento;
- resolução de ocorrências e consulta ao histórico.

### Merendeira

A merendeira utiliza a aplicação durante a operação da alimentação escolar, podendo:

- consultar o cardápio;
- visualizar o estoque;
- registrar preparos;
- registrar consumo;
- reportar problemas;
- consultar e atualizar informações do perfil.

## API e persistência

O servidor é inicializado pelo arquivo `index.js` utilizando **JSON Server**.

O arquivo `db/db.json` funciona como base de dados da aplicação e é disponibilizado através de endpoints REST.

O servidor também disponibiliza os arquivos estáticos presentes em `public/`.

Por padrão, a aplicação utiliza `http://localhost:3000`.

A porta também pode ser definida através da variável de ambiente `PORT`.

## Como executar

### Pré-requisitos

É necessário possuir:

- Node.js;
- npm.

### Instalação

A partir da raiz do repositório:

```bash
cd codigo
npm install
```

### Execução

```bash
npm start
```

Quando o servidor iniciar, o terminal deverá exibir uma mensagem semelhante a `JSON Server rodando na porta 3000`.

A aplicação poderá então ser acessada em `http://localhost:3000`.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- JSON Server

## Observações técnicas

O Merenda+ foi desenvolvido originalmente durante o primeiro período do curso de Engenharia de Software da PUC Minas.

Por esse motivo, algumas decisões técnicas refletem o objetivo educacional do projeto. O JSON Server simula a camada de persistência e a autenticação é realizada no frontend utilizando os dados disponibilizados pela API.

Essas soluções são adequadas ao contexto acadêmico e à demonstração do projeto, mas não devem ser consideradas uma arquitetura de produção.