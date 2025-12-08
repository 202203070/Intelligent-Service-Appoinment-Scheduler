-- ============================================
-- 1. DROP TABLES (CLEANUP)
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS bay_service_mapping;
DROP TABLE IF EXISTS inventory_service;
DROP TABLE IF EXISTS technician_service;
DROP TABLE IF EXISTS technician_schedule;
DROP TABLE IF EXISTS bay_schedule;
DROP TABLE IF EXISTS appointment;
DROP TABLE IF EXISTS service_request;
DROP TABLE IF EXISTS customer_vehicles;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS technician;
DROP TABLE IF EXISTS bay;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 2. CREATE TABLES (SCHEMA)
-- ============================================

-- 1. Customer Table (matches Java: Long IDENTITY)
CREATE TABLE customer (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone_number VARCHAR(20),
    loyalty_points INT
);

-- 2. Customer Vehicles (ElementCollection)
CREATE TABLE customer_vehicles (
    customer_id BIGINT NOT NULL,
    vehicle_name VARCHAR(100),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

-- 3. Inventory Table
CREATE TABLE inventory (
    inventory_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    part_name VARCHAR(100),
    available_parts INT,
    ordered_parts INT
);

-- 4. Technician Table
CREATE TABLE technician (
    technician_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    level VARCHAR(50)
);

-- 5. Bay Table
CREATE TABLE bay (
    bay_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bay_type VARCHAR(100)
);

-- 6. Service Request Table (The "Job")
CREATE TABLE service_request (
    service_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    issue VARCHAR(255),
    service VARCHAR(100),
    service_time DOUBLE, -- Duration in minutes (matches Java Double)
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

-- 7. Bay Scheduler (Bitmask)
CREATE TABLE bay_schedule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bay_id BIGINT NOT NULL,
    date DATE,
    bitmask INT,
    FOREIGN KEY (bay_id) REFERENCES bay(bay_id)
);

-- 8. Technician Scheduler (Bitmask)
CREATE TABLE technician_schedule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    technician_id BIGINT NOT NULL,
    date DATE,
    bitmask INT,
    FOREIGN KEY (technician_id) REFERENCES technician(technician_id)
);

-- 9. Appointments (scheduled jobs)
CREATE TABLE appointment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    technician_id BIGINT,
    bay_id BIGINT,
    date DATE NOT NULL,
    time TIME NOT NULL
);

-- ============================================
-- 3. JOIN TABLES (MANY-TO-MANY RELATIONSHIPS)
-- ============================================

-- Links Inventory Items to specific Services
CREATE TABLE inventory_service (
    inventory_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    PRIMARY KEY (inventory_id, service_id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id),
    FOREIGN KEY (service_id) REFERENCES service_request(service_id)
);

-- Links Technicians to Services they are qualified for
CREATE TABLE technician_service (
    technician_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    PRIMARY KEY (technician_id, service_id),
    FOREIGN KEY (technician_id) REFERENCES technician(technician_id),
    FOREIGN KEY (service_id) REFERENCES service_request(service_id)
);

-- Links Bays to Services they can handle
CREATE TABLE bay_service_mapping (
    bay_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    PRIMARY KEY (bay_id, service_id),
    FOREIGN KEY (bay_id) REFERENCES bay(bay_id),
    FOREIGN KEY (service_id) REFERENCES service_request(service_id)
);

-- ============================================
-- 4. DATA POPULATION
-- ============================================

-- A. CUSTOMERS
INSERT INTO customer (customer_id, name, phone_number, loyalty_points) VALUES
('CUST-001', 'Robert "Bob" Vance', '555-0101', 95),  -- VIP
('CUST-002', 'Alice Smith', '555-0102', 15),       -- Low Loyalty (Victim)
('CUST-003', 'Charlie Day', '555-0103', 40),       -- Immune (Rescheduled)
('CUST-004', 'Diana Prince', '555-0104', 80),      -- Trigger: Out of Stock
('CUST-005', 'Evan Peters', '555-0105', 50),       -- Happy Path
('CUST-006', 'Frank Castle', '555-9111', 60);      -- Emergency

-- B. CUSTOMER VEHICLES
INSERT INTO customer_vehicles (customer_id, vehicle_name) VALUES
('CUST-001', '2022 BMW X5'),
('CUST-002', '2018 Honda Civic'),
('CUST-003', '2015 Ford F-150'),
('CUST-004', '2021 Tesla Model 3'),
('CUST-004', '1967 Shelby Cobra'),
('CUST-005', '2019 Toyota Camry'),
('CUST-006', '2020 Dodge Charger');

