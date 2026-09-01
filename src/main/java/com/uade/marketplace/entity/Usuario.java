package com.uade.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

import com.uade.marketplace.entity.enums.NombreRol;

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
    private String contrasena;

    @Column(nullable = false, unique = true)
    private String telefono;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NombreRol rol;
}
