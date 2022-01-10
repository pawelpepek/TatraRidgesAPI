using System;
using System.Globalization;
using System.Windows.Data;

namespace TatraRidges.WebScraping.Converters
{
    public class WikiAdressConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return "https://pl.wikipedia.org/" + value;
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
