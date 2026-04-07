package com.solidaritymap.dto;

import com.solidaritymap.model.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO para información de usuario (sin password)
 */
@Schema(description = "Datos públicos del usuario (sin contraseña)")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    @Schema(description = "Identificador único del usuario", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "Nombre de usuario único", example = "admin")
    private String username;

    @Schema(description = "Correo electrónico", example = "admin@solidaritymap.com")
    private String email;

    @Schema(description = "Rol del usuario: ADMIN o USER", example = "ADMIN")
    private Role role;

    @Schema(description = "Indica si el usuario está activo", example = "true")
    private Boolean enabled;

    @Schema(description = "Fecha y hora de creación de la cuenta")
    private LocalDateTime createdAt;
}
