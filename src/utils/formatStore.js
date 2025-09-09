function formatStore(store) {
  return {
    cliente: store[0] || "",
    marca: store[1] || "",
    filial: store[2] || "",
    cnpj: store[3] || "",
    data_inauguracao: store[4] || "",
    data_encerramento: store[5] || "",
    status: store[6] || "",
    observacoes: store[7] || "",
    chamado: store[8] || "",
    responsavel: store[9] || "",
    motivo: store[10] || "",
    tipo: store[11] || "",
    date_update: store[12] || "",
  }
}

module.exports = formatStore