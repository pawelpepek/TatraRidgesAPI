using System;
using System.Windows.Input;

namespace TatraRidges.WebScraping.Helpers
{
    public class RelayCommand : ICommand
    {
        private readonly Action _action;
        private readonly Func<bool> _canExecute = null;

        public event EventHandler CanExecuteChanged;


        public RelayCommand(Action action) => _action = action;
        public RelayCommand(Action action, Func<bool> canExecute)
        {
            _action = action;
            _canExecute = canExecute;
        }

        public void OnCanExecuteChanged() => CanExecuteChanged?.Invoke(this, EventArgs.Empty);
        public bool CanExecute(object parameter) => _canExecute == null || _canExecute();

        public void Execute(object parameter) => _action();
    }
}
