// import axios from "axios";

// const PROJECT_ID = "tesdhtt";
// const COLLECTION = "ProduksiHarianUltrasonik";

// export async function getJarakData() {
//   try {
//     const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=500&orderBy=waktuTS%20desc`;

//     const res = await axios.get(url);
//     if (!res.data.documents) return [];

//     const now = new Date();
//     const currentMonth = now.getMonth(); // 0-11
//     const currentYear = now.getFullYear();
//     const today = now.getDate();

//     const data = res.data.documents
//       .map((doc) => {
//         const fields = doc.fields;
//         if (!fields.waktuTS?.timestampValue) return null;

//         const waktu = new Date(fields.waktuTS.timestampValue);

//         // 🔥 FILTER BULAN & TAHUN YANG SAMA
//         if (
//           waktu.getMonth() !== currentMonth ||
//           waktu.getFullYear() !== currentYear ||
//           waktu.getDate() > today
//         ) {
//           return null;
//         }

//         const jarak = Number(
//           fields.jarak?.doubleValue ?? fields.jarak?.integerValue ?? 0
//         );

//         /* =====================
//            HITUNG VOLUME
//         ===================== */
//         const radius = 12 + ((11.5 - 12) / 16.5) * jarak;

//         const volume =
//           (1 / 3) * Math.PI * jarak * (12 ** 2 + 12 * radius + radius ** 2);

//         const volumeFinal = Math.round(volume / 1000);

//         const tgl = waktu.toLocaleDateString("id-ID", {
//           day: "2-digit",
//           month: "2-digit",
//         });

//         const jam = waktu.toLocaleTimeString("id-ID", {
//           hour: "2-digit",
//           minute: "2-digit",
//         });

//         return {
//           value: volumeFinal,
//           label: `${tgl}\n${jam}`,
//         };
//       })
//       .filter(Boolean)
//       .reverse(); // ASC untuk grafik

//     return data;
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
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?pageSize=500&orderBy=waktuTS%20desc`;

    const res = await axios.get(url);
    if (!res.data.documents) return [];

    const data = res.data.documents
      .map((doc) => {
        const f = doc.fields;
        if (!f.waktuTS?.timestampValue) return null;

        /* =====================
           TIMESTAMP → DATE
        ===================== */
        const waktu = new Date(f.waktuTS.timestampValue);

        /* =====================
           JARAK
        ===================== */
        const jarak = Number(
          f.jarak?.doubleValue ?? f.jarak?.integerValue ?? 0,
        );

        /* =====================
           HITUNG VOLUME
        ===================== */
        const radius = 12 + ((11.5 - 12) / 16.5) * jarak;

        const volume =
          (1 / 3) * Math.PI * jarak * (12 ** 2 + 12 * radius + radius ** 2);

        const volumeFinal = Math.round(volume / 1000);

        /* =====================
           LABEL GRAFIK
        ===================== */
        const tgl = waktu.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        const jam = waktu.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          value: volumeFinal,
          label: `${tgl}\n${jam}`,
          waktuTS: waktu,
        };
      })
      .filter(Boolean);

    return data;
  } catch (err) {
    console.log("❌ Firestore REST error:", err.message);
    return [];
  }
}
