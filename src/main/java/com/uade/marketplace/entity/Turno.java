package com.uade.marketplace.entity;

import java.time.LocalDateTime;

import com.uade.marketplace.entity.enums.EstadoTurno;
import com.uade.marketplace.entity.enums.TipoFutbol;

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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTurno;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_futbol")
    private TipoFutbol tipoFutbol;

    @Column(name = "lugares_disponibles")
    private Integer lugaresDisponibles;

    @Column(name = "precio_por_jugador")
    private Float precioPorJugador;

    @Column
    private String descripcion;

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
