package com.solidaritymap.service;

import com.solidaritymap.dto.AuthResponse;
import com.solidaritymap.dto.LoginRequest;
import com.solidaritymap.dto.RegisterRequest;
import com.solidaritymap.dto.UserDTO;
import com.solidaritymap.model.User;
import com.solidaritymap.repository.UserRepository;
import com.solidaritymap.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Servicio de autenticación
 * Maneja login, registro y conversión de User a UserDTO
 */
@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Registra un nuevo usuario
     */
    public AuthResponse register(RegisterRequest request) {
        logger.info("📝 Intentando registrar usuario: {}", request.getUsername());

        // Validar que username no exista
        if (userRepository.existsByUsername(request.getUsername())) {
            logger.error("❌ Username ya existe: {}", request.getUsername());
            throw new RuntimeException("El username ya está en uso");
        }

        // Validar que email no exista
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.error("❌ Email ya existe: {}", request.getEmail());
            throw new RuntimeException("El email ya está en uso");
        }

        // Crear nuevo usuario
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);
        logger.info("✅ Usuario registrado exitosamente: {} con role: {}",
                savedUser.getUsername(), savedUser.getRole());

        // Autenticar automáticamente después del registro
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, convertToDTO(savedUser));
    }

    /**
     * Autentica un usuario existente
     */
    public AuthResponse login(LoginRequest request) {
        logger.info("🔐 Intentando login para usuario: {}", request.getUsername());

        // DEBUG: Ver hash almacenado
        User debugUser = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (debugUser != null) {
            logger.info("🔍 DEBUG - Hash almacenado: {}", debugUser.getPassword());
            logger.info("🔍 DEBUG - Password ingresado: {}", request.getPassword());
            logger.info("🔍 DEBUG - Match test: {}",
                    passwordEncoder.matches(request.getPassword(), debugUser.getPassword()));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            logger.info("✅ Login exitoso para usuario: {}", request.getUsername());

            return new AuthResponse(jwt, convertToDTO(user));
        } catch (Exception e) {
            logger.error("❌ Error en login para usuario {}: {}", request.getUsername(), e.getMessage());
            throw new RuntimeException("Credenciales inválidas");
        }
    }

    /**
     * Obtiene información del usuario actual autenticado
     */
    public UserDTO getCurrentUser(String username) {
        logger.info("📋 Obteniendo información de usuario: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return convertToDTO(user);
    }

    /**
     * Convierte User entity a UserDTO (sin password)
     */
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}
