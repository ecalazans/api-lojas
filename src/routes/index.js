// Reunindo os grupos de rotas
const { Router } = require("express")

//Rotas
const storeRoutes = require("./store.routes")
const usersRoutes = require("./users.routes")
const sessionsRoutes = require("./sessions.routes")


const routes = Router()
routes.use("/sessions", sessionsRoutes)
routes.use("/lojas", storeRoutes)
routes.use("/users", usersRoutes)


module.exports = routes