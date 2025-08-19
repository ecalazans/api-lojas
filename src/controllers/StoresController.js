const { google } = require("googleapis")
const auth = require("../config/googleAuth")
const formatStore = require("../utils/formatStore")

class StoreController {
  // mostrar todas as lojas
  async index(request, response) {
    const spreadsheetId = process.env.SPREADSHEET_ID;

    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      const responseApi = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "CONSOLIDADO LOJAS!A3:H", // Nome da aba + intervalo
      });

      const allStores = (responseApi.data.values || []).map(formatStore)

      response.json(allStores);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  };

  // mostrar uma loja
  async show(request, response) {
    const { cnpj } = request.params

    const spreadsheetId = process.env.SPREADSHEET_ID;

    try {
      const client = await auth.getClient()
      const sheets = google.sheets({ version: "v4", auth: client })

      const responseApi = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "CONSOLIDADO LOJAS!A3:H",
      });

      const stores = (responseApi.data.values || []).map(formatStore)

      const store = stores.find(store => store.cnpj === cnpj)
      // const storeFormated = formatStore(store)

      if (!store) {
        return response.status(404).json({ message: "Loja não encontrada com esse CNPJ" })
      }

      response.json(store)

    } catch (error) {
      response.status(500).json({ error: error.message })
    }
  };

  // cadastrar loja
  async create(request, response) {
    const { cliente, marca, filial, cnpj, inauguracao, encerramento, status, observacoes } = request.body;

    const spreadsheetId = process.env.SPREADSHEET_ID;

    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "CONSOLIDADO LOJAS!A:H",
        valueInputOption: "RAW",
        requestBody: {
          values: [[cliente, marca, filial, cnpj, inauguracao, encerramento, status, observacoes]],
        },
      });

      response.json({ message: "Loja adicionada com sucesso!" });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }

  // atualizar STATUS loja
  async update(request, response) {
    // id pode ser CNPJ ou FILIAL
    const { id, novoStatus } = request.body;

    const spreadsheetId = process.env.SPREADSHEET_ID;

    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      // ler todas as lojas
      const responseApi = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "CONSOLIDADO LOJAS!A3:H",
      });

      const store = (responseApi.data.values || []).map(formatStore)

      // procurar linha que bate com CNPJ ou FILIAL
      const linhaIndex = store.findIndex(
        store => store.cnpj === id || store.filial === id
      );
      // console.log(linhaIndex)

      if (linhaIndex === -1) {
        return response.status(404).json({ message: "Loja não encontrada" });
      }

      const linhaReal = linhaIndex + 3; // +3 porque começamos em A3
      // console.log(linhaReal)

      // atualizar status (coluna G)
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `CONSOLIDADO LOJAS!G${linhaReal}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[novoStatus]],
        },
      });

      response.json({ message: "Status atualizado com sucesso!" });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }

  // Deletar loja (limpar linha)
  async delete(request, response) {
    const { id } = request.params;

    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `CONSOLIDADO LOJAS!A${linha}:H${linha}`,
      });

      res.json({ message: "Loja removida com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

}

module.exports = StoreController