import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
    getAuth,
    signOut,
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

const currentUser = JSON.parse(localStorage.getItem("user"));

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

const setProfileColors = () => {
    const profileColorsDiv = document.querySelector(".profile-colors");
    profileColorsDiv.innerHTML = null;

    profileColors.forEach((color) => {
        let span = document.createElement("span");
        span.style.backgroundColor = color;
        if (color === currentUser.color) {
            let i = document.createElement("i");
            i.setAttribute("class", "fa-solid fa-check");
            span.append(i);
        }
        profileColorsDiv.append(span);
    });

    let smUser = document.querySelector("#user-image");
    smUser.innerText = currentUser.displayName[0].toUpperCase();
    smUser.style.backgroundColor = currentUser.color;

    let bigUser = document.querySelector(".big-user-image");
    bigUser.innerText = currentUser.displayName[0].toUpperCase();
    bigUser.style.backgroundColor = currentUser.color;

    document.querySelector(".user-info>:nth-child(2)").innerText =
        currentUser.displayName;
    document.querySelector(".user-info>:nth-child(3)").innerText =
        currentUser.email;
};

setProfileColors();

document.getElementById("logout").addEventListener("click", () => logout());

const logout = () => {
    signOut(auth).then(() => {
        localStorage.setItem("user", null);
        window.location = "login.html";
    });
};

document.getElementById("user-image").addEventListener("click", () => {
    document.querySelector(".user-update").classList.add("active");
});

document.querySelector(".exit-user>div>i").addEventListener("click", () => {
    document.querySelector(".user-update").classList.remove("active");
});
