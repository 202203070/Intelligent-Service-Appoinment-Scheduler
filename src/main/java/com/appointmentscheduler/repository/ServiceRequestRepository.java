package com.appointmentscheduler.repository;

import com.appointmentscheduler.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    @Query("SELECT s.serviceTime FROM ServiceRequest s WHERE s.serviceId = :serviceId")
    Integer findServiceTimeByServiceId(@Param("serviceId") Long serviceId);
}
