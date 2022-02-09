using TatraRidges.Model.Dtos;

namespace TatraRidges.Model.Helpers
{
    public class DifficultyHandler
    {
        private readonly TatraDbContext _dbContext;
        private readonly List<Difficulty> _difficulties;
        private readonly List<DifficultyDetail> _difficultiesDetails;

        public DifficultyHandler(TatraDbContext context)
        {
            _dbContext = context;
            _difficulties = _dbContext.Difficulties.ToList();
            _difficultiesDetails = _dbContext.DifficultyDetails.ToList();
        }

        public DifficultyDto GetTextFromDecimal(decimal value)
        {
            var difficulties = GetAllDifficulties();

            return difficulties.OrderBy(d => Math.Abs(d.Value - value)).First();
        }

        public List<DifficultyDto> GetAllDifficulties()
        {

            var allDifficulties = new List<DifficultyDto>();

            var noDifficulties = _difficulties.Where(d => d.Id == 0)
                                             .SelectMany(d => GetDifficultyOptions(d))
                                             .ToList();

            var littleDifficulties = _difficulties.Where(d => d.Id == 1 || d.Id == 2)
                                                 .Select(d => new DifficultyDto() { Text = d.Text, Value = Convert.ToDecimal(d.Id) })
                                                 .ToList();

            var greaterDifficulties = _difficulties.Where(d => d.Id > 2)
                                                  .SelectMany(d => GetDifficultyOptions(d))
                                                  .ToList();

            allDifficulties.AddRange(noDifficulties);
            allDifficulties.AddRange(littleDifficulties);
            allDifficulties.AddRange(greaterDifficulties);

            return allDifficulties.OrderBy(d => d.Value).ToList();
        }

        private List<DifficultyDto> GetDifficultyOptions(Difficulty difficulty)
        {
            return _difficultiesDetails.Select(d => GetDifficultyDto(difficulty,d))
                                       .ToList();
        }

        private static DifficultyDto GetDifficultyDto(Difficulty difficulty, DifficultyDetail detail)
        {
            return new DifficultyDto()
            {
                Text = DifficultyConverter.GetDifficultyText(difficulty, detail),
                Value = DifficultyConverter.GetValueForDifficulty(difficulty, detail)
            };
        }

    }
}
