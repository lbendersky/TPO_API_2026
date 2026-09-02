package com.uade.marketplace.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.marketplace.controllers.config.JwtService;
import com.uade.marketplace.dto.request.AuthenticationRequest;
import com.uade.marketplace.dto.request.RegisterRequest;
import com.uade.marketplace.dto.response.AuthenticationResponse;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = Usuario.builder()
                .email(request.getEmail())
                .nombre(request.getNombre())
                .nombreUsuario(request.getNombreUsuario())
                .dni(request.getDni())
                .telefono(request.getTelefono())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .rol(com.uade.marketplace.entity.enums.Rol.USUARIO)
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getContrasena()));

        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().accessToken(jwtToken).build();
    }
}
