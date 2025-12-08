package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Table(name="bay")
public class Bay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bayId;
    private String bayType;
    //private LocalDateTime time;

    @ManyToMany
    @JoinTable(
            name = "bay_service_mapping",
            joinColumns = @JoinColumn(name = "bay_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<ServiceRequest> serviceRequests;


    public Long getBayId() {
        return bayId;
    }

    public void setBayId(Long bayId) {
        this.bayId = bayId;
    }

    public String getBayType() {
        return bayType;
    }

    public void setBayType(String bayType) {
        this.bayType = bayType;
    }

    public List<ServiceRequest> getServiceRequests() {
        return serviceRequests;
    }

    public void setServiceRequests(List<ServiceRequest> serviceRequests) {
        this.serviceRequests = serviceRequests;
    }

}
