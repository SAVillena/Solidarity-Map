# Solidarity Map

Solidarity Map es una aplicación de pila completa diseñada para mapear y gestionar centros de solidaridad. Cuenta con un mapa interactivo para visualizar ubicaciones, capacidades de importación de archivos Excel para la gestión masiva de datos y un sistema de autenticación seguro.

## 🚀 Características

- **Mapa Interactivo**: Visualiza los centros de solidaridad en un mapa dinámico utilizando Leaflet.
- **Gestión de Centros**: Operaciones CRUD completas para centros de solidaridad.
- **Importación de Excel**: Carga masiva de centros a través de archivos `.xlsx`.
- **Autenticación**: Autenticación segura basada en JWT para tareas administrativas.
- **Diseño Responsivo**: Interfaz moderna construida con React y Tailwind CSS.

## 🛠 Tecnologías Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.2.1**
- **PostgreSQL** (con la extensión **PostGIS** para datos espaciales)
- **Hibernate / JPA**
- **Lombok**
- **Flyway** (Migración de bases de datos)
- **Maven**

### Frontend
- **React 19**
- **Vite**
- **Tailwind CSS**
- **Leaflet / React-Leaflet**
- **Axios**

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente:
- [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Node.js](https://nodejs.org/) (se recomienda v18+)
- [Docker](https://www.docker.com/) y Docker Compose (opcional, para ejecución en contenedores)
- [PostgreSQL](https://www.postgresql.org/) (si se ejecuta localmente sin Docker)

## ⚙️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/SAVillena/Solidarity-Map.git
cd Solidarity-Map
```

### 2. Configuración del Entorno

Crea un archivo `.env` en el directorio **raíz** (o confía en `application.properties` por defecto para desarrollo local):

```env
DB_URL=jdbc:postgresql://localhost:5432/solidarity_map
DB_USERNAME=tu_usuario_db
DB_PASSWORD=tu_contraseña_db
```

### 3. Ejecutar con Docker (Recomendado)

La forma más sencilla de ejecutar la pila completa (Base de datos + Backend + Frontend) es usando Docker Compose.

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Base de Datos**: Puerto 5432

### 4. Ejecutar Localmente (Configuración Manual)

#### Base de Datos
Asegúrate de tener una base de datos PostgreSQL llamada `solidarity_map` y habilita la extensión PostGIS:
```sql
CREATE DATABASE solidarity_map;
\c solidarity_map
CREATE EXTENSION postgis;
```

#### Backend
1. Navega al directorio `backend`:
   ```bash
   cd backend
   ```
2. Configura `src/main/resources/application.properties` o establece las variables de entorno.
3. Ejecuta la aplicación:
   ```bash
   mvn spring-boot:run
   ```
   El backend iniciará en `http://localhost:8080`.

#### Frontend
1. Navega al directorio `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   El frontend iniciará en `http://localhost:5173` (puerto por defecto de Vite).

## 📂 Estructura del Proyecto

```
Solidarity-Map/
├── backend/            # Aplicación Spring Boot
│   ├── src/main/java   # Código fuente
│   ├── src/main/resources # Configuración y scripts SQL
│   └── Dockerfile
├── frontend/           # Aplicación React
│   ├── src/            # Componentes, páginas, hooks
│   └── Dockerfile
├── docker-compose.yml  # Orquestación Docker
└── README.md           # Documentación del Proyecto
```

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor, haz un fork del repositorio y envía un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
