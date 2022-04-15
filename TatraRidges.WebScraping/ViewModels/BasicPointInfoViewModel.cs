using System.ComponentModel;
using TatraRidges.WebScraping.Model.Structures;

namespace TatraRidges.WebScraping.ViewModels
{
    public class BasicPointInfoViewModel : INotifyPropertyChanged
    {
        #pragma warning disable 67
        public event PropertyChangedEventHandler PropertyChanged;
        #pragma warning restore 67

        public bool IsChecked { get; set; }
        public bool IsInDataBaase { get; set; }
        public BasicPointInfo Info { get; private set; }

        public BasicPointInfoViewModel(bool isInBase, BasicPointInfo info)
        {
            IsInDataBaase = isInBase;
            IsChecked = !isInBase;
            Info = info;
        }
    }
}
