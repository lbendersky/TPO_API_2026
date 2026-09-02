package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;

public interface CanchaService {
    List<Cancha> getAll();
    Optional<Cancha> getById(Long idCancha);
    List<Cancha> buscarPorLocalidad(String localidad);
    List<Cancha> buscarPorSuperficie(String tipoSuperficie);
    Cancha publicar (Cancha cancha) throws RecursoNoEncontradoException;
    Cancha actualizar(Long idCancha, Cancha cancha) throws RecursoNoEncontradoException;
    void eliminar(Long idCancha) throws RecursoNoEncontradoException;
    List<Cancha> getCanchasPorPublicador(Long idUsuario);
}
