package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
//@Getter
//@Setter
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


    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public String getPartName() {
        return partName;
    }

    public void setPartName(String partName) {
        this.partName = partName;
    }

    public int getAvailableParts() {
        return availableParts;
    }

    public void setAvailableParts(int availableParts) {
        this.availableParts = availableParts;
    }

    public int getOrderedParts() {
        return orderedParts;
    }

    public void setOrderedParts(int orderedParts) {
        this.orderedParts = orderedParts;
    }

    public List<ServiceRequest> getServiceRequests() {
        return serviceRequests;
    }

    public void setServiceRequests(List<ServiceRequest> serviceRequests) {
        this.serviceRequests = serviceRequests;
    }

}
