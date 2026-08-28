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

    public Turno(LocalDateTime fechaHora, String tipoFutbol, int lugaresDisponibles,
                float precioPorJugador, Usuario usuario, Cancha cancha) {
        this.fechaHora = fechaHora;
        this.tipoFutbol = tipoFutbol;
        this.lugaresDisponibles = lugaresDisponibles;
        this.precioPorJugador = precioPorJugador;
        this.estado = EstadoTurno.INCOMPLETO;
        this.usuario = usuario;
        this.cancha = cancha;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTurno;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    @Column(name = "tipo_futbol")
    private String tipoFutbol;

    @Column(name = "lugares_disponibles")
    private int lugaresDisponibles;

    @Column(name = "precio_por_jugador")
    private float precioPorJugador;

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
