package com.uade.marketplace.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.uade.marketplace.entity.enums.TipoSuperficie;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cancha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCancha;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String direccion;

    @ManyToOne
    @JoinColumn(name = "id_localidad", nullable = false)
    private Localidad localidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoSuperficie tipoSuperficie;

    @Column(nullable = false)
    private Double precioUnitario;

    @Column(nullable = false)
    private Integer cantidadJugadores;

    @Column
    private String descripcion;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(name = "motivo_baja")
    private String motivoBaja;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario publicador;

    @OneToMany(mappedBy = "cancha")
    @JsonIgnore
    private List<Turno> turnos;
}
