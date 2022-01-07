using System;
using System.Globalization;
using System.Windows.Data;

namespace TatraRidges.WebScraping.Converters
{
    public class InDataBaseConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return (bool)value ? "Zapisany" : "";
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
