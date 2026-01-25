# Backend Architecture

## Project Structure
The Spring Boot application follows a layered architecture:

```
src/main/java/com/solidaritymap/
├── config/           # Configuration classes (Security, CORS, Swagger)
├── controller/       # REST Controllers (API endpoints)
├── dto/              # Data Transfer Objects (Request/Response models)
├── model/            # JPA Entities and Enums (Database mapping)
├── repository/       # Data Access Interfaces (Spring Data JPA)
├── service/          # Business Logic Layers (e.g., ExcelService)
└── util/             # Utility classes and helpers
```

## Key Components
- **CentersController**: Endpoints for CRUD and geolocation queries.
- **ExcelService**: Logic for parsing and importing .xlsx files.
- **SecurityConfig**: JWT authentication and role-based access control.
