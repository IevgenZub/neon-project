using Neon.Contracts;
using System;
using System.Collections.Generic;
using System.Reactive.Subjects;
using System.Threading;
using System.Threading.Tasks;

namespace Neon
{
    public class QuestionTicker
    {
        private readonly Dictionary<string, string> _correctAnswers;
        private readonly Timer _timer;
        private readonly TimeSpan _updateInterval;
        private readonly Subject<Question> _subject;
        
        public QuestionTicker()
        {
            _updateInterval = TimeSpan.FromMilliseconds(5000);
            _timer = new Timer(NextQuestion, null, _updateInterval, _updateInterval);
            _subject = new Subject<Question>();
            _correctAnswers = new Dictionary<string, string>();
        }

        public IObservable<Question> StreamQuestions()
        {
            return _subject;
        }

        public bool IsCorrectAnswer(Answer answer)
        {
            return _correctAnswers[answer.QuestionId] == answer.SelectedAnswer;
        }

        private async void NextQuestion(object state)
        {
            var nextQuestion = await GetNextRandomQuestion();
            _subject.OnNext(nextQuestion);
        }

        private async Task<Question> GetNextRandomQuestion()
        {
            // TODO: Read from database

            var questionA = new Question()
            {
                Id = Guid.NewGuid().ToString(),
                Text = "Ты бузишь ? ", 
                Answers = new List<string>() { "Да", "Нет", "Я подумаю", "Точно нет"}
            };

            _correctAnswers.Add(questionA.Id, questionA.Answers[0]);

            var questionB = new Question()
            {
                Id = Guid.NewGuid().ToString(),
                Text = "Как дела ? ",
                Answers = new List<string>() { "Нормально", "Не бузи", "Хочу кушать", "Ничё так" }
            };

            _correctAnswers.Add(questionB.Id, questionB.Answers[1]);

            var questionС = new Question()
            {
                Id = Guid.NewGuid().ToString(),
                Text = "Шо делать ? ",
                Answers = new List<string>() { "Не знаю", "Не бузи", "Хочу кушать", "Фильм" }
            };

            _correctAnswers.Add(questionС.Id, questionС.Answers[0]);

            var questions = new List<Question>() { questionA, questionB, questionС };
            var randomNumber = new Random().Next(0, 3);
            var result = questions[randomNumber];

            return await Task.FromResult(result);
        }
    }
}
