import admin from "firebase-admin";

function getPrivateKeyFromEnv(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  // Firebase private keys are often stored with escaped newlines.
  return raw.replace(/\\n/g, "\n");
}

export function getFirebaseAdminApp(): admin.app.App {
  const existingApps = admin.apps;
  if (existingApps.length > 0) {
    return existingApps[0] as admin.app.App;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKeyFromEnv(process.env.FIREBASE_PRIVATE_KEY);

  // If GOOGLE_APPLICATION_CREDENTIALS is set, firebase-admin can auto-discover.
  // Otherwise, use explicit service account env vars.
  if (projectId && clientEmail && privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return admin.initializeApp();
}

export function getFirebaseAuth(): admin.auth.Auth {
  const app = getFirebaseAdminApp();
  return admin.auth(app);
}
