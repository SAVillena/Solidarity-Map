package com.solidaritymap.model;

/**
 * Enum que define los roles de usuario en el sistema
 * 
 * ADMIN: Acceso completo - puede crear/editar/eliminar centros y usuarios
 * VOLUNTEER: Puede crear y editar centros
 * USER: Solo lectura - visualiza información
 */
public enum Role {
    ADMIN,
    VOLUNTEER,
    USER
}
