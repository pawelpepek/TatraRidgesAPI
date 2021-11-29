namespace TatraRidges.Model.Helpers
{
    public class DecimalRange
    {
        private readonly decimal _minValue;
        private readonly decimal _maxValue;

        public DecimalRange(decimal minValue, decimal maxValue)
        {
            _minValue = minValue;
            _maxValue = maxValue;
        }
        public bool IsNumberInThisRange(decimal value) => value <= _minValue && value >= _maxValue;
        public string MessageForValue(string name)
        {
            return $"{name} musi być z zakresu <{_minValue}; {_maxValue}>.";
        }
    }
}
