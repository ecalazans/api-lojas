require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")

const cors = require("cors")
const routes = require("./routes")

const PORT = process.env.PORT || 3030

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use(routes)



app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`))