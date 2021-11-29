namespace TatraRidges.Model.Exceptions
{
    public class CyclicRidgeException : Exception
    {
        public CyclicRidgeException() : base("Nie mozna zapisać takiego połączenia ponieważ powoduje zapętlenie grani!") { }
    }
}