package com.uade.marketplace.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class TurnoDuplicateException extends Exception {

    public TurnoDuplicateException() {
        super("Ya existe un turno reservado para esa cancha en el horario solicitado.");
    }

    public TurnoDuplicateException(String message) {
        super(message);
    }
}
