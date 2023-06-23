# nrich-chat-app

This is a documentation file for a simple chat application built using HTML, CSS, and Vanilla JavaScript. The chat app utilizes Firebase for authentication and real-time database functionality.

## Prerequisites

Before getting started, ensure you have the following:

1. A code editor (e.g., Visual Studio Code, Sublime Text).
2. A Firebase account. If you don't have one, you can create a free account at [Firebase](https://firebase.google.com/).

## Setup Firebase Account

Follow the steps below to set up your Firebase account, including authentication and real-time database configuration:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and sign in using your Google account.

2. Click on the "Create a project" button and provide a name for your project.

3. Once the project is created, you'll be redirected to the project dashboard.

4. Enable Authentication:
   - Click on the "Authentication" tab in the left sidebar.
   - Choose the "Get started" button under "Sign-in method."
   - Enable the desired sign-in methods (e.g., Email/Password, Google, etc.) and follow the provided instructions to configure them.

5. Enable Realtime Database:
   - Click on the "Realtime Database" tab in the left sidebar.
   - Choose "Create database" and select the "Start in test mode" option (for simplicity).
   - Click on "Enable" to create your database.

## Using the Chat App

To use the chat app:

1. Clone or download the project files to your local machine.

2. Open the project folder in your preferred code editor.

3. In the project files, locate the `firebase.js` file.

4. Replace the placeholder values in the `firebase.js` file with your Firebase project's configuration details. You can find these details in the Firebase console under "Project settings" > "Your apps" > "Firebase SDK snippet" > "Config".

5. Open the `index.html` file in a web browser.
