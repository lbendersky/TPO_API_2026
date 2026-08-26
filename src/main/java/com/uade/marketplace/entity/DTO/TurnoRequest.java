package com.uade.marketplace.entity.DTO;

import java.time.LocalDateTime;

import com.uade.marketplace.entity.enums.TipoFutbol;

import lombok.Data;

@Data
public class TurnoRequest {
    private LocalDateTime fechaHora;
    private TipoFutbol tipoFutbol;
    private int lugaresDisponibles;
    private float precioPorJugador;
    private Long idUsuario;
    private Long idCancha;
}