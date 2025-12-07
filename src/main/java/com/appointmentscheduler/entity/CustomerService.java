package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "customerservice")
public class CustomerService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerServiceId;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "customerId")
    private Customer customer;

    private String vehicleName;

    @ElementCollection
    @CollectionTable(
            name = "customer_service_needed",
            joinColumns = @JoinColumn(name = "customer_service_id")
    )
    @Column(name = "service_id")
    private List<Integer> servicesNeeded;
}
