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
        public string Name { get; }
        public string Url { get; }
        public PointType Type{get;}

        public BasicPointInfoViewModel(bool isInBase, BasicPointInfo info )
        {
            Name = info.Name;
            Url= info.Url;
            IsInDataBaase = isInBase;
            IsChecked = !isInBase;
            Type = info.Type;
        }
    }
}
