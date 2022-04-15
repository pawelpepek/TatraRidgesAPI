namespace TatraRidges.Model.Helpers.RouteSummary.Additional
{
    internal class RowsDescriptionBuilder
    {
        private string _header;
        private readonly List<string> _rows = new();
        public RowsDescriptionBuilder AddHeader(string header)
        {
            _header = header;
            return this;
        }
        public RowsDescriptionBuilder AddRows(List<string> rows)
        {
            _rows.AddRange(rows);
            return this;
        }
        public string Build()
        {
            var rowsText = string.Join("\n", _rows);
            return _rows.Any() ? $"Występują drogi zawierające {_header}:\n{rowsText}" : "";
        }
    }
}
