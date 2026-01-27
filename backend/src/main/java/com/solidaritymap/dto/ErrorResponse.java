package com.solidaritymap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO para respuestas de error estructuradas.
 * Proporciona información clara sobre errores que ocurren en la API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    /**
     * Timestamp cuando ocurrió el error
     */
    private LocalDateTime timestamp;

    /**
     * Código de estado HTTP (400, 404, 500, etc.)
     */
    private int status;

    /**
     * Mensaje de error corto
     */
    private String error;

    /**
     * Mensaje descriptivo del error
     */
    private String message;

    /**
     * Ruta de la petición que causó el error
     */
    private String path;

    /**
     * Detalles adicionales del error (opcional)
     */
    private Map<String, Object> details;

    /**
     * Constructor sin detalles adicionales
     */
    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}
