require("dotenv").config()
const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");

const cors = require("cors");
const routes = require("./routes")

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(routes)


app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta: ${process.env.PORT}`));