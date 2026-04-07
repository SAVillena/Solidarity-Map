package com.solidaritymap.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para request de login
 */
@Schema(description = "Credenciales de acceso para autenticación")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @Schema(description = "Nombre de usuario", example = "admin")
    private String username;

    @Schema(description = "Contraseña del usuario", example = "contraseña123")
    private String password;
}
