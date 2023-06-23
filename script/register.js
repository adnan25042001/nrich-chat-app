import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import firebaseConfig from "./firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    createUser();
});

const createUser = async () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(user, {
            displayName: username,
        });

    } catch (error) {
        console.log(error);
    }
};
