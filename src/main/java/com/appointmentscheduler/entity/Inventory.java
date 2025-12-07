package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "inventory")
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    private String partName;
    private int availableParts;
    private int orderedParts;


    @ManyToMany
    @JoinTable(
            name = "inventory_service",
            joinColumns = @JoinColumn(name = "inventory_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<ServiceRequest> serviceRequests;
}
