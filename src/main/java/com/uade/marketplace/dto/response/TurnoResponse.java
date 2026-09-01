package com.uade.marketplace.dto.response;

import java.time.LocalDateTime;

import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.enums.EstadoTurno;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TurnoResponse {
    private Long idTurno;
    private LocalDateTime fechaHora;
    private String tipoFutbol;
    private Integer lugaresDisponibles;
    private Float precioPorJugador;
    private EstadoTurno estado;
    private String nombreCancha;
    private String localidad;
    private String nombreOrganizador;

    public static TurnoResponse from(Turno t) {
        return new TurnoResponse(
                t.getIdTurno(),
                t.getFechaHora(),
                t.getTipoFutbol(),
                t.getLugaresDisponibles(),
                t.getPrecioPorJugador(),
                t.getEstado(),
                t.getCancha() != null ? t.getCancha().getNombre() : null,
                t.getCancha() != null ? t.getCancha().getLocalidad() : null,
                t.getUsuario() != null ? t.getUsuario().getNombre() : null
        );
    }
}
