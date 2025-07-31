🚗 Parking App – Gerenciamento de Vagas
Aplicativo mobile e API backend para controle de vagas de estacionamento. Usuários podem reservar vagas para dias específicos e gestores administram vagas e reservas.

📦 Estrutura do projeto
estacio_react_native/
 parking-app-backend/   # API REST em Node.js/Express + Sequelize (SQLite)
 parking-app-frontend/  # Aplicativo mobile em React Native (Expo)
✨ Funcionalidades
Frontend (React Native + Expo)
Cadastro e login de usuários (token JWT).

Listagem de vagas disponíveis.

Reserva de vagas para uma data específica.

Visualização e cancelamento/edição de reservas.

Área administrativa (apenas para gestores) para criar, editar e excluir vagas.

Backend (Node.js + Express + Sequelize)
Autenticação com JWT.

Controle de acesso por papéis: user e manager.

Endpoints para criar/listar/editar/excluir vagas.

Endpoints para criar/listar/editar/excluir reservas.

Banco de dados SQLite pronto para ser adaptado a outros bancos via Sequelize.

🛠 Tecnologias
Frontend: React Native, Expo, React Navigation, AsyncStorage.

Backend: Node.js, Express, Sequelize, SQLite (dialeto padrão), JSON Web Token, bcryptjs.

Ferramentas auxiliares: ngrok (expor a API para o dispositivo móvel).

🚀 Como executar
Pré‑requisitos
Node.js ≥ 16

npm ou yarn

Conta no ngrok (opcional, para testes no celular).

1. Backend
cd parking-app-backend
npm install
npm run dev      # inicia em modo desenvolvimento (porta 3000)

Faça um fork do projeto.

Crie uma branch para sua feature/bugfix.

Envie um PR explicando a alteração.

📄 Licença
Este projeto está licenciado sob a licença MIT. Sinta‑se livre para usar, estudar e adaptar.
