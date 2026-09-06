package com.uade.marketplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnalyticsResponse {
    private long totalUsuarios;
    private long totalCanchas;
    private long totalCanchasActivas;
    private long totalTurnos;
    private long turnosIncompletos;
    private long turnosLlenos;
    private long turnosEnProceso;
    private long totalInscripciones;
    private long inscripcionesPendientes;
    private long inscripcionesPagadas;
    private long inscripcionesCanceladas;
    private long inscripcionesReembolsadas;
    private double ingresosTotales;
}