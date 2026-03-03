namespace AuthService.Application.Exceptions;

public static class ErrorCodes
{
    public const string EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    public const string INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    public const string USER_NOT_FOUND = "USER_NOT_FOUND";
    public const string ROLE_NOT_FOUND = "ROLE_NOT_FOUND";
}
