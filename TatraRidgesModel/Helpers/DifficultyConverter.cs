namespace TatraRidges.Model.Helpers
{
    public class DifficultyConverter
    {
        private readonly TatraDbContext _dbContext;
        private readonly List<Difficulty> _difficulties;
        private readonly List<DifficultyDetail> _difficultiesDetails;

        public DifficultyConverter(TatraDbContext context)
        {
            _dbContext = context;
            _difficulties = _dbContext.Difficulties.ToList();
            _difficultiesDetails = _dbContext.DifficultyDetails.ToList();
        }

        public (Difficulty difficulty, DifficultyDetail detail) GetDifficultyFromText(string text)
        {
            var signs = new char[] { '-', '+' };
            var parts = text.Split(signs);
            var difficulty = _difficulties.FirstOrDefault(d => d.Text == parts[0]);
            if (difficulty == null)
            {
                throw new Exception("Unknown difficulty");
            }
            else
            {
                var sign = parts.Length == 2 ? parts[1] : "";
                var detail =  _difficultiesDetails.FirstOrDefault(d => d.Sign == sign);
                if (detail == null)
                {
                    throw new Exception("Unknown detail difficulty");
                }
                else
                {
                    return (difficulty, detail);
                }
            }
        }
        public static decimal GetValueForDifficulty(Difficulty difficulty, DifficultyDetail detail)
        {
            var difficultyValue = Convert.ToDecimal(difficulty.Id);
            var detailValue= detail.Id < 2 ? detail.Id * 0.333m : -0.333m;

            return difficultyValue + detailValue;
        }
        public static string GetDifficultyText(Difficulty difficulty, DifficultyDetail detail) 
            => difficulty.Text + detail.Sign;
    }
}
