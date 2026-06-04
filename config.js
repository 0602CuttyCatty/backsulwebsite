/* ═══════════════════════════════════════════
   config.js — Firebase 설정 & 비밀번호
   ⚠️  Git에 올리지 마세요 (.gitignore에 추가)
═══════════════════════════════════════════ */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkAdgryGyQ4AOWlYeDtqlqxtU0tT7egY0",
  authDomain: "backsulwebsite.firebaseapp.com",
  projectId: "backsulwebsite",
  storageBucket: "backsulwebsite.firebasestorage.app",
  messagingSenderId: "239083259997",
  appId: "1:239083259997:web:ba6febfbd8bd1a0b47e5b4",
  measurementId: "G-V4CQBXZ2WH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);