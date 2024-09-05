import firebase_app from "./config";
import { getFirestore } from "firebase/firestore";

const db = getFirestore(firebase_app);
