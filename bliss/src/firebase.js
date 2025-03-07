import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBXPb6IJPETv7-maiX_iBMvlP1cVxqLf-U",
    authDomain: "sample-c5864.firebaseapp.com",
    databaseURL: "https://sample-c5864-default-rtdb.firebaseio.com",
    projectId: "sample-c5864",
    storageBucket: "sample-c5864.appspot.com",
    messagingSenderId: "977993400479",
    appId: "1:977993400479:web:41c9b5a364b727de5022aa",
    measurementId: "G-8FTE1QF1G2"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };