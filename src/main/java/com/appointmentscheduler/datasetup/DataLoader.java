package com.appointmentscheduler.datasetup;

import com.appointmentscheduler.entity.Bay;
import com.appointmentscheduler.entity.Inventory;
import com.appointmentscheduler.entity.ServiceRequest;
import com.appointmentscheduler.entity.Technician;
import com.appointmentscheduler.repository.BayRepository;
import com.appointmentscheduler.repository.InventoryRepository;
import com.appointmentscheduler.repository.ServiceRequestRepository;
import com.appointmentscheduler.repository.TechnicianRepository;
import org.springframework.boot.CommandLineRunner;

import java.util.Arrays;

public class DataLoader implements CommandLineRunner {
    private final ServiceRequestRepository serviceRequestRepository;
    private final TechnicianRepository technicianRepository;
    private final BayRepository bayRepository;
    private final InventoryRepository inventoryRepository;

    public DataLoader(ServiceRequestRepository serviceRequestRepository,
                      TechnicianRepository technicianRepository,
                      BayRepository bayRepository,
                      InventoryRepository inventoryRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.technicianRepository = technicianRepository;
        this.bayRepository = bayRepository;
        this.inventoryRepository = inventoryRepository;
    }


    @Override
    public void run(String... args) throws Exception {

        if(serviceRequestRepository.count() > 0) return;


        ServiceRequest s1 = new ServiceRequest();
        s1.setServiceId(1L);
        s1.setIssue("Squeaking Brakes");
        s1.setService("Brake Pad Replacement");
        s1.setServiceTime(120.0);

        ServiceRequest s2 = new ServiceRequest();
        s2.setServiceId(2L);
        s2.setIssue("Engine Light");
        s2.setService("Diagnostic & Repair");
        s2.setServiceTime(180.0);

        ServiceRequest s3 = new ServiceRequest();
        s3.setServiceId(3L);
        s3.setIssue("Oil Change");
        s3.setService("Oil & Filter Service");
        s3.setServiceTime(60.0);

        ServiceRequest s4 = new ServiceRequest();
        s4.setServiceId(4L);
        s4.setIssue("Tire Issues");
        s4.setService("Tire Replacement");
        s4.setServiceTime(90.0);

        ServiceRequest s5 = new ServiceRequest();
        s5.setServiceId(5L);
        s5.setIssue("Dead Battery");
        s5.setService("Battery Replacement");
        s5.setServiceTime(60.0);

        ServiceRequest s6 = new ServiceRequest();
        s6.setServiceId(6L);
        s6.setIssue("Overheating");
        s6.setService("Diagnostic & Repair");
        s6.setServiceTime(60.0);

        serviceRequestRepository.saveAll(Arrays.asList(s1,s2,s3,s4,s5,s6));
//-------------------------------------------------------------------
        Technician Ax = new Technician();
        Ax.setName("Ax");
        Ax.setLevel("A");
        Ax.setServices(Arrays.asList(s2, s1, s6)); // example mapping

        Technician Ay = new Technician();
        Ay.setName("Ay");
        Ay.setLevel("A");
        Ay.setServices(Arrays.asList(s2, s1, s6));

        Technician Az = new Technician();
        Az.setName("Ax");
        Az.setLevel("A");
        Az.setServices(Arrays.asList(s2, s1, s6));

        Technician Bx = new Technician();
        Bx.setName("Bx");
        Bx.setLevel("B");
        Bx.setServices(Arrays.asList(s1, s3, s4));

        Technician By = new Technician();
        By.setName("By");
        By.setLevel("B");
        By.setServices(Arrays.asList(s1, s3, s4));

        Technician Bz = new Technician();
        Bz.setName("Bz");
        Bz.setLevel("B");
        Bz.setServices(Arrays.asList(s1, s3, s4));

        Technician Cx = new Technician();
        Cx.setName("Cx");
        Cx.setLevel("C");
        Cx.setServices(Arrays.asList(s3, s5));

        Technician Cy = new Technician();
        Cy.setName("Cy");
        Cy.setLevel("C");
        Cy.setServices(Arrays.asList(s3, s5));

        Technician Cz = new Technician();
        Cz.setName("Cz");
        Cz.setLevel("C");
        Cz.setServices(Arrays.asList(s3, s5));

        technicianRepository.saveAll(Arrays.asList(Ax,Ay,Az, Bx, By, Bz, Cx, Cy, Cz));

//        -----------------------------------------------------------------------------------

        Bay general = new Bay();
        general.setBayType("General Repair");
        general.setServiceRequests(Arrays.asList(s1, s2, s6));

        Bay quick = new Bay();
        quick.setBayType("Quick Service");
        quick.setServiceRequests(Arrays.asList(s3, s5));

        Bay tire = new Bay();
        tire.setBayType("Tire and Wheel");
        tire.setServiceRequests(Arrays.asList(s4));

        bayRepository.saveAll(Arrays.asList(general, quick, tire));

//        ---------------------------------------------------------

        Inventory i1 = new Inventory();
        i1.setPartName("Brake Pads");
        i1.setAvailableParts(3);
        i1.setOrderedParts(0);
        i1.setServiceRequests(Arrays.asList(s1));

        Inventory i7 = new Inventory();
        i1.setPartName("Rotor");
        i1.setAvailableParts(3);
        i1.setOrderedParts(0);
        i1.setServiceRequests(Arrays.asList(s1));

        Inventory i2 = new Inventory();
        i2.setPartName("OBD Scanner");
        i2.setAvailableParts(2);
        i2.setOrderedParts(0);
        i2.setServiceRequests(Arrays.asList(s2));

        Inventory i3 = new Inventory();
        i3.setPartName("Engine Oil");
        i3.setAvailableParts(5);
        i3.setOrderedParts(0);
        i3.setServiceRequests(Arrays.asList(s3));

        Inventory i9 = new Inventory();
        i3.setPartName("Filter");
        i3.setAvailableParts(5);
        i3.setOrderedParts(0);
        i3.setServiceRequests(Arrays.asList(s3));

        Inventory i4 = new Inventory();
        i4.setPartName("Tires");
        i4.setAvailableParts(4);
        i4.setOrderedParts(0);
        i4.setServiceRequests(Arrays.asList(s4));

        Inventory i10 = new Inventory();
        i4.setPartName("Valvestems");
        i4.setAvailableParts(4);
        i4.setOrderedParts(0);
        i4.setServiceRequests(Arrays.asList(s4));

        Inventory i5 = new Inventory();
        i5.setPartName("Battery");
        i5.setAvailableParts(1);
        i5.setOrderedParts(0);
        i5.setServiceRequests(Arrays.asList(s5));

        Inventory i6 = new Inventory();
        i6.setPartName("Coolant");
        i6.setAvailableParts(2);
        i6.setOrderedParts(0);
        i6.setServiceRequests(Arrays.asList(s6));

        Inventory i8 = new Inventory();
        i6.setPartName("Thermostat");
        i6.setAvailableParts(2);
        i6.setOrderedParts(0);
        i6.setServiceRequests(Arrays.asList(s6));

        inventoryRepository.saveAll(Arrays.asList(i1,i2,i3,i4,i5,i6,i7,i8,i9,i10));

    }
}
