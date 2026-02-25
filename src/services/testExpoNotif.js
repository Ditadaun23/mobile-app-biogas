import fetch from "node-fetch";

const EXPO_TOKEN = "ExponentPushToken[LYxqIxNUp0YxM28Y9lu3uS]";

async function sendTestNotif() {
  const message = {
    to: EXPO_TOKEN,
    sound: "default",
    title: "🚀 Test Notifikasi",
    body: "Halo! Ini notif percobaan dari server 🚨",
    data: {
      type: "TEST",
    },
  };

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const result = await res.json();
  console.log("RESULT:", result);
}

sendTestNotif();
