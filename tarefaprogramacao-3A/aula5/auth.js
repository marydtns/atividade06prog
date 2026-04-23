import app from "./firebaseConfig";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(app);

export const login = async (email, senha) => {
  return await signInWithEmailAndPassword(auth, email, senha);
};

export const cadastrar = async (email, senha) => {
  return await createUserWithEmailAndPassword(auth, email, senha);
};