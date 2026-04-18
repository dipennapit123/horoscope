import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { publicEnv } from "../config/publicEnv";

const firebaseConfig = {
  apiKey: publicEnv.firebaseApiKey(),
  authDomain: publicEnv.firebaseAuthDomain(),
  projectId: publicEnv.firebaseProjectId(),
  storageBucket: publicEnv.firebaseStorageBucket(),
  messagingSenderId: publicEnv.firebaseMessagingSenderId(),
  appId: publicEnv.firebaseAppId(),
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export const firebaseApp = app;
export const firebaseAuth = auth;
