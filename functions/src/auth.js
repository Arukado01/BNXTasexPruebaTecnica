const admin = require("firebase-admin");
if (!admin.apps.length) admin.initializeApp();

exports.requireRole = (role) => async (req, res, next) => {
  // 1) Lee el header
  const header = req.headers.authorization;
  console.log(">> Auth header:", header);
  if (!header) {
    console.warn(">> No authorization header");
    return res.status(401).json({error: "Sin token"});
  }

  // 2) Extrae el token tras "Bearer "
  const parts = header.split("Bearer ");
  const token = parts.length === 2 ? parts[1] : null;
  if (!token) {
    console.warn(">> Header mal formateado:", header);
    return res.status(401).json({error: "Sin token"});
  }

  try {
    // 3) Verifica el ID Token
    const decoded = await admin.auth().verifyIdToken(token);
    console.log(">> decoded.uid =", decoded.uid);

    // 4) Consulta el documento de roles en Firestore
    const snap = await admin
        .firestore()
        .collection("users")
        .doc(decoded.uid)
        .get();

    if (!snap.exists) {
      console.warn(`>> No existe users/${decoded.uid}`);
      return res.status(403).json({error: "Sin permiso"});
    }

    const data = snap.data();
    const roles = Array.isArray(data.roles) ? data.roles : [];
    console.log(">> roles from Firestore =", roles);

    // 5) Comprueba que el rol requerido esté presente
    if (roles.indexOf(role) === -1) {
      console.warn(`>> El rol "${role}" no está presente en ${roles}`);
      return res.status(403).json({error: "Sin permiso"});
    }

    // 6) Todo OK, continúa
    req.user = decoded;
    next();
  } catch (err) {
    console.error(">> Error verifying token:", err);
    return res.status(401).json({error: "Token inválido"});
  }
};
