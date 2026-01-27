package com.solidaritymap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para coordenadas geográficas
 * Simplifica la serialización de ubicaciones
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationDTO {
    private double latitude;
    private double longitude;
}
