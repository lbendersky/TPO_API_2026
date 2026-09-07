package com.uade.marketplace.entity.enums;

public enum TipoFutbol {
    F5(10),
    F7(14),
    F8(16),
    F11(22);

    private final int cantidadJugadores;

    TipoFutbol(int cantidadJugadores) {
        this.cantidadJugadores = cantidadJugadores;
    }

    public int getCantidadJugadores() {
        return cantidadJugadores;
    }
}