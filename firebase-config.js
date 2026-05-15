// mock-site/firebase-config.js
// Firebase 프로젝트 설정값 — Firebase 콘솔 > 프로젝트 설정 > 내 앱에서 복사
const firebaseConfig = {
  apiKey:            "AIzaSyCfpvCn6wO8TNKnWiqOB0FYp-YGaPISQ7I",
  authDomain:        "nvidia-npn-partner.firebaseapp.com",
  databaseURL:       "https://nvidia-npn-partner-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "nvidia-npn-partner",
  storageBucket:     "nvidia-npn-partner.firebasestorage.app",
  messagingSenderId: "674256554869",
  appId:             "1:674256554869:web:d5c5a4f8b3c21df15d613c"
};

// Firebase 앱 초기화 (SDK v9 compat)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const STATE_REF = db.ref('npn_state');
