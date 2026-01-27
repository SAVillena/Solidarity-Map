package com.solidaritymap.exception;

/**
 * Excepción personalizada para errores de base de datos.
 * Se lanza cuando hay problemas de conexión o consultas a la base de datos.
 */
public class DatabaseException extends RuntimeException {

    public DatabaseException(String message) {
        super(message);
    }

    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
