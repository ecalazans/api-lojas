const { Router } = require("express")

// Controller
const StoreController = require("../controllers/StoresController")
const storeController = new StoreController()

// Rotas
const storeRoutes = Router()
storeRoutes.get("/", storeController.index)
storeRoutes.get("/:cnpj", storeController.show)
storeRoutes.post("/", storeController.create)
storeRoutes.put("/", storeController.update)


module.exports = storeRoutes