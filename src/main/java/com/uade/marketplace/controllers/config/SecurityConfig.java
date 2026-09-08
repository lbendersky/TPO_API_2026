package com.uade.marketplace.controllers.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.uade.marketplace.entity.enums.Rol;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req
                        // Auth y errores
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/error/**").permitAll()

                        // Navegar el catalogo sin loguearse
                        .requestMatchers(HttpMethod.GET, "/turnos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/canchas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ofertas/**").permitAll()

                        // Solo ADMIN
                        .requestMatchers("/admin/**").hasAnyAuthority(Rol.ADMIN.name())
                        .requestMatchers("/ofertas/**").hasAnyAuthority(Rol.ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/inscripciones").hasAnyAuthority(Rol.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/inscripciones/*/estado-pago").hasAnyAuthority(Rol.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/inscripciones/**").hasAnyAuthority(Rol.ADMIN.name())
                        
                        // Cualquier usuario autenticado (USUARIO o ADMIN)
                        .anyRequest().authenticated())
                        .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                        .authenticationProvider(authenticationProvider)
                        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}