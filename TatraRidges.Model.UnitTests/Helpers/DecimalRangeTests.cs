using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace TatraRidgesModel.UnitTests.Helpers
{
    public class DecimalRangeTests
    {
        public static IEnumerable<object[]> GetInSamplesRanges()
        {
            var list = new List<ValueInDecimalRange>()
            {
                new ValueInDecimalRange(0,new DecimalRangeForTest(-10,13)),
                new ValueInDecimalRange(0.1m,new DecimalRangeForTest(0,0.1m)),
                new ValueInDecimalRange(13,new DecimalRangeForTest(12,13)),
                new ValueInDecimalRange(-13,new DecimalRangeForTest(-13,-13)),
                new ValueInDecimalRange(1,new DecimalRangeForTest(1,2)),
                new ValueInDecimalRange(0,new DecimalRangeForTest(-100,100))
            };
            return list.Select(q => new object[] { q });
        }

        public static IEnumerable<object[]> GetOutSamplesRanges()
        {
            var list= new List<ValueInDecimalRange>()
            {
                new ValueInDecimalRange(14,new DecimalRangeForTest(-10,13)),
                new ValueInDecimalRange(-0.1m,new DecimalRangeForTest(0,0.1m)),
                new ValueInDecimalRange(0,new DecimalRangeForTest(12,13)),
                new ValueInDecimalRange(13,new DecimalRangeForTest(-13,-13)),
                new ValueInDecimalRange(1,new DecimalRangeForTest(2,1)),
                new ValueInDecimalRange(0,new DecimalRangeForTest(100,-100))
            };
            return list.Select(q => new object[] { q });
        }

        [Theory]
        [MemberData(nameof(GetInSamplesRanges))]
        public void IsNumberInThisRange_SetValueInRange_RetursTrue(ValueInDecimalRange valueAndRange)
        {
            //act
            var result = IsNumberInThisRange_SetValueInRange(valueAndRange);

            //assert
            Assert.True(result, valueAndRange.GetInfo());
        }

        [Theory]
        [MemberData(nameof(GetOutSamplesRanges))]
        public void IsNumberInThisRange_SetValueOutRange_RetursFalse(ValueInDecimalRange valueAndRange)
        {
            //act
            var result = IsNumberInThisRange_SetValueInRange(valueAndRange);

            //assert
            Assert.False(result, valueAndRange.GetInfo());
        }

        private static bool IsNumberInThisRange_SetValueInRange(ValueInDecimalRange valueAndRange)
        {
            //arrange
            var decimalRange = valueAndRange.DecimalRange.MakeDecimalRange();
            return decimalRange.IsNumberInThisRange(valueAndRange.Value);
        }
    }
}
