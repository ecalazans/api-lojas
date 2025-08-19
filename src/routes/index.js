// Reunindo os grupos de rotas
const { Router } = require("express")

//Rotas
const storeRoutes = require("./store.routes")

const routes = Router()
routes.use("/lojas", storeRoutes)


module.exports = routes