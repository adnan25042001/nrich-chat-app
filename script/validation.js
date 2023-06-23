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

import firebaseConfig from "./firebase.js";
import profileColors from "./ProfileColors.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const authStateChanged = async (user) => {
    if (!user) return;
    const data = await get(ref(db, "users/" + user.uid));
    const currentUser = data.val();
    if (!currentUser) {
        const colorIndex = Math.floor(Math.random() * profileColors.length);
        set(ref(db, "users/" + user.uid), {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            color: profileColors[colorIndex],
            date: new Date().toUTCString(),
            online: true,
        });
    }
    localStorage.setItem("user", JSON.stringify(currentUser));
    setTimeout(() => {
        window.location = "index.html";
    }, 300);
};

onAuthStateChanged(auth, authStateChanged);
