const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const {requireRole} = require("./auth");

// POST /companies
router.post(
    "/",
    requireRole("admin"),
    async (req, res) => {
      const {name, nit, emailAdmin, password} = req.body;
      if (!name || !nit || !emailAdmin || !password) {
        return res.status(400).json({error: "Faltan datos"});
      }

      // 1. Crear usuario administrador
      const userRecord = await admin
          .auth()
          .createUser({email: emailAdmin, password});

      await admin
          .firestore()
          .collection("users")
          .doc(userRecord.uid)
          .set({
            displayName: `${name} admin`,
            email: userRecord.email,
            roles: ["admin"],
          });

      // 2. Crear empresa
      const companyRef = await admin
          .firestore()
          .collection("companies")
          .add({
            name,
            nit,
            ownerUID: userRecord.uid,
            createdAt: admin.firestore.FieldValue
                .serverTimestamp(),
          });

      return res.status(201).json({id: companyRef.id});
    },
);

// GET /companies
router.get(
    "/",
    requireRole("admin"),
    async (_, res) => {
      try {
        const db = admin.firestore();
        const snap = await db
            .collection("companies")
            .orderBy("createdAt", "desc")
            .get();

        const companies = await Promise.all(
            snap.docs.map(async (doc) => {
              const data = doc.data();
              const company = {id: doc.id, ...data};

              if (company.ownerUID) {
                const ownerSnap = await db
                    .doc(`users/${company.ownerUID}`)
                    .get();

                if (ownerSnap.exists) {
                  company.ownerData = ownerSnap.data();
                }
              }

              return company;
            }),
        );

        return res.json(companies);
      } catch (error) {
        return res.status(500).json({error: error.message});
      }
    },
);

module.exports = router;
