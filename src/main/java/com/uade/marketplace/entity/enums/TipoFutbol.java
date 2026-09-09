package com.uade.marketplace.entity.enums;

public enum TipoFutbol {
    F5(10, 1),
    F7(14, 1),
    F8(16, 1),
    F11(22, 2);

    private final int cantidadJugadores;
    private final int duracionHoras;

    TipoFutbol(int cantidadJugadores, int duracionHoras) {
        this.cantidadJugadores = cantidadJugadores;
        this.duracionHoras = duracionHoras;
    }

    public int getCantidadJugadores() {
        return cantidadJugadores;
    }


    public int getDuracionHoras() {
        return duracionHoras;
    }
}