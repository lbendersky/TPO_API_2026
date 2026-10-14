package com.uade.marketplace.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data 
public class Oferta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOferta;  
    
    @Column
    private Double porcentajeDescuento;

    @Column
    private LocalDate fechaInicio;

    @Column
    private LocalDate fechaFin;

    @OneToOne
    @JoinColumn(name = "idTurno", nullable = false)
    private Turno turno;
}
