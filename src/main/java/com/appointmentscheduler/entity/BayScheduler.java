package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "bay_schedule")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class BayScheduler {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bay_id", nullable = false)
    private Bay bay;

    private LocalDate date;

    private Integer bitmask;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bay getBay() {
        return bay;
    }

    public void setBay(Bay bay) {
        this.bay = bay;
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
