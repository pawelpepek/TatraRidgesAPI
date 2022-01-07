using TatraRidges.Model.Dtos;

namespace TatraRidges.WebScraping.Model.Structures
{
    public class CheckedPointInfo
    {
        public bool IsChecked { get; set; }
        public MountainPointBasicDto Info { get; }

        public CheckedPointInfo(MountainPointBasicDto info)
        {
            IsChecked = true;
            Info = info;
        }
    }
}