-- C. INVENTORY
-- Logic: ID 1 (Brake Pads) is 0 to trigger the "Wait for Parts" logic.
INSERT INTO inventory (inventory_id, part_name, available_parts, ordered_parts) VALUES
(1, 'Brake Pads', 0, 10),    -- OUT OF STOCK
(2, 'Engine Oil', 50, 20),
(3, 'Battery', 5, 2),
(4, 'New Tires', 12, 4),
(5, 'Coolant', 20, 0),
(6, 'OBDII Scanner', 2, 0);

-- D. TECHNICIANS
INSERT INTO technician (technician_id, name, level) VALUES
(1, 'Arthur', 'Level 2 - Brakes'),
(2, 'Ben', 'Level 4 - General'),
(3, 'Charles', 'Level 3 - Engine');

-- E. BAYS
INSERT INTO bay (bay_id, bay_type) VALUES
(1, 'General Repair Bay'),
(2, 'Quick Service Bay');

-- F. SERVICE REQUESTS
-- 1. Diana (Needs Brakes -> Stock 0)
INSERT INTO service_request (service_id, customer_id, issue, service, service_time) VALUES
(1, 'CUST-004', 'Squeaking Brakes', 'Brake Pad Replacement', 120);

-- 2. Bob (VIP -> Engine)
INSERT INTO service_request (service_id, customer_id, issue, service, service_time) VALUES
(2, 'CUST-001', 'Engine Light', 'Diagnostic & Repair', 180);

-- 3. Evan (Standard -> Oil)
INSERT INTO service_request (service_id, customer_id, issue, service, service_time) VALUES
(3, 'CUST-005', 'Oil Change', 'Oil & Filter Service', 60);

-- 4. Frank (Emergency -> Overheating)
INSERT INTO service_request (service_id, customer_id, issue, service, service_time) VALUES
(4, 'CUST-006', 'Overheating', 'Diagnostic & Repair', 60);

-- 5. Alice (Victim -> Battery)
INSERT INTO service_request (service_id, customer_id, issue, service, service_time) VALUES
(5, 'CUST-002', 'Dead Battery', 'Battery Replacement', 60);

-- 6. Charlie (Immune -> Engine)
INSERT INTO service_request (service_id, customer_id, issue, service, service_time) VALUES
(6, 'CUST-003', 'Engine Light', 'Diagnostic & Repair', 180);


-- G. MAPPING: Service -> Inventory Parts
INSERT INTO inventory_service (inventory_id, service_id) VALUES
(1, 1), -- Diana needs Inventory 1 (Brake Pads - STOCK 0)
(6, 2), -- Bob needs Scanner
(2, 3), -- Evan needs Oil
(5, 4), -- Frank needs Coolant
(3, 5), -- Alice needs Battery
(6, 6); -- Charlie needs Scanner

-- H. MAPPING: Service -> Technician Skills
INSERT INTO technician_service (technician_id, service_id) VALUES
(1, 1), -- Arthur (Brakes) -> Diana
(3, 2), -- Charles (Engine) -> Bob
(2, 3), -- Ben (General) -> Evan
(2, 4), -- Ben (General) -> Frank (Emergency)
(3, 5), -- Charles (Engine) -> Alice
(3, 6); -- Charles (Engine) -> Charlie

-- I. MAPPING: Service -> Bay Type
INSERT INTO bay_service_mapping (bay_id, service_id) VALUES
(1, 1), -- Diana -> General Bay
(1, 2), -- Bob -> General Bay
(2, 3), -- Evan -> Quick Bay
(1, 4), -- Frank -> General Bay
(2, 5), -- Alice -> Quick Bay
(1, 6); -- Charlie -> General Bay

-- J. INITIALIZE SCHEDULES (For 1 day example)
-- Setting bitmask to 0 (All Free) for today
INSERT INTO bay_schedule (bay_id, date, bitmask) VALUES
(1, CURDATE(), 0),
(2, CURDATE(), 0);

INSERT INTO technician_schedule (technician_id, date, bitmask) VALUES
(1, CURDATE(), 0),
(2, CURDATE(), 0),
(3, CURDATE(), 0);