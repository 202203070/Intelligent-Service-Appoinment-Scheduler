package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "technician")
public class Technician {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long technicianId;

    private String name;
    private String level;
    //private LocalDateTime availableTime;

    @ManyToMany
    @JoinTable(
            name = "technician_service",
            joinColumns = @JoinColumn(name = "technician_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<ServiceRequest> services;
}
