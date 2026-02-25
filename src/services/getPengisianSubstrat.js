import axios from "axios";

const PROJECT_ID = "tesdhtt";
const COLLECTION = "PengisianSubstrat";

export async function getPengisianSubstrat() {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

    const res = await axios.get(url);

    if (!res.data.documents) return [];

    return res.data.documents.map((doc) => {
      const fields = doc.fields;

      /* ======================
         AMBIL WAKTU (ROOT)
      ====================== */
      const waktu = fields.waktu?.stringValue ?? "-";

      // ambil tanggal saja (untuk judul card)
      const date = waktu.split(" ")[0] ?? "-";

      /* ======================
         AMBIL ITEMS ARRAY
      ====================== */
      const items =
        fields.items?.arrayValue?.values?.map((item) => {
          const v = item.mapValue.fields;

          const jenis = v.jenis?.stringValue ?? "-";
          const ukuran = v.ukuran?.stringValue ?? "-";
          const satuan = v.satuan?.stringValue ?? "-";

          return `${jenis} (${ukuran} ${satuan})`;
        }) ?? [];

      return {
        date,
        waktu,
        items,
      };
    });
  } catch (err) {
    console.log("❌ Firestore REST Error:", err.message);
    return [];
  }
}
