package com.appointmentscheduler.datasetup;

import com.appointmentscheduler.entity.Bay;
import com.appointmentscheduler.entity.Customer;
import com.appointmentscheduler.entity.Inventory;
import com.appointmentscheduler.entity.ServiceRequest;
import com.appointmentscheduler.entity.Technician;
import com.appointmentscheduler.repository.BayRepository;
import com.appointmentscheduler.repository.CustomerRepository;
import com.appointmentscheduler.repository.InventoryRepository;
import com.appointmentscheduler.repository.ServiceRequestRepository;
import com.appointmentscheduler.repository.TechnicianRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    private final ServiceRequestRepository serviceRequestRepository;
    private final TechnicianRepository technicianRepository;
    private final BayRepository bayRepository;
    private final InventoryRepository inventoryRepository;
    private final CustomerRepository customerRepository;

    public DataLoader(ServiceRequestRepository serviceRequestRepository,
                      TechnicianRepository technicianRepository,
                      BayRepository bayRepository,
                      InventoryRepository inventoryRepository,
                      CustomerRepository customerRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.technicianRepository = technicianRepository;
        this.bayRepository = bayRepository;
        this.inventoryRepository = inventoryRepository;
        this.customerRepository = customerRepository;
    }


    @Override
    public void run(String... args) throws Exception {
        // Only seed once for this demo
        if (customerRepository.count() > 0) {
            return;
        }

        // 6. Customers (from notes, IDs auto-generated instead of CUST-XXX)
        Customer diana = new Customer();
        diana.setName("Diana Prince");
        diana.setPhoneNumber("555-0104");
        diana.setLoyaltyPoints(80);
        diana.setVehicleNames(Collections.singletonList("2018 Audi A4"));

        Customer bob = new Customer();
        bob.setName("Bob Vance");
        bob.setPhoneNumber("555-0101");
        bob.setLoyaltyPoints(95);
        bob.setVehicleNames(Collections.singletonList("2020 BMW X5"));

        Customer alice = new Customer();
        alice.setName("Alice Smith");
        alice.setPhoneNumber("555-0102");
        alice.setLoyaltyPoints(15);
        alice.setVehicleNames(Collections.singletonList("2018 Honda Civic"));

        customerRepository.saveAll(Arrays.asList(diana, bob, alice));

        // 3. Service Catalog (hard-coded services from table)
        ServiceRequest squeakingBrakes = new ServiceRequest();
        squeakingBrakes.setIssue("Squeaking Brakes");
        squeakingBrakes.setService("Squeaking Brakes");
        squeakingBrakes.setServiceTime(120.0); // Level B, GENERAL
        squeakingBrakes.setCustomer(diana);

        ServiceRequest engineLight = new ServiceRequest();
        engineLight.setIssue("Engine Light");
        engineLight.setService("Engine Light");
        engineLight.setServiceTime(180.0); // Level A, GENERAL
        engineLight.setCustomer(bob);

        ServiceRequest overheating = new ServiceRequest();
        overheating.setIssue("Overheating");
        overheating.setService("Overheating");
        overheating.setServiceTime(60.0); // Level B, GENERAL
        overheating.setCustomer(diana);

        ServiceRequest oilChange = new ServiceRequest();
        oilChange.setIssue("Oil Change");
        oilChange.setService("Oil Change");
        oilChange.setServiceTime(60.0); // Level C, QUICK
        oilChange.setCustomer(alice);

        ServiceRequest deadBattery = new ServiceRequest();
        deadBattery.setIssue("Dead Battery");
        deadBattery.setService("Dead Battery");
        deadBattery.setServiceTime(60.0); // Level C, QUICK
        deadBattery.setCustomer(alice);

        ServiceRequest tireIssues = new ServiceRequest();
        tireIssues.setIssue("Tire Issues");
        tireIssues.setService("Tire Issues");
        tireIssues.setServiceTime(90.0); // Level B, TIRE_ISSUES
        tireIssues.setCustomer(diana);

        List<ServiceRequest> services = Arrays.asList(
                squeakingBrakes,
                engineLight,
                overheating,
                oilChange,
                deadBattery,
                tireIssues
        );

        serviceRequestRepository.saveAll(services);

        // 4. Technicians (3 per level, Texas hub)
        Technician techA1 = createTech("Tech A1", "Level A", Arrays.asList(engineLight));
        Technician techA2 = createTech("Tech A2", "Level A", Arrays.asList(engineLight));
        Technician techA3 = createTech("Tech A3", "Level A", Arrays.asList(engineLight));

        Technician techB1 = createTech("Tech B1", "Level B", Arrays.asList(squeakingBrakes, overheating, tireIssues));
        Technician techB2 = createTech("Tech B2", "Level B", Arrays.asList(squeakingBrakes, overheating, tireIssues));
        Technician techB3 = createTech("Tech B3", "Level B", Arrays.asList(squeakingBrakes, overheating, tireIssues));

        Technician techC1 = createTech("Tech C1", "Level C", Arrays.asList(oilChange, deadBattery));
        Technician techC2 = createTech("Tech C2", "Level C", Arrays.asList(oilChange, deadBattery));
        Technician techC3 = createTech("Tech C3", "Level C", Arrays.asList(oilChange, deadBattery));

        technicianRepository.saveAll(Arrays.asList(
                techA1, techA2, techA3,
                techB1, techB2, techB3,
                techC1, techC2, techC3
        ));

        // 5. Service Bays (2 per type, Texas hub conceptually)
        Bay generalBay1 = new Bay();
        generalBay1.setBayType("GENERAL");
        generalBay1.setServiceRequests(Arrays.asList(squeakingBrakes, engineLight, overheating));

        Bay generalBay2 = new Bay();
        generalBay2.setBayType("GENERAL");
        generalBay2.setServiceRequests(Arrays.asList(squeakingBrakes, engineLight, overheating));

        Bay quickBay1 = new Bay();
        quickBay1.setBayType("QUICK");
        quickBay1.setServiceRequests(Arrays.asList(oilChange, deadBattery));

        Bay quickBay2 = new Bay();
        quickBay2.setBayType("QUICK");
        quickBay2.setServiceRequests(Arrays.asList(oilChange, deadBattery));

        Bay tireBay1 = new Bay();
        tireBay1.setBayType("TIRE_ISSUES");
        tireBay1.setServiceRequests(Arrays.asList(tireIssues));

        Bay tireBay2 = new Bay();
        tireBay2.setBayType("TIRE_ISSUES");
        tireBay2.setServiceRequests(Arrays.asList(tireIssues));

        bayRepository.saveAll(Arrays.asList(
                generalBay1, generalBay2,
                quickBay1, quickBay2,
                tireBay1, tireBay2
        ));

        // 1 & 2. Inventory – parts for BOTH centers with special rules
        // Texas center
        createInventoryForCenter("Texas",
                new String[]{
                        "Brake Pads", "Rotors", "OBDII Scanner", "Coolant", "Thermostat",
                        "Engine Oil", "Oil Filter", "Battery", "New Tires", "Valve Stems"
                },
                new int[]{
                        0,    // Brake Pads – out of stock in Texas for Predictive Booking
                        100,  // Rotors
                        100,  // OBDII Scanner
                        100,  // Coolant
                        100,  // Thermostat
                        100,  // Engine Oil
                        100,  // Oil Filter
                        100,  // Battery
                        100,  // New Tires
                        100   // Valve Stems
                },
                new ServiceRequest[][]{
                        {squeakingBrakes},               // Brake Pads
                        {squeakingBrakes},               // Rotors
                        {engineLight},                   // OBDII Scanner
                        {overheating},                   // Coolant
                        {overheating},                   // Thermostat
                        {oilChange},                     // Engine Oil
                        {oilChange},                     // Oil Filter
                        {deadBattery},                   // Battery
                        {tireIssues},                    // New Tires
                        {tireIssues}                     // Valve Stems
                }
        );

        // London center
        createInventoryForCenter("London",
                new String[]{
                        "Brake Pads", "Rotors", "OBDII Scanner", "Coolant", "Thermostat",
                        "Engine Oil", "Oil Filter", "Battery", "New Tires", "Valve Stems"
                },
                new int[]{
                        100,  // Brake Pads
                        100,  // Rotors
                        100,  // OBDII Scanner
                        100,  // Coolant
                        100,  // Thermostat
                        100,  // Engine Oil
                        100,  // Oil Filter
                        100,  // Battery
                        0,    // New Tires – out of stock in London for Blocked Calendar
                        100   // Valve Stems
                },
                new ServiceRequest[][]{
                        {squeakingBrakes},               // Brake Pads
                        {squeakingBrakes},               // Rotors
                        {engineLight},                   // OBDII Scanner
                        {overheating},                   // Coolant
                        {overheating},                   // Thermostat
                        {oilChange},                     // Engine Oil
                        {oilChange},                     // Oil Filter
                        {deadBattery},                   // Battery
                        {tireIssues},                    // New Tires
                        {tireIssues}                     // Valve Stems
                }
        );

    }

    private Technician createTech(String name, String level, List<ServiceRequest> services) {
        Technician t = new Technician();
        t.setName(name);
        t.setLevel(level);
        t.setServices(services);
        return t;
    }

    private void createInventoryForCenter(String centerName,
                                          String[] partNames,
                                          int[] quantities,
                                          ServiceRequest[][] serviceMappings) {
        for (int i = 0; i < partNames.length; i++) {
            Inventory inv = new Inventory();
            // centerName is used in the business logic / demo flows only,
            // entity does not currently have a center/location column,
            // so we embed it in the partName for now.
            inv.setPartName(centerName + " - " + partNames[i]);
            inv.setAvailableParts(quantities[i]);
            inv.setOrderedParts(0);
            inv.setServiceRequests(Arrays.asList(serviceMappings[i]));
            inventoryRepository.save(inv);
        }
    }
}
