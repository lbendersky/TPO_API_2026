package com.uade.marketplace.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String email;
    private String nombre;
    private String nombreUsuario;
    private String dni;
    private String telefono;
    private String contrasena;

}
