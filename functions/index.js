const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

/* Routers */
const companies = require("./src/companies");
const authLogin = require("./src/auth-login");
const authCheck = require("./src/auth-check");

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

// Rutas protegidas por roles
app.use("/companies", companies);

// Rutas de autenticación
app.use("/auth", authLogin); // POST /auth/login
app.use("/auth", authCheck); // GET  /auth/is-admin

/* Exporta la API unificada */
exports.api = functions.https.onRequest(app);

/* Funcion independiente para bootstrap */
exports.seedAdmin = require("./src/seed-admin").seedAdmin;
