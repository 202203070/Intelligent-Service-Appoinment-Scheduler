package com.appointmentscheduler.repository;

import com.appointmentscheduler.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    @Query("SELECT i FROM Inventory i JOIN i.serviceRequests s WHERE s.serviceId IN :serviceIds")
    List<Inventory> findPartsForServices(@Param("serviceIds") List<Integer> serviceIds);
}
