"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/messages")
    .build();

var otheruser = document.getElementById("username").innerHTML;
connection.on("ReceiveMessage", function (message, user) {
    otheruser = user;
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var div = document.createElement("li");
    var currentdate = new Date();
    var datetime = currentdate.getHours() + ":"
        + currentdate.getMinutes();
    if (user != document.getElementById("username").innerHTML) {
        div.setAttribute("class", "clearfix");
        div.innerHTML = "<div class='message-data align-right'><span class='message-data-time'>" + datetime + "</span>&nbsp;&nbsp;<span class='message-data-name'>" + user + "</span><i class='fa fa-circle me'></i></div><div class='messagebox other-message float-right'>" + msg + "</div>";
    }
    else {
        div.setAttribute("class", "clearfix");
        div.innerHTML = "<div class='message-data'><i class='fa fa-circle online'></i><span class='message-data-name'>You</span>&nbsp;&nbsp;<span class='message-data-time'>" + datetime + "</span></div><div class='messagebox my-message'>" + msg + "</div>";

    }
    document.getElementById("messages").appendChild(div);
});

connection.on("UserDisconnected", function (connectionId) {
    var message = "Left the chat";
    connection.invoke("SendMessageToGroup", document.getElementById("GroupName").value, message, otheruser)
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("message-to-send").value;
    connection.invoke("SendMessageToGroup", document.getElementById("GroupName").value, message, document.getElementById("username").innerHTML).catch(function (err) {
            return console.error(err.toString());
        });
    

    event.preventDefault();
});







document.getElementById("joinGroup").addEventListener("click", function (event) {
    if (document.getElementById("username").innerHTML == "" || document.getElementById("username").innerHTML == null) {
        document.getElementById("username").innerHTML = "Anonymous";
    }
    document.getElementById("chat-with").innerHTML = "Current Room: " + document.getElementById("GroupName").value;
    if (connection.invoke("JoinGroup", document.getElementById("GroupName").value)) {
        connection.invoke("SendMessageToGroup", document.getElementById("GroupName").value, "Joined the chat", document.getElementById("username").innerHTML)
    };
    event.preventDefault();
});

