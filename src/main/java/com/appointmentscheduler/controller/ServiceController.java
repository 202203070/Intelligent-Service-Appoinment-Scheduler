package com.appointmentscheduler.controller;


import com.appointmentscheduler.entity.Bay;
import com.appointmentscheduler.entity.ServiceRequest;
import com.appointmentscheduler.entity.Technician;
import com.appointmentscheduler.repository.BayRepository;
import com.appointmentscheduler.repository.ServiceRequestRepository;
import com.appointmentscheduler.repository.TechnicianRepository;
import com.appointmentscheduler.service.BayAndTechnicianService;
import com.appointmentscheduler.service.InventoryService;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1")
public class ServiceController {
    private BayAndTechnicianService bayAndTechnicianService;
    private InventoryService inventoryService;
    private TechnicianRepository technicianRepository;
    private BayRepository bayRepository;
    private ServiceRequestRepository serviceRequestRepository;

    ServiceController(BayAndTechnicianService bayAndTechnicianService, InventoryService inventoryService, TechnicianRepository technicianRepository, BayRepository bayRepository, ServiceRequestRepository serviceRequestRepository){
        this.bayAndTechnicianService=bayAndTechnicianService;
        this.inventoryService=inventoryService;
        this.technicianRepository=technicianRepository;
        this.bayRepository=bayRepository;
        this.serviceRequestRepository=serviceRequestRepository;

    }

    @PostMapping("/returnslot")
    public ResponseEntity<?>getReturnCarSlot(@RequestBody List<Integer> services){
        LocalDateTime maxDateTime = null;
        for(int i=0;i<services.size();i++){
            List<Technician> technicians = technicianRepository.findTechniciansByServiceId(Long.valueOf(services.get(i)));
            List<Bay> bays = bayRepository.findBaysByServiceId(Long.valueOf(services.get(i)));


            LocalDateTime currentDateTime= this.bayAndTechnicianService.bayAndTechnicianAvailability(this.inventoryService.inventoryAvailability(services.get(i)),this.serviceRequestRepository.findServiceTimeByServiceId(Long.valueOf(services.get(i))),technicians,bays);
            if (maxDateTime == null || currentDateTime.isAfter(maxDateTime)) {
                maxDateTime = currentDateTime;
            }
        }
        return ResponseEntity.ok(maxDateTime);
    }
}
