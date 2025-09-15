const { compare } = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const { google } = require("googleapis")

const auth = require("../config/googleAuth")
const authConfig = require("../config/auth")
const formatUser = require("../utils/formatUser")


class SessionsController {
  async create(request, response) {
    const { email, password } = request.body

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

      const user = users.find(
        user => user.email === email
      )

      if (!user) {
        return response.status(401).json({ message: "E-mail e/ou senha incorreta" })
      }

      const passwordMatched = await compare(password, user.password)

      if (!passwordMatched) {
        return response.status(401).json({ message: "E-mail e/ou senha incorreta" })
      }

      const { secret, expiresIn } = authConfig.jwt
      const token = sign({
        perfil: user.perfil,
        marca: user.marca,
      }, secret, {
        subject: String(user.id),
        expiresIn
      })

      return response.json({ user, token })

    } catch (err) {
      return response.status(500).json({ error: err.message })
    }
  }
}

module.exports = SessionsController