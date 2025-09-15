const { Router } = require("express")

// Controller
const StoreController = require("../controllers/StoresController")
const storeController = new StoreController()

// Middleware de autenticação
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

// Rotas
const storeRoutes = Router()

storeRoutes.use(ensureAuthenticated)

storeRoutes.get("/all", storeController.index)
storeRoutes.get("/", storeController.show)
storeRoutes.post("/", storeController.create)
storeRoutes.put("/", storeController.update)
storeRoutes.delete("/", storeController.delete)


module.exports = storeRoutes