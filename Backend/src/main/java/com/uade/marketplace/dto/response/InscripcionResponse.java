package com.uade.marketplace.dto.response;

import java.time.LocalDateTime;

import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.enums.EstadoPago;
import com.uade.marketplace.entity.enums.TipoFutbol;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InscripcionResponse {
    private Long idInscripcion;
    private Long idTurno;
    private String nombreComprador;
    private LocalDateTime fechaCompra;
    private Double montoPagado;
    private EstadoPago estadoPago;
    private String nombreCancha;
    private String localidad;
    private LocalDateTime fechaHoraTurno;
    private TipoFutbol tipoFutbol;

    public static InscripcionResponse from(Inscripcion i) {
        Turno turno = i.getTurno();
        return new InscripcionResponse(
                i.getIdInscripcion(),
                turno != null ? turno.getIdTurno() : null,
                i.getUsuarioComprador() != null ? i.getUsuarioComprador().getNombre() : null,
                i.getFechaCompra(),
                i.getMontoPagado(),
                i.getEstadoPago(),
                turno != null && turno.getCancha() != null ? turno.getCancha().getNombre() : null,
                turno != null && turno.getCancha() != null && turno.getCancha().getLocalidad() != null
                        ? turno.getCancha().getLocalidad().getNombre() : null,
                turno != null ? turno.getFechaHora() : null,
                turno != null ? turno.getTipoFutbol() : null
        );
    }
}
