package com.uade.marketplace.entity;

import java.time.LocalDateTime;

import com.uade.marketplace.entity.enums.EstadoPago;

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
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInscripcion;

    @ManyToOne
    @JoinColumn (name = "idTurno" , nullable = false)
    private Turno turno;
    
   
    @ManyToOne
    @JoinColumn (name = "idUsuario" , nullable = false)
    private Usuario usuarioComprador;

    @Column (nullable = false)
    private LocalDateTime fechaCompra;

    @Column (nullable = false)
    private Double montoPagado;

    @Enumerated(EnumType.STRING)
    private EstadoPago estadoPago;    
}
