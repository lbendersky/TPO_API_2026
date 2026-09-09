package com.uade.marketplace.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.marketplace.dto.request.OfertaRequest;
import com.uade.marketplace.dto.response.OfertaResponse;
import com.uade.marketplace.entity.Oferta;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.SolicitudInvalidaException;
import com.uade.marketplace.repository.OfertaRepository;
import com.uade.marketplace.repository.TurnoRepository;

@Service
public class OfertaServiceImpl implements OfertaService {

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private TurnoRepository turnoRepository;

    @Override
    public List<OfertaResponse> obtenerTodas() {
        return ofertaRepository.findAll().stream().map(OfertaResponse::from).toList();
    }

    @Override
    public Optional<OfertaResponse> obtenerPorTurno(Long idTurno) {
        List<Oferta> ofertas = ofertaRepository.findByTurno_IdTurno(idTurno);
        return ofertas.isEmpty() ? Optional.empty() : Optional.of(OfertaResponse.from(ofertas.get(0)));
    }

    @Override
    public OfertaResponse crearOferta(OfertaRequest request) throws RecursoNoEncontradoException {
        if (request.getIdTurno() == null)
            throw new RecursoNoEncontradoException("Falta indicar el turno de la oferta");
        Turno turno = turnoRepository.findById(request.getIdTurno())
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe el turno " + request.getIdTurno()));
        validarDatos(request);
        Oferta oferta = Oferta.builder()
                .porcentajeDescuento(request.getPorcentajeDescuento())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .turno(turno)
                .build();
        return OfertaResponse.from(ofertaRepository.save(oferta));
    }

    @Override
    public OfertaResponse actualizarOferta(Long idOferta, OfertaRequest request) throws RecursoNoEncontradoException {
        Oferta oferta = ofertaRepository.findById(idOferta)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la oferta " + idOferta));
        validarDatos(request);
        oferta.setPorcentajeDescuento(request.getPorcentajeDescuento());
        oferta.setFechaInicio(request.getFechaInicio());
        oferta.setFechaFin(request.getFechaFin());
        return OfertaResponse.from(ofertaRepository.save(oferta));
    }

    @Override
    public void eliminarOferta(Long idOferta) {
        ofertaRepository.deleteById(idOferta);
    }

    @Override
    public List<Oferta> obtenerActivas() {
        return ofertaRepository.findActivas(LocalDate.now());
    }

    @Override
    public Optional<Oferta> obtenerOfertaActivaPorTurno(Long idTurno) {
        LocalDate hoy = LocalDate.now();
        return ofertaRepository.findByTurno_IdTurno(idTurno).stream()
                .filter(o -> !hoy.isBefore(o.getFechaInicio()) && !hoy.isAfter(o.getFechaFin()))
                .findFirst();
    }

    @Override
    public Float calcularPrecioConDescuento(Float precioOriginal, Oferta ofertaActiva) {
        if (ofertaActiva == null || precioOriginal == null) return precioOriginal;
        float descuento = precioOriginal * (ofertaActiva.getPorcentajeDescuento().floatValue() / 100f);
        return precioOriginal - descuento;
    }

    private void validarDatos(OfertaRequest request) {
        if (request.getPorcentajeDescuento() == null
                || request.getPorcentajeDescuento() <= 0
                || request.getPorcentajeDescuento() > 100)
            throw new SolicitudInvalidaException("El porcentaje de descuento debe estar entre 0 y 100");
        if (request.getFechaInicio() == null || request.getFechaFin() == null)
            throw new SolicitudInvalidaException("Debe indicar fecha de inicio y fecha de fin");
        if (request.getFechaInicio().isAfter(request.getFechaFin()))
            throw new SolicitudInvalidaException("La fecha de inicio no puede ser posterior a la fecha de fin");
    }
}