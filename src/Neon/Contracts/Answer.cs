using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Neon.Contracts
{
    public class Answer
    {
        public string QuestionId { get; set; }

        public string SelectedAnswer { get; set; }

        public string UserId { get; set; }
    }
}
