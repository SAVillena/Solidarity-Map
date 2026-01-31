package com.solidaritymap.service;

import com.solidaritymap.dto.CenterDTO;
import com.solidaritymap.exception.DatabaseException;
import com.solidaritymap.mapper.CenterMapper;
import com.solidaritymap.model.Center;
import com.solidaritymap.model.CenterType;
import com.solidaritymap.repository.CenterRepository;
import com.solidaritymap.validator.CoordinateValidator;
import com.solidaritymap.repository.CenterSpecification;
import org.springframework.data.jpa.domain.Specification;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    /**
     * Obtiene un centro por su ID
     * 
     * @param id UUID del centro
     * @return CenterDTO
     * @throws com.solidaritymap.exception.ResourceNotFoundException si no existe
     */
    public CenterDTO getCenterById(java.util.UUID id) {
        log.info("🔍 Buscando centro con ID: {}", id);

        Center center = centerRepository.findById(id)
                .orElseThrow(() -> new com.solidaritymap.exception.ResourceNotFoundException(
                        "Centro", "id", id));

        log.info("✅ Centro encontrado: {}", center.getName());
        return CenterMapper.toDTO(center);
    }

    /**
     * Crea un nuevo centro
     * 
     * @param request Datos del centro a crear
     * @return CenterDTO del centro creado
     */
    @Transactional
    public CenterDTO createCenter(com.solidaritymap.dto.CreateCenterRequest request) {
        log.info("➕ Creando nuevo centro: {}", request.getName());

        // Validar coordenadas
        coordinateValidator.validate(request.getLatitude(), request.getLongitude());

        // Crear entidad
        Center center = new Center();
        center.setName(request.getName());
        center.setAddress(request.getAddress());
        center.setContactNumber(request.getContactNumber());
        center.setType(request.getType());
        center.setUrgencyStatus(request.getUrgencyStatus());
        center.setOperatingHours(request.getOperatingHours());

        // Convertir List<String> a JSON string
        if (request.getSuppliesNeeded() != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                String suppliesJson = objectMapper.writeValueAsString(request.getSuppliesNeeded());
                center.setSuppliesNeeded(suppliesJson);
            } catch (Exception e) {
                log.error("❌ Error al convertir suppliesNeeded a JSON: {}", e.getMessage());
                throw new DatabaseException("Error al procesar los suministros necesarios");
            }
        }

        // Crear Point geometry
        org.locationtech.jts.geom.GeometryFactory geometryFactory = new org.locationtech.jts.geom.GeometryFactory(
                new org.locationtech.jts.geom.PrecisionModel(), 4326);
        org.locationtech.jts.geom.Point point = geometryFactory.createPoint(
                new org.locationtech.jts.geom.Coordinate(request.getLongitude(), request.getLatitude()));
        center.setLocation(point);

        // Guardar
        Center savedCenter = centerRepository.save(center);
        log.info("✅ Centro creado exitosamente con ID: {}", savedCenter.getId());

        return CenterMapper.toDTO(savedCenter);
    }

    /**
     * Actualiza un centro existente
     * 
     * @param id      UUID del centro a actualizar
     * @param request Datos a actualizar
     * @return CenterDTO actualizado
     * @throws com.solidaritymap.exception.ResourceNotFoundException si no existe
     */
    @Transactional
    public CenterDTO updateCenter(java.util.UUID id, com.solidaritymap.dto.UpdateCenterRequest request) {
        log.info("📝 Actualizando centro con ID: {}", id);

        Center center = centerRepository.findById(id)
                .orElseThrow(() -> new com.solidaritymap.exception.ResourceNotFoundException(
                        "Centro", "id", id));

        // Actualizar campos si están presentes
        if (request.getName() != null) {
            center.setName(request.getName());
        }
        if (request.getAddress() != null) {
            center.setAddress(request.getAddress());
        }
        if (request.getContactNumber() != null) {
            center.setContactNumber(request.getContactNumber());
        }
        if (request.getType() != null) {
            center.setType(request.getType());
        }
        if (request.getUrgencyStatus() != null) {
            center.setUrgencyStatus(request.getUrgencyStatus());
        }
        if (request.getOperatingHours() != null) {
            center.setOperatingHours(request.getOperatingHours());
        }
        if (request.getSuppliesNeeded() != null) {
            try {
                // Convertir List<String> a JSON string
                ObjectMapper objectMapper = new ObjectMapper();
                String suppliesJson = objectMapper.writeValueAsString(request.getSuppliesNeeded());
                center.setSuppliesNeeded(suppliesJson);
            } catch (Exception e) {
                log.error("❌ Error al convertir suppliesNeeded a JSON: {}", e.getMessage());
                throw new DatabaseException("Error al procesar los suministros necesarios");
            }
        }

        // Actualizar ubicación si ambas coordenadas están presentes
        if (request.getLatitude() != null && request.getLongitude() != null) {
            coordinateValidator.validate(request.getLatitude(), request.getLongitude());

            org.locationtech.jts.geom.GeometryFactory geometryFactory = new org.locationtech.jts.geom.GeometryFactory(
                    new org.locationtech.jts.geom.PrecisionModel(), 4326);
            org.locationtech.jts.geom.Point point = geometryFactory.createPoint(
                    new org.locationtech.jts.geom.Coordinate(request.getLongitude(), request.getLatitude()));
            center.setLocation(point);
        }

        Center updatedCenter = centerRepository.save(center);
        log.info("✅ Centro actualizado exitosamente");

        return CenterMapper.toDTO(updatedCenter);
    }

    /**
     * Actualiza solo el estado de urgencia de un centro
     * 
     * @param id            UUID del centro
     * @param urgencyStatus Nuevo estado (0, 1, 2)
     * @return CenterDTO actualizado
     * @throws com.solidaritymap.exception.ResourceNotFoundException si no existe
     */
    @Transactional
    public CenterDTO updateUrgency(java.util.UUID id, Integer urgencyStatus) {
        log.info("⚠️ Actualizando urgencia del centro {} a: {}", id, urgencyStatus);

        Center center = centerRepository.findById(id)
                .orElseThrow(() -> new com.solidaritymap.exception.ResourceNotFoundException(
                        "Centro", "id", id));

        center.setUrgencyStatus(urgencyStatus);
        Center updatedCenter = centerRepository.save(center);

        log.info("✅ Urgencia actualizada exitosamente");
        return CenterMapper.toDTO(updatedCenter);
    }

    /**
     * Elimina un centro
     * 
     * @param id UUID del centro a eliminar
     * @throws com.solidaritymap.exception.ResourceNotFoundException si no existe
     */
    @Transactional
    public void deleteCenter(java.util.UUID id) {
        log.info("🗑️ Eliminando centro con ID: {}", id);

        if (!centerRepository.existsById(id)) {
            throw new com.solidaritymap.exception.ResourceNotFoundException("Centro", "id", id);
        }

        centerRepository.deleteById(id);
        log.info("✅ Centro eliminado exitosamente");
    }
}
