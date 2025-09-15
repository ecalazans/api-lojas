const { Router } = require("express")

// Controller
const SessionsController = require("../controllers/SessionsController")
const sessionsController = new SessionsController()

// Rotas
const sessionsRoutes = Router()
sessionsRoutes.post("/", sessionsController.create)


module.exports = sessionsRoutes