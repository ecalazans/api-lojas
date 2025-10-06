const { verify } = require("jsonwebtoken");
const authConfig = require("../config/auth");

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  try {
    if (!authHeader) {
      return response.status(401).json({ message: "JWT Token não informado" })
    }

    const [, token] = authHeader.split(" "); // pegando a segunda posição do array

    // const { sub: user_id } = verify(token, authConfig.jwt.secret);

    // request.user = {
    //   id: Number(user_id)
    // }

    const { sub: user_id, perfil, cliente } = verify(token, authConfig.jwt.secret);

    // agora decoded tem { id, perfil, marca, iat, exp, sub }
    request.user = {
      id: Number(user_id),
      perfil,
      cliente,
    };

    return next();

  } catch (err) {
    return response.status(401).json({ message: "JWT Token inválido" })
  }
}

module.exports = ensureAuthenticated