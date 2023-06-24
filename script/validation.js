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
    update,
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
        get(ref(db, "users/" + user.uid)).then((data) => {
            localStorage.setItem("user", JSON.stringify(data.val()));
            window.location = "index.html";
        });
    } else {
        currentUser.online = true;
        update(ref(db, "users/" + currentUser.uid), currentUser).then(() => {
            localStorage.setItem("user", JSON.stringify(currentUser));
            window.location = "./index.html";
        });
    }
};

onAuthStateChanged(auth, authStateChanged);
