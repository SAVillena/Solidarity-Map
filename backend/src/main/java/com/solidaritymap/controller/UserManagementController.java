package com.solidaritymap.controller;

import com.solidaritymap.dto.CreateUserRequest;
import com.solidaritymap.dto.UpdateUserRequest;
import com.solidaritymap.dto.UserDTO;
import com.solidaritymap.model.User;
import com.solidaritymap.repository.UserRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Controller para gestión de usuarios (solo ADMIN)
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
public class UserManagementController {

    private static final Logger logger = LoggerFactory.getLogger(UserManagementController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * GET /api/users - Listar todos los usuarios
     */
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

    /**
     * POST /api/users - Crear nuevo usuario
     */
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request) {
        logger.info("➕ Creando nuevo usuario: {}", request.getUsername());

        // Validar que username no exista
        if (userRepository.existsByUsername(request.getUsername())) {
            logger.error("❌ Username ya existe: {}", request.getUsername());
            return ResponseEntity.badRequest().body("El username ya está en uso");
        }

        // Validar que email no exista
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.error("❌ Email ya existe: {}", request.getEmail());
            return ResponseEntity.badRequest().body("El email ya está en uso");
        }

        // Crear usuario
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

    /**
     * PUT /api/users/{id} - Actualizar usuario
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication) {

        logger.info("✏️ Actualizando usuario: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Actualizar fields (solo si se proporcionan)
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            // Validar que nuevo email no exista
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

    /**
     * DELETE /api/users/{id} - Eliminar usuario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable UUID id,
            Authentication authentication) {

        logger.info("🗑️ Eliminando usuario: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar que no sea el usuario actual
        String currentUsername = authentication.getName();
        if (user.getUsername().equals(currentUsername)) {
            logger.error("❌ No se puede eliminar el propio usuario");
            return ResponseEntity.badRequest().body("No puedes eliminar tu propio usuario");
        }

        userRepository.delete(user);
        logger.info("✅ Usuario eliminado: {}", user.getUsername());

        return ResponseEntity.ok().body("Usuario eliminado exitosamente");
    }

    /**
     * Convierte User entity a UserDTO
     */
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
