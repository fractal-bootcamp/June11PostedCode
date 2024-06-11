import admin from "firebase-admin";

import serviceAccount from "./serviceAccountKey.json";

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = app.auth();

export default auth;
