const currentUser = localStorage.getItem("user");

if (currentUser === null || currentUser === undefined) {
    window.location = "./login.html";
}
