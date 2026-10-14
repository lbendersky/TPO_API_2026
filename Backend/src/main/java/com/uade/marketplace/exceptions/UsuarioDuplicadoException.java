package com.uade.marketplace.exceptions;

public class UsuarioDuplicadoException extends RuntimeException {
    public UsuarioDuplicadoException() {
        super("Registro invalido");
    }
}