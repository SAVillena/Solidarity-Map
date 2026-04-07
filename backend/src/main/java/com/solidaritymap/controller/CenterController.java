package com.solidaritymap.controller;

import com.solidaritymap.dto.CenterDTO;
import com.solidaritymap.model.CenterStatus;
import com.solidaritymap.model.CenterType;
import com.solidaritymap.service.CenterService;
import com.solidaritymap.service.ExcelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.solidaritymap.dto.CreateCenterRequest;
import com.solidaritymap.dto.UpdateCenterRequest;
import com.solidaritymap.dto.UpdateUrgencyRequest;

@Slf4j
@Tag(name = "Centros", description = "Gestión de centros de solidaridad (ACOPIO y VETERINARIA). Los endpoints de lectura son públicos; escritura/modificación requieren rol ADMIN.")
@RestController
@RequestMapping("/api/centers")
@RequiredArgsConstructor
public class CenterController {

    private final CenterService centerService;
    private final ExcelService excelService;

    // ─────────────────────── ENDPOINTS PÚBLICOS ───────────────────────

    @Operation(summary = "Listar todos los centros", description = "Retorna todos los centros aprobados. Filtrá por tipo con el parámetro `type`.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de centros", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class)))
    })
    @GetMapping
    public List<CenterDTO> getAllCenters(
            @Parameter(description = "Tipo de centro: ACOPIO o VETERINARIA") @RequestParam(required = false) CenterType type) {
        return centerService.getAllCenters(type);
    }

    @Operation(summary = "Buscar centros", description = "Búsqueda por texto, tipo y/o estado de urgencia.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resultados de búsqueda", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class)))
    })
    @GetMapping("/search")
    public List<CenterDTO> searchCenters(
            @Parameter(description = "Texto a buscar en nombre o dirección") @RequestParam(required = false) String query,
            @Parameter(description = "Tipo de centro: ACOPIO o VETERINARIA") @RequestParam(required = false) CenterType type,
            @Parameter(description = "Estado de urgencia: 0 = Normal, 1 = Moderado, 2 = Crítico") @RequestParam(required = false) Integer urgencyStatus) {
        return centerService.searchCenters(query, type, urgencyStatus);
    }

    @Operation(summary = "Centros más cercanos", description = "Retorna centros dentro del radio especificado (en metros) a la ubicación dada.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de centros cercanos", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class)))
    })
    @GetMapping("/nearest")
    public List<CenterDTO> getNearestCenters(
            @Parameter(description = "Latitud", example = "-34.6037") @RequestParam double lat,
            @Parameter(description = "Longitud", example = "-58.3816") @RequestParam double lon,
            @Parameter(description = "Radio en metros (por defecto 5000)", example = "5000") @RequestParam(defaultValue = "5000") double radius) {
        return centerService.getNearestCenters(lat, lon, radius);
    }

    @Operation(summary = "Obtener centro por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Centro encontrado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class))),
            @ApiResponse(responseCode = "404", description = "Centro no encontrado", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<CenterDTO> getCenterById(
            @Parameter(description = "UUID del centro", required = true) @PathVariable UUID id) {
        log.info("🔍 GET /api/centers/{}", id);
        CenterDTO center = centerService.getCenterById(id);
        return ResponseEntity.ok(center);
    }

    @Operation(summary = "Sugerir un nuevo centro (Público)", description = "Cualquier usuario puede sugerir un centro. Queda en estado PENDIENTE hasta que un admin lo apruebe.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Sugerencia enviada correctamente", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content)
    })
    @PostMapping("/suggest")
    public ResponseEntity<CenterDTO> suggestCenter(@Valid @RequestBody CreateCenterRequest request) {
        log.info("💡 POST /api/centers/suggest - Sugerencia de centro: {}", request.getName());
        CenterDTO created = centerService.suggestCenter(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Centros pendientes de aprobación (Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de centros pendientes", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content)
    })
    @GetMapping("/pending")
    public List<CenterDTO> getPendingCenters() {
        return centerService.getCentersByStatus(CenterStatus.PENDING);
    }

    // ─────────────────────── ENDPOINTS ADMIN ───────────────────────

    @Operation(summary = "Crear nuevo centro (Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Centro creado exitosamente", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content)
    })
    @PostMapping
    public ResponseEntity<CenterDTO> createCenter(@Valid @RequestBody CreateCenterRequest request) {
        log.info("➕ POST /api/centers - Creando centro: {}", request.getName());
        CenterDTO created = centerService.createCenter(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Actualizar centro (Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Centro actualizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content),
            @ApiResponse(responseCode = "404", description = "Centro no encontrado", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<CenterDTO> updateCenter(
            @Parameter(description = "UUID del centro") @PathVariable UUID id,
            @Valid @RequestBody UpdateCenterRequest request) {
        log.info("📝 PUT /api/centers/{}", id);
        CenterDTO updated = centerService.updateCenter(id, request);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Actualizar urgencia del centro (Admin)", description = "Modifica únicamente el estado de urgencia: 0 = Normal, 1 = Moderado, 2 = Crítico.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Urgencia actualizada", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class))),
            @ApiResponse(responseCode = "400", description = "Valor de urgencia inválido", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content),
            @ApiResponse(responseCode = "404", description = "Centro no encontrado", content = @Content)
    })
    @PatchMapping("/{id}/urgency")
    public ResponseEntity<CenterDTO> updateUrgency(
            @Parameter(description = "UUID del centro") @PathVariable UUID id,
            @Valid @RequestBody UpdateUrgencyRequest request) {
        log.info("⚠️ PATCH /api/centers/{}/urgency - Nuevo estado: {}", id, request.getUrgencyStatus());
        CenterDTO updated = centerService.updateUrgency(id, request.getUrgencyStatus());
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Aprobar centro sugerido (Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Centro aprobado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content),
            @ApiResponse(responseCode = "404", description = "Centro no encontrado", content = @Content)
    })
    @PatchMapping("/{id}/approve")
    public ResponseEntity<CenterDTO> approveCenter(
            @Parameter(description = "UUID del centro") @PathVariable UUID id) {
        log.info("✅ PATCH /api/centers/{}/approve", id);
        return ResponseEntity.ok(centerService.approveCenter(id));
    }

    @Operation(summary = "Rechazar centro sugerido (Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Centro rechazado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = CenterDTO.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content),
            @ApiResponse(responseCode = "404", description = "Centro no encontrado", content = @Content)
    })
    @PatchMapping("/{id}/reject")
    public ResponseEntity<CenterDTO> rejectCenter(
            @Parameter(description = "UUID del centro") @PathVariable UUID id) {
        log.info("🚫 PATCH /api/centers/{}/reject", id);
        return ResponseEntity.ok(centerService.rejectCenter(id));
    }

    @Operation(summary = "Importar centros desde Excel (Admin)", description = "Carga masiva de centros desde un archivo `.xlsx`. Ver `EXCEL_FORMAT.md` para el formato esperado.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Importación exitosa con estadísticas"),
            @ApiResponse(responseCode = "400", description = "Archivo inválido o formato incorrecto", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content)
    })
    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> importCenters(
            @Parameter(description = "Archivo Excel (.xlsx) con los centros a importar") @RequestParam("file") MultipartFile file)
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

    @Operation(summary = "Eliminar centro (Admin)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Centro eliminado exitosamente"),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content),
            @ApiResponse(responseCode = "404", description = "Centro no encontrado", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCenter(
            @Parameter(description = "UUID del centro a eliminar") @PathVariable UUID id) {
        log.info("🗑️ DELETE /api/centers/{}", id);
        centerService.deleteCenter(id);
        return ResponseEntity.noContent().build();
    }
}
