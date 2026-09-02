package com.uade.marketplace.dto.response;

import java.time.LocalDateTime;

import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.entity.enums.EstadoTurno;
import com.uade.marketplace.entity.enums.TipoFutbol;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TurnoResponse {
    private Long idTurno;
    private LocalDateTime fechaHora;
    private TipoFutbol tipoFutbol;
    private Integer lugaresDisponibles;
    private Float precioPorJugador;
    private String descripcion;
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
                t.getDescripcion(),
                t.getEstado(),
                t.getCancha() != null ? t.getCancha().getNombre() : null,
                t.getCancha() != null && t.getCancha().getLocalidad() != null ? t.getCancha().getLocalidad().getNombre() : null,
                t.getUsuario() != null ? t.getUsuario().getNombre() : null
        );
    }
}
