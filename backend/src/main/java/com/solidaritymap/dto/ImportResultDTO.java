package com.solidaritymap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO para resultado de importación de centros
 * Proporciona feedback detallado del proceso
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportResultDTO {
    private boolean success;
    private String message;
    private int centersImported;
    private int centersSkipped;
    private int centersWithErrors;
    private String filename;

    @Builder.Default
    private List<String> errors = new ArrayList<>();

    @Builder.Default
    private List<String> warnings = new ArrayList<>();
}
