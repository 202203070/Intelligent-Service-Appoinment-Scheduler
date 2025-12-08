package com.appointmentscheduler.repository;

import com.appointmentscheduler.entity.TechnicianScheduler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface TechnicianSchedulerRepository extends JpaRepository<TechnicianScheduler, Long> {
    Optional<TechnicianScheduler> findByTechnician_TechnicianIdAndDate(Long technicianId, LocalDate date);
}
