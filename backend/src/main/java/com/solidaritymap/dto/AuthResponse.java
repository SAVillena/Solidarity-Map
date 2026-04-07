package com.solidaritymap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para response de autenticación exitosa.
 * Contiene el token JWT y la información del usuario.
 */
@Schema(description = "Respuesta de autenticación con token JWT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    @Schema(description = "Token JWT para autenticación en endpoints protegidos", example = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTYz...")
    private String token;

    @Schema(description = "Tipo de token", example = "Bearer")
    private String type = "Bearer";

    @Schema(description = "Datos del usuario autenticado")
    private UserDTO user;

    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
}
