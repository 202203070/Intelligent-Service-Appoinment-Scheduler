package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "service_request")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;
    private String issue;
    private int serviceTime;
    private String service;

    @ManyToMany(mappedBy = "serviceRequests")
    private List<Bay> bays;

    @ManyToMany(mappedBy = "services")
    private List<Technician> technicians;

    @ManyToMany(mappedBy = "serviceRequests")
    private List<Inventory> inventoryItems;
}
