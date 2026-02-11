# Arquitectura del Backend

## Estructura del Proyecto
La aplicación Spring Boot sigue una arquitectura en capas:

```
src/main/java/com/solidaritymap/
├── config/           # Clases de configuración (Seguridad, CORS, Swagger)
├── controller/       # Controladores REST (Endpoints de la API)
├── dto/              # Objetos de Transferencia de Datos (Modelos de Solicitud/Respuesta)
├── model/            # Entidades JPA y Enums (Mapeo de Base de Datos)
├── repository/       # Interfaces de Acceso a Datos (Spring Data JPA)
├── service/          # Capas de Lógica de Negocio (ej. ExcelService)
└── util/             # Clases de utilidad y auxiliares
```

## Componentes Clave
- **CentersController**: Endpoints para operaciones CRUD y consultas de geolocalización.
- **ExcelService**: Lógica para analizar e importar archivos .xlsx.
- **SecurityConfig**: Autenticación JWT y control de acceso basado en roles.
