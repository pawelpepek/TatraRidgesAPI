namespace TatraRidges.Model.Helpers
{
    internal class AdjectiveGroupData
    {
        private readonly decimal _breakMost = .66m;
        private readonly decimal _breakToLover = .15m;
        private readonly long _allTicks;
        private readonly List<Adjective> _commonAdjectives;

        private long _rankTimesTicks;
        private long _ticks;

        public string Id { get; }

        public AdjectiveGroupData(string id, List<Adjective> commonAdjectives, long allTicks)
        {
            Id = id;
            _commonAdjectives = commonAdjectives;
            _allTicks = allTicks;
        }

        public void AddTimeAndRank(long ticks, Adjective adjective)
        {
            _rankTimesTicks += ticks * adjective.Rank;
            _ticks += ticks;
        }

        public string GetText()
        {
            if (IsToLower())
            {
                return string.Empty;
            }
            else
            {
                var rank = GetRank();
                var adjective = _commonAdjectives.OrderBy(a => Math.Abs(a.Rank - rank)).First();
                var description = adjective.Id.Substring(0, 1) == "c" || IsMost() ? adjective.Text : "częściowo " + adjective.Text;
                return description.ToLower();
            }
        }

        public bool IsToLower() => GetTicks() < _breakToLover * _allTicks;

        private decimal GetRank()
        {
            var ticks = GetTicks();
            return _rankTimesTicks / ticks;
        }

        private bool IsMost() => GetTicks() > _breakMost * _allTicks;

        private decimal GetTicks() => Convert.ToDecimal(_ticks);
    }
}