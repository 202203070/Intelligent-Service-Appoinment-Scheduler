package com.appointmentscheduler.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "bay_schedule")
@Getter
@Setter
@NoArgsConstructor
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
}
