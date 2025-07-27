# Parking App Backend

Este diretório contém a API REST construída em Node.js e Express que alimenta o aplicativo de gerenciamento de vagas. O banco de dados utilizado é o PostgreSQL, acessado via [Sequelize](https://sequelize.org/).

## Visão geral

O backend fornece autenticação baseada em tokens JWT, controle de acesso por papéis (usuário ou gestor) e endpoints para manipular usuários, vagas e reservas. A estrutura segue boas práticas descritas em tutoriais recentes que demonstram como **o JWT é um método de autenticação leve e compatível com aplicações web e mobile**【88422205807684†L163-L183】. O PostgreSQL é utilizado por ser robusto, seguro e oferecer suporte a relacionamento entre dados, o que facilita a modelagem de usuários, papéis e reservas【88422205807684†L125-L139】.

### Principais endpoints

| Método | Caminho | Ação |
|---|---|---|
| `POST` | `/api/auth/signup` | Cria um novo usuário (padrão: `user`) |
| `POST` | `/api/auth/signin` | Autentica um usuário e retorna um token JWT |
| `GET` | `/api/slots` | Lista todas as vagas disponíveis |
| `POST` | `/api/slots` | Cria uma nova vaga (restrito a gestores) |
| `POST` | `/api/reservations` | Cria uma reserva para uma vaga em determinada data |
| `GET` | `/api/reservations` | Lista reservas (usuário vê apenas as suas; gestor vê todas) |

## Configuração

1. Renomeie o arquivo `.env.example` para `.env` e ajuste as variáveis de ambiente de acordo com seu ambiente local:

   ```ini
   DATABASE_URL=postgres://usuario:senha@localhost:5432/parking_db
   JWT_SECRET=uma-chave-secreta
   PORT=3000
   ```

2. Instale as dependências (é necessário acesso à internet para baixar os pacotes NPM):

   ```bash
   cd parking-app-backend
   npm install
   ```

3. Inicie a API:

   ```bash
   npm start
   ```

Na primeira execução, o servidor criará automaticamente:

* Um usuário gestor com as credenciais `admin@example.com` / `admin123` (definido em `server.js` para testes);
* Três vagas (`A1`, `A2`, `B1`) para facilitar o uso inicial.

## Estrutura do código

* **`server.js`** – Ponto de entrada da aplicação. Configura o Express, aplica middlewares de CORS e JSON, registra as rotas e sincroniza o banco de dados. Também faz a semeadura inicial (gestor e vagas).
* **`config/db.js`** – Inicializa o Sequelize com as variáveis de ambiente.
* **`models/`** – Contém os modelos `User`, `ParkingSlot` e `Reservation` com seus relacionamentos.
* **`controllers/`** – Lógica de cada rota (cadastro, login, criação/listagem de vagas, criação/listagem de reservas).
* **`middleware/auth.js`** – Middleware para verificação do token JWT e restrição por papel.
* **`routes/`** – Agrupamento das rotas de autenticação, vagas e reservas.

## Teste com cURL

Após iniciar a API, você pode testar rapidamente os endpoints usando cURL:

**Cadastro de usuário:**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"João","email":"joao@example.com","password":"senha123"}'
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/signin \
     -H "Content-Type: application/json" \
     -d '{"email":"joao@example.com","password":"senha123"}'
```

O retorno incluirá `accessToken`; use-o no cabeçalho `Authorization` para acessar rotas protegidas:

```bash
curl -H "Authorization: Bearer SEU_TOKEN" http://localhost:3000/api/slots
```