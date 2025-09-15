const { Router } = require("express")

// Controller
const UsersController = require("../controllers/UsersController")
const usersController = new UsersController()

// Middleware de autenticação
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

// Rotas
const usersRoutes = Router()

usersRoutes.use(ensureAuthenticated)

usersRoutes.post("/", usersController.create)
usersRoutes.get("/", usersController.show)

module.exports = usersRoutes
