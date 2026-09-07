package com.uade.marketplace.dto.request;

import java.time.LocalDate;
import lombok.Data;

@Data 
public class OfertaRequest {
    private Long idTurno;
    private Double porcentajeDescuento;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
