using System;
using System.Reactive.Subjects;
using System.Threading;
using System.Threading.Tasks;

namespace Neon
{
    public class QuestionTicker
    {
        private readonly Timer _timer;
        private readonly TimeSpan _updateInterval;
        private readonly Subject<Question> _subject;
        
        public QuestionTicker()
        {
            _updateInterval = TimeSpan.FromMilliseconds(5000);
            _timer = new Timer(NextQuestion, null, _updateInterval, _updateInterval);
            _subject = new Subject<Question>();
        }

        public IObservable<Question> StreamQuestions()
        {
            return _subject;
        }

        private async void NextQuestion(object state)
        {
            var nextQuestion = await GetNextRandomQuestion();
            _subject.OnNext(nextQuestion);
        }

        private async Task<Question> GetNextRandomQuestion()
        {
            // TODO: Read from database
            var result = new Question() { Text = new Random().Next(1, 100).ToString() };
            return await Task.FromResult(result);
        }
    }
}
