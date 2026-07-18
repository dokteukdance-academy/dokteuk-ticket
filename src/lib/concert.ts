import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getConcerts() {
  const snapshot = await getDocs(collection(db, "concerts"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}