namespace TatraRidges.Model.Helpers
{
    public class AdjectiveGroupData
    {
        private readonly decimal _breakMost = .66m;
        private readonly decimal _breakToLover = .15m;
        private readonly long _allTicks;
        private readonly List<Adjective> _commonAdjectives;

        private long _rankTimesTicks;
        private long _ticks;
        private Adjective _closestAdjective=null;

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

        public void FindClosestAdjective()
        {
            var rank = GetRank();
            _closestAdjective = _commonAdjectives.OrderBy(a => Math.Abs(a.Rank - rank)).First();
        }

        public string GetText()
        {
            if (_closestAdjective==null || IsToLower())
            {
                return string.Empty;
            }
            else
            {
                var description= _closestAdjective.Text.Replace("Częściowo ","");
                return description.ToLower();
            }
        }

        public bool IsToLower() => GetTicks() < _breakToLover * _allTicks;

        public bool IsPart()=> _closestAdjective.Id.StartsWith("c") || !IsMost();

        private decimal GetRank()
        {
            var ticks = GetTicks();
            return  _rankTimesTicks / ticks;
        }

        private bool IsMost() => GetTicks() > _breakMost * _allTicks;

        private decimal GetTicks() => Convert.ToDecimal(_ticks);
    }
}