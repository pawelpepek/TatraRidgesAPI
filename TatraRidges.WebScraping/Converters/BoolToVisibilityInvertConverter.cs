using System;
using System.Globalization;
using System.Windows.Data;

namespace TatraRidges.WebScraping.Converters
{
    public class BoolToVisibilityInvertConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        => !(bool)value ? "Visible" : "Hidden";

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}