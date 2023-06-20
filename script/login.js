import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    loginUser();
});

const loginUser = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
    }
};
