const io = require("socket.io-client");
const prompt = require('prompt-sync')({sigint: true});
const crypto = require('crypto');
const colors = require('colors');
const { isRegExp } = require("util");
var term = require( 'terminal-kit' ).terminal; 
const algorithm = 'aes-256-cbc';

const availableColors = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "gray", "grey"];
var userColor = availableColors[availableColors.length * Math.random() | 0];

var key = "";
var iv = "";

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

const ip = prompt('Enter ip: '.yellow);
const port = prompt('Enter port: '.yellow);
const name = prompt('Enter name: '.yellow);
const secret = prompt('Enter secret key: '.yellow, {echo: '*'});

console.log("");

let socket = io.connect("http://" + ip + ":" + port);

socket.emit("join", secret);

socket.on("newUser", (newUser) => console.log(newUser.yellow));

socket.on("algo", (data) => {
    key = data.key;
    iv = data.iv;
});

socket.on("newMessage", (data) => {
    var message = "[" + new Date().toLocaleString() + "] " + data.name + " => " + decrypt(data.encrypted_message);
    colorText(message, data.userColor);
});

socket.on("success", (success) => console.log(success.yellow));

socket.on("err", (err) => console.log(err.red));

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    var message = d.toString().trim();
    term.up(1);
    term.eraseLine();
    if(message.startsWith('/')){
        if(message.startsWith("/help")){
            console.log("Commands:".blue);
            console.log("   /help - Show all commands".blue);
            console.log("   /color <color> - change chat color".blue);
        }else if(message.startsWith("/color")){
            var color = message.replace("/color ", "");
            if(availableColors.includes(color)){
                    userColor = color;
                    console.log(("Color " + color + " is now your chat color.").blue);
                }else{
                    console.log(("Color '" + color + "' is not available.").red);
               }
        }else{
            console.log("Please use /help for more commands.".blue);
        }
    }else{
        var encrypted_message = encrypt(message);
        colorText("[" + new Date().toLocaleString() + "] " + name + " => " + message, userColor);
        socket.emit("newMsg", {name, encrypted_message, userColor});
    }
});

function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}
   
function decrypt(text) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function colorText(message, color){
    switch(color){
        case "black":
            console.log(message.black);
        break;
        case "red":
            console.log(message.red);
        break;
        case "green":
            console.log(message.green);
        break;
        case "yellow":
            console.log(message.yellow);
        break;
        case "blue":
            console.log(message.blue);
        break;
        case "magenta":
            console.log(message.magenta);
        break;
        case "cyan":
            console.log(message.cyan);
        break;
        case "white":
            console.log(message.white);
        break;
        case "gray":
            console.log(message.gray);
        break;
        case "grey":
            console.log(message.grey);
        break;
        default:
            console.log(message.green);
        break;
    }
}

