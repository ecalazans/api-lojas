function formatUser(user) {
  return {
    id: user[0] || "",
    nome: user[1] || "",
    email: user[2] || "",
    password: user[3] || "",
    perfil: user[4] || "",
    ativo: user[5] || false,
    last_update_password: user[6] || "",
    marca: user[7] || ""
  }
}

module.exports = formatUser