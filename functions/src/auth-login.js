/* eslint-disable new-cap */
const fetch = require("node-fetch");
const express = require("express");

const router = express.Router();

/**
 * POST /auth/login
 * Body:  {email, password}  –opcional–
 * Si el body viene vacío se loguea con las credenciales
 * admin definidas en functions:config.
 *
 * Respuesta: {idToken, refreshToken, expiresIn, uid}
 */
router.post("/login", async (req, res) => {
  // 1) Credenciales (las del body o las de config)
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return res
        .status(400)
        .json({error: "Email y password son obligatorios"});
  }

  try {
    /* ---------- 2. Proxy a Firebase Auth ---------- */
    const apiKey = process.env.ADMIN_FIREBASE_APIKEY;
    const url =
            "https://identitytoolkit.googleapis.com/v1/" +
            "accounts:signInWithPassword?key=" +
            apiKey;

    const resp = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      // EMAIL_NOT_FOUND, INVALID_PASSWORD, USER_DISABLED…
      return res.status(400).json({error: data.error.message});
    }

    /* ---------- 3. Devuelve lo necesario ---------- */
    return res.json({
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      uid: data.localId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({error: "Error interno"});
  }
});

module.exports = router;
