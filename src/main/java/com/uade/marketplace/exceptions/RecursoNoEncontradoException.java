package com.uade.marketplace.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Recurso no encontrado")
public class RecursoNoEncontradoException extends Exception {
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}