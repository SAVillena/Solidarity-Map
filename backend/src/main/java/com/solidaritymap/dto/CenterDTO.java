package com.solidaritymap.dto;

import com.solidaritymap.model.CenterType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO para transferir información de centros al frontend.
 * Separado de la entidad para controlar exactamente qué se serializa.
 */
@Schema(description = "Información de un centro de solidaridad")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CenterDTO {

    @Schema(description = "Identificador único del centro", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "Nombre del centro", example = "Centro de Acopio Norte")
    private String name;

    @Schema(description = "Dirección del centro", example = "Av. Independencia 1234, Santiago")
    private String address;

    @Schema(description = "Número de contacto", example = "+56912345678")
    private String contactNumber;

    @Schema(description = "Tipo de centro: ACOPIO o VETERINARIA", example = "ACOPIO")
    private CenterType type;

    @Schema(description = "Estado de urgencia: 0=Normal, 1=Moderado, 2=Crítico", example = "0")
    private Integer urgencyStatus;

    @Schema(description = "Estado de aprobación: PENDING, APPROVED, REJECTED", example = "APPROVED")
    private com.solidaritymap.model.CenterStatus status;

    @Schema(description = "Coordenadas geográficas del centro")
    private LocationDTO location;

    @Schema(description = "Horario de atención en formato JSON", example = "{\"lunes\":\"09:00-18:00\"}")
    private String operatingHours;

    @Schema(description = "Insumos necesarios", example = "Ropa de abrigo, alimentos no perecederos")
    private String suppliesNeeded;

    @Schema(description = "Fecha de creación del registro")
    private LocalDateTime createdAt;

    @Schema(description = "Fecha de última actualización")
    private LocalDateTime updatedAt;
}
