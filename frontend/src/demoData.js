// Hard-coded demo data for frontend-only flows

export const DEMO_INVENTORY = [
  // Texas
  { center: 'Texas', part: 'Brake Pads', quantity: 0 },
  { center: 'Texas', part: 'Rotors', quantity: 100 },
  { center: 'Texas', part: 'OBDII Scanner', quantity: 100 },
  { center: 'Texas', part: 'Coolant', quantity: 100 },
  { center: 'Texas', part: 'Thermostat', quantity: 100 },
  { center: 'Texas', part: 'Engine Oil', quantity: 100 },
  { center: 'Texas', part: 'Oil Filter', quantity: 100 },
  { center: 'Texas', part: 'Battery', quantity: 100 },
  { center: 'Texas', part: 'New Tires', quantity: 100 },
  { center: 'Texas', part: 'Valve Stems', quantity: 100 },
  // London
  { center: 'London', part: 'Brake Pads', quantity: 100 },
  { center: 'London', part: 'Rotors', quantity: 100 },
  { center: 'London', part: 'OBDII Scanner', quantity: 100 },
  { center: 'London', part: 'Coolant', quantity: 100 },
  { center: 'London', part: 'Thermostat', quantity: 100 },
  { center: 'London', part: 'Engine Oil', quantity: 100 },
  { center: 'London', part: 'Oil Filter', quantity: 100 },
  { center: 'London', part: 'Battery', quantity: 100 },
  { center: 'London', part: 'New Tires', quantity: 0 },
  { center: 'London', part: 'Valve Stems', quantity: 100 },
];

export const DEMO_SERVICES = [
  {
    id: 1,
    name: 'Squeaking Brakes',
    durationMinutes: 120,
    skill: 'Level B',
    bayType: 'GENERAL',
  },
  {
    id: 2,
    name: 'Engine Light',
    durationMinutes: 180,
    skill: 'Level A',
    bayType: 'GENERAL',
  },
  {
    id: 3,
    name: 'Overheating',
    durationMinutes: 60,
    skill: 'Level B',
    bayType: 'GENERAL',
  },
  {
    id: 4,
    name: 'Oil Change',
    durationMinutes: 60,
    skill: 'Level C',
    bayType: 'QUICK',
  },
  {
    id: 5,
    name: 'Dead Battery',
    durationMinutes: 60,
    skill: 'Level C',
    bayType: 'QUICK',
  },
  {
    id: 6,
    name: 'Tire Issues',
    durationMinutes: 90,
    skill: 'Level B',
    bayType: 'TIRE_ISSUES',
  },
];

// Service -> required parts mapping (by service id)
export const DEMO_SERVICE_PARTS = {
  1: ['Brake Pads', 'Rotors'],
  2: ['OBDII Scanner'],
  3: ['Coolant', 'Thermostat'],
  4: ['Engine Oil', 'Oil Filter'],
  5: ['Battery'],
  6: ['New Tires', 'Valve Stems'],
};

export const DEMO_TECHNICIANS = [
  // Level A
  { id: 1, name: 'Tech A1', level: 'Level A', center: 'Texas' },
  { id: 2, name: 'Tech A2', level: 'Level A', center: 'Texas' },
  { id: 3, name: 'Tech A3', level: 'Level A', center: 'Texas' },
  // Level B
  { id: 4, name: 'Tech B1', level: 'Level B', center: 'Texas' },
  { id: 5, name: 'Tech B2', level: 'Level B', center: 'Texas' },
  { id: 6, name: 'Tech B3', level: 'Level B', center: 'Texas' },
  // Level C
  { id: 7, name: 'Tech C1', level: 'Level C', center: 'Texas' },
  { id: 8, name: 'Tech C2', level: 'Level C', center: 'Texas' },
  { id: 9, name: 'Tech C3', level: 'Level C', center: 'Texas' },
];

export const DEMO_BAYS = [
  { id: 1, name: 'General Bay 1', type: 'GENERAL', center: 'Texas' },
  { id: 2, name: 'General Bay 2', type: 'GENERAL', center: 'Texas' },
  { id: 3, name: 'Quick Bay 1', type: 'QUICK', center: 'Texas' },
  { id: 4, name: 'Quick Bay 2', type: 'QUICK', center: 'Texas' },
  { id: 5, name: 'Tire Bay 1', type: 'TIRE_ISSUES', center: 'Texas' },
  { id: 6, name: 'Tire Bay 2', type: 'TIRE_ISSUES', center: 'Texas' },
];

export const DEMO_CUSTOMERS = [
  {
    id: 1,
    name: 'Diana Prince',
    phoneNumber: '555-0104',
    loyaltyPoints: 80,
  },
  {
    id: 2,
    name: 'Bob Vance',
    phoneNumber: '555-0101',
    loyaltyPoints: 95,
  },
  {
    id: 3,
    name: 'Alice Smith',
    phoneNumber: '555-0102',
    loyaltyPoints: 15,
  },
];
