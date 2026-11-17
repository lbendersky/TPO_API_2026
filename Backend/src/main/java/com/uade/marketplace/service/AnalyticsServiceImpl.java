package com.uade.marketplace.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.marketplace.dto.response.AnalyticsResponse;
import com.uade.marketplace.entity.enums.EstadoPago;
import com.uade.marketplace.entity.enums.EstadoTurno;
import com.uade.marketplace.repository.CanchaRepository;
import com.uade.marketplace.repository.InscripcionRepository;
import com.uade.marketplace.repository.TurnoRepository;
import com.uade.marketplace.repository.UsuarioRepository;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private CanchaRepository canchaRepository;
    @Autowired
    private TurnoRepository turnoRepository;
    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Override
    public AnalyticsResponse getAnalytics() {
        LocalDateTime ahora = LocalDateTime.now();

        Double ingresosTarjetaRaw = inscripcionRepository.sumMontoPagadoByEstadoPago(EstadoPago.PAGADO);
        Double ingresosEfectivoRaw = inscripcionRepository.sumMontoPagadoByEstadoPagoYFechaHasta(EstadoPago.EFECTIVO, ahora);
        Double ingresosEfectivoFuturosRaw = inscripcionRepository.sumMontoPagadoByEstadoPagoYFechaDesde(EstadoPago.EFECTIVO, ahora);

        double ingresosTarjeta = ingresosTarjetaRaw != null ? ingresosTarjetaRaw : 0.0;
        double ingresosEfectivo = ingresosEfectivoRaw != null ? ingresosEfectivoRaw : 0.0;
        double ingresosEfectivoFuturos = ingresosEfectivoFuturosRaw != null ? ingresosEfectivoFuturosRaw : 0.0;

        return new AnalyticsResponse(
                usuarioRepository.count(),
                canchaRepository.count(),
                canchaRepository.countByActivaTrue(),
                turnoRepository.count(),
                turnoRepository.countByEstado(EstadoTurno.INCOMPLETO),
                turnoRepository.countByEstado(EstadoTurno.LLENO),
                inscripcionRepository.count(),
                inscripcionRepository.countByEstadoPago(EstadoPago.PENDIENTE),
                inscripcionRepository.countByEstadoPago(EstadoPago.PAGADO),
                inscripcionRepository.countByEstadoPago(EstadoPago.CANCELADO),
                inscripcionRepository.countByEstadoPago(EstadoPago.REEMBOLSADO),
                inscripcionRepository.countByEstadoPago(EstadoPago.EFECTIVO),
                ingresosTarjeta,
                ingresosEfectivo,
                ingresosEfectivoFuturos,
                ingresosTarjeta + ingresosEfectivo
        );
    }
}