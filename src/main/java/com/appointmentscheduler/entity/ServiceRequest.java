package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "service_request")
@AllArgsConstructor
@Builder
@Getter
@Setter
@NoArgsConstructor
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    private String issue;
    private Double serviceTime;
    private String service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToMany(mappedBy = "serviceRequests")
    private List<Bay> bays;

    @ManyToMany(mappedBy = "services")
    private List<Technician> technicians;

    @ManyToMany(mappedBy = "serviceRequests")
    private List<Inventory> inventoryItems;



    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getIssue() {
        return issue;
    }

    public void setIssue(String issue) {
        this.issue = issue;
    }

    public Double getServiceTime() {
        return serviceTime;
    }

    public void setServiceTime(Double serviceTime) {
        this.serviceTime = serviceTime;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public List<Bay> getBays() {
        return bays;
    }

    public void setBays(List<Bay> bays) {
        this.bays = bays;
    }

    public List<Technician> getTechnicians() {
        return technicians;
    }

    public void setTechnicians(List<Technician> technicians) {
        this.technicians = technicians;
    }

    public List<Inventory> getInventoryItems() {
        return inventoryItems;
    }

    public void setInventoryItems(List<Inventory> inventoryItems) {
        this.inventoryItems = inventoryItems;
    }
}
