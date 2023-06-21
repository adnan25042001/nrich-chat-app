import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
    onAuthStateChanged,
    getAuth,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
    get,
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

const currentUser = JSON.parse(localStorage.getItem("user"));

if (currentUser !== null && currentUser !== undefined) {
    window.location = "./index.html";
}

const profileColors = [
    "#E95F56",
    "#C490D1",
    "#897E95",
    "#A6AB95",
    "#E46000",
    "#1090D8",
    "#E86D8A",
    "#1F7551",
    "#9DC2B7",
    "#FFE177",
    "#A9D2FD",
    "#FFCDA5",
    "#4AAC67",
    "#FFE5A5",
    "#CD413C",
];

const authStateChanged = async (user) => {
    if(!user) return;
    const data = await get(ref(db, "users/" + user.uid));
    const currentUser = data.val();
    if (!currentUser) {
        const colorIndex = Math.floor(Math.random() * profileColors.length);
        set(ref(db, "users/" + user.uid), {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            color: profileColors[colorIndex],
        });
    } else {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }
    window.location = "index.html";
};

onAuthStateChanged(auth, authStateChanged);
