package com.uade.marketplace.dto.response;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import com.uade.marketplace.entity.Carrito;
import com.uade.marketplace.entity.ItemCarrito;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CarritoResponse {
    private Long idCarrito;
    private Long idUsuario;
    private List<ItemCarritoResponse> items;
    private Float total;

    public static CarritoResponse from(Carrito c, Function<ItemCarrito, String> imagenPorItem, int minutosReserva) {
        List<ItemCarritoResponse> items = c.getItems().stream()
                .map(i -> ItemCarritoResponse.from(i, imagenPorItem.apply(i), minutosReserva))
                .toList();
        float total = (float) items.stream().mapToDouble(ItemCarritoResponse::getSubtotal).sum();
        return new CarritoResponse(
                c.getIdCarrito(),
                c.getUsuario() != null ? c.getUsuario().getIdUsuario() : null,
                items,
                total
        );
    }

    public static CarritoResponse from(Carrito c, Map<Long, String> imagenesPorCancha, int minutosReserva) {
        return from(c, item -> {
            if (item.getTurno() == null || item.getTurno().getCancha() == null) return null;
            return imagenesPorCancha.get(item.getTurno().getCancha().getIdCancha());
        }, minutosReserva);
    }
}
