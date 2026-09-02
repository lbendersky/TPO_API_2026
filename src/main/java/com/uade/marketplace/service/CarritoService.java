package com.uade.marketplace.service;

import java.util.List;

import com.uade.marketplace.entity.Carrito;
import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoSinCuposException;

public interface CarritoService {
    Carrito getPorUsuario(Long idUsuario) throws RecursoNoEncontradoException;
    Carrito agregarItem(Long idUsuario, Long idTurno, Integer cantidad) throws RecursoNoEncontradoException;
    Carrito actualizarCantidad(Long idUsuario, Long idItem, Integer cantidad) throws RecursoNoEncontradoException;
    Carrito quitarItem(Long idUsuario, Long idItem) throws RecursoNoEncontradoException;
    void vaciar(Long idUsuario) throws RecursoNoEncontradoException;
    List<Inscripcion> checkout(Long idUsuario) throws RecursoNoEncontradoException, TurnoSinCuposException;
}
