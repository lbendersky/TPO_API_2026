package com.uade.marketplace.exceptions;

public class TurnoDuplicateException extends Exception {

    public TurnoDuplicateException() {
        super("Ya existe un turno reservado para esa cancha en el horario solicitado.");
    }

    public TurnoDuplicateException(String message) {
        super(message);
    }
}
