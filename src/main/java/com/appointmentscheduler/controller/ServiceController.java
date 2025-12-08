package com.appointmentscheduler.controller;


import com.appointmentscheduler.entity.Bay;
import com.appointmentscheduler.entity.ServiceRequest;
import com.appointmentscheduler.entity.Customer;
import com.appointmentscheduler.entity.Technician;
import com.appointmentscheduler.entity.Appointment;
import com.appointmentscheduler.entity.Inventory;
import com.appointmentscheduler.repository.BayRepository;
import com.appointmentscheduler.repository.ServiceRequestRepository;
import com.appointmentscheduler.repository.CustomerRepository;
import com.appointmentscheduler.repository.TechnicianRepository;
import com.appointmentscheduler.repository.AppointmentRepository;
import com.appointmentscheduler.repository.InventoryRepository;
import com.appointmentscheduler.service.BayAndTechnicianService;
import com.appointmentscheduler.service.InventoryService;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
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
    private CustomerRepository customerRepository;
    private AppointmentRepository appointmentRepository;
    private InventoryRepository inventoryRepository;

    ServiceController(BayAndTechnicianService bayAndTechnicianService, InventoryService inventoryService, TechnicianRepository technicianRepository, BayRepository bayRepository, ServiceRequestRepository serviceRequestRepository, CustomerRepository customerRepository, AppointmentRepository appointmentRepository, InventoryRepository inventoryRepository){
        this.bayAndTechnicianService=bayAndTechnicianService;
        this.inventoryService=inventoryService;
        this.technicianRepository=technicianRepository;
        this.bayRepository=bayRepository;
        this.serviceRequestRepository=serviceRequestRepository;
        this.customerRepository=customerRepository;
        this.appointmentRepository=appointmentRepository;
        this.inventoryRepository=inventoryRepository;

    }

    @PostMapping("/returnslot")
    public ResponseEntity<?>getReturnCarSlot(@RequestBody List<Integer> services){
        LocalDateTime maxDateTime = null;
        for(int i=0;i<services.size();i++){
            List<Technician> technicians = technicianRepository.findTechniciansByServiceId(Long.valueOf(services.get(i)));
            List<Bay> bays = bayRepository.findBaysByServiceId(Long.valueOf(services.get(i)));


            LocalDateTime currentDateTime= this.bayAndTechnicianService.bayAndTechnicianAvailability(this.inventoryService.inventoryAvailability(services.get(i)),(this.serviceRequestRepository.findServiceTimeByServiceId(Long.valueOf(services.get(i)))),technicians,bays);
            if (maxDateTime == null || currentDateTime.isAfter(maxDateTime)) {
                maxDateTime = currentDateTime;
            }
        }
        return ResponseEntity.ok(maxDateTime);
    }

    @PostMapping("/technicians/for-services")
    public ResponseEntity<List<Technician>> getTechniciansForServices(@RequestBody List<Integer> services) {
        // For now, just return distinct technicians qualified for any of the requested services
        // Frontend can pick how to present/choose among them.
        List<Technician> all = services.stream()
                .map(id -> technicianRepository.findTechniciansByServiceId(Long.valueOf(id)))
                .flatMap(List::stream)
                .distinct()
                .toList();
        return ResponseEntity.ok(all);
    }

    @PostMapping("/bays/for-services")
    public ResponseEntity<List<Bay>> getBaysForServices(@RequestBody List<Integer> services) {
        List<Bay> all = services.stream()
                .map(id -> bayRepository.findBaysByServiceId(Long.valueOf(id)))
                .flatMap(List::stream)
                .distinct()
                .toList();
        return ResponseEntity.ok(all);
    }

    @PostMapping("/inventory/for-service")
    public ResponseEntity<List<Inventory>> getInventoryForService(@RequestBody Integer serviceId) {
        List<Inventory> items = inventoryRepository.findPartsForService(serviceId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceRequest>> getAllServices() {
        List<ServiceRequest> services = serviceRequestRepository.findAll();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return ResponseEntity.ok(customers);
    }

    @PostMapping("/customers")
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        customer.setCustomerId(null); // ensure ID is generated by DB
        Customer saved = customerRepository.save(customer);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer updated) {
        return customerRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setPhoneNumber(updated.getPhoneNumber());
                    existing.setLoyaltyPoints(updated.getLoyaltyPoints());
                    existing.setVehicleNames(updated.getVehicleNames());
                    Customer saved = customerRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        Appointment appt = Appointment.builder()
                .customerId(request.getCustomerId())
                .technicianId(request.getTechnicianId())
                .bayId(request.getBayId())
                .date(LocalDate.parse(request.getDate()))
                .time(LocalTime.parse(request.getTime()))
                .serviceSummary(request.getServiceSummary())
                .build();
        Appointment saved = appointmentRepository.save(appt);
        return ResponseEntity.ok(saved);
    }

    public static class AppointmentRequest {
        private Long customerId;
        private Long technicianId;
        private Long bayId;
        private String date; // ISO local date: yyyy-MM-dd
        private String time; // HH:mm or HH:mm:ss
        private String serviceSummary;

        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }
        public Long getTechnicianId() { return technicianId; }
        public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }
        public Long getBayId() { return bayId; }
        public void setBayId(Long bayId) { this.bayId = bayId; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
        public String getServiceSummary() { return serviceSummary; }
        public void setServiceSummary(String serviceSummary) { this.serviceSummary = serviceSummary; }
    }
}
