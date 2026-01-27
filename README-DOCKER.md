# 🐳 Guía de Docker - Solidarity Map

Esta guía te explica cómo ejecutar el proyecto completo usando Docker, sin necesidad de instalar Java, Maven, Node.js ni PostgreSQL en tu sistema.

## 📋 Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose
- Docker Compose (incluido con Docker Desktop)

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y ajusta los valores si es necesario:

```bash
cp .env.example .env
```

El archivo `.env` ya viene con valores por defecto que funcionan. Solo necesitas modificarlo si quieres cambiar puertos o credenciales.

### 2. Construir e Iniciar los Servicios

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up -d
```

Este comando:
- 📦 Construye las imágenes Docker para backend y frontend
- 🗄️ Descarga la imagen de PostgreSQL con PostGIS
- 🚀 Inicia los 3 servicios (base de datos, backend, frontend)
- ✅ Espera a que cada servicio esté listo antes de iniciar el siguiente

**Primera vez:** La construcción puede tomar 5-10 minutos.

### 3. Verificar que Todo Funciona

Verifica el estado de los servicios:

```bash
docker-compose ps
```

Todos los servicios deberían estar en estado `Up`.

### 4. Acceder a la Aplicación

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **Base de Datos:** localhost:5432

## 🛠️ Comandos Útiles

### Ver Logs

Ver todos los logs:
```bash
docker-compose logs -f
```

Ver logs de un servicio específico:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Detener los Servicios

Detener sin eliminar contenedores:
```bash
docker-compose stop
```

Detener y eliminar contenedores (los datos persisten):
```bash
docker-compose down
```

Detener y eliminar TODO (incluyendo datos):
```bash
docker-compose down -v
```

### Reiniciar un Servicio

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
```

### Reconstruir Imágenes

Si haces cambios en el código, necesitas reconstruir:

```bash
docker-compose build
docker-compose up -d
```

O para forzar reconstrucción completa:
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Ejecutar Comandos en un Contenedor

Acceder a la base de datos (PostgreSQL):
```bash
docker-compose exec db psql -U solidarity_user -d solidarity_map
```

Verificar PostGIS:
```bash
docker-compose exec db psql -U solidarity_user -d solidarity_map -c "SELECT PostGIS_Version();"
```

Acceder al shell del backend:
```bash
docker-compose exec backend sh
```

## 🔧 Desarrollo

### Backend (Spring Boot)

Los cambios en el código Java requieren reconstruir la imagen:

```bash
docker-compose build backend
docker-compose up -d backend
```

### Frontend (React + Vite)

Los cambios en el código React requieren reconstruir la imagen:

```bash
docker-compose build frontend
docker-compose up -d frontend
```

### Base de Datos

Para ejecutar migraciones o scripts SQL:

```bash
docker-compose exec db psql -U solidarity_user -d solidarity_map -f /ruta/al/script.sql
```

O copiar un archivo al contenedor y ejecutarlo:

```bash
docker cp mi_script.sql solidarity-map-db:/tmp/
docker-compose exec db psql -U solidarity_user -d solidarity_map -f /tmp/mi_script.sql
```

## 📊 Estructura de Servicios

```
┌─────────────────┐
│   Frontend      │  Puerto 3000
│  (React+Vite)   │
└────────┬────────┘
         │
         │ API calls
         ▼
┌─────────────────┐
│    Backend      │  Puerto 8080
│  (Spring Boot)  │
└────────┬────────┘
         │
         │ JDBC
         ▼
┌─────────────────┐
│   Database      │  Puerto 5432
│ (PostgreSQL +   │
│    PostGIS)     │
└─────────────────┘
```

## 🔍 Solución de Problemas

### El backend no se conecta a la base de datos

1. Verifica que la base de datos esté corriendo:
   ```bash
   docker-compose ps db
   ```

2. Revisa los logs de la base de datos:
   ```bash
   docker-compose logs db
   ```

3. Verifica las variables de entorno:
   ```bash
   docker-compose config
   ```

### El frontend no puede llamar al backend

1. Asegúrate de que el backend esté corriendo:
   ```bash
   docker-compose ps backend
   docker-compose logs backend
   ```

2. La configuración de nginx debería hacer proxy de `/api/` al backend automáticamente.

### Puerto ya en uso

Si algún puerto está ocupado, edita el archivo `.env` y cambia los puertos:

```env
FRONTEND_PORT=3001
BACKEND_PORT=8081
DB_PORT=5433
```

Luego reinicia:
```bash
docker-compose down
docker-compose up -d
```

### Limpiar todo y empezar de cero

```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes construidas
docker-compose rm -f
docker rmi solidarity-map-backend solidarity-map-frontend

# Reconstruir desde cero
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Notas Importantes

- **Datos persistentes:** Los datos de PostgreSQL se guardan en un volumen Docker (`postgres_data`), por lo que persisten entre reinicios.
- **Variables de entorno:** El archivo `.env` NO debe subirse a Git (ya está en `.gitignore`).
- **Salud de servicios:** Docker Compose espera a que cada servicio esté "saludable" antes de iniciar el siguiente.
- **Logs:** Los logs se muestran en tiempo real con `docker-compose logs -f`.

## 🎯 Próximos Pasos

1. Inicia los servicios: `docker-compose up -d`
2. Verifica que todo funcione: `docker-compose ps`
3. Abre el frontend: http://localhost:3000
4. ¡Comienza a desarrollar! 🚀

Para más información sobre Docker, consulta la [documentación oficial de Docker](https://docs.docker.com/).
