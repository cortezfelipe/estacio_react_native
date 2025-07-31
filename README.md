
# 🚗 Parking App – Gerenciamento de Vagas

Aplicativo mobile e API backend para controle de vagas de estacionamento.  
Usuários podem reservar vagas para dias específicos e gestores administram vagas e reservas.

---

## 📦 Estrutura do projeto

```
estacio_react_native/
├── parking-app-backend/   # API REST em Node.js/Express + Sequelize (SQLite)
└── parking-app-frontend/  # Aplicativo mobile em React Native (Expo)
```

---

## ✨ Funcionalidades

### Frontend (React Native + Expo)

- Cadastro e login de usuários (token JWT)
- Listagem de vagas disponíveis
- Reserva de vagas para uma data específica
- Visualização e cancelamento/edição de reservas
- Área administrativa (somente gestores): criar, editar e excluir vagas

### Backend (Node.js + Express + Sequelize)

- Autenticação com JWT
- Controle de acesso por papéis: `user` e `manager`
- Endpoints para CRUD de vagas
- Endpoints para CRUD de reservas
- Banco de dados SQLite (pronto para adaptação a outros via Sequelize)

---

## 🛠 Tecnologias

- **Frontend**: React Native, Expo, React Navigation, AsyncStorage
- **Backend**: Node.js, Express, Sequelize, SQLite, JSON Web Token, bcryptjs
- **Ferramentas auxiliares**: [ngrok](https://ngrok.com/) (exposição da API local para celular)

---

## 🚀 Como executar

### Pré‑requisitos

- Node.js ≥ 16
- npm ou yarn
- Conta no ngrok (opcional, para testes no celular)

---

### 1. Backend

```bash
cd parking-app-backend
npm install
npm run dev  # inicia em modo desenvolvimento (porta 3000)
```

> Em outro terminal, para expor a API:
```bash
ngrok http 3000
```

Usuário gestor criado automaticamente:
- **Login:** `admin@example.com`
- **Senha:** `admin123`

Três vagas iniciais: `A1`, `A2`, `B1`

---

### 2. Configurar o endereço da API

Edite o arquivo:

```js
# parking-app-frontend/src/api/api.js
export const API_URL = "https://SEU-ENDERECO-NGROK/api";
```

---

### 3. Frontend

```bash
cd parking-app-frontend
npm install
npx expo start  # escolha rodar no emulador ou dispositivo físico
```

---

## 📚 Principais Endpoints

| Método | Caminho                        | Descrição                                 |
|--------|--------------------------------|-------------------------------------------|
| POST   | `/api/auth/signup`            | Registro de usuário                        |
| POST   | `/api/auth/signin`            | Login e obtenção de token                  |
| GET    | `/api/slots`                  | Lista de vagas                             |
| POST   | `/api/slots`                  | Criação de vaga (somente gestor)          |
| POST   | `/api/reservations`          | Criação de reserva                         |
| GET    | `/api/reservations`          | Lista reservas do usuário ou todas (gestor) |
| PUT    | `/api/reservations/:id`      | Atualização de reserva (somente gestor)   |
| DELETE | `/api/reservations/:id`      | Remoção de reserva (somente gestor)       |

---

## 🗂 Estrutura de pastas (resumo)

### `parking-app-backend/`

```
├── config/           # Configuração do Sequelize
├── controllers/      # Lógica dos endpoints
├── middleware/       # Autenticação e autorização
├── models/           # Definições: User, ParkingSlot, Reservation
└── routes/           # Arquivos de rotas
```

### `parking-app-frontend/`

```
├── src/
│   ├── api/          # Configuração do axios
│   ├── context/      # Contexto de autenticação
│   ├── screens/      # Telas (Login, Home, Reservas, etc.)
│   └── styles/       # Estilos compartilhados
└── assets/           # Imagens e recursos visuais
```

---

## 🤝 Contribuindo

1. Faça um fork do projeto.
2. Crie uma branch para sua `feature` ou `bugfix`.
3. Envie um Pull Request explicando a alteração.

---

## 📄 Licença

Este projeto está licenciado sob a **licença MIT**.  
Sinta‑se livre para usar, estudar e adaptar.
