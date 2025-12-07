package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "customer")
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    private String name;

    private String phoneNumber;

    private int loyaltyPoints;

    @ElementCollection
    @CollectionTable(
            name = "customer_vehicles",
            joinColumns = @JoinColumn(name = "customer_id")
    )
    @Column(name = "vehicle_name")
    private List<String> vehicleNames;
}
