package com.uade.marketplace.dto.response;

import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.NombreRol;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioResponse {
    private Long idUsuario;
    private String nombreUsuario;
    private String nombre;
    private String email;
    private String telefono;
    private NombreRol rol;

    public static UsuarioResponse from(Usuario u) {
        return new UsuarioResponse(
                u.getIdUsuario(),
                u.getNombreUsuario(),
                u.getNombre(),
                u.getEmail(),
                u.getTelefono(),
                u.getRol()
        );
    }
}
