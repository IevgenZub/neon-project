using System.Collections.Generic;

namespace Neon.Contracts
{
    public class Question
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public List<string> Answers { get; set; }
    }
}