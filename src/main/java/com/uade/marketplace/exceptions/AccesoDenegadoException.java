package com.uade.marketplace.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "Acceso denegado")
public class AccesoDenegadoException extends Exception {
    public AccesoDenegadoException(String mensaje) {
        super(mensaje);
    }
}