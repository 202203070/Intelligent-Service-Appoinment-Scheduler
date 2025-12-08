package com.appointmentscheduler.repository;

import com.appointmentscheduler.entity.Bay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BayRepository extends JpaRepository<Bay,Long> {
    @Query("SELECT b FROM Bay b JOIN b.serviceRequests s WHERE s.serviceId = :serviceId")
    List<Bay> findBaysByServiceId(@Param("serviceId") Long serviceId);
}
