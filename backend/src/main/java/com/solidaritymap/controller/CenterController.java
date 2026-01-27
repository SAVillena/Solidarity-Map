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
@CrossOrigin(origins = "*") // Allow all origins for development
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
    public ResponseEntity<Map<String, Object>> importCenters(@RequestParam("file") MultipartFile file) {
        log.info("📁 Iniciando importación de centros desde archivo: {}", file.getOriginalFilename());

        try {
            int imported = excelService.importCenters(file);

            log.info("✅ Importación exitosa: {} centros importados", imported);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Centros importados exitosamente",
                    "centersImported", imported,
                    "filename", file.getOriginalFilename()));

        } catch (IOException e) {
            log.error("❌ Error al procesar archivo: {}", e.getMessage());
            throw new RuntimeException("Error al procesar el archivo Excel: " + e.getMessage(), e);
        }
    }
}
