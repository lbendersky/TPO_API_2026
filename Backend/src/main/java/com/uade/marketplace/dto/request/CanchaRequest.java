package com.uade.marketplace.dto.request;

import com.uade.marketplace.entity.enums.TipoFutbol;
import com.uade.marketplace.entity.enums.TipoSuperficie;

import lombok.Data;

@Data
public class CanchaRequest {
    private String nombre;
    private String direccion;
    private Long idLocalidad;
    private TipoSuperficie tipoSuperficie;
    private TipoFutbol tipoFutbol;
    private Double precioUnitario;
    private String descripcion;
}