package com.uade.marketplace.dto.response;

import java.time.LocalDateTime;

import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.entity.enums.EstadoPago;

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

    public static InscripcionResponse from(Inscripcion i) {
        return new InscripcionResponse(
                i.getIdInscripcion(),
                i.getTurno() != null ? i.getTurno().getIdTurno() : null,
                i.getUsuarioComprador() != null ? i.getUsuarioComprador().getNombre() : null,
                i.getFechaCompra(),
                i.getMontoPagado(),
                i.getEstadoPago()
        );
    }
}
