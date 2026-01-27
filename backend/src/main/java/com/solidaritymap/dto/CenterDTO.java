package com.solidaritymap.dto;

import com.solidaritymap.model.CenterType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO para transferir información de centros al frontend
 * Separado de la entidad para controlar exactamente qué se serializa
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CenterDTO {
    private UUID id;
    private String name;
    private String address;
    private String contactNumber;
    private CenterType type;
    private Integer urgencyStatus;
    private LocationDTO location;
    private String operatingHours;
    private String suppliesNeeded;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
