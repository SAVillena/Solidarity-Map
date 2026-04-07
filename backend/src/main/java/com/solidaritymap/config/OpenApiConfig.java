package com.solidaritymap.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuración de OpenAPI / Swagger UI para la documentación de la API.
 * Disponible en: http://localhost:8080/swagger-ui/index.html
 */
@Configuration
public class OpenApiConfig {

    private static final String BEARER_AUTH = "bearerAuth";

    @Bean
    public OpenAPI solidarityMapOpenAPI() {
        return new OpenAPI()
                .info(buildInfo())
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Servidor de Desarrollo")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH))
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH, buildSecurityScheme()));
    }

    private Info buildInfo() {
        return new Info()
                .title("Solidarity Map API")
                .description("""
                        API REST para la gestión de centros de solidaridad (ACOPIO y VETERINARIA).

                        ## Autenticación
                        La API utiliza **JWT Bearer Token**. Para endpoints protegidos:
                        1. Usá `POST /api/auth/login` para obtener el token.
                        2. Hacé clic en **Authorize** (🔒) e ingresá `Bearer <tu_token>`.

                        ## Roles
                        - **Público**: lectura de centros, sugerencia de centros, login/registro.
                        - **ADMIN**: crear, editar, eliminar centros, gestión de usuarios.
                        """)
                .version("1.0.0")
                .contact(new Contact()
                        .name("Solidarity Map Team")
                        .email("solidaritymap@example.com"))
                .license(new License()
                        .name("MIT License")
                        .url("https://opensource.org/licenses/MIT"));
    }

    private SecurityScheme buildSecurityScheme() {
        return new SecurityScheme()
                .name(BEARER_AUTH)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("Token JWT obtenido desde POST /api/auth/login. Ingresalo como: Bearer <token>");
    }
}
