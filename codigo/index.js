// Merenda+ - Trabalho Interdisciplinar 1
// Engenharia de Software - PUC Minas
//
// Servidor da aplicação baseado em JSON Server.
// Estrutura inicial adaptada do material acadêmico fornecido por
// Rommel Vieira Carneiro (2023).

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./db/db.json')

const middlewares = jsonServer.defaults({
  static: "./public",
  noCors: true });
server.use(middlewares)
server.use(router)

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`JSON Server rodando na porta ${PORT}`);
});