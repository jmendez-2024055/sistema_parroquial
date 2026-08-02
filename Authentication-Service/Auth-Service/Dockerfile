# Se construye desde la carpeta Authentication-Service/Auth-Service

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiamos TODO src/ en un solo paso (sin copias parciales previas) para evitar
# que capas intermedias escriban en una carpeta que luego otro COPY intenta fusionar.
COPY src/. src/

RUN find . -type d \( -name bin -o -name obj \) -prune -exec rm -rf {} +

RUN dotnet restore src/AuthService.Api/AuthService.Api.csproj

RUN dotnet publish src/AuthService.Api/AuthService.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-8080} dotnet AuthService.Api.dll"]