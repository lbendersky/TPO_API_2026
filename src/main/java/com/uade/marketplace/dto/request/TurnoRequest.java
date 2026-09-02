package com.uade.marketplace.dto.request;

import java.time.LocalDateTime;

import com.uade.marketplace.entity.enums.TipoFutbol;

import lombok.Data;

@Data
public class TurnoRequest {
    private LocalDateTime fechaHora;
    private TipoFutbol tipoFutbol;
    private int lugaresDisponibles;
    private float precioPorJugador;
    private String descripcion;
    private Long idUsuario;
    private Long idCancha;
}