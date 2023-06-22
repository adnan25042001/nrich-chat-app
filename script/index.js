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

const currentUser = JSON.parse(localStorage.getItem("user"));

// if (!currentUser) window.location = "./login.html";

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

const setProfileColors = (currentUser) => {
    const profileColorsDiv = document.querySelector(".profile-colors");
    profileColorsDiv.innerHTML = null;

    profileColors.forEach((color) => {
        let span = document.createElement("span");
        span.addEventListener("click", () =>
            handleUpdateProfile("color", color)
        );
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

    let checkCircle = document.getElementById("check-circle");
    checkCircle.style.display = "none";
    checkCircle.style.color = "rgb(107, 138, 253)";
    checkCircle.addEventListener("click", () =>
        handleUpdateProfile(
            "name",
            document.getElementById("edit-profile-name").innerText
        )
    );

    let profileName = document.getElementById("edit-profile-name");
    profileName.innerText = currentUser.displayName;
    profileName.addEventListener("keydown", (e) => keyDown(e));
    profileName.addEventListener("keyup", (e) => keyUp(e));

    document.querySelector(".user-info>:nth-child(3)").innerText =
        currentUser.email;
};

setProfileColors(currentUser);

const keyUp = (event) => {
    if (event.target.innerText.trim() !== currentUser?.displayName) {
        document.getElementById("check-circle").style.display = "block";
        document.getElementById("square-pen").style.display = "none";
    } else {
        document.getElementById("check-circle").style.display = "none";
        document.getElementById("square-pen").style.display = "block";
    }
};

const keyDown = (event) => {
    if (event.key === "Enter" && event.keyCode === 13) {
        event.preventDefault();
        console.log(1);
    }
};

// append all the users into current users chat
const appendAllUsers = (data) => {
    const chats = document.querySelector(".chats");
    chats.innerHTML = null;

    for (let key in data) {
        if (key === currentUser.uid) continue;

        let chat = document.createElement("div");
        chat.setAttribute("class", "chat");

        let chatImage = document.createElement("div");
        chatImage.setAttribute("class", "chat-image");
        chatImage.style.backgroundColor = data[key].color;
        chatImage.innerText = data[key].displayName[0].toUpperCase();

        let div = document.createElement("div");

        let span = document.createElement("span");

        let innerDiv1 = document.createElement("div");
        innerDiv1.innerText = data[key].displayName;

        let innerDiv2 = document.createElement("div");
        innerDiv2.innerText = "Date";

        span.append(innerDiv1, innerDiv2);

        let p = document.createElement("p");
        p.innerText = "hello world";

        let unreadMessageSpan = document.createElement("span");
        unreadMessageSpan.innerText = 6;

        div.append(span, p, unreadMessageSpan);

        chat.append(chatImage, div);

        chats.append(chat);
    }
};

document.getElementById("logout").addEventListener("click", () => logout());

const logout = () => {
    signOut(auth).then(() => {
        localStorage.setItem("user", null);
        window.location = "login.html";
    });
};

//getting all the users from database
onValue(ref(db, "users"), (snap) => {
    const data = snap.val();
    appendAllUsers(data);
});

document.getElementById("user-image").addEventListener("click", () => {
    document.querySelector(".user-update").classList.add("active");
});

document.querySelector(".exit-user>div>i").addEventListener("click", () => {
    document.querySelector(".user-update").classList.remove("active");
});

// method to update profile name and profile color
const handleUpdateProfile = async (type, value) => {
    let obj = { ...currentUser };
    switch (type) {
        case "color":
            obj.color = value;
            break;
        case "name":
            obj.displayName = value;
            break;
        default:
            break;
    }

    try {
        await update(ref(db, "users/" + currentUser.uid), obj);
        const data = await get(ref(db, "users/" + currentUser.uid));
        const user = data.val();

        localStorage.setItem("user", JSON.stringify(user));
        setProfileColors(user);

        document.getElementById("check-circle").style.display = "none";
        document.getElementById("square-pen").style.display = "block";

        if (type === "name") {
            await updateProfile(user, {
                displayName: username,
            });
        }
        setTimeout(() => {
            alert("Profile updated successfully:)");
        }, 500);
    } catch (error) {
        console.log(error);
    }
};
