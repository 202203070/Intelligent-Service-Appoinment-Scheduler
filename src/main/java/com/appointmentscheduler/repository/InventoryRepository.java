package com.appointmentscheduler.repository;

import com.appointmentscheduler.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
//    @Query("SELECT i FROM Inventory i JOIN i.serviceRequests s WHERE s.serviceId IN :serviceIds")
//    List<Inventory> findPartsForServices(@Param("serviceIds") List<Integer> serviceIds);

    @Query("SELECT i FROM Inventory i JOIN i.serviceRequests s WHERE s.serviceId = :serviceId")
    List<Inventory> findPartsForService(@Param("serviceId") int serviceId);
}
