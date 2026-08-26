package com.uade.marketplace.entity;

import java.time.LocalDateTime;

import com.uade.marketplace.entity.enums.EstadoTurno;

import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.Data;

@Entity
@Data
public class Turno {

    public Turno() {}

    public Turno(LocalDateTime fecha_hora, String tipo_futbol, int lugares_disponibles,
                 float precio_por_jugador, Usuario usuario, Cancha cancha) {
        this.fecha_hora = fecha_hora;
        this.tipo_futbol = tipo_futbol;
        this.lugares_disponibles = lugares_disponibles;
        this.precio_por_jugador = precio_por_jugador;
        this.estado = EstadoTurno.INCOMPLETO;
        this.usuario = usuario;
        this.cancha = cancha;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTurno;

    @Column
    private LocalDateTime fecha_hora;

    @Column
    private String tipo_futbol;

    @Column
    private int lugares_disponibles;

    @Column
    private float precio_por_jugador;

    @Enumerated(EnumType.STRING)
    @Column(check = @CheckConstraint(name = "chequear_estado_turno", constraint = "estado IN ('INCOMPLETO', 'LLENO', 'EN_PROCESO')"))
    private EstadoTurno estado;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_cancha", nullable = false)
    private Cancha cancha;
}
