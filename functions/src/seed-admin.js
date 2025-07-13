const functions = require("firebase-functions");
const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

/**
 * GET /auth/seed-admin  – idempotente
 * Respuesta: {ok:true, uid}
 */
exports.seedAdmin = functions.https.onRequest(async (req, res) => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const pwd = process.env.ADMIN_PASSWORD;
    let userRec;

    try {
      userRec = await admin.auth().getUserByEmail(email);
    } catch (e) {
      if (e.code === "auth/user-not-found") {
        userRec = await admin.auth().createUser(
            {
              email,
              password: pwd,
            },
        );
      } else {
        throw e;
      }
    }

    await admin
        .firestore()
        .collection("users")
        .doc(userRec.uid)
        .set(
            {
              roles: ["admin"],
              displayName: "root admin",
            },
            {merge: true},
        );

    return res.json({ok: true, uid: userRec.uid});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ok: false, error: err.message});
  }
});
