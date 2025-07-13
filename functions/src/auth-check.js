/* eslint-disable new-cap */
const express = require("express");
const {requireRole} = require("./auth");

const router = express.Router();

/**
 * GET /auth/is-admin
 * Usa el mismo token que /auth/login (Bearer <idToken>)
 * Si el middleware no arroja, devuelve 200 {ok:true}
 */
router.get(
    "/is-admin",
    requireRole("admin"),
    (req, res) => {
      res.json({ok: true});
    },
);

module.exports = router;
