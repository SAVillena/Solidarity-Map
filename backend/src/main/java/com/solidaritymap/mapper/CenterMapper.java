package com.solidaritymap.mapper;

import com.solidaritymap.dto.CenterDTO;
import com.solidaritymap.dto.LocationDTO;
import com.solidaritymap.model.Center;
import org.locationtech.jts.geom.Point;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre entidades Center y DTOs
 * Sigue SRP: responsabilidad única de mapeo
 */
public class CenterMapper {

    /**
     * Convierte una entidad Center a DTO
     */
    public static CenterDTO toDTO(Center center) {
        if (center == null) {
            return null;
        }

        return CenterDTO.builder()
                .id(center.getId())
                .name(center.getName())
                .address(center.getAddress())
                .contactNumber(center.getContactNumber())
                .type(center.getType())
                .urgencyStatus(center.getUrgencyStatus())
                .status(center.getStatus())
                .location(toLocationDTO(center.getLocation()))
                .operatingHours(center.getOperatingHours())
                .suppliesNeeded(center.getSuppliesNeeded())
                .createdAt(center.getCreatedAt())
                .updatedAt(center.getUpdatedAt())
                .build();
    }

    /**
     * Convierte una lista de entidades a DTOs
     */
    public static List<CenterDTO> toDTOList(List<Center> centers) {
        if (centers == null) {
            return List.of();
        }
        return centers.stream()
                .map(CenterMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convierte un Point de JTS a LocationDTO simple
     */
    private static LocationDTO toLocationDTO(Point point) {
        if (point == null) {
            return null;
        }
        // Point almacena como (lon, lat) en JTS
        return new LocationDTO(
                point.getY(), // latitude
                point.getX() // longitude
        );
    }

    /**
     * Nota: No se incluye fromDTO porque los centros se crean
     * desde Excel o formularios, no desde DTOs
     */
}
