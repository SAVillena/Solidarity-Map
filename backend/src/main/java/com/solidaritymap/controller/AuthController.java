package com.solidaritymap.controller;

import com.solidaritymap.dto.AuthResponse;
import com.solidaritymap.dto.LoginRequest;
import com.solidaritymap.dto.RegisterRequest;
import com.solidaritymap.dto.UserDTO;
import com.solidaritymap.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para endpoints de autenticación.
 */
@Tag(name = "Autenticación", description = "Endpoints para registro, login y perfil del usuario autenticado")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Operation(summary = "Registrar nuevo usuario", description = "Crea una cuenta de usuario con username, email y password. Devuelve un JWT token.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Registro exitoso", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o usuario ya existe", content = @Content)
    })
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

    @Operation(summary = "Login de usuario", description = "Autentica al usuario con username y password. Devuelve un JWT token válido para usar en endpoints protegidos.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login exitoso — token JWT en el body", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas", content = @Content)
    })
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

    @Operation(summary = "Obtener perfil del usuario autenticado", description = "Devuelve los datos del usuario identificado por el token JWT enviado en el header Authorization.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Datos del usuario actual", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = UserDTO.class))),
            @ApiResponse(responseCode = "400", description = "Token inválido o usuario no encontrado", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content)
    })
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
