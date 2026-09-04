package com.uade.marketplace.service;

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
        Double ingresos = inscripcionRepository.sumMontoPagadoByEstadoPago(EstadoPago.PAGADO);

        return new AnalyticsResponse(
                usuarioRepository.count(),
                canchaRepository.count(),
                canchaRepository.countByActivaTrue(),
                turnoRepository.count(),
                turnoRepository.countByEstado(EstadoTurno.INCOMPLETO),
                turnoRepository.countByEstado(EstadoTurno.LLENO),
                turnoRepository.countByEstado(EstadoTurno.EN_PROCESO),
                inscripcionRepository.count(),
                inscripcionRepository.countByEstadoPago(EstadoPago.PENDIENTE),
                inscripcionRepository.countByEstadoPago(EstadoPago.PAGADO),
                inscripcionRepository.countByEstadoPago(EstadoPago.CANCELADO),
                inscripcionRepository.countByEstadoPago(EstadoPago.REEMBOLSADO),
                ingresos != null ? ingresos : 0.0
        );
    }
}