package com.solidaritymap.controller;

import com.solidaritymap.dto.AuthResponse;
import com.solidaritymap.dto.LoginRequest;
import com.solidaritymap.dto.RegisterRequest;
import com.solidaritymap.dto.UserDTO;
import com.solidaritymap.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para endpoints de autenticación
 * POST /api/auth/register - Registrar nuevo usuario
 * POST /api/auth/login - Login
 * GET /api/auth/me - Obtener usuario actual
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Registra un nuevo usuario en el sistema
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        logger.info("📝 Request de registro recibido para username: {}", request.getUsername());

        try {
            AuthResponse response = authService.register(request);
            logger.info("✅ Registro exitoso para: {}", request.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Error en registro: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * POST /api/auth/login
     * Autentica un usuario y devuelve JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        logger.info("🔐 Request de login recibido para username: {}", request.getUsername());

        try {
            AuthResponse response = authService.login(request);
            logger.info("✅ Login exitoso para: {}", request.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Error en login: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    /**
     * GET /api/auth/me
     * Obtiene información del usuario autenticado actual
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        logger.info("📋 Request de info de usuario para: {}", userDetails.getUsername());

        try {
            UserDTO user = authService.getCurrentUser(userDetails.getUsername());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("❌ Error obteniendo usuario: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
