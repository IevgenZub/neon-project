using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Neon.Hubs
{
    public class LobbyHub: Hub
    {
        public async Task NewOnlineUser(string username, string id)
        {
            await Clients.All.SendAsync("userConnected", username, id);
        }

        public async Task RemoveOnlineUser(string id)
        {
            await Clients.All.SendAsync("userDisconnected", id);
        }
    }
}
