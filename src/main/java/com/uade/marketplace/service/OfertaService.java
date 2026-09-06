package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.entity.Oferta;

public interface OfertaService {
    List<Oferta> obtenerTodas();
    Optional<Oferta> obtenerPorTurno(Long idTurno);
    Oferta crearOferta(Oferta oferta);
    Oferta actualizarOferta(Long idOferta, Oferta oferta);
    void eliminarOferta(Long idOferta);
}
