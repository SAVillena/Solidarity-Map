package com.solidaritymap.exception;

import com.solidaritymap.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones para toda la aplicación.
 * Captura excepciones y las convierte en respuestas JSON estructuradas.
 */
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

        /**
         * Maneja excepciones cuando un recurso no se encuentra
         */
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
                        ResourceNotFoundException ex, WebRequest request) {

                log.error("❌ Recurso no encontrado: {}", ex.getMessage());

                ErrorResponse errorResponse = new ErrorResponse(
                                LocalDateTime.now(),
                                HttpStatus.NOT_FOUND.value(),
                                "Not Found",
                                ex.getMessage(),
                                request.getDescription(false).replace("uri=", ""));

                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        /**
         * Maneja errores de validación (@Valid)
         */
        @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationException(
                        org.springframework.web.bind.MethodArgumentNotValidException ex, WebRequest request) {

                log.error("❌ Error de validación: {}", ex.getMessage());

                Map<String, String> errors = new HashMap<>();
                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

                ErrorResponse errorResponse = new ErrorResponse(
                                LocalDateTime.now(),
                                HttpStatus.BAD_REQUEST.value(),
                                "Validation Error",
                                "Errores de validación en los datos enviados",
                                request.getDescription(false).replace("uri=", ""));

                Map<String, Object> details = new HashMap<>();
                details.put("fieldErrors", errors);
                errorResponse.setDetails(details);

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        /**
         * Maneja errores de base de datos
         */
        @ExceptionHandler(DatabaseException.class)
        public ResponseEntity<ErrorResponse> handleDatabaseException(
                        DatabaseException ex, WebRequest request) {

                log.error("❌ Error de base de datos: {}", ex.getMessage(), ex);

                ErrorResponse errorResponse = new ErrorResponse(
                                LocalDateTime.now(),
                                HttpStatus.SERVICE_UNAVAILABLE.value(),
                                "Database Error",
                                "Error al conectar con la base de datos. Por favor verifica que PostgreSQL esté corriendo y la extensión PostGIS esté instalada.",
                                request.getDescription(false).replace("uri=", ""));

                Map<String, Object> details = new HashMap<>();
                details.put("originalMessage", ex.getMessage());
                details.put("suggestion", "Ejecuta: CREATE EXTENSION IF NOT EXISTS postgis;");
                errorResponse.setDetails(details);

                return new ResponseEntity<>(errorResponse, HttpStatus.SERVICE_UNAVAILABLE);
        }

        /**
         * Maneja argumentos inválidos
         */
        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
                        IllegalArgumentException ex, WebRequest request) {

                log.error("❌ Argumento inválido: {}", ex.getMessage());

                ErrorResponse errorResponse = new ErrorResponse(
                                LocalDateTime.now(),
                                HttpStatus.BAD_REQUEST.value(),
                                "Bad Request",
                                ex.getMessage(),
                                request.getDescription(false).replace("uri=", ""));

                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        /**
         * Maneja errores de archivo demasiado grande
         */
        @ExceptionHandler(MaxUploadSizeExceededException.class)
        public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceeded(
                        MaxUploadSizeExceededException ex, WebRequest request) {

                log.error("❌ Archivo demasiado grande: {}", ex.getMessage());

                ErrorResponse errorResponse = new ErrorResponse(
                                LocalDateTime.now(),
                                HttpStatus.PAYLOAD_TOO_LARGE.value(),
                                "File Too Large",
                                "El archivo Excel excede el tamaño máximo permitido (10MB). Por favor sube un archivo más pequeño.",
                                request.getDescription(false).replace("uri=", ""));

                return new ResponseEntity<>(errorResponse, HttpStatus.PAYLOAD_TOO_LARGE);
        }

        /**
         * Maneja errores de I/O (lectura de archivos)
         */
        @ExceptionHandler(IOException.class)
        public ResponseEntity<ErrorResponse> handleIOException(
                        IOException ex, WebRequest request) {

                log.error("❌ Error de I/O: {}", ex.getMessage(), ex);

                ErrorResponse errorResponse = new ErrorResponse(
                                LocalDateTime.now(),
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "File Processing Error",
                                "Error al procesar el archivo. Asegúrate de que sea un archivo Excel válido (.xlsx).",
                                request.getDescription(false).replace("uri=", ""));

                Map<String, Object> details = new HashMap<>();
                details.put("originalMessage", ex.getMessage());
                errorResponse.setDetails(details);

                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        /**
         * Maneja cualquier otra excepción no capturada
         */
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGlobalException(
                        Exception ex, WebRequest request) {

                log.error("❌ Error inesperado: {}", ex.getMessage(), ex);

                ErrorResponse errorResponse = new ErrorResponse(
                                LocalDateTime.now(),
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "Internal Server Error",
                                "Ocurrió un error inesperado en el servidor. Por favor revisa los logs para más detalles.",
                                request.getDescription(false).replace("uri=", ""));

                Map<String, Object> details = new HashMap<>();
                details.put("type", ex.getClass().getSimpleName());
                details.put("originalMessage", ex.getMessage());
                errorResponse.setDetails(details);

                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
