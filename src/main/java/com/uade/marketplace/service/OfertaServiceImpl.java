package com.uade.marketplace.service;

import com.uade.marketplace.entity.Oferta;
import com.uade.marketplace.repository.OfertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OfertaServiceImpl implements OfertaService {

    @Autowired
    private OfertaRepository ofertaRepository;

    @Override
    public List<Oferta> obtenerTodas() {
        return ofertaRepository.findAll();
    }

    @Override
    public Optional<Oferta> obtenerPorTurno(Long idTurno) {
        return ofertaRepository.findById(idTurno);
    }

    @Override
    public Oferta crearOferta(Oferta oferta) {
        return ofertaRepository.save(oferta);
    }

    @Override
    public Oferta actualizarOferta(Long idOferta, Oferta ofertaActualizada) {
        Oferta oferta = ofertaRepository.findById(idOferta)
                .orElseThrow(() -> new RuntimeException("Oferta no encontrada"));
        oferta.setPorcentajeDescuento(ofertaActualizada.getPorcentajeDescuento());
        oferta.setFechaInicio(ofertaActualizada.getFechaInicio());
        oferta.setFechaFin(ofertaActualizada.getFechaFin());
        return ofertaRepository.save(oferta);
    }

    @Override
    public void eliminarOferta(Long idOferta) {
        ofertaRepository.deleteById(idOferta);
    }
}