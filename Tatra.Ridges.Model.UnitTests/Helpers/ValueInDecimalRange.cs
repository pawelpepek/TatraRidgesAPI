﻿using TatraRidges.Model.Helpers;

namespace Tatra.Ridges.Model.UnitTests.Helpers
{
    public struct ValueInDecimalRange
    {
        public DecimalRangeForTest DecimalRange { get; private set; }
        public decimal Value { get;private set; }

        public ValueInDecimalRange(decimal value, DecimalRangeForTest decimalRange)
        {
            DecimalRange = decimalRange;
            Value = value;
        }
        public string GetInfo()=>$"Value = {Value} in <{DecimalRange.MinValue}; {DecimalRange.MaxValue}>";   
    }
}
