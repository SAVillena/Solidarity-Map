package com.solidaritymap.controller;

import com.solidaritymap.dto.CreateUserRequest;
import com.solidaritymap.dto.UpdateUserRequest;
import com.solidaritymap.dto.UserDTO;
import com.solidaritymap.model.User;
import com.solidaritymap.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controller para gestión de usuarios — solo ADMIN.
 * Todos los endpoints requieren autenticación con rol ADMIN.
 */
@Tag(name = "Gestión de Usuarios", description = "CRUD de usuarios del sistema. Requiere rol ADMIN en todos los endpoints.")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/users")
public class UserManagementController {

    private static final Logger logger = LoggerFactory.getLogger(UserManagementController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Operation(summary = "Listar todos los usuarios")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de usuarios", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = UserDTO.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content)
    })
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        logger.info("👥 Obteniendo lista de todos los usuarios");
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        logger.info("✅ Encontrados {} usuarios", userDTOs.size());
        return ResponseEntity.ok(userDTOs);
    }

    @Operation(summary = "Crear nuevo usuario (Admin)", description = "Crea un usuario con username, email, password y rol (ADMIN o USER).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario creado exitosamente", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = UserDTO.class))),
            @ApiResponse(responseCode = "400", description = "Username o email ya en uso, o datos inválidos", content = @Content(mediaType = MediaType.TEXT_PLAIN_VALUE)),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content)
    })
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        logger.info("➕ Creando nuevo usuario: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            logger.error("❌ Username ya existe: {}", request.getUsername());
            return ResponseEntity.badRequest().body("El username ya está en uso");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.error("❌ Email ya existe: {}", request.getEmail());
            return ResponseEntity.badRequest().body("El email ya está en uso");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setEnabled(request.getEnabled() != null ? request.getEnabled() : true);

        User savedUser = userRepository.save(user);
        logger.info("✅ Usuario creado exitosamente: {}", savedUser.getUsername());
        return ResponseEntity.ok(convertToDTO(savedUser));
    }

    @Operation(summary = "Actualizar usuario (Admin)", description = "Modifica email, password, rol o habilitación de un usuario existente. Solo se actualizan los campos presentes en el body.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario actualizado", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = UserDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o email ya en uso", content = @Content(mediaType = MediaType.TEXT_PLAIN_VALUE)),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @Parameter(description = "UUID del usuario a actualizar") @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication) {

        logger.info("✏️ Actualizando usuario: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("El email ya está en uso");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }

        User updatedUser = userRepository.save(user);
        logger.info("✅ Usuario actualizado: {}", updatedUser.getUsername());
        return ResponseEntity.ok(convertToDTO(updatedUser));
    }

    @Operation(summary = "Eliminar usuario (Admin)", description = "Elimina un usuario del sistema. No se puede eliminar el propio usuario autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario eliminado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Intento de eliminar el propio usuario", content = @Content(mediaType = MediaType.TEXT_PLAIN_VALUE)),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "Acceso denegado — se requiere ADMIN", content = @Content),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @Parameter(description = "UUID del usuario a eliminar") @PathVariable UUID id,
            Authentication authentication) {

        logger.info("🗑️ Eliminando usuario: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String currentUsername = authentication.getName();
        if (user.getUsername().equals(currentUsername)) {
            logger.error("❌ No se puede eliminar el propio usuario");
            return ResponseEntity.badRequest().body("No puedes eliminar tu propio usuario");
        }

        userRepository.delete(user);
        logger.info("✅ Usuario eliminado: {}", user.getUsername());
        return ResponseEntity.ok().body("Usuario eliminado exitosamente");
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setEnabled(user.getEnabled());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
