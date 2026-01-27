package com.solidaritymap.validator;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

/**
 * Validador para archivos Excel
 * SRP: Responsabilidad única de validar archivos
 */
@Component
public class ExcelValidator {

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("xlsx", "xls");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel");

    /**
     * Valida que el archivo Excel sea válido
     */
    public void validate(MultipartFile file) {
        validateNotNull(file);
        validateNotEmpty(file);
        validateFileType(file);
        validateFileSize(file);
    }

    private void validateNotNull(MultipartFile file) {
        if (file == null) {
            throw new IllegalArgumentException("El archivo no puede ser nulo");
        }
    }

    private void validateNotEmpty(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }
    }

    private void validateFileType(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null || filename.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del archivo no es válido");
        }

        String extension = getFileExtension(filename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException(
                    String.format("Tipo de archivo no permitido: %s. Extensiones permitidas: %s",
                            extension, ALLOWED_EXTENSIONS));
        }

        // Validar MIME type también para mayor seguridad
        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(
                    "Tipo de contenido no válido para archivo Excel");
        }
    }

    private void validateFileSize(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("El archivo excede el tamaño máximo permitido de %d MB",
                            MAX_FILE_SIZE / (1024 * 1024)));
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }
}
