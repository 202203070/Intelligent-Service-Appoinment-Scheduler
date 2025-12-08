package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "technician_schedule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class TechnicianScheduler {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "technician_id", nullable = false)
    private Technician technician;

    private LocalDate date;

    private Integer bitmask; // 18 bits → 18 slots

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Technician getTechnician() {
        return technician;
    }

    public void setTechnician(Technician technician) {
        this.technician = technician;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getBitmask() {
        return bitmask;
    }

    public void setBitmask(Integer bitmask) {
        this.bitmask = bitmask;
    }
}
