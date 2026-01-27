package com.solidaritymap.service;

import com.solidaritymap.model.Center;
import com.solidaritymap.model.CenterType;
import com.solidaritymap.repository.CenterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelService {

    private final CenterRepository centerRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    /**
     * Importa centros desde un archivo Excel
     * 
     * @param file Archivo Excel a importar
     * @return Número de centros importados exitosamente
     * @throws IOException Si hay error al leer el archivo
     */
    public int importCenters(MultipartFile file) throws IOException {
        // Validar que el archivo no esté vacío
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        // Validar extensión del archivo
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".xlsx")) {
            throw new IllegalArgumentException("El archivo debe ser un Excel (.xlsx). Recibido: " + filename);
        }

        List<Center> centers = new ArrayList<>();
        int successCount = 0;
        int errorCount = 0;

        log.info("📊 Procesando archivo Excel: {}", filename);

        try (InputStream inputStream = file.getInputStream();
                Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            // Skip header if present
            if (rows.hasNext()) {
                Row headerRow = rows.next();
                log.info("📋 Encabezados detectados en fila 1");
            }

            while (rows.hasNext()) {
                Row row = rows.next();
                int rowNum = row.getRowNum() + 1; // 1-indexed for user readability

                try {
                    Center center = mapRowToCenter(row);
                    if (center != null) {
                        centers.add(center);
                        successCount++;
                        log.debug("✅ Fila {}: Centro '{}' procesado correctamente", rowNum, center.getName());
                    }
                } catch (Exception e) {
                    errorCount++;
                    log.error("❌ Error en fila {}: {} - {}", rowNum, e.getClass().getSimpleName(), e.getMessage());
                }
            }

            // Guardar en base de datos
            if (!centers.isEmpty()) {
                log.info("💾 Guardando {} centros en la base de datos...", centers.size());
                centerRepository.saveAll(centers);
                log.info("✅ Centros guardados exitosamente");
            } else {
                log.warn("⚠️ No se encontraron centros válidos para importar");
            }

            log.info("📊 Resumen de importación: {} exitosos, {} errores", successCount, errorCount);

        } catch (IOException e) {
            log.error("❌ Error al leer el archivo Excel: {}", e.getMessage());
            throw new IOException("No se pudo leer el archivo Excel. Asegúrate de que sea un archivo .xlsx válido.", e);
        }

        return successCount;
    }

    /**
     * Mapea una fila del Excel a un objeto Center
     * Formato esperado: Name | Address | Contact | Type | Lat | Lon
     */
    private Center mapRowToCenter(Row row) {
        int rowNum = row.getRowNum() + 1;

        try {
            Center center = new Center();

            // Columna 0: Name (requerido)
            String name = getCellValue(row.getCell(0));
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre es obligatorio (columna A)");
            }
            center.setName(name.trim());

            // Columna 1: Address (requerido)
            String address = getCellValue(row.getCell(1));
            if (address == null || address.trim().isEmpty()) {
                throw new IllegalArgumentException("La dirección es obligatoria (columna B)");
            }
            center.setAddress(address.trim());

            // Columna 2: Contact (opcional)
            String contact = getCellValue(row.getCell(2));
            center.setContactNumber(contact != null ? contact.trim() : null);

            // Columna 3: Type (requerido - ACOPIO o VETERINARIA)
            String typeStr = getCellValue(row.getCell(3));
            if (typeStr == null || typeStr.trim().isEmpty()) {
                throw new IllegalArgumentException("El tipo es obligatorio (columna D). Use: ACOPIO o VETERINARIA");
            }
            try {
                center.setType(CenterType.valueOf(typeStr.toUpperCase().trim()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(
                        "Tipo inválido en columna D: '" + typeStr + "'. Valores válidos: ACOPIO, VETERINARIA");
            }

            // Columna 4: Latitude (requerido)
            String latStr = getCellValue(row.getCell(4));
            if (latStr == null || latStr.trim().isEmpty()) {
                throw new IllegalArgumentException("La latitud es obligatoria (columna E)");
            }
            double lat;
            try {
                lat = Double.parseDouble(latStr.trim());
                if (lat < -90 || lat > 90) {
                    throw new IllegalArgumentException("Latitud fuera de rango (-90 a 90): " + lat);
                }
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Latitud inválida en columna E: '" + latStr + "'");
            }

            // Columna 5: Longitude (requerido)
            String lonStr = getCellValue(row.getCell(5));
            if (lonStr == null || lonStr.trim().isEmpty()) {
                throw new IllegalArgumentException("La longitud es obligatoria (columna F)");
            }
            double lon;
            try {
                lon = Double.parseDouble(lonStr.trim());
                if (lon < -180 || lon > 180) {
                    throw new IllegalArgumentException("Longitud fuera de rango (-180 a 180): " + lon);
                }
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Longitud inválida en columna F: '" + lonStr + "'");
            }

            // Crear punto geográfico
            Point location = geometryFactory.createPoint(new Coordinate(lon, lat));
            location.setSRID(4326);
            center.setLocation(location);

            // Valores por defecto
            center.setUrgencyStatus(0);

            return center;

        } catch (Exception e) {
            log.debug("⚠️ Error procesando fila {}: {}", rowNum, e.getMessage());
            throw e; // Re-throw para que sea capturado por el método principal
        }
    }

    /**
     * Obtiene el valor de una celda como String
     */
    private String getCellValue(Cell cell) {
        if (cell == null)
            return null;

        try {
            switch (cell.getCellType()) {
                case STRING:
                    return cell.getStringCellValue();
                case NUMERIC:
                    // Evitar notación científica para números
                    if (DateUtil.isCellDateFormatted(cell)) {
                        return cell.getDateCellValue().toString();
                    } else {
                        double numValue = cell.getNumericCellValue();
                        // Si es un número entero, no mostrar decimales
                        if (numValue == (long) numValue) {
                            return String.valueOf((long) numValue);
                        } else {
                            return String.valueOf(numValue);
                        }
                    }
                case BOOLEAN:
                    return String.valueOf(cell.getBooleanCellValue());
                case FORMULA:
                    return cell.getCellFormula();
                case BLANK:
                    return null;
                default:
                    return null;
            }
        } catch (Exception e) {
            log.warn("⚠️ Error al leer celda: {}", e.getMessage());
            return null;
        }
    }
}
