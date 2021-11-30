namespace TatraRidges.Model.Helpers
{
    public static class DifficultyConverter
    {
        public static decimal DifficultyValue(Difficulty difficulty, DifficultyDetail detail)
        {
            return difficulty.Id+ GetValueFromDetail(detail);  
        }

        private static decimal GetValueFromDetail(DifficultyDetail detail)
        {
            return detail.Sign == string.Empty
                ? 0
                : GetValueFromNotEmptyDetail(detail);

        }

        private static decimal GetValueFromNotEmptyDetail(DifficultyDetail detail) 
            => detail.Sign == "+" ? 0.33m : -0.33m;
    }
}
