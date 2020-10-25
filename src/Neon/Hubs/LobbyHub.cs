using System.Threading.Channels;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Neon.Hubs
{
    public class LobbyHub: Hub
    {
        private readonly QuestionTicker _questionTicker;

        public LobbyHub(QuestionTicker questionTicker)
        {
            _questionTicker = questionTicker;
        }

        public async Task NewOnlineUser(string id, string username)
        {
            await Clients.All.SendAsync("userConnected", id, username);
        }

        public async Task RemoveOnlineUser(string id)
        {
            await Clients.All.SendAsync("userDisconnected", id);
        }

        public ChannelReader<Question> StreamQuestions()
        {
            return _questionTicker.StreamQuestions().AsChannelReader(10);
        }
    }
}
