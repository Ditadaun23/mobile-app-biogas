import admin from "firebase-admin";
import fetch from "node-fetch";

// =====================
// INIT FIREBASE ADMIN
// =====================
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT env not set");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// =====================
// SEND NOTIF
// =====================
async function sendNotification() {
  console.log("🔥 PROJECT:", serviceAccount.project_id);

  const usersSnap = await db.collection("users").get();
  console.log("👤 TOTAL USERS:", usersSnap.size);

  let expoTokens = [];

  for (const userDoc of usersSnap.docs) {
    const tokensSnap = await userDoc.ref.collection("expoTokens").get();

    tokensSnap.forEach((doc) => {
      const data = doc.data();
      if (data.token?.startsWith("ExponentPushToken")) {
        expoTokens.push(data.token);
      }
    });
  }

  console.log("📱 TOTAL EXPO TOKENS:", expoTokens.length);

  if (expoTokens.length === 0) {
    console.log("❌ TIDAK ADA EXPO PUSH TOKEN");
    return;
  }

  // =====================
  // KIRIM KE EXPO
  // =====================
  const messages = expoTokens.map((token) => ({
    to: token,
    sound: "default",
    title: "🔥 Test Notifikasi",
    body: "Notif berhasil dikirim dari Firestore 🚀",
    data: {
      type: "TEST",
    },
  }));

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  const result = await res.json();
  console.log("✅ EXPO RESPONSE:", JSON.stringify(result, null, 2));
}

sendNotification().catch(console.error);
