using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using TatraRidges.Model.Entities;
using TatraRidges.WebScraping.Model.Structures;

namespace TatraRidges.WebScraping.ViewModels
{
    public class MountainPointViewModel: INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        public bool IsChecked { get; set; }
        public string Name{ get;set;}
        public string AlternativeName { get; set; }
        public short? Evaluation { get; }
        public decimal Latitude { get; }
        public decimal Longitude { get; }

        public Uri Address { get; }

        public BasicPointInfo BasicPointInfo { get; }

        [Display(AutoGenerateField =false)]
        private readonly MountainPoint _point;

        public MountainPointViewModel(MountainPoint point, BasicPointInfo basicInfo)
        {
            IsChecked = true;
            _point = point;

            Name = _point.Name;
            AlternativeName = _point.AlternativeName;
            Evaluation = _point.Evaluation;
            Address = new Uri("https://pl.wikipedia.org" + _point.WikiAddress);

            Latitude=_point.Latitude;
            Longitude=_point.Longitude;
            BasicPointInfo=basicInfo;
        }
        public MountainPoint GetPoint()
        {
            _point.Name = Name;
            _point.AlternativeName = AlternativeName;
            return _point;
        }

    }
}
