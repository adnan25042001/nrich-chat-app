import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
    getAuth,
    signOut,
    updateProfile,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
    getDatabase,
    ref,
    update,
    get,
    onValue,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC02O9S-g-7GO8dwSAt-XL1QuQUUiQ5mRY",
    authDomain: "nrich-chat-app.firebaseapp.com",
    databaseURL: "https://nrich-chat-app-default-rtdb.firebaseio.com",
    projectId: "nrich-chat-app",
    storageBucket: "nrich-chat-app.appspot.com",
    messagingSenderId: "115859145847",
    appId: "1:115859145847:web:a6d25d0ae8446ea4a23272",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let currentUser = JSON.parse(localStorage.getItem("user"));


//getting all the users from database
onValue(ref(db, "users/" + currentUser.uid), (snap) => {
    currentUser = snap.val();
});

