package com.solidaritymap.dto;

import com.solidaritymap.model.CenterType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

/**
 * DTO para crear un nuevo centro.
 * Validaciones según reglas de negocio.
 */
@Schema(description = "Datos para crear o sugerir un nuevo centro de solidaridad")
@Data
public class CreateCenterRequest {

    @Schema(description = "Nombre del centro", example = "Centro de Acopio Norte", minLength = 3, maxLength = 100)
    @NotBlank(message = "El nombre es requerido")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String name;

    @Schema(description = "Dirección completa del centro", example = "Av. Independencia 1234, Santiago", minLength = 5, maxLength = 200)
    @NotBlank(message = "La dirección es requerida")
    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    private String address;

    @Schema(description = "Teléfono de contacto (formato Chile)", example = "+56912345678")
    @Pattern(regexp = "^(\\+?56)?\\s?[0-9]{8,9}$", message = "Formato de teléfono inválido (ej: +56912345678)")
    private String contactNumber;

    @Schema(description = "Tipo de centro", example = "ACOPIO", required = true)
    @NotNull(message = "El tipo de centro es requerido")
    private CenterType type;

    @Schema(description = "Latitud geográfica", example = "-33.4489", minimum = "-90", maximum = "90", required = true)
    @NotNull(message = "La latitud es requerida")
    @DecimalMin(value = "-90.0", message = "La latitud debe estar entre -90 y 90")
    @DecimalMax(value = "90.0", message = "La latitud debe estar entre -90 y 90")
    private Double latitude;

    @Schema(description = "Longitud geográfica", example = "-70.6693", minimum = "-180", maximum = "180", required = true)
    @NotNull(message = "La longitud es requerida")
    @DecimalMin(value = "-180.0", message = "La longitud debe estar entre -180 y 180")
    @DecimalMax(value = "180.0", message = "La longitud debe estar entre -180 y 180")
    private Double longitude;

    @Schema(description = "Estado de urgencia: 0=Normal, 1=Moderado, 2=Crítico", example = "0", minimum = "0", maximum = "2", defaultValue = "0")
    @Min(value = 0, message = "El estado de urgencia debe ser 0, 1 o 2")
    @Max(value = 2, message = "El estado de urgencia debe ser 0, 1 o 2")
    private Integer urgencyStatus = 0;

    @Schema(description = "Horario de atención en formato JSON", example = "{\"lunes\":\"09:00-18:00\",\"martes\":\"09:00-18:00\"}")
    private String operatingHours;

    @Schema(description = "Lista de insumos necesarios", example = "[\"Ropa de abrigo\",\"Alimentos no perecederos\"]")
    private List<String> suppliesNeeded;
}
