package com.solidaritymap.exception;

/**
 * Excepción personalizada para cuando un recurso no se encuentra.
 * Se lanza cuando se busca un centro por ID y no existe.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
