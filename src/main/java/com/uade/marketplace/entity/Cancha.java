package com.uade.marketplace.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //Convierte en tabla.
@Data
@NoArgsConstructor
@AllArgsConstructor
//Lombok, getters, setters.
public class Cancha {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    //PK que genera MySQL.
    private Long idCancha;

    @Column(nullable = false) //Campo obligatorio para el negocio.
    private String nombre;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String localidad;

    @Column(nullable = false)
    private String tipoSuperficie;

    @Column(nullable = false)
    private Double precioUnitario;

    @Column(nullable = false)
    private Integer cantidadJugadores;
    
    @ManyToOne                                    // FK hacia usuario, MUCHAS canchas las publica UN usuario
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario publicador;

    @OneToMany(mappedBy = "cancha")               // en una cancha se juegan MUCHOS turnos
    @JsonIgnore
    private List<Turno> turnos;
}
