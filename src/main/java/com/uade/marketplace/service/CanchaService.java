package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;

public interface CanchaService {
    List<Cancha> getAll();
    Optional<Cancha> getById(Long idCancha);
    List<Cancha> buscarPorLocalidad(String localidad);
    Cancha publicar (Cancha cancha) throws RecursoNoEncontradoException;
}
