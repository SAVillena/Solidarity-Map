package com.solidaritymap.config;

import com.solidaritymap.model.Role;
import com.solidaritymap.model.User;
import com.solidaritymap.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Inicializa datos por defecto en la BD
 * Se ejecuta automáticamente al iniciar la aplicación
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Crear usuario admin si no existe
        if (!userRepository.existsByUsername("admin")) {
            logger.info("👤 Creando usuario admin por defecto...");

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@solidaritymap.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);

            userRepository.save(admin);

            logger.info("✅ Usuario admin creado exitosamente");
            logger.info("   Username: admin");
            logger.info("   Password: admin123");
            logger.info("   ⚠️  CAMBIAR ESTA CONTRASEÑA EN PRODUCCIÓN!");
        } else {
            logger.info("ℹ️  Usuario admin ya existe, omitiendo creación");
        }
    }
}
