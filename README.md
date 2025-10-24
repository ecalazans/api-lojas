# 🧾 API – Controle de Lojas

API desenvolvida para centralizar e gerenciar os dados do sistema **Controle de Lojas**, utilizando o **Google Sheets API** como fonte de dados.  
O objetivo é disponibilizar endpoints REST para consulta, criação e atualização das informações de lojas e usuários.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **Google Sheets API**
- **dotenv** (para variáveis de ambiente)
- **CORS**
- **Axios / Fetch** (para comunicação HTTP)
- **Vercel** (hospedagem da API)

---

## ⚙️ Estrutura do Projeto

  📂 src
  ┣ 📂 config        # Configurações (auth e GoogleAuth)
  ┣ 📂 controllers   # Regras de negócio e integração com o Google Sheets
  ┣ 📂 middlewares   # Interceptador de autenticação
  ┣ 📂 routes        # Definições das rotas (lojas, usuários, autenticação)
  ┣ 📂 utils         # Funções auxiliares (tratamento de dados, formatação, logs, etc)
  ┣ 📄 server.js     # Ponto de entrada da aplicação
  ┗ 📄 .env          # Variáveis de ambiente (não versionadas)

---
## 🧩 Integração com o Google Sheets

  A API utiliza o Google Sheets API para leitura e escrita de dados.
  Cada aba da planilha representa uma entidade do sistema (ex: Lojas, Usuários).
  As operações CRUD são traduzidas em leituras e escritas nas células correspondentes.
  
---

## 🧪 Executando o Projeto Localmente
---

  # Clonar o repositório
  git clone https://github.com/seu-usuario/controle-lojas-api.git

  # Entrar na pasta
  cd controle-lojas-api

  # Instalar dependências
  npm install

  # Rodar o servidor
  npm run dev

---

---

## 👤 Autor

  **Erick Domingos Calazans**
  Desenvolvedor Web | Node.js | Google API

---