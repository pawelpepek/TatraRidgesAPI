namespace TatraRidges.Model.Helpers
{
    public class DecimalRange
    {
        public decimal MinValue { get; }
        public decimal MaxValue { get; }

        public DecimalRange(decimal minValue, decimal maxValue)
        {
            MinValue = minValue;
            MaxValue = maxValue;
        }
        public bool IsNumberInThisRange(decimal value) => value <= MinValue && value >= MaxValue;
    }
}
