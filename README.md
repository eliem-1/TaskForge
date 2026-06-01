# TaskForge

TaskForge is a full-stack task management project composed of:

- `Backend/` - ASP.NET Core backend with controllers, EF Core data access, and migrations.
- `Frontend/` - React + TypeScript + Vite frontend app.

## Getting started

### Backend

1. Open a terminal in `Backend/`
2. Restore and run the application:

```powershell
cd Backend
dotnet restore
dotnet run
```

3. The API will typically be available at `https://localhost:5001` or `http://localhost:5000` depending on your launch settings.

### Frontend

1. Open a terminal in `Frontend/`
2. Install dependencies and start the development server:

```powershell
cd Frontend
npm install
npm run dev
```

3. Open the URL shown by Vite (usually `http://localhost:5173`).

## Project structure

- `Backend/Controllers/` - Web API controllers.
- `Backend/Data/` - Entity Framework Core context and seeding logic.
- `Backend/Models/` - Domain models for tasks and users.
- `Frontend/src/` - React application source files.

## Notes

- The backend uses EF Core migrations under `Backend/Migrations/`.
- The frontend is built with Vite and TypeScript.
- Update `appsettings.json` and `appsettings.Development.json` in the backend as needed for database or API settings.
