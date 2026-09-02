package com.uade.marketplace.dto.response;

import java.util.List;

import com.uade.marketplace.entity.Carrito;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CarritoResponse {
    private Long idCarrito;
    private Long idUsuario;
    private List<ItemCarritoResponse> items;
    private Float total;

    public static CarritoResponse from(Carrito c) {
        List<ItemCarritoResponse> items = c.getItems().stream()
                .map(ItemCarritoResponse::from)
                .toList();
        float total = (float) items.stream().mapToDouble(ItemCarritoResponse::getSubtotal).sum();
        return new CarritoResponse(
                c.getIdCarrito(),
                c.getUsuario() != null ? c.getUsuario().getIdUsuario() : null,
                items,
                total
        );
    }
}
