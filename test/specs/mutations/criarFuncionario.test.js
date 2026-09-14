const request = require("supertest");
const { expect } = require("chai");

describe("Mutation - Criar Funcionario", () => {
  let token;
  before(async () => {
    const resposta = await request("http://localhost:4000")
      .post("/graphql")
      .send({
        query: `mutation Mutation($email: String!, $senha: String!) {
        login(email: $email, senha: $senha) {
              token 
        }
      }`,
        variables: {
          email: "admin@admin.com",
          senha: "123456",
        },
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.login).to.have.property("token");
    token = resposta.body.data.login.token;
  });
  it.only("deve criar um funcionario quando preencho os campos obrigatorios de forma valida", async () => {
    let cpf = Date.now();
    console.log(cpf);

    const resposta = await request("http://localhost:4000")
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send({
        query: `mutation Mutation($input: CriarFuncionarioInput!) {
              criarFuncionario(input: $input) {
                id
                cpf
                nome
                salario_base
                admissao
                desligamento
          }
        }`,
        variables: {
          input: {
            admissao: "2026-01-05",
            cpf: `${cpf}`,
            desligamento: "",
            nome: "paulo carvalho",
            salario_base: 8500,
          },
        },
      });
    expect(resposta.status).to.equal(200);
    expect(resposta.body.data.criarFuncionario).to.have.property("id");
  });
});
