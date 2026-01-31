package com.solidaritymap.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO para actualizar solo el estado de urgencia de un centro
 * Usado en PATCH /api/centers/{id}/urgency
 */
@Data
public class UpdateUrgencyRequest {

    @NotNull(message = "El estado de urgencia es requerido")
    @Min(value = 0, message = "El estado de urgencia debe ser 0, 1 o 2")
    @Max(value = 2, message = "El estado de urgencia debe ser 0, 1 o 2")
    private Integer urgencyStatus;
}
