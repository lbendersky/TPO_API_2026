package com.uade.marketplace.dto.request;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TurnoRequest {
    private LocalDateTime fechaHora;
    private float precioPorJugador;
    private String descripcion;
    private String imagenPath;
    private Long idUsuario;
    private Long idCancha;
}