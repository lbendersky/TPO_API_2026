package com.uade.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.uade.marketplace.entity.enums.NombreRol;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data // Genera getters y setters automáticamente
@NoArgsConstructor // para Hibernate
@AllArgsConstructor // para crear un constructor con todos los atributos
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(nullable = false, unique = true)
    private String nombreUsuario;

    @Column(nullable = false, unique = true)
    private String dni;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String contrasena;

    @Column(nullable = false, unique = true)
    private String telefono;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NombreRol rol;
}
