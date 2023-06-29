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

import firebaseConfig from "./firebase.js";
import profileColors from "./ProfileColors.js";

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
        let myDate = formatDate(data[key].date);

        let chat = document.createElement("div");
        chat.setAttribute("class", "chat");

        chat.addEventListener("click", async () => {
            let obj = { ...currentUser };
            obj.chatUser = key;
            await update(ref(db, "users/" + currentUser.uid), obj);
            selectedChat(chat);
            chatUserHeader(data[key], myDate);
            createUserChat(data[key]);
            if (window.innerWidth <= 676) {
                if (document.querySelectorAll(".selected").length !== 1) return;
                let right = document.querySelector(".right");
                right.classList.add("show-chat");
            }
        });

        let chatImage = document.createElement("div");
        chatImage.setAttribute("class", "chat-image");
        chatImage.style.backgroundColor = data[key].color;
        chatImage.innerText = data[key].displayName[0].toUpperCase();

        let online = document.createElement("span");
        online.setAttribute("class", "online");

        if (data[key].online) {
            chatImage.append(online);
        }

        let div = document.createElement("div");

        let span = document.createElement("span");

        let innerDiv1 = document.createElement("div");
        innerDiv1.innerText = data[key].displayName;

        let innerDiv2 = document.createElement("div");
        innerDiv2.setAttribute("id", key + "date");
        innerDiv2.innerText = myDate;

        span.append(innerDiv1, innerDiv2);

        let p = document.createElement("p");
        p.setAttribute("id", key + "lastMsg");
        p.innerText = "...";

        let unreadMessageSpan = document.createElement("span");
        unreadMessageSpan.setAttribute("id", key + "unreadMsg");
        unreadMessageSpan.innerText = 0;
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

        currentUser.online = false;

        update(ref(db, "users/" + currentUser.uid), currentUser).then(
            () => (window.location = "./login.html")
        );
    });
};

//selected chat
const selectedChat = async (element) => {
    let selectedClasses = document.querySelectorAll(".selected");
    selectedClasses.forEach((ele) => ele.classList.remove("selected"));
    element.classList.add("selected");
};

//getting all the users from database
onValue(ref(db, "users"), async (snap) => {
    const data = await snap.val();
    appendAllUsers(data);
    updateChatsData(currentUser, data);
});

