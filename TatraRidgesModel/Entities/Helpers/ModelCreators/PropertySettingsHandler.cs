using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TatraRidges.Model.Entities.Helpers.ModelCreators
{
    internal static class PropertySettingsHandler
    {
        internal static void SettingsForDecimal(this PropertyBuilder<decimal> property)
        {
            property.HasColumnType("decimal(8,6)").IsRequired();
        }
        internal static void SettingsForString(this PropertyBuilder<string> property, int maxSigns)
        {
            property.HasMaxLength(maxSigns).IsRequired();
        }
    }
}
