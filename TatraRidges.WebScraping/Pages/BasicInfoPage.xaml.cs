using System.Windows.Controls;
using TatraRidges.WebScraping.ViewModels;

namespace TatraRidges.WebScraping
{
    /// <summary>
    /// Interaction logic for BasicInfoPage.xaml
    /// </summary>
    public partial class BasicInfoPage : Page
    {
        public BasicInfoPage()
        {
            InitializeComponent();

            DataContext = new MainViewModel();
        }
    }
}
