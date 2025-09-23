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
    chamado_inativo: store[8] || "",
    responsavel_inativo: store[9] || "",
    motivo_inativo: store[10] || "",
    tipo: store[11] || "",
    date_update_inativo: store[12] || "",
    chamado_ativo: store[13] || "",
    responsavel_ativo: store[14] || "",
    motivo_ativo: store[15] || "",
    date_update_ativo: store[16] || "",
  }
}

module.exports = formatStore