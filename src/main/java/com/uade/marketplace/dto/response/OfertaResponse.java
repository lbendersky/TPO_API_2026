package com.uade.marketplace.dto.response;
import java.time.LocalDate;
import com.uade.marketplace.entity.Oferta;
import lombok.*;

@Data 
@Builder 
public class OfertaResponse {
    private Long idOferta;
    private Double porcentajeDescuento;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Long idTurno;

    public static OfertaResponse from(Oferta o) {
        return OfertaResponse.builder()
                .idOferta(o.getIdOferta())
                .porcentajeDescuento(o.getPorcentajeDescuento())
                .fechaInicio(o.getFechaInicio())
                .fechaFin(o.getFechaFin())
                .idTurno(o.getTurno() != null ? o.getTurno().getIdTurno() : null)
                .build();
    }
}
