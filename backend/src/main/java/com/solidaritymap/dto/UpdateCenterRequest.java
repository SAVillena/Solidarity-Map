package com.solidaritymap.dto;

import com.solidaritymap.model.CenterType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

/**
 * DTO para actualizar un centro existente
 * Todos los campos son opcionales para permitir actualizaciones parciales con
 * PUT
 */
@Data
public class UpdateCenterRequest {

    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String name;

    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    private String address;

    @Pattern(regexp = "^(\\+?56)?\\s?[0-9]{8,9}$", message = "Formato de teléfono inválido (ej: +56912345678)")
    private String contactNumber;

    private CenterType type;

    @DecimalMin(value = "-90.0", message = "La latitud debe estar entre -90 y 90")
    @DecimalMax(value = "90.0", message = "La latitud debe estar entre -90 y 90")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "La longitud debe estar entre -180 y 180")
    @DecimalMax(value = "180.0", message = "La longitud debe estar entre -180 y 180")
    private Double longitude;

    @Min(value = 0, message = "El estado de urgencia debe ser 0, 1 o 2")
    @Max(value = 2, message = "El estado de urgencia debe ser 0, 1 o 2")
    private Integer urgencyStatus;

    private String operatingHours; // JSON string
    private List<String> suppliesNeeded; // Cambiado de String a List<String> para aceptar array JSON
}
