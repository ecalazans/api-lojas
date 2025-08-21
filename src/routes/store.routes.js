const { Router } = require("express")

// Controller
const StoreController = require("../controllers/StoresController")
const storeController = new StoreController()

// Rotas
const storeRoutes = Router()
storeRoutes.get("/all", storeController.index)
storeRoutes.get("/", storeController.show)
storeRoutes.post("/", storeController.create)
storeRoutes.put("/", storeController.update)
storeRoutes.delete("/", storeController.delete)


module.exports = storeRoutes