package com.uade.marketplace.dto.request;

import lombok.Data;

@Data
public class UsuarioRequest {
    private String nombreUsuario;
    private String dni;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String contrasena;
}