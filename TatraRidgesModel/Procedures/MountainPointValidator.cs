using TatraRidges.Model.Dtos;
using TatraRidges.Model.Helpers;

namespace TatraRidges.Model.Procedures
{
    public class MountainPointValidator
    {
        private readonly DecimalRange _latitudeRange = new(49.12m, 49.29m);
        private readonly DecimalRange _longitudeRange = new(19.91m, 20.29m);

        private readonly decimal _latitude;
        private readonly decimal _longitude;

        public MountainPointValidator(PointGPSDto coordinates)
        {
            _latitude = coordinates.Latitude;
            _longitude = coordinates.Longitude;
        }

        public bool IsCoordinatesValid()
        {
            return IsLatitudeValid() && IsLongitudeValid();
        }

        public string ErrorMessage()
        {
            var messages = new List<string>();
            if (!IsLatitudeValid()) 
            {
                messages.Add(_latitudeRange.MessageForValue("Szerokość geograficzna"));
            }
            if (!IsLongitudeValid())
            {
                messages.Add(_longitudeRange.MessageForValue("Długość geograficzna"));
            }
            return string.Join("\n", messages);
        }

        private bool IsLatitudeValid() => _latitudeRange.IsNumberInThisRange(_latitude);
        private bool IsLongitudeValid() => _longitudeRange.IsNumberInThisRange(_longitude);
    }
}
