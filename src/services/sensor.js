import axios from "axios";

const databaseURL = "https://tesdhtt-default-rtdb.firebaseio.com";

export async function getSensorData() {
  try {
    const res = await axios.get(`${databaseURL}/.json`);
    return res.data;
  } catch (err) {
    console.log("Error GET:", err);
    return null;
  }
}
