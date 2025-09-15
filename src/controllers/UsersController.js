const { hash } = require("bcryptjs")
const { google } = require("googleapis")
const auth = require("../config/googleAuth")
const formatUser = require("../utils/formatUser");


class UsersController {
  async create(request, response) {
    const { nome, email, password, perfil, ativo = true, marca } = request.body

    const spreadsheetId = process.env.SPREADSHEET_ID;

    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      // ler todos os usuários
      const responseApi = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "USERS!A2:H",
      });

      const users = (responseApi.data.values || []).map(formatUser)

      const validateUser = users.find(
        user => user.email === email
      )

      if (validateUser) {
        return response.status(404).json({ message: "Este e-mail já está em uso!" })
      }

      if (!nome, !email, !password, !perfil, ativo, !marca) {
        return response.status(404).json({ message: "É preciso preencher todos os campos!" })
      }

      const hashedPassword = await hash(password, 8);
      // console.log(hashedPassword)

      // Pega o último id (linha depois do cabeçalho)
      let newId = 1;
      if (users.length >= 1) {
        const lastRow = users[users.length - 1];
        const lastId = parseInt(lastRow.id); // coluna A = id
        // console.log(lastId)
        newId = lastId + 1;
      }
      // console.log(newId)

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "USERS!A2:H",
        valueInputOption: "RAW",
        requestBody: {
          values: [[newId, nome, email, hashedPassword, perfil, ativo, "", marca]],
        },
      });

      return response.json({ message: "Usuário cadastrado com sucesso!" })

    } catch (err) {
      return response.status(500).json({ error: err.message })
    }
  }

  async show(request, response) {
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // ler todos os usuários
    try {
      const client = await auth.getClient()
      const sheets = google.sheets({ version: "v4", auth: client })

      const responseApi = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "USERS!A2:H",
      });

      const users = (responseApi.data.values || []).map(formatUser)

      response.json(users)
    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  }
}


module.exports = UsersController