using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Windows.Input;
using TatraRidges.Model.Entities;
using TatraRidges.WebScraping.Helpers;
using TatraRidges.WebScraping.Model;
using TatraRidges.WebScraping.Model.Scrapers;
using TatraRidges.WebScraping.Model.Structures;
using TTatraRidges.WebScraping.ViewModels.Helpers;

namespace TatraRidges.WebScraping.ViewModels
{
    public class MainViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler? PropertyChanged;
        public bool IsLoading { get; private set; }
        public bool IsLoadingBasic { get; private set; }
        public bool IsAnyChecked { get; private set; }
        public bool IsAnyCheckedForDB { get; private set; }
        public bool IsLoaded { get; set; }
        public string LoadedValue { get; private set; }
        public int LoadedIndex { get; set; }
        public int LoadedCount { get; private set; }
        public bool IsSaved { get; set; }
        public ObservableCollection<BasicPointInfoViewModel> BasicList { get; }
            = new ObservableCollection<BasicPointInfoViewModel>();
        public ObservableCollection<MountainPointViewModel> DataList { get; }
            = new ObservableCollection<MountainPointViewModel>();

        public ICommand DownloadBasicInfoCommand { get; set; }
        public ICommand DownloadDetailInfoCommand { get; set; }
        public ICommand SaveToDbContextCommand { get; set; }
        public ICommand BackCommand { get; set; }

        public MainViewModel()
        {
            DownloadBasicInfoCommand = new RelayCommand(DownloadBasicInfo);
            DownloadDetailInfoCommand = new RelayCommand(DownloadDetails, () => IsAnyChecked);
            BackCommand = new RelayCommand(()=> IsLoaded=false);
            SaveToDbContextCommand = new RelayCommand(SaveInDB, () => IsAnyCheckedForDB);
        }

        private async void DownloadBasicInfo()
        {
            IsLoading = true;
            IsLoadingBasic = true;
            BasicList.Clear();
            ChangeIsAnyChecked(true);

            var scraper = new PointsManyScraperFactory();

            var pointsList = await scraper.GetCheckedList();
            pointsList.ForEach(ManagePoint);
            IsLoading = false;
            IsLoadingBasic = false;
            ChangeIsAnyChecked();
        }
        private void ManagePoint(BasicPointInfoViewModel point)
        {
            BasicList.Add(point);
            point.PropertyChanged += Point_PropertyChanged;
        }

        private void Point_PropertyChanged(object? sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "IsChecked")
            {
                ChangeIsAnyChecked();
            }
        }

        private async void DownloadDetails()
        {
            IsSaved = false;
            IsLoading = true;
            DataList.Clear();   
            var basicPoints = BasicList.Where(p => p.IsChecked)
                                       .Select(p => p.Info)
                                       .ToList();
            LoadedIndex = 0;
            LoadedCount = basicPoints.Count;
            foreach (var basicInfo in basicPoints)
            {
                try
                {
                    var point = await PointDetailScraper.Scrape(basicInfo);
                    if (point != null)
                    {
                        var newDataPoint = new MountainPointViewModel(point, basicInfo);
                        newDataPoint.PropertyChanged += NewDataPoint_PropertyChanged;
                        DataList.Add(newDataPoint);
                    }
                }
                catch(Exception exc)
                {

                }
                LoadedIndex++;
                var percent = LoadedIndex *1m / LoadedCount;
                LoadedValue = $"{percent:0%} - {basicInfo.Name}";
            }
            IsLoaded = true;
            IsLoading = false;
            IsAnyCheckedForDB = true;
            ((RelayCommand)SaveToDbContextCommand).OnCanExecuteChanged();
        }

        private void NewDataPoint_PropertyChanged(object? sender, PropertyChangedEventArgs e)
        {
            if(e.PropertyName=="IsChecked")
            {
                IsAnyCheckedForDB = DataList.Any(p => p.IsChecked);
                ((RelayCommand)SaveToDbContextCommand).OnCanExecuteChanged();
            }
        }

        private void ChangeIsAnyChecked(bool clear = false)
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

        private void SaveInDB()
        {
            var list=DataList.Where(p => p.IsChecked).Select(p=>p.GetPoint()).ToList();
            DbContextSaver.Save(list);
            var checkedPoints= DataList.Where(p => p.IsChecked).ToList();
            checkedPoints.ForEach(p => DataList.Remove(p));

            var savedBasicInfos = BasicList.Where(i => checkedPoints.Select(p => p.BasicPointInfo).Contains(i.Info))
                                           .ToList();
            savedBasicInfos.ForEach(p => p.IsInDataBaase=true);
            savedBasicInfos.ForEach(p => p.IsChecked = false);
            IsSaved = true;
        }
    }
}
