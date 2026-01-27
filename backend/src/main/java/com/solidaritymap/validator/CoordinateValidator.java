package com.solidaritymap.validator;

import org.springframework.stereotype.Component;

/**
 * Validador para coordenadas geográficas
 * SRP: Responsabilidad única de validar coordenadas
 */
@Component
public class CoordinateValidator {

    private static final double MIN_LATITUDE = -90.0;
    private static final double MAX_LATITUDE = 90.0;
    private static final double MIN_LONGITUDE = -180.0;
    private static final double MAX_LONGITUDE = 180.0;

    /**
     * Valida que las coordenadas sean válidas geográficamente
     * 
     * @param lat latitud
     * @param lon longitud
     * @throws IllegalArgumentException si las coordenadas no son válidas
     */
    public void validate(double lat, double lon) {
        validateLatitude(lat);
        validateLongitude(lon);
    }

    /**
     * Valida la latitud
     */
    public void validateLatitude(double lat) {
        if (lat < MIN_LATITUDE || lat > MAX_LATITUDE) {
            throw new IllegalArgumentException(
                    String.format("Latitud inválida: %.6f. Debe estar entre %.1f y %.1f",
                            lat, MIN_LATITUDE, MAX_LATITUDE));
        }
    }

    /**
     * Valida la longitud
     */
    public void validateLongitude(double lon) {
        if (lon < MIN_LONGITUDE || lon > MAX_LONGITUDE) {
            throw new IllegalArgumentException(
                    String.format("Longitud inválida: %.6f. Debe estar entre %.1f y %.1f",
                            lon, MIN_LONGITUDE, MAX_LONGITUDE));
        }
    }

    /**
     * Valida que el radio de búsqueda sea lógico
     */
    public void validateRadius(double radius) {
        if (radius <= 0) {
            throw new IllegalArgumentException("El radio debe ser mayor a 0");
        }
        if (radius > 1_000_000) { // 1000 km
            throw new IllegalArgumentException("El radio no puede exceder 1,000 km");
        }
    }
}
