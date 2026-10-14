package com.uade.marketplace.dto.response;

import com.uade.marketplace.entity.ItemCarrito;

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

    public static ItemCarritoResponse from(ItemCarrito i) {
        return new ItemCarritoResponse(
                i.getIdItem(),
                i.getTurno() != null ? i.getTurno().getIdTurno() : null,
                i.getTurno() != null && i.getTurno().getCancha() != null ? i.getTurno().getCancha().getNombre() : null,
                i.getCantidad(),
                i.getPrecioUnitario(),
                i.getPrecioUnitario() * i.getCantidad()
        );
    }
}
