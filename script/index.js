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
    set,
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

if (!currentUser) window.location = "./login.html";

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

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
    }
};

// append all the users into current users chat
const appendAllUsers = (data) => {
    const chats = document.querySelector("#chats");
    chats.innerHTML = "";

    for (let key in data) {
        if (key === currentUser.uid) continue;

        // creating the date format here
        let myDate;

        let date = new Date(data[key].date);

        const differenceInDays = Math.round(
            (new Date() - date) / (24 * 60 * 60 * 1000)
        );

        if (differenceInDays >= 7) {
            myDate = date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } else if (differenceInDays > 0) {
            myDate = days[date.getDay()];
        } else {
            myDate = date.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        }

        let chat = document.createElement("div");
        chat.setAttribute("class", "chat");

        chat.addEventListener("click", async () => {
            let obj = { ...currentUser };
            obj.userChat = key;
            await update(ref(db, "users/" + currentUser.uid), obj);
            selectedChat(chat);
            chatUserHeader(data[key], myDate);
            createUserChat(data[key]);
        });

        let chatImage = document.createElement("div");
        chatImage.setAttribute("class", "chat-image");
        chatImage.style.backgroundColor = data[key].color;
        chatImage.innerText = data[key].displayName[0].toUpperCase();

        let div = document.createElement("div");

        let span = document.createElement("span");

        let innerDiv1 = document.createElement("div");
        innerDiv1.innerText = data[key].displayName;

        let innerDiv2 = document.createElement("div");
        innerDiv2.innerText = myDate;

        span.append(innerDiv1, innerDiv2);

        let p = document.createElement("p");
        p.innerText = "...";

        let unreadMessageSpan = document.createElement("span");
        unreadMessageSpan.setAttribute("id", "unreadMsg");
        unreadMessageSpan.innerText = 1;
        unreadMessageSpan.style.display = "none";

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

//selected chat
const selectedChat = async (element) => {
    let selectedClasses = document.querySelectorAll(".selected");
    selectedClasses.forEach((ele) => ele.classList.remove("selected"));
    element.classList.add("selected");
};

//getting all the users from database
onValue(ref(db, "users"), (snap) => {
    const data = snap.val();
    appendAllUsers(data);
});

onValue(ref(db, "users/" + currentUser.uid), (snap) => {
    console.log(12);
    const data = snap.val();
    localStorage.setItem("user", JSON.stringify(data));
    currentUser = data;
    callAppendChatMethod(data);
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

// All methods related to chat will come here
const chatUserHeader = (data, date) => {
    let chatUserInfo = document.querySelector(".chat-info");
    chatUserInfo.innerHTML = "";

    let div = document.createElement("div");

    let chatUserImage = document.createElement("div");
    chatUserImage.innerText = data.displayName[0].toUpperCase();
    chatUserImage.style.backgroundColor = data.color;

    let innerDiv = document.createElement("div");

    let nameDiv = document.createElement("div");
    nameDiv.innerText = data.displayName;

    let dateDiv = document.createElement("div");
    if (date[date.length - 1] === "m") {
        dateDiv.innerText = "last seen today at " + date;
    } else {
        dateDiv.innerText = "last seen at " + date;
    }

    innerDiv.append(nameDiv, dateDiv);

    div.append(chatUserImage, innerDiv);

    chatUserInfo.append(div);
};

const appendChatsInChatBox = (currentUserChats, userChats) => {
    const chatBox = document.querySelector(".chat-box");
    chatBox.innerHTML = "";

    if (document.querySelectorAll(".selected").length !== 1) return;

    let chatArr = [...currentUserChats.messages, ...userChats.messages];

    chatArr.sort((a, b) => new Date(a.date) - new Date(b.date));

    chatArr.forEach((ele) => {
        let messageDiv = document.createElement("div");
        messageDiv.innerText = ele.message;

        if (ele.id === currentUser.uid) {
            messageDiv.setAttribute("class", "current-user-msg");
        } else {
            messageDiv.setAttribute("class", "user-msg");
        }

        let myDate;

        let date = new Date(ele.date);

        const differenceInDays = Math.round(
            (new Date() - date) / (24 * 60 * 60 * 1000)
        );

        if (differenceInDays >= 7) {
            myDate = date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } else if (differenceInDays > 0) {
            myDate = days[date.getDay()];
        } else {
            myDate = date.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        }

        let timeSpan = document.createElement("span");
        timeSpan.setAttribute("id", "messageTime");
        timeSpan.innerText = myDate;

        messageDiv.append(timeSpan);
        chatBox.append(messageDiv);
    });

    console.log(chatArr);
};

const createUserChat = async (userData) => {
    console.log(currentUser.uid, currentUser.userChat);
    try {
        let obj = { ...currentUser };
        obj.chatUser = userData.uid;
        await update(ref(db, "users/" + currentUser.uid), obj);

        const data = await get(ref(db, "users/" + currentUser.uid));
        const updatedCurrentUser = data.val();

        localStorage.setItem("user", JSON.stringify(updatedCurrentUser));

        const currentUserChatId = currentUser.uid + "+" + userData.uid;
        const userChatId = userData.uid + "+" + currentUser.uid;

        const currentUserChatData = await get(
            ref(db, "user-chats/" + currentUserChatId)
        );
        const currentUserChats = currentUserChatData.val();

        if (!currentUserChats) {
            await set(ref(db, "user-chats/" + currentUserChatId), {
                uid: currentUserChatId,
                messages: null,
            });
        }

        const userChatdata = await get(ref(db, "user-chats/" + userChatId));
        const userChats = userChatdata.val();
        if (!userChats) {
            await set(ref(db, "user-chats/" + userChatId), {
                uid: userChatId,
                messages: null,
            });
        }
        appendChatsInChatBox(currentUserChats, userChats);
    } catch (error) {
        console.log(error);
    }
};

let message = document.getElementById("message");

message.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.keyCode === 13) {
        event.preventDefault();
        if (document.querySelectorAll(".selected").length === 1) {
            sendMessage(message.value);
            message.value = "";
        }
    }
});

const sendMessage = async (message) => {
    const currentUserChatId = currentUser.uid + "+" + currentUser.chatUser;

    const currentUserChatData = await get(
        ref(db, "user-chats/" + currentUserChatId)
    );
    const currentUserChats = currentUserChatData.val();

    if (!currentUserChats.messages) {
        currentUserChats.messages = [
            {
                date: new Date().toUTCString(),
                read: false,
                message: message,
                id: currentUser.uid,
            },
        ];
    } else {
        currentUserChats.messages.push({
            date: new Date().toUTCString(),
            read: false,
            message: message,
            id: currentUser.uid,
        });
    }

    try {
        await update(
            ref(db, "user-chats/" + currentUserChatId),
            currentUserChats
        );
    } catch (error) {
        console.log(error);
    }
};

const currentUserChatId = currentUser.uid + "+" + currentUser.chatUser;
const userChatId = currentUser.chatUser + "+" + currentUser.uid;

onValue(ref(db, "user-chats/" + currentUserChatId), (snap) => {
    get(ref(db, "user-chats/" + userChatId)).then((data) =>
        appendChatsInChatBox(snap.val(), data.val())
    );
});

onValue(ref(db, "user-chats/" + userChatId), (snap) => {
    get(ref(db, "user-chats/" + currentUserChatId)).then((data) =>
        appendChatsInChatBox(data.val(), snap.val())
    );
});

const callAppendChatMethod = async (currentUserData) => {
    let currentUserChatId =
        currentUserData.uid + "+" + currentUserData.userChat;
    let userChatId = currentUserData.userChat + "+" + currentUserData.uid;
    let data1 = await get(ref(db, "user-chats/" + currentUserChatId));
    let data2 = await get(ref(db, "user-chats/" + userChatId));
    console.log(1);
    appendChatsInChatBox(data1.val(), data2.val());
};
