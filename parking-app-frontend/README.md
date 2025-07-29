# Parking App Frontend

Esta pasta contém o aplicativo móvel construído em React Native utilizando o [Expo](https://expo.dev/). O aplicativo consome a API do diretório `parking-app-backend` para permitir que usuários reservem vagas de estacionamento e que gestores gerenciem essas vagas.

## Funcionalidades

- **Autenticação**: tela de login e cadastro que consome os endpoints `/api/auth/signup` e `/api/auth/signin`. O token JWT fica armazenado em `AsyncStorage` e é enviado automaticamente nas requisições subsequentes.
- **Listagem de vagas**: usuários visualizam todas as vagas cadastradas e podem selecionar uma para reservar em uma data específica.
- **Reservas**: criação de reservas e listagem de reservas existentes. Usuários comuns veem somente as suas reservas; gestores veem todas.
- **Gestão de vagas**: gestores podem cadastrar novas vagas (nome e descrição) e ver a lista de vagas existentes.
- **Logout**: permite sair da sessão, removendo o token do armazenamento e retornando às telas de login.

## Instalação e execução

1. Certifique‑se de ter o **Expo CLI** instalado globalmente. Se não tiver, instale com:

   ```bash
   npm install -g expo-cli
   ```

2. Instale as dependências do projeto:

   ```bash
   cd parking-app-frontend
   npm install
   ```

3. Ajuste a constante `API_URL` no arquivo `src/api/api.js` para apontar para o endereço onde o backend está rodando. Por exemplo, se estiver testando no emulador Android e o backend rodar na máquina local em `localhost:3000`, substitua por `http://<seu-ip-local>:3000/api`.

4. Inicie o Expo:

   ```bash
   npm start
   ```

   Abra o aplicativo **Expo Go** em um emulador Android/iOS ou em um dispositivo físico para executar o app.

## Navegação

O aplicativo utiliza a **React Navigation** para gerenciar as telas. Dependendo do estado de autenticação:

* Se o usuário não estiver autenticado, serão exibidas as telas de **Login** e **Cadastro**.
* Se estiver autenticado como **usuário**, terá acesso às telas de **Vagas**, **Minhas Reservas** e **Nova Reserva**.
* Se estiver autenticado como **gestor**, verá as mesmas telas, além de **Gerenciar Vagas** e uma listagem de **Todas as Reservas**. Esse controle é feito a partir do campo `role` recebido no payload do token.

O uso de JWT no lado cliente segue a mesma premissa discutida no artigo que demonstra que, por ser armazenado no cliente, não há necessidade de sessões no servidor e o token pode ser enviado em requisições subsequentes【637800531540319†L65-L72】.