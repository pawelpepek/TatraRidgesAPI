export const getMessage=(statusCode:number)=>{
    switch(statusCode)
    {
        case 400:
            return "Nie ma takiej strony";
        case 401:
            return "Brak uprawnień";
        case 404:
            return "Brak wyników";
        case 406:
            return "Niepoprawne dane";
        case 409:
            return "Konflikt";
        default:
            return "";    
    }
}