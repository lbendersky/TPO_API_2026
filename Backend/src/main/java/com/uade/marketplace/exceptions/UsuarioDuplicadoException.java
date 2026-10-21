package com.uade.marketplace.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT, reason = "Ese dato ya está en uso por otro usuario")
public class UsuarioDuplicadoException extends RuntimeException {
    public UsuarioDuplicadoException() {
        super("Registro invalido");
    }
}