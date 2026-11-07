package com.uade.marketplace.dto.response;

import java.time.LocalDateTime;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.ItemCarrito;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.enums.TipoFutbol;
import com.uade.marketplace.entity.enums.TipoSuperficie;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ItemCarritoResponse {
    private Long idItem;
    private Long idTurno;
    private String nombreCancha;
    private Integer cantidad;
    private Float precioUnitario;
    private Float subtotal;

    private TipoFutbol tipoFutbol;
    private TipoSuperficie tipoSuperficie;
    private String localidad;
    private String direccion;
    private LocalDateTime fechaHora;
    private Integer lugaresDisponibles;
    private String imagen;
    private LocalDateTime fechaReserva;
    private LocalDateTime fechaExpiracion;

    public static ItemCarritoResponse from(ItemCarrito i, String imagenBase64, int minutosReserva) {
        Turno turno = i.getTurno();
        Cancha cancha = turno != null ? turno.getCancha() : null;
        LocalDateTime fechaReserva = i.getFechaReserva();
        LocalDateTime fechaExpiracion = fechaReserva != null ? fechaReserva.plusMinutes(minutosReserva) : null;
        return new ItemCarritoResponse(
                i.getIdItem(),
                turno != null ? turno.getIdTurno() : null,
                cancha != null ? cancha.getNombre() : null,
                i.getCantidad(),
                i.getPrecioUnitario(),
                i.getPrecioUnitario() * i.getCantidad(),
                turno != null ? turno.getTipoFutbol() : null,
                cancha != null ? cancha.getTipoSuperficie() : null,
                cancha != null && cancha.getLocalidad() != null ? cancha.getLocalidad().getNombre() : null,
                cancha != null ? cancha.getDireccion() : null,
                turno != null ? turno.getFechaHora() : null,
                turno != null ? turno.getLugaresDisponibles() : null,
                imagenBase64,
                fechaReserva,
                fechaExpiracion
        );
    }
}
