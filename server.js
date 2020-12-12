const express = require("express");
const app = express();
const colors = require('colors');
const http = require("http").createServer();

//Crypto
const crypto = require('crypto');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

console.log("");
console.log("  /$$$$$$                                  /$$                     /$$      /$$                     /$$       /$$                    ".yellow);
console.log(" /$$__  $$                                | $$                    | $$$    /$$$                    | $$      |__/                    ".yellow);
console.log("| $$  \\__/  /$$$$$$  /$$   /$$  /$$$$$$  /$$$$$$    /$$$$$$       | $$$$  /$$$$  /$$$$$$   /$$$$$$$| $$$$$$$  /$$ /$$$$$$$   /$$$$$$ ".yellow);
console.log("| $$       /$$__  $$| $$  | $$ /$$__  $$|_  $$_/   /$$__  $$      | $$ $$/$$ $$ |____  $$ /$$_____/| $$__  $$| $$| $$__  $$ /$$__  $$".yellow);
console.log("| $$      | $$  \\__/| $$  | $$| $$  \\ $$  | $$    | $$  \\ $$      | $$  $$$| $$  /$$$$$$$| $$      | $$  \\ $$| $$| $$  \\ $$| $$$$$$$$".yellow);
console.log("| $$    $$| $$      | $$  | $$| $$  | $$  | $$ /$$| $$  | $$      | $$\\  $ | $$ /$$__  $$| $$      | $$  | $$| $$| $$  | $$| $$_____/".yellow);
console.log("|  $$$$$$/| $$      |  $$$$$$$| $$$$$$$/  |  $$$$/|  $$$$$$/      | $$ \\/  | $$|  $$$$$$$|  $$$$$$$| $$  | $$| $$| $$  | $$|  $$$$$$$".yellow);
console.log(" \\______/ |__/       \\____  $$| $$____/    \\___/   \\______/       |__/     |__/ \\_______/ \\_______/|__/  |__/|__/|__/  |__/ \\_______/".yellow);
console.log("                     /$$  | $$| $$                                                                                                   ".yellow);
console.log("                    |  $$$$$$/| $$                                                                                                   ".yellow);
console.log("                     \\______/ |__/                                                                                                   ".yellow);
console.log("");

const prompt = require('prompt-sync')({sigint: true});
const port = prompt('Enter port: '.yellow);
const secret = prompt('Enter secret key: '.yellow, {echo: '*'});

console.log("");

const io = require("socket.io")(http);

io.on("connection", (socket) => {
    console.log(("[" + new Date().toLocaleString() + "] " +'New connection from ' + socket.request.connection.remoteAddress).cyan);

    socket.on("join", (sec) => {
        if(sec == secret){
            socket.join(secret);
            socket.broadcast.emit("newUser", "New user has joined the room.");
            socket.emit("algo", {key, iv});
            socket.emit("success", "You have successfully entered secret code.");
        }else{
            console.log(("[" + new Date().toLocaleString() + "] " + socket.request.connection.remoteAddress + " entered incorrect secret code!").red);
            socket.emit("err", "ERROR: Secret code is incorrect!");
            socket.disconnect();
        }
    });

    socket.on("newMsg", (data) => {
        console.log(("[" + new Date().toLocaleString() + "] " + data.name + " => " + data.encrypted_message).yellow);
        socket.broadcast.emit("newMessage", data);
    });

});

http.listen(port, () => {
    console.log(("[" + new Date().toLocaleString() + "] Server is listed on port " + port).yellow);
});