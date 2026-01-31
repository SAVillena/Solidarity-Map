-- Migration para crear tabla users y usuario admin por defecto
-- Versión 2 - Autenticación JWT

-- Crear tabla users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Usuario admin será creado automáticamente por DataInitializer.java
-- con el PasswordEncoder correcto al iniciar la aplicación

-- Log de migration exitosa
SELECT 'Migration V2 ejecutada: Tabla users creada y admin configurado' AS info;
