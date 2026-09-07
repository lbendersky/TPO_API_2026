package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.dto.request.OfertaRequest;
import com.uade.marketplace.entity.Oferta;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;

public interface OfertaService {
    List<Oferta> obtenerTodas();
    Optional<Oferta> obtenerPorTurno(Long idTurno);
    Oferta crearOferta(OfertaRequest request) throws RecursoNoEncontradoException;
    Oferta actualizarOferta(Long idOferta, OfertaRequest request) throws RecursoNoEncontradoException;
    void eliminarOferta(Long idOferta);
    List<Oferta> obtenerActivas();
    Optional<Oferta> obtenerOfertaActivaPorTurno(Long idTurno);
    Float calcularPrecioConDescuento(Float precioOriginal, Oferta ofertaActiva);
}
