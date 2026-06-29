const admin = require("firebase-admin");

const serviceAccount = require("./appdivertido-firebase-adminsdk-fbsvc-6276951c54.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "3yaBvrHffgeYUNEOsgi0NYwSdPU2";

async function setAdmin() {
  try {
    await admin.auth().setCustomUserClaims(uid, {
      admin: true,
    });

    console.log("Usuário definido como admin com sucesso!");
    process.exit();
  } catch (error) {
    console.error("Erro ao definir admin:", error);
  }
}

setAdmin();