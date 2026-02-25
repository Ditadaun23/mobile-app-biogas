// // src/services/testFirestoreREST.js
// export async function testFirestoreREST() {
//   try {
//     const projectId = "tesdhtt";
//     const collection = "test";

//     const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}`;

//     const res = await fetch(url);
//     const data = await res.json();

//     console.log("🔥 Firestore REST CONNECTED");
//     console.log(data);
//   } catch (err) {
//     console.log("❌ REST ERROR:", err);
//   }
// }

// import axios from "axios";

// // GANTI sesuai project kamu
// const PROJECT_ID = "tesdhtt";

// // collection yang mau diambil
// const COLLECTION = "ProduksiHarianUltrasonik";

// // ambil 5 data terbaru
// export async function getJarakData() {
//   try {
//     const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=5&orderBy=waktuTS%20desc`;

//     const res = await axios.get(url);

//     if (!res.data.documents) return [];

//     return res.data.documents
//       .map((doc) => {
//         const fields = doc.fields;

//         const jarak =
//           fields.jarak?.doubleValue ?? fields.jarak?.integerValue ?? 0;

//         let label = "-";
//         if (fields.waktuTS?.timestampValue) {
//           const date = new Date(fields.waktuTS.timestampValue);

//           const tgl = date.toLocaleDateString("id-ID", {
//             day: "2-digit",
//             month: "2-digit",
//           });

//           const jam = date.toLocaleTimeString("id-ID", {
//             hour: "2-digit",
//             minute: "2-digit",
//           });

//           label = `${tgl}\n${jam}`;
//         }

//         return {
//           value: Number(jarak),
//           label,
//         };
//       })
//       .reverse(); // urutkan ASC buat grafik
//   } catch (err) {
//     console.log("❌ Firestore REST error:", err.message);
//     return [];
//   }
// }

import axios from "axios";

const PROJECT_ID = "tesdhtt";
const COLLECTION = "ProduksiHarianUltrasonik";

export async function getJarakData() {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=5&orderBy=waktuTS%20desc`;

    const res = await axios.get(url);

    if (!res.data.documents) return [];

    const data = res.data.documents.map((doc, i) => {
      const fields = doc.fields;

      const jarak = Number(
        fields.jarak?.doubleValue ?? fields.jarak?.integerValue ?? 0
      );

      /* =====================
         HITUNG VOLUME
      ===================== */

      // Hitung jari-jari
      const radius = 12 + ((11.5 - 12) / 16.5) * jarak;

      // Hitung volume (cm³)
      const volume =
        (1 / 3) * Math.PI * jarak * (12 ** 2 + 12 * radius + radius ** 2);

      // Ubah ke liter & bulatkan
      const volumeFinal = Math.round(volume / 1000);

      /* =====================
         LABEL WAKTU
      ===================== */
      let label = "-";
      if (fields.waktuTS?.timestampValue) {
        const date = new Date(fields.waktuTS.timestampValue);

        const tgl = date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
        });

        const jam = date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

        label = `${tgl}\n${jam}`;
      }

      return {
        idx: i,
        jarak,
        radius,
        value: volumeFinal, // ← YANG DIPAKAI GRAFIK
        label,
      };
    });

    return data.reverse(); // ASC untuk grafik
  } catch (err) {
    console.log("❌ Firestore REST error:", err.message);
    return [];
  }
}