onValue(ref(db, "users/" + currentUser.uid), async (snap) => {
    const data = await snap.val();
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
        const user = await data.val();

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

    if (document.querySelectorAll(".selected").length !== 1) return;

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

    let span = document.createElement("spna");
    span.setAttribute("id", "exit-chat");
    span.addEventListener("click", () => {
        if (document.querySelectorAll(".selected").length !== 1) return;
        let right = document.querySelector(".right");
        right.classList.remove("show-chat");
    });

    let i = document.createElement("i");
    i.setAttribute("class", "fa-solid fa-arrow-left");

    span.append(i);

    chatUserInfo.append(div, span);
};

const appendChatsInChatBox = (currentUserChats, userChats) => {
    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = null;

    if (document.querySelectorAll(".selected").length !== 1) return;

    let obj = { ...userChats };
    if (obj.messages) {
        for (let i = 0; i < obj.messages.length; i++) {
            obj.messages[i].read = true;
        }
    }

    update(ref(db, "user-chats/" + userChats.uid), obj).then(() => {
        let unreadMessageSpan = document.getElementById(
            userChats.uid.trim().split("+")[0] + "unreadMsg"
        );
        unreadMessageSpan.innerText = 0;
        unreadMessageSpan.style.display = "none";
    });

    let chatArr = [
        ...(currentUserChats?.messages || []),
        ...(userChats?.messages || []),
    ];

    chatArr.sort((a, b) => new Date(a.date) - new Date(b.date));

    chatBox.innerHTML = "";

    chatArr.forEach((ele, i) => {
        let messageDiv = document.createElement("div");
        messageDiv.innerText = ele.message;

        if (ele.id === currentUser.uid) {
            messageDiv.setAttribute("class", "current-user-msg");
        } else {
            messageDiv.setAttribute("class", "user-msg");
        }

        let myDate = formatDate(ele.date);

        if (
            userChats.messages &&
            ele === userChats.messages[userChats.messages.length - 1]
        ) {
            get(ref(db, "users/" + userChats.uid.trim().split("+")[0])).then(
                async (data) => {
                    let user = await data.val();
                    chatUserHeader(user, myDate);
                }
            );
        }

        if (i === chatArr.length - 1) {
            document.getElementById(
                userChats.uid.trim().split("+")[0] + "date"
            ).innerText = myDate;
        }

        let timeSpan = document.createElement("span");
        timeSpan.setAttribute("id", "messageTime");
        timeSpan.innerText = myDate;

        messageDiv.append(timeSpan);
        chatBox.append(messageDiv);
    });
};

const createUserChat = async (userData) => {
    try {
        let obj = { ...currentUser };
        obj.chatUser = userData.uid;
        await update(ref(db, "users/" + currentUser.uid), obj);

        const data = await get(ref(db, "users/" + currentUser.uid));
        const updatedCurrentUser = await data.val();

        localStorage.setItem("user", JSON.stringify(updatedCurrentUser));

        const currentUserChatId = currentUser.uid + "+" + userData.uid;
        const userChatId = userData.uid + "+" + currentUser.uid;

        const currentUserChatData = await get(
            ref(db, "user-chats/" + currentUserChatId)
        );
        const currentUserChats = await currentUserChatData.val();

        if (!currentUserChats) {
            await set(ref(db, "user-chats/" + currentUserChatId), {
                uid: currentUserChatId,
                messages: [],
            });
        }

        const userChatdata = await get(ref(db, "user-chats/" + userChatId));
        const userChats = await userChatdata.val();
        if (!userChats) {
            await set(ref(db, "user-chats/" + userChatId), {
                uid: userChatId,
                messages: [],
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
    const currentUserChats = await currentUserChatData.val();

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
        callAppendChatMethod(currentUser);
        let data = await get(ref(db, "users"));
        let users = await data.val();
        updateChatsData(currentUser, users);
    } catch (error) {
        console.log(error);
    }
};

const callAppendChatMethod = async (currentUserData) => {
    let currentUserChatId =
        currentUserData.uid + "+" + currentUserData.chatUser;
    let userChatId = currentUserData.chatUser + "+" + currentUserData.uid;
    let data1 = await get(ref(db, "user-chats/" + currentUserChatId));
    let data2 = await get(ref(db, "user-chats/" + userChatId));
    let currentUserChats = data1.val();
    let userChats = data2.val();
    appendChatsInChatBox(currentUserChats, userChats);
};

const updateChatsData = async (currentUser, users) => {
    for (let key in users) {
        if (key === currentUser.uid) continue;

        const currentUserChatId = currentUser.uid + "+" + key;
        const userChatId = key + "+" + currentUser.uid;

        const currentUserChatData = await get(
            ref(db, "user-chats/" + currentUserChatId)
        );
        const currentUserChats = await currentUserChatData.val();

        const userChatdata = await get(ref(db, "user-chats/" + userChatId));
        const userChats = await userChatdata.val();

        let arr;
        if (currentUserChats && userChats) {
            arr = [
                ...(currentUserChats?.messages || []),
                ...(userChats?.messages || []),
            ];
        } else if (currentUserChats) {
            arr = [...(currentUserChats.messages || [])];
        } else if (userChats) {
            arr = [...(userChats.messages || [])];
        } else {
            arr = [];
        }

        arr.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (arr.length === 0) continue;

        let date = document.getElementById(key + "date");
        date.innerText = formatDate(arr[arr.length - 1].date);

        let msg = document.getElementById(key + "lastMsg");
        msg.innerText = arr[arr.length - 1].message;

        let count = 0;

        let msgArr;
        if (userChats) {
            msgArr = [...(userChats.messages || [])];
        }

        for (let i = 0; i < msgArr.length; i++) {
            if (!msgArr[i].read) count++;
        }

        if (count > 0) {
            let unreadMsg = document.getElementById(key + "unreadMsg");
            unreadMsg.innerText = count;
            unreadMsg.style.display = "flex";
        }
    }
};

const currentUserChatId = currentUser.uid + "+" + currentUser.chatUser;
const userChatId = currentUser.chatUser + "+" + currentUser.uid;

onValue(ref(db, "user-chats/" + userChatId), (snap) => {
    get(ref(db, "user-chats/" + currentUserChatId)).then((data) =>
        appendChatsInChatBox(data.val(), snap.val())
    );
});

const formatDate = (dateString) => {
    let myDate;

    let date = new Date(dateString);

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
    return myDate;
};

document.getElementById("search").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.keyCode === 13) {
        event.preventDefault();
        alert("sorry for inconvenience\nsearch method is not implemented yet");
        document.getElementById("search").value = "";
    }
});
