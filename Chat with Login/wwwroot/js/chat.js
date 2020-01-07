"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/messages")
    .build();

connection.on("ReceiveMessage", function (message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var div = document.createElement("div");
    div.innerHTML = msg + "<hr/>";
    document.getElementById("messages").appendChild(div);
});

connection.on("UserDisconnected", function (connectionId) {
    var message = document.getElementById("username").innerHTML; + " left the chat"
    connection.invoke("SendMessageToGroup", document.getElementById("GroupName").value, message)
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("message").value;

    connection.invoke("SendMessageToGroup", document.getElementById("GroupName").value, message).catch(function (err) {
            return console.error(err.toString());
        });
    

    event.preventDefault();
});


document.getElementById("joinGroup").addEventListener("click", function (event) {
    if (document.getElementById("username").innerHTML == "" || document.getElementById("username").innerHTML == null) {
        document.getElementById("username").innerHTML = "Anonymous";
    }
    if (connection.invoke("JoinGroup", document.getElementById("GroupName").value)) {
        connection.invoke("SendMessageToGroup", document.getElementById("GroupName").value, document.getElementById("username").innerHTML + " joined the chat")
    };
    event.preventDefault();
});