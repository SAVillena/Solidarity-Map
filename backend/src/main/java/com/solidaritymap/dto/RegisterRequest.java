package com.solidaritymap.dto;

import com.solidaritymap.model.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para request de registro de usuario
 */
@Schema(description = "Datos para registrar un nuevo usuario en el sistema")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @Schema(description = "Nombre de usuario único", example = "juan_perez")
    private String username;

    @Schema(description = "Correo electrónico del usuario", example = "juan@example.com")
    private String email;

    @Schema(description = "Contraseña (mínimo 8 caracteres recomendado)", example = "MiPassword123!")
    private String password;

    @Schema(description = "Rol del usuario. Por defecto USER.", example = "USER", defaultValue = "USER")
    private Role role = Role.USER;
}
