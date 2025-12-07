package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "technician")
public class Technician {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long technicianId;

    private String name;
    private String level;
    private LocalDateTime availableTime;

    @ManyToMany
    @JoinTable(
            name = "technician_service",
            joinColumns = @JoinColumn(name = "technician_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<ServiceRequest> services;
}
