package com.uade.marketplace.service;

import java.util.List;

import com.uade.marketplace.dto.response.CarritoResponse;
import com.uade.marketplace.dto.response.InscripcionResponse;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoSinCuposException;

public interface CarritoService {
    CarritoResponse getPorUsuario(Long idUsuario) throws RecursoNoEncontradoException;
    CarritoResponse agregarItem(Long idUsuario, Long idTurno, Integer cantidad) throws RecursoNoEncontradoException;
    CarritoResponse actualizarCantidad(Long idUsuario, Long idItem, Integer cantidad) throws RecursoNoEncontradoException;
    CarritoResponse quitarItem(Long idUsuario, Long idItem) throws RecursoNoEncontradoException;
    void vaciar(Long idUsuario) throws RecursoNoEncontradoException;
    List<InscripcionResponse> checkout(Long idUsuario) throws RecursoNoEncontradoException, TurnoSinCuposException;
}
