package com.appointmentscheduler.repository;

import com.appointmentscheduler.entity.Technician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Long> {
    @Query("SELECT t FROM Technician t JOIN t.services s WHERE s.serviceId = :serviceId")
    List<Technician> findTechniciansByServiceId(@Param("serviceId") Long serviceId);
}
