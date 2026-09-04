package com.uade.marketplace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.dto.response.CanchaResponse;
import com.uade.marketplace.service.CanchaService;

@RestController
@RequestMapping("/admin/canchas")
public class AdminCanchaController {

    @Autowired
    private CanchaService canchaService;

    @GetMapping
    public List<CanchaResponse> getAllAdmin() {
        return canchaService.getAllAdmin().stream().map(CanchaResponse::from).toList();
    }
}