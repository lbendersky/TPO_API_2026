package com.uade.marketplace.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT, reason = "No hay cupos disponibles para este turno")
public class TurnoSinCuposException extends Exception {

    public TurnoSinCuposException() {
        super("No hay cupos disponibles para este turno.");
    }

    public TurnoSinCuposException(String mensaje) {
        super(mensaje);
    }
}