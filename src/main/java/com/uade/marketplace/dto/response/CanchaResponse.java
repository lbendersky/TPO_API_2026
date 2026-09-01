package com.uade.marketplace.dto.response;

import com.uade.marketplace.entity.Cancha;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CanchaResponse {
    private Long idCancha;
    private String nombre;
    private String direccion;
    private String localidad;
    private String tipoSuperficie;
    private Double precioUnitario;
    private Integer cantidadJugadores;
    private String nombrePublicador;

    public static CanchaResponse from(Cancha c) {
        return new CanchaResponse(
                c.getIdCancha(),
                c.getNombre(),
                c.getDireccion(),
                c.getLocalidad(),
                c.getTipoSuperficie(),
                c.getPrecioUnitario(),
                c.getCantidadJugadores(),
                c.getPublicador() != null ? c.getPublicador().getNombre() : null
        );
    }
}
