package com.solidaritymap.controller;

import com.solidaritymap.dto.CenterDTO;
import com.solidaritymap.model.CenterType;
import com.solidaritymap.service.CenterService;
import com.solidaritymap.service.ExcelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/centers")
@RequiredArgsConstructor

public class CenterController {

    private final CenterService centerService;
    private final ExcelService excelService;

    /**
     * Obtiene todos los centros, opcionalmente filtrados por tipo
     * 
     * @param type Tipo de centro (ACOPIO o VETERINARIA)
     * @return Lista de centros como DTOs
     */
    @GetMapping
    public List<CenterDTO> getAllCenters(@RequestParam(required = false) CenterType type) {
        return centerService.getAllCenters(type);
    }

    /**
     * Búsqueda avanzada de centros
     * GET /api/centers/search?query=...&type=...&urgency=...
     */
    @GetMapping("/search")
    public List<CenterDTO> searchCenters(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) CenterType type,
            @RequestParam(required = false) Integer urgencyStatus) {
        return centerService.searchCenters(query, type, urgencyStatus);
    }

    /**
     * Obtiene centros cercanos a una ubicación
     * 
     * @param lat    Latitud
     * @param lon    Longitud
     * @param radius Radio de búsqueda en metros
     * @return Lista de centros cercanos como DTOs
     */
    @GetMapping("/nearest")
    public List<CenterDTO> getNearestCenters(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5000") double radius) {
        return centerService.getNearestCenters(lat, lon, radius);
    }

    /**
     * Importa centros desde un archivo Excel
     * 
     * @param file Archivo Excel (.xlsx)
     * @return Mensaje de éxito con estadísticas
     */
    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importCenters(@RequestParam("file") MultipartFile file)
            throws IOException {
        log.info("📁 Iniciando importación de centros desde archivo: {}", file.getOriginalFilename());

        int imported = excelService.importCenters(file);

        log.info("✅ Importación exitosa: {} centros importados", imported);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Centros importados exitosamente",
                "centersImported", imported,
                "filename", file.getOriginalFilename()));
    }

    /**
     * Obtiene un centro por su ID
     * 
     * @param id UUID del centro
     * @return CenterDTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<CenterDTO> getCenterById(@PathVariable java.util.UUID id) {
        log.info("🔍 GET /api/centers/{}", id);
        CenterDTO center = centerService.getCenterById(id);
        return ResponseEntity.ok(center);
    }

    /**
     * Crea un nuevo centro
     * 
     * @param request Datos del centro a crear
     * @return CenterDTO creado con status 201 Created
     */
    @PostMapping
    public ResponseEntity<CenterDTO> createCenter(
            @jakarta.validation.Valid @RequestBody com.solidaritymap.dto.CreateCenterRequest request) {
        log.info("➕ POST /api/centers - Creando centro: {}", request.getName());
        CenterDTO created = centerService.createCenter(request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(created);
    }

    /**
     * Actualiza un centro existente
     * 
     * @param id      UUID del centro
     * @param request Datos a actualizar
     * @return CenterDTO actualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<CenterDTO> updateCenter(
            @PathVariable java.util.UUID id,
            @jakarta.validation.Valid @RequestBody com.solidaritymap.dto.UpdateCenterRequest request) {
        log.info("📝 PUT /api/centers/{}", id);
        CenterDTO updated = centerService.updateCenter(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Actualiza solo el estado de urgencia de un centro
     * 
     * @param id      UUID del centro
     * @param request Estado de urgencia (0-2)
     * @return CenterDTO actualizado
     */
    @PatchMapping("/{id}/urgency")
    public ResponseEntity<CenterDTO> updateUrgency(
            @PathVariable java.util.UUID id,
            @jakarta.validation.Valid @RequestBody com.solidaritymap.dto.UpdateUrgencyRequest request) {
        log.info("⚠️ PATCH /api/centers/{}/urgency - Nuevo estado: {}", id, request.getUrgencyStatus());
        CenterDTO updated = centerService.updateUrgency(id, request.getUrgencyStatus());
        return ResponseEntity.ok(updated);
    }

    /**
     * Elimina un centro
     * 
     * @param id UUID del centro a eliminar
     * @return 204 No Content
     */
    /**
     * Sugiere un nuevo centro (Público)
     */
    @PostMapping("/suggest")
    public ResponseEntity<CenterDTO> suggestCenter(
            @jakarta.validation.Valid @RequestBody com.solidaritymap.dto.CreateCenterRequest request) {
        log.info("💡 POST /api/centers/suggest - Sugerencia de centro: {}", request.getName());
        CenterDTO created = centerService.suggestCenter(request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(created);
    }

    /**
     * Aprueba un centro (Admin)
     */
    @PatchMapping("/{id}/approve")
    public ResponseEntity<CenterDTO> approveCenter(@PathVariable java.util.UUID id) {
        log.info("✅ PATCH /api/centers/{}/approve", id);
        return ResponseEntity.ok(centerService.approveCenter(id));
    }

    /**
     * Rechaza un centro (Admin)
     */
    @PatchMapping("/{id}/reject")
    public ResponseEntity<CenterDTO> rejectCenter(@PathVariable java.util.UUID id) {
        log.info("🚫 PATCH /api/centers/{}/reject", id);
        return ResponseEntity.ok(centerService.rejectCenter(id));
    }

    /**
     * Obtiene centros pendientes (Admin)
     */
    @GetMapping("/pending")
    public List<CenterDTO> getPendingCenters() {
        return centerService.getCentersByStatus(com.solidaritymap.model.CenterStatus.PENDING);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCenter(@PathVariable java.util.UUID id) {
        log.info("🗑️ DELETE /api/centers/{}", id);
        centerService.deleteCenter(id);
        return ResponseEntity.noContent().build();
    }
}
