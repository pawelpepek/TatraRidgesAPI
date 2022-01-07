using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows.Input;
using TatraRidges.WebScraping.Helpers;
using TatraRidges.WebScraping.Model.Structures;
using TTatraRidges.WebScraping.ViewModels.Helpers;

namespace TatraRidges.WebScraping.ViewModels
{
    public class MainViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler? PropertyChanged;
        public bool IsLoading { get; private set; }
        public bool IsAnyChecked { get; private set; }
        public ObservableCollection<BasicPointInfoViewModel> BasicList { get; }
            = new ObservableCollection<BasicPointInfoViewModel>();
        public ObservableCollection<CheckedPointInfo> DataList { get; }
            = new ObservableCollection<CheckedPointInfo>();

        public ICommand DownloadBasicInfoCommand { get; set; }
        public ICommand DownloadDetailInfoCommand { get; set; }

        public MainViewModel()
        {
            DownloadBasicInfoCommand = new RelayCommand(DownloadBasicInfo);
            DownloadDetailInfoCommand = new RelayCommand(DownloadDetails,()=>IsAnyChecked) ;
        }

        private async  void DownloadBasicInfo()
        {
            IsLoading = true;
            BasicList.Clear();
            ChangeIsAnyChecked(true);

            var scraper = new PointsManyScraperFactory();

            var pointsList = await scraper.GetCheckedList();
            pointsList.ForEach(ManagePoint);
            IsLoading = false;
            ChangeIsAnyChecked();
        }
        private void ManagePoint(BasicPointInfoViewModel point)
        {
            BasicList.Add(point);
            point.PropertyChanged += Point_PropertyChanged;
        }

        private void Point_PropertyChanged(object? sender, PropertyChangedEventArgs e)
        {
            if(e.PropertyName =="IsChecked")
            {
                ChangeIsAnyChecked();
            }
        }

        private async void DownloadDetails()
        {

        }
        private void ChangeIsAnyChecked(bool clear=false)
        {
            if (clear)
            {
                IsAnyChecked = false;
            }
            else
            {
                IsAnyChecked = BasicList.Any(p => p.IsChecked);
            }
            ((RelayCommand)DownloadDetailInfoCommand).OnCanExecuteChanged();
        }
    }
}
