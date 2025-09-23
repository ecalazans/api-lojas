const { google } = require("googleapis")
const auth = require("../config/googleAuth")
const formatStore = require("../utils/formatStore")

class StoreController {
  // mostrar todas as lojas
  async index(request, response) {
    const { perfil, marca } = request.user

    const spreadsheetId = process.env.SPREADSHEET_ID;

    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      const responseApi = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "CONSOLIDADO LOJAS!A3:Q", // Nome da aba + intervalo
      });

      let allStores = (responseApi.data.values || []).map(formatStore)

      if (perfil !== "admin") {
        allStores = allStores.filter(store => store.marca === marca)
      }

      // console.log(allStores.length)

      response.json(allStores);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  };

  // mostrar uma loja
  async show(request, response) {
    const { cnpj, filial } = request.query

    const spreadsheetId = process.env.SPREADSHEET_ID;

    try {
      const client = await auth.getClient()
      const sheets = google.sheets({ version: "v4", auth: client })

      const responseApi = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "CONSOLIDADO LOJAS!A3:Q",
      });

      if (!cnpj && !filial) {
        return response.status(404).json({ message: "Precisa informar um CNPJ ou FILIAL" });
      }

      const stores = (responseApi.data.values || []).map(formatStore)

      const store = stores.find(
        store => store.cnpj === cnpj || store.filial === filial
      )
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

      // ler todas as lojas
      const responseApi = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "CONSOLIDADO LOJAS!A3:M",
      });

      const stores = (responseApi.data.values || []).map(formatStore)

      const validadeCnpj = stores.find(
        store => store.cnpj === cnpj
      )

      if (validadeCnpj) {
        return response.status(404).json({ message: "O CNPJ informado já está cadastrado" })
      }

      if (!cnpj || cnpj === "") {
        return response.status(404).json({ message: "O CNPJ precisa ser informado" })
      }

      // Cadastrar loja
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
    const { id, novoStatus, chamado, responsavel, motivo } = request.body;

    const spreadsheetId = process.env.SPREADSHEET_ID;

    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      // ler todas as lojas
      const responseApi = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "CONSOLIDADO LOJAS!A3:M",
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

      // Pegando a data em que foi feita a alteração
      const dataUpdate = new Date().toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo"
      });

      const linhaReal = linhaIndex + 3; // +3 porque começamos em A3
      // console.log(linhaReal)

      if (novoStatus === "Inativo") {
        // atualizar status (coluna G)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `CONSOLIDADO LOJAS!G${linhaReal}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[novoStatus]],
          },
        });

        // Atualizar Chamado (coluna I)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `CONSOLIDADO LOJAS!I${linhaReal}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[chamado]],
          },
        });

        // Atualizar Responsável (coluna J)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `CONSOLIDADO LOJAS!J${linhaReal}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[responsavel]],
          },
        });

        // Atualizar Motivo (coluna K)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `CONSOLIDADO LOJAS!K${linhaReal}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[motivo]],
          },
        });

        // Atualizar Data Alteração (coluna M)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `CONSOLIDADO LOJAS!M${linhaReal}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[dataUpdate]],
          },
        });

        response.json({ message: "Status atualizado com sucesso!" });
      }

      if (novoStatus === "Ativo") {
        // atualizar status (coluna G)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `CONSOLIDADO LOJAS!G${linhaReal}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[novoStatus]],
          },
        });

        // Atualizar Chamado (coluna N)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `CONSOLIDADO LOJAS!N${linhaReal}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[chamado]],
          },
        });

        // Atualizar Responsável (coluna O)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `CONSOLIDADO LOJAS!O${linhaReal}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[responsavel]],
          },
        });

        // Atualizar Motivo (coluna P)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `CONSOLIDADO LOJAS!P${linhaReal}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[motivo]],
          },
        });

        // Atualizar Data Alteração (coluna Q)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `CONSOLIDADO LOJAS!Q${linhaReal}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[dataUpdate]],
          },
        });

        response.json({ message: "Status atualizado com sucesso!" });
      }

    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }

  // Deletar loja (limpar linha)
  async delete(request, response) {
    const { cnpj } = request.body;

    const spreadsheetId = process.env.SPREADSHEET_ID;

    try {
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });

      // ler todas as lojas
      const responseApi = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "CONSOLIDADO LOJAS!A3:M",
      });

      const sheet = await sheets.spreadsheets.get({ spreadsheetId });
      const aba = sheet.data.sheets.find(s => s.properties.title === "CONSOLIDADO LOJAS");
      const sheetId = aba.properties.sheetId;

      const stores = (responseApi.data.values || []).map(formatStore)

      const rowIndex = stores.findIndex(
        store => store.cnpj === cnpj
      )

      // Identificando a linha
      if (rowIndex == -1) {
        return response.status(404).json({ message: "Loja não encontrada" })
      }

      // Linha que será deletada
      const rowToDelete = rowIndex + 2

      // Deletar limpando os valores da linha
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheetId, // ID da aba; normalmente 0 se for a primeira
                  dimension: "ROWS",
                  startIndex: rowToDelete,
                  endIndex: rowToDelete + 1
                }
              }
            }
          ]
        }
      });

      response.json({ message: "Loja removida com sucesso!" });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  };

}

module.exports = StoreController