using System.ComponentModel;
using TatraRidges.Model.Entities;
using TatraRidges.WebScraping.Model.Structures;

namespace TatraRidges.WebScraping.ViewModels
{
    public class BasicPointInfoViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler? PropertyChanged;

        public bool IsChecked { get; set; }
        public bool IsInDataBaase { get; set; }
        public BasicPointInfo Info { get; private set; }

        public BasicPointInfoViewModel(bool isInBase, BasicPointInfo info )
        {
            IsInDataBaase = isInBase;
            IsChecked = !isInBase;
            Info = info;
        }
    }
}
