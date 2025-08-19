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
  }
}

module.exports = formatStore