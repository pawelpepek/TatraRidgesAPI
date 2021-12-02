using TatraRidges.Model.Helpers;

namespace TatraRidgesModel.UnitTests.Helpers
{
    public struct DecimalRangeForTest
    {
        public decimal MinValue { get; }
        public decimal MaxValue { get; }

        public DecimalRangeForTest(decimal minValue, decimal maxValue)
        {
            MinValue = minValue;
            MaxValue = maxValue;
        }
        public DecimalRange MakeDecimalRange()=> new(MinValue, MaxValue);
    }
}
