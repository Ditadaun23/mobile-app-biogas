import axios from "axios";

const PROJECT_ID = "tesdhtt";

export const getLatestUltrasonicData = async () => {
  try {
    const url = `
https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery
    `;

    const body = {
      structuredQuery: {
        from: [{ collectionId: "ProduksiHarianUltrasonik" }],
        orderBy: [
          {
            field: { fieldPath: "waktuTS" },
            direction: "DESCENDING",
          },
        ],
        limit: 1,
      },
    };

    const response = await axios.post(url, body);

    const doc = response.data[0]?.document;
    if (!doc) return null;

    const fields = doc.fields;

    return {
      index: Number(fields.index.integerValue),
      jarak: Number(fields.jarak.doubleValue),
      //   waktu: fields.waktu.stringValue,
      waktuTS: fields.waktuTS.timestampValue,
    };
  } catch (error) {
    console.log("Firestore axios error:", error.message);
    return null;
  }
};
