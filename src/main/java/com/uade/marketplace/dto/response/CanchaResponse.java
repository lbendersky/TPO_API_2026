package com.uade.marketplace.dto.response;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.enums.TipoSuperficie;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CanchaResponse {
    private Long idCancha;
    private String nombre;
    private String direccion;
    private String localidad;
    private TipoSuperficie tipoSuperficie;
    private Double precioUnitario;
    private Integer cantidadJugadores;
    private String descripcion;
    private String nombrePublicador;

    public static CanchaResponse from(Cancha c) {
        return new CanchaResponse(
                c.getIdCancha(),
                c.getNombre(),
                c.getDireccion(),
                c.getLocalidad() != null ? c.getLocalidad().getNombre() : null,
                c.getTipoSuperficie(),
                c.getPrecioUnitario(),
                c.getCantidadJugadores(),
                c.getDescripcion(),
                c.getPublicador() != null ? c.getPublicador().getNombre() : null
        );
    }
}
