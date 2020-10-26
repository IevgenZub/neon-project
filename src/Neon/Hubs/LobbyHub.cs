using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Threading.Channels;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Neon.Contracts;

namespace Neon.Hubs
{
    public class LobbyHub: Hub
    {
        private static readonly List<User> _users = new List<User>();
        private readonly QuestionTicker _questionTicker;

        public LobbyHub(QuestionTicker questionTicker)
        {
            _questionTicker = questionTicker;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var user = _users.Single(u => u.ConnectionId == Context.ConnectionId);
            _users.Remove(user);
            await Clients.All.SendAsync("userDisconnected", user);
        }

        public async Task NewOnlineUser(User user)
        {
            if (!_users.Any(u => u.Id == user.Id))
            {
                _users.Add(user);
                await Clients.All.SendAsync("userConnected", user);
            }
        }

        public List<User> GetUsersOnline()
        {
            return _users;
        }

        public ChannelReader<Question> StreamQuestions()
        {
            return _questionTicker.StreamQuestions().AsChannelReader(10);
        }

        public async Task SubmitAnswer(Answer answer)
        {
            if (_questionTicker.IsCorrectAnswer(answer))
            {
                var user = _users.Single(u => u.Id == answer.UserId);
                user.Score += 100;
                await Clients.All.SendAsync("userScored", user);
            }
        }
    }
}
