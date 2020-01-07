using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Chat_with_Login.Hubs
{
    public class ChatHub : Hub
    {


        public Task SendMessageToAll(string message)
        {
            return Clients.Caller.SendAsync("ReceiveMessage", message);
        }
        public Task JoinGroup(string group)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, group);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await Clients.All.SendAsync("UserDisconnected");
            await base.OnDisconnectedAsync(ex);
        }
        public async Task SendMessageToGroup(string group, string message, string user)
        {
            await Clients.Group(group).SendAsync("ReceiveMessage", message, user);
        }
    }
}
