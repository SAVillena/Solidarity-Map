package com.solidaritymap.service;

import com.solidaritymap.dto.CenterDTO;
import com.solidaritymap.exception.DatabaseException;
import com.solidaritymap.mapper.CenterMapper;
import com.solidaritymap.model.Center;
import com.solidaritymap.model.CenterType;
import com.solidaritymap.repository.CenterRepository;
import com.solidaritymap.validator.CoordinateValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio para gestionar operaciones de centros
 * Refactorizado para usar DTOs y validators (SOLID)
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CenterService {

    private final CenterRepository centerRepository;
    private final CoordinateValidator coordinateValidator;

    /**
     * Obtiene todos los centros, opcionalmente filtrados por tipo
     * 
     * @param type Tipo de centro (ACOPIO o VETERINARIA), null para todos
     * @return Lista de centros como DTOs
     */
    public List<CenterDTO> getAllCenters(CenterType type) {
        try {
            log.info("📋 Obteniendo todos los centros" + (type != null ? " de tipo: " + type : ""));

            List<Center> centers = (type != null)
                    ? centerRepository.findByType(type)
                    : centerRepository.findAll();

            log.info("✅ Encontrados {} centros", centers.size());
            return CenterMapper.toDTOList(centers);

        } catch (DataAccessException e) {
            log.error("❌ Error de base de datos al obtener centros: {}", e.getMessage());
            throw new DatabaseException(
                    "Error al consultar la base de datos. Verifica que PostgreSQL esté corriendo y PostGIS esté instalado.",
                    e);
        }
    }

    /**
     * Obtiene centros cercanos a una ubicación
     * 
     * @param lat    Latitud
     * @param lon    Longitud
     * @param radius Radio de búsqueda en metros
     * @return Lista de centros cercanos como DTOs
     */
    public List<CenterDTO> getNearestCenters(double lat, double lon, double radius) {
        try {
            log.info("📍 Buscando centros cercanos a [{}, {}] en un radio de {}m", lat, lon, radius);

            // Validar usando el validator (SRP)
            coordinateValidator.validate(lat, lon);
            coordinateValidator.validateRadius(radius);

            List<Center> centers = centerRepository.findNearest(lat, lon, radius);
            log.info("✅ Encontrados {} centros cercanos", centers.size());
            return CenterMapper.toDTOList(centers);

        } catch (DataAccessException e) {
            log.error("❌ Error de base de datos al buscar centros cercanos: {}", e.getMessage());
            throw new DatabaseException(
                    "Error al realizar búsqueda espacial. Verifica que la extensión PostGIS esté instalada en PostgreSQL.",
                    e);
        }
    }

    /**
     * Cuenta el total de centros
     */
    public long countCenters() {
        return centerRepository.count();
    }

    /**
     * Cuenta centros por tipo
     */
    public long countByType(CenterType type) {
        return centerRepository.findByType(type).size();
    }
}
