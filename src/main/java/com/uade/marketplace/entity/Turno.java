package com.uade.marketplace.entity;

import java.time.LocalDateTime;

import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class Turno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_turno;

    @Column
    private LocalDateTime fecha_hora;

    @Column 
    private String tipo_futbol;

    @Column
    private int lugares_disponibles;

    @Column
    private float precio_por_jugador;

    @Column(check = @CheckConstraint(name = "chequear_estado", constraint = "estado IN ('INCOMPLETO', 'LLENO', 'EN PROCESO')"))
    private String estado;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_cancha", nullable = false)
    private Cancha cancha;
}
