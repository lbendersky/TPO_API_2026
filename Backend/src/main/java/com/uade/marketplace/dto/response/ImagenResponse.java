package com.uade.marketplace.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImagenResponse {
    private Long id;
    private String nombre;
    private String file;
}