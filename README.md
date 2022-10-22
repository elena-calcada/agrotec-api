<h1 align="center">Agro Tec - API</h1>


<p align="center">
  <a href="#dart-sobre">Sobre</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Funcionalidades</a> &#xa0; | &#xa0;
  <a href="#rocket-tecnologias">Tecnologias</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requisitos">Requisitos</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Iniciando</a> &#xa0; | &#xa0;
  <a href="#memo-license">Licença</a> &#xa0; | &#xa0;
  <a href="https://github.com/elena-calcada" target="_blank">Autor</a>
</p>

<br>

## :dart: Sobre

Este projeto disponibiliza o backend para o sistema web da Agrotec (em desenvolvimento) e para o site da Agrotec (em desenvolvimento) por meio de um REST API.

Para um melhor entendimento do objetivo desta API, vale destacar que:

- O objetivo do site da Agrotec é servir como catálogo organizado, prático e simples de produtos para melhor auxiliar os clientes da loja.

- O objetivo do sistema Agrotec é fazer com que o cliente consiga manter seu site de maneira autônoma.

## :sparkles: Features

### 1. Cadastro de usuário
#### RF
- Deve ser possível cadastrar um novo usuário.
#### RN
- Não é preciso estar logado no sistema para cadastrar um novo usuário.
- Por padrão, o usuário cadastrado não terá acesso ao sistema, ele não será executor nem administrador, terá somente o cadastro.
- Não deverá ser possível cadastrar um usuário já existente.

### 2. Permitir que o usuário acesse o sistema como executor
#### RF
- Deve ser possível permitir que o usuário cadastrado acesse o sistema como executor.
#### RN
- O responsável por dar acesso de executor a um usuário cadastrado, deve ser um usuário administrador.
- O usuário administrador precisa estar logado ao sistema para transformar o usuário cadastrado em um usuário executor.

### 3. Permitir que o usuário acesse o sistema como administrador
#### RF
- Deve ser possível permitir que o usuário cadastrado acesse o sistema como administrador.
#### RN
- O responsável por dar acesso de administrador a um usuário cadastrado, deve ser um usuário administrador.
- O usuário administrador precisa estar logado ao sistema para transformar o usuário cadastrado em um usuário administrador.

### 4. Listagem de usuários
#### RF
- Deve ser possível listar todos os usuários cadastrados.
#### RN
- Somente um usuário administrador poderá listar usuários.
- O usuário administrador precisa estar logado no sistema para listar usuários.

### 5. Deletar usuário
#### RF
- Deve ser possível deletar um usuário cadastrado.
#### RN
- Somente um usuário administrador poderá deletar um usuário.
- O usuário administrador precisa estar logado no sistema para deletar usuários.

### 6. Editar dados do usuário
#### RF
- Deve ser possível cada usuário alterar seus próprios dados de cadastro.
#### RN
- Todos os usuários, independente do tipo de permissão, podem editar suas próprias informações de cadastro.
- O usuário precisa estar logado no sistema para editar suas informações.
- Não será possível editar o e-mail.

### 7. Cadastrar grupos de categorias
#### RF
- Deve ser possível cadastrar um novo tipo de grupo
#### RN
- Somente usuários administradores ou executores podem cadastrar um novo grupo.
- O usuário precisa estar logado no sistema para cadastrar um novo grupo.
- Não deve ser possível cadastrar um grupo que já exista.

### 8. Listar grupos de categorias
#### RF
- Deve ser possível listar todos os grupos.
#### RN
- Somente usuários administradores ou executores podem listar os grupos.
- O usuário precisa estar logado no sistema para listar os grupos.

### 9. Deletar grupo
#### RF
- Deve ser possível deletar um grupo.
#### RN
- Somente usuários administradores ou executores podem deletar um grupo.
- O usuário precisa estar logado no sistema para deletar um grupo.
- Não será possível deletar um grupo que tenha categoria(s) vinculada(s) a ele.

### 10. Editar grupo
#### RF
- Deve ser possível editar informações do grupo cadastrado.
#### RN
- Somente usuários administradores ou executores podem editar as informações.
- O usuário precisa estar logado no sistema para editar suas informações.
- Não será possível editar o nome do grupo.

### 11. Cadastrar categorias
#### RF
- Deve ser possível cadastrar uma nova categoria.
#### RN
- Somente usuários administradores ou executores podem cadastrar uma nova categoria.
- O usuário precisa estar logado no sistema para cadastrar uma nova categoria.
- Não deve ser possível cadastrar uma categoria que já existe.

### 12. Listar categorias
#### RF
- Deve ser possível listar todos as categorias de modo que essa listagem contenha detalhes do grupo que cada uma está vinculada.
- Deve ser possível lista categorias por grupo.
#### RN
- Somente usuários administradores ou executores podem listar as categorias.
- O usuário precisa estar logado no sistema para listar as categorias.

### 13. Deletar categoria
#### RF
- Deve ser possível deletar uma categoria.
#### RN
- Somente usuários administradores ou executores podem deletar uma categoria.
- O usuário precisa estar logado no sistema para deletar uma categoria.
- Não será possível deletar uma categoria que tenha produto(s) vinculado(s) a ela.

### 14. Editar categoria
#### RF
- Deve ser possível editar informações da categoria.
#### RN
- Somente usuários administradores ou executores podem editar as informações.
- O usuário precisa estar logado no sistema para editar.
- Não será possível editar o nome da categoria.

### 15. Cadastrar fornecedores
#### RF
- Deve ser possível cadastrar um novo fornecedor.
#### RN
- Somente usuários administradores ou executores podem cadastrar um novo fornecedor.
- O usuário precisa estar logado no sistema para cadastrar um novo fornecedor.
- Não deve ser possível cadastrar um fornecedor que já existe.

### 16. Listar fornecedores
#### RF
- Deve ser possível listar todos os fornecedores.
#### RN
- Somente usuários administradores ou executores podem listar os fornecedores.
- O usuário precisa estar logado no sistema para listar os fornecedores.

### 17. Deletar fornecedor
#### RF
- Deve ser possível deletar um fornecedor.
#### RN
- Somente usuários administradores ou executores podem deletar um fornecedor.
- O usuário precisa estar logado no sistema para deletar um fornecedor.
- Nao deve ser possível deletar um fornecedor que esteja vinculado a um ou mais produtos.

### 18. Editar fornecedor
#### RF
- Deve ser possível editar informações do fornecedor.
#### RN
- Somente usuários administradores ou executores podem editar as informações.
- O usuário precisa estar logado no sistema para editar.
- Não será possível editar o nome do fornecedor.

### 19. Cadastrar produto
#### RF
- Deve ser possível cadastrar um novo produto.
#### RN
- Somente usuários administradores ou executores podem cadastrar um novo produto.
- O usuário precisa estar logado no sistema para cadastrar um novo produto.

### 20. Cadastrar imagem do produto
#### RF
- Deve ser possível cadastrar a imagem do produto.
#### RNF
- Utilizar o multer para fazer o upload dos arquivos.
#### RN

- Somente usuários administradores ou executores podem cadastrar uma imagem para o produto.
- O usuário precisa estar logado no sistema para cadastrar imagem para o produto.

### 21. Listar produtos
#### RF
- Deve ser possível listar todos os produtos.
- Deve ser possível listar os produtos por grupo de categorias.
- Deve ser possível listar os produtos por categoria.
- Deve ser possível listar os produtos por fornecedor.
#### RN
- Somente usuários administradores ou executores podem listar os produtos.
- O usuário precisa estar logado no sistema para cadastrar imagem para o produto.

### 22. Deletar produto
#### RF
- Deve ser possível deletar um produto.
#### RN
- Somente usuários administradores ou executores podem deletar um produto.
- O usuário precisa estar logado no sistema para deletar um produto.

### 23. Editar produto
#### RF
- Deve ser possível editar informações de um produto.
#### RN
- Somente usuários administradores ou executores podem editar informações de um produto.
- O usuário precisa estar logado no sistema para atualizar um produto.

## :rocket: Tecnologias

Neste projeto foram utilizadas as seguintes ferramentas:

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io)
- [Docker](https://docs.docker.com/)
- [PostgreSQL como uma imagem Docker](https://hub.docker.com/_/postgres)
- Autenticação com [jsonwebtoken](https://jwt.io/introduction)
- Injeção de dependências com [tsyringe](https://www.npmjs.com/package/tsyringe)
- Criptografia com o [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- Tratamento de erros com o [express-async-errors](https://www.npmjs.com/package/express-async-errors)
- Upload de arquivos com [multer](https://www.npmjs.com/package/multer)
- Padronização de código com [eslint](https://eslint.org/docs/latest/) e [prettier](https://prettier.io/docs/en/options.html)



## :white_check_mark: Requisitos

Antes de começar, é preciso ter o [Git](https://git-scm.com), o [Node](https://nodejs.org/en/) e o [Docker](https://docs.docker.com/) instalados.

## :checkered_flag: Iniciando

```bash
# Clone this project
$ git clone git@github.com:elena-calcada/agrotec-api.git

# Install dependencies
$ npm install
or
$ yarn

# Criar container PostgreSQL
$ docker run --name name_container -e POSTGRES_USER=user_container -e POSTGRES_PASSWORD=password_container -p 5432:5432 -d postgres

# Logar no PostgreSQL
$ psql -U name_user

# Logado no PostgreSQL, criar o database
$ CREATE DATABASE agrotec;

# Run migrate
$ npx prisma migrate dev
or
$ yarn prisma migrate dev

# Run the project
$ npm run dev
or
$ yarn dev

# The server will initialize in the <http://localhost:3333>
```

Made by <a href="https://github.com/elena-calcada" target="_blank">Elena Calçada</a>

&#xa0;

<a href="#top">Back to top</a>