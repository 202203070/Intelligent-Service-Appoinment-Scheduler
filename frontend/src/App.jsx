import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Search, Bell, User, ChevronDown, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import {
  DEMO_CUSTOMERS,
  DEMO_SERVICES,
  DEMO_INVENTORY,
  DEMO_TECHNICIANS,
  DEMO_BAYS,
  DEMO_SERVICE_PARTS,
} from './demoData';

// API Configuration - points to Spring Boot base path
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Single backend call we actually support today:
// POST `${API_URL}/returnslot` with a body of service IDs (List<Integer>)

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', 
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM',
];

// ============================================
// TOP HEADER COMPONENT
// ============================================
function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-40">
      <div className="flex items-center flex-1 max-w-md">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="ml-3 w-full bg-transparent text-sm outline-none text-slate-700"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-slate-600 hover:text-slate-900">
          <Bell size={20} />
          <span className="absolute -top-2 -right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
            <User size={18} />
          </div>
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}

// ============================================
// STEP 1: CUSTOMER IDENTIFICATION
// ============================================
function Step1CustomerIdentification({ onCustomerSelect, onVehicleSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [customers] = useState(
    DEMO_CUSTOMERS.map((c) => ({
      ...c,
      customerId: c.id,
      vehicleNames: c.vehicleNames || ['Demo Vehicle'],
    }))
  );

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phoneNumber?.includes(searchTerm)
  );

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    onCustomerSelect(customer);
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    onVehicleSelect(car);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Who is visiting today?</h2>
        <p className="text-slate-600 mb-6">Search for a customer to get started</p>
        
        <>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search Customer Name or Phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {searchTerm && filteredCustomers.length > 0 && !selectedCustomer && (
              <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
                {filteredCustomers.map(customer => (
                  <button
                    key={customer.customerId}
                    onClick={() => handleSelectCustomer(customer)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b last:border-b-0 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {customer.name}
                        </p>
                        <p className="text-sm text-slate-500">{customer.phoneNumber}</p>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                        Points: {customer.loyaltyPoints}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchTerm && filteredCustomers.length === 0 && !selectedCustomer && (
              <div className="text-center py-4 text-slate-500">
                No customers found
              </div>
            )}

            {selectedCustomer && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Customer Profile</p>
                      <h3 className="text-xl font-bold text-slate-900">{selectedCustomer.name}</h3>
                      <p className="text-sm text-slate-600">{selectedCustomer.phoneNumber}</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                      Points: {selectedCustomer.loyaltyPoints}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-900 mb-4">Select a vehicle:</p>
                {selectedCustomer.vehicleNames && selectedCustomer.vehicleNames.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {selectedCustomer.vehicleNames.map((vehicle, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectCar({ id: idx, model: vehicle, color: 'Unknown', year: 2020 })}
                        className={`p-4 rounded-lg border-2 text-left transition ${
                          selectedCar?.id === idx
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <p className="font-semibold text-slate-900">{vehicle}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">No vehicles registered</p>
                )}
              </div>
            )}

            {selectedCar && (
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                Proceed to Diagnosis
              </button>
            )}
          </>
      </div>
    </div>
  );
}

// ============================================
// STEP 2: DIAGNOSIS (NLP INPUT)
// ============================================
// function Step2Diagnosis({ selectedServices, onServicesChange, onProceed, onBack }) {
//   const [searchTerm, setSearchTerm] = useState('');

//   // Hard-coded service catalog from demo data
//   const services = DEMO_SERVICES.map((s) => ({
//     serviceId: s.id,
//     service: s.name,
//     issue: s.name,
//     serviceTime: s.durationMinutes,
//     serviceTimeMinutes: s.durationMinutes,
//     skill: s.skill,
//     bayType: s.bayType,
//   }));

//   const filteredServices = services.filter(s =>
//     s.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     s.issue.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const isSelected = (serviceId) => selectedServices.includes(serviceId);

//   const toggleService = (serviceId) => {
//     if (isSelected(serviceId)) {
//       onServicesChange(selectedServices.filter(id => id !== serviceId));
//     } else {
//       onServicesChange([...selectedServices, serviceId]);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
//         <h2 className="text-2xl font-bold text-slate-900 mb-2">What is the issue?</h2>
//         <p className="text-slate-600 mb-6">Describe the symptoms to find the right service</p>
        
//         <>
//             <div className="relative mb-6">
//               <AlertCircle className="absolute left-3 top-3 text-slate-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Describe symptoms (e.g., 'squeaking brakes')"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
//               />
//             </div>

//             {searchTerm && (
//               <div className="grid grid-cols-1 gap-3 mb-6">
//                 {filteredServices.length > 0 ? (
//                   filteredServices.map(service => (
//                     <button
//                       key={service.serviceId}
//                       onClick={() => toggleService(service.serviceId)}
//                       className={`p-4 rounded-lg border-2 text-left transition ${
//                         isSelected(service.serviceId)
//                           ? 'border-blue-500 bg-blue-50'
//                           : 'border-slate-200 bg-white hover:border-blue-300'
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="font-semibold text-slate-900">{service.service}</p>
//                           <p className="text-sm text-slate-600">{service.issue}</p>
//                         </div>
//                         <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded">
//                           {(service.serviceTimeMinutes / 60).toFixed(1)}h
//                         </span>
//                       </div>
//                     </button>
//                   ))
//                 ) : (
//                   <p className="text-center text-slate-500 py-4">No services found</p>
//                 )}
//               </div>
//             )}

//             {selectedServices.length > 0 && (
//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={onBack}
//                   className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
//                 >
//                   Back
//                 </button>
//                 <button
//                   onClick={onProceed}
//                   className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
//                 >
//                   Proceed to Resource Check
//                 </button>
//               </div>
//             )}
//           </>
//       </div>
//     </div>
//   );
// }

// function Step2Diagnosis({ onProceed, onBack }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedServices, setSelectedServices] = useState([]); // store service IDs

//   // Hard-coded service catalog from demo data
//   const services = DEMO_SERVICES.map((s) => ({
//     serviceId: s.id,
//     service: s.name,
//     issue: s.name,
//     serviceTimeMinutes: s.durationMinutes,
//     skill: s.skill,
//     bayType: s.bayType,
//   }));

//   // Filter services by search term (show all if empty)
//   const filteredServices =
//     searchTerm.trim() === ""
//       ? services
//       : services.filter(
//           (s) =>
//             s.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             s.issue.toLowerCase().includes(searchTerm.toLowerCase())
//         );

//   // Check if a service is selected
//   const isSelected = (serviceId) => selectedServices.includes(serviceId);

//   // Toggle selection
//   const toggleService = (serviceId) => {
//     setSelectedServices((prev) =>
//       prev.includes(serviceId)
//         ? prev.filter((id) => id !== serviceId)
//         : [...prev, serviceId]
//     );
//   };

//   // Proceed handler
//   const handleProceed = () => {
//     console.log("Selected service IDs:", selectedServices);
//     if (onProceed) onProceed(selectedServices); // pass IDs to parent if needed
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
//         <h2 className="text-2xl font-bold text-slate-900 mb-2">What is the issue?</h2>
//         <p className="text-slate-600 mb-6">
//           Describe the symptoms to find the right service
//         </p>

//         <div className="relative mb-6">
//           <AlertCircle className="absolute left-3 top-3 text-slate-400" size={20} />
//           <input
//             type="text"
//             placeholder="Describe symptoms (e.g., 'squeaking brakes')"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
//           />
//         </div>

//         <div className="grid grid-cols-1 gap-3 mb-6">
//           {filteredServices.length > 0 ? (
//             filteredServices.map((service) => (
//               <button
//                 key={service.serviceId}
//                 onClick={() => toggleService(service.serviceId)}
//                 className={`p-4 rounded-lg border-2 text-left transition ${
//                   isSelected(service.serviceId)
//                     ? "border-blue-500 bg-blue-50"
//                     : "border-slate-200 bg-white hover:border-blue-300"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-semibold text-slate-900">{service.service}</p>
//                     <p className="text-sm text-slate-600">{service.issue}</p>
//                   </div>
//                   <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded">
//                     {(service.serviceTimeMinutes / 60).toFixed(1)}h
//                   </span>
//                 </div>
//               </button>
//             ))
//           ) : (
//             <p className="text-center text-slate-500 py-4">No services found</p>
//           )}
//         </div>

//         {selectedServices.length > 0 && (
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={onBack}
//               className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
//             >
//               Back
//             </button>
//             <button
//               onClick={handleProceed}
//               className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
//             >
//               Proceed to Resource Check
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

function Step2Diagnosis({selectedServices, onServicesChange, onProceed, onBack }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Map demo services to desired structure
  const services = DEMO_SERVICES.map((s) => ({
    serviceId: s.id,
    service: s.name,
    issue: s.name,
    serviceTimeMinutes: s.durationMinutes,
    skill: s.skill,
    bayType: s.bayType,
  }));

  // Filter services based on search term
  const filteredServices = searchTerm.trim() === ""
    ? services
    : services.filter(s =>
        s.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.issue.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Toggle selection of a service
  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      onServicesChange(selectedServices.filter(id => id !== serviceId));
    } else {
      onServicesChange([...selectedServices, serviceId]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">What is the issue?</h2>
        <p className="text-slate-600 mb-6">Describe the symptoms to find the right service</p>

        {/* Search Input */}
        <div className="relative mb-6">
          <AlertCircle className="absolute left-3 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Describe symptoms (e.g., 'squeaking brakes')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        {/* Service List */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {filteredServices.length > 0 ? (
            filteredServices.map(service => {
              const selected = selectedServices.includes(service.serviceId);
              return (
                <button
                  key={service.serviceId}
                  onClick={() => toggleService(service.serviceId)}
                  aria-pressed={selected}
                  role="button"
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    selected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{service.service}</p>
                      <p className="text-sm text-slate-600">{service.issue}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded">
                      {(service.serviceTimeMinutes / 60).toFixed(1)}h
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="text-center text-slate-500 py-4">No services found</p>
          )}
        </div>

        {/* Action Buttons */}
        {selectedServices.length > 0 && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              onClick={() => onProceed(selectedServices)}
              // onClick={onProceed}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Proceed to Resource Check
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


// ============================================
// STEP 3: RESOURCE INTELLIGENCE
// ============================================
function Step3ResourceIntelligence({ selectedServiceIds, backendReturnTime, onBack, onProceed }) {
  const [bayType, setBayType] = useState('Service Bay');
  const [technicianName, setTechnicianName] = useState('Assigned Technician');
  const [parts, setParts] = useState({ partName: 'Required Parts', availableParts: 1 });

  // Derive technician, bay and parts purely from demo data (no backend)
  useEffect(() => {
    if (!selectedServiceIds || selectedServiceIds.length === 0) return;

    const firstService = DEMO_SERVICES.find((s) => s.id === selectedServiceIds[0]);
    if (!firstService) return;

    // Technician: pick first tech with matching skill in Texas
    const tech = DEMO_TECHNICIANS.find(
      (t) => t.level === firstService.skill && t.center === 'Texas'
    );
    if (tech) {
      setTechnicianName(tech.name);
    }

    // Bay: pick first bay matching bayType and center Texas
    const bay = DEMO_BAYS.find(
      (b) => b.type === firstService.bayType && b.center === 'Texas'
    );
    if (bay) {
      setBayType(`${bay.name} (${bay.type})`);
    }

    // Parts: list required parts and compute min quantity across centers
    const partNames = DEMO_SERVICE_PARTS[firstService.id] || [];
    if (partNames.length > 0) {
      const firstPart = partNames[0];
      const inventoryForPart = DEMO_INVENTORY.filter((i) => i.part === firstPart);
      const minQty = inventoryForPart.reduce(
        (acc, item) => Math.min(acc, item.quantity),
        Number.POSITIVE_INFINITY
      );
      setParts({ partName: firstPart, availableParts: isFinite(minQty) ? minQty : 0 });
    }
  }, [selectedServiceIds]);

  if (!selectedServiceIds || selectedServiceIds.length === 0) return null;

  if (!backendReturnTime) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Resource Availability</h2>
          <p className="text-slate-600">
            Waiting for backend to compute the earliest available return time5
          </p>
        </div>
      </div>
    );
  }

  const earliestDate = new Date(backendReturnTime);
  const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const earliestDateStr = earliestDate.toLocaleDateString('en-US', dateOptions);

  //added two lines
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  const earliestTimeStr = earliestDate.toLocaleTimeString('en-US', timeOptions);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Resource Availability</h2>
        
        {/* Resource Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Technician */}
          <div className="border border-slate-200 rounded-lg p-6">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Technician</p>
            <p className="text-lg font-bold text-slate-900 mb-4">{technicianName || 'N/A'}</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">Available</span>
            </div>
          </div>

          {/* Bay */}
          <div className="border border-slate-200 rounded-lg p-6">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Service Bay</p>
            <p className="text-lg font-bold text-slate-900 mb-4">{bayType || 'N/A'}</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">Available</span>
            </div>
          </div>

          {/* Parts */}
          <div className="border border-slate-200 rounded-lg p-6">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Parts Required</p>
            <p className="text-lg font-bold text-slate-900 mb-4">{parts?.partName || 'N/A'}</p>
            <div className="flex items-center gap-2">
              {parts?.availableParts > 0 ? (
                <>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">In Stock</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">Out of Stock</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Logic Visualization */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">Return Time</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Earliest Available (from backend)</p>
            {/* <p className="text-3xl font-bold text-blue-600">{earliestDateStr}</p> */}
            <p className="text-3xl font-bold text-blue-600">{earliestDateStr} at {earliestTimeStr}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onProceed}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Find Slots
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP 4: SLOT SELECTION (CALENDAR)
// ============================================

//FOR INDIA (FINAL)

function Step4SlotSelection({ backendReturnTime, onSlotSelect, onBack, onProceed }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  
    // Initialize selectedDate
  const [selectedDate, setSelectedDate] = useState(
    backendReturnTime ? new Date(backendReturnTime) : new Date()
  );

  const earliestReturnDateTime = backendReturnTime ? new Date(backendReturnTime) : new Date();
  const now = new Date(); 

  // --- Time Slots (09:00 AM to 06:00 PM, 30-minute intervals) ---
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 18; // 6 PM
    
    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === endHour && m > 0) break; 
        
        const hour12 = h > 12 ? h - 12 : h;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const minuteStr = m.toString().padStart(2, '0');
        const hourStr = hour12.toString().padStart(2, '0');
        
        slots.push(`${hourStr}:${minuteStr} ${ampm}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Helper function to convert a date and time string into a Date object
  const parseSlotDateTime = (date, slotTime) => {
    const [timePart, ampm] = slotTime.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }

    const slotDateTime = new Date(date);
    slotDateTime.setHours(hours, minutes, 0, 0);
    return slotDateTime;
  };


  // --- 1. SEPARATE LOGIC FOR VISUAL AVAILABILITY (Ignore Backend Time) ---
  const isVisuallyAvailable = (date, slotTime) => {
    const slotDateTime = parseSlotDateTime(date, slotTime);

    // Only grey out slots that are strictly in the past relative to NOW.
    return slotDateTime.getTime() >= now.getTime();
  };
    
  // --- 2. LOGIC FOR SELECTION/BOOKING (Enforce Backend Time and Real-Time) ---
//   const isSlotAvailableForSelection = (date, slotTime) => {
//     const slotDateTime = parseSlotDateTime(date, slotTime);

//     // Rule 1: Cannot book a past slot (relative to NOW)
//     if (slotDateTime.getTime() < now.getTime()) {
//         return false; 
//     }

//     // Rule 2: Cannot book a slot earlier than the resource-checked time
//     if (slotDateTime.getTime() < earliestReturnDateTime.getTime()) {
//       return false; 
//     }
    
//     return true; 
//   };

const isSlotAvailableForSelection = (selectedDate, slot) => {
  const now = new Date();
  const slotDateTime = new Date(`${selectedDate.toDateString()} ${slot}`);

  // Allow selection for ALL future times
  return slotDateTime >= now;
};



  const handleSelectSlot = (slot) => {
    // This function remains the gatekeeper, using the strict, combined logic.
    if (isSlotAvailableForSelection(selectedDate, slot)) { 
      setSelectedSlot(slot);
      onSlotSelect({ date: selectedDate.toISOString().split('T')[0], time: slot });
    } 
    // If the check fails (e.g., resources are unavailable), the click is simply ignored.
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    
    // Determine the earliest possible date the user can select
    const earliestSelectableDate = new Date(Math.max(now.getTime(), earliestReturnDateTime.getTime()));

    // Prevent navigating before the determined earliest date
    if (newDate.toDateString() < earliestSelectableDate.toDateString() && days < 0) {
        return; 
    }

    setSelectedDate(newDate);
    setSelectedSlot(null); 
  };

  const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Time Slot</h2>
        <p className="text-slate-600 mb-8">Choose a date and time for your appointment</p>

        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => handleDateChange(-1)}
            className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition"
             // Use the stricter logic for navigation: disable Previous button if selected date is the earliest possible date
             disabled={selectedDate.toDateString() === earliestReturnDateTime.toDateString() && selectedDate.toDateString() === now.toDateString()} 
          >
            ← Previous
          </button>
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-1">Selected Date</p>
            <p className="text-lg font-bold text-slate-900">{dateStr}</p>
          </div>
          <button
            onClick={() => handleDateChange(1)}
            className="px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Next →
          </button>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-6 gap-2 mb-8">
          {timeSlots.map((slot, idx) => {
            // **UI LOGIC**: Only grey out slots that are in the PAST (relative to NOW)
            const isAvailable = isVisuallyAvailable(selectedDate, slot); 
            const isSelected = selectedSlot === slot;
            
            return (
              <button
                key={idx}
                onClick={() => handleSelectSlot(slot)}
                disabled={!isAvailable} // <-- Only disables slots already passed in real-time
                className={`py-3 px-2 rounded-lg text-sm font-medium transition ${
                  !isAvailable
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-50 text-slate-900 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {selectedSlot && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onProceed}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Confirm Appointment
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
}

//FOR INDIA
// function Step4SlotSelection({ backendReturnTime, onSlotSelect, onBack, onProceed }) {
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(
//     backendReturnTime ? new Date(backendReturnTime) : new Date()
//   );

//   const timeSlots = [
//     '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
//     '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM',
//     '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
//   ];

//   const earliestDate = backendReturnTime ? new Date(backendReturnTime) : new Date();

//   const isSlotAvailable = (date) => {
//     return date >= earliestDate;
//   };

//   const handleSelectSlot = (slot) => {
//     if (isSlotAvailable(selectedDate)) {
//       setSelectedSlot(slot);
//       onSlotSelect({ date: selectedDate.toISOString().split('T')[0], time: slot });
//     }
//   };

//   const handleDateChange = (days) => {
//     const newDate = new Date(selectedDate);
//     newDate.setDate(newDate.getDate() + days);
//     setSelectedDate(newDate);
//   };

//   const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-lg shadow-sm p-8">
//         <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Time Slot</h2>
//         <p className="text-slate-600 mb-8">Choose a date and time for your appointment</p>

//         {/* Date Navigation */}
//         <div className="flex items-center justify-between mb-8">
//           <button
//             onClick={() => handleDateChange(-1)}
//             className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
//           >
//             ← Previous
//           </button>
//           <div className="text-center">
//             <p className="text-sm text-slate-600 mb-1">Selected Date</p>
//             <p className="text-lg font-bold text-slate-900">{dateStr}</p>
//           </div>
//           <button
//             onClick={() => handleDateChange(1)}
//             className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
//           >
//             Next →
//           </button>
//         </div>

//         {/* Time Slots */}
//         <div className="grid grid-cols-6 gap-2 mb-8">
//           {timeSlots.map((slot, idx) => {
//             const isAvailable = isSlotAvailable(selectedDate);
//             const isSelected = selectedSlot === slot;
            
//             return (
//               <button
//                 key={idx}
//                 onClick={() => handleSelectSlot(slot)}
//                 disabled={!isAvailable}
//                 className={`py-3 px-2 rounded-lg text-sm font-medium transition ${
//                   !isAvailable
//                     ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                     : isSelected
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-slate-50 text-slate-900 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
//                 }`}
//               >
//                 {slot}
//               </button>
//             );
//           })}
//         </div>

//         {selectedSlot && (
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={onBack}
//               className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
//             >
//               Back
//             </button>
//             <button
//               type="button"
//               onClick={onProceed}
//               className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
//             >
//               Confirm Appointment
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//FOR EUROPE
// function Step4SlotSelection({ backendReturnTime, onSlotSelect, onBack, onProceed }) {
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(
//     // Initialize selectedDate based on backendReturnTime date
//     backendReturnTime ? new Date(backendReturnTime) : new Date()
//   );

//  const timeSlots = [
//     '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
//     '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM',
//     '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
//   ];

//   // --- 1. Define the earliest available time from the backend ---
//   const earliestReturnDateTime = backendReturnTime ? new Date(backendReturnTime) : new Date();

//   // Helper function to combine a date object with a time string (e.g., "09:00 AM")
//   const parseSlotDateTime = (date, slotTime) => {
//     const [timePart, ampm] = slotTime.split(' ');
//     let [hours, minutes] = timePart.split(':').map(Number);

//     // Handle AM/PM conversion
//     if (ampm === 'PM' && hours !== 12) {
//       hours += 12;
//     } else if (ampm === 'AM' && hours === 12) {
//       hours = 0; // Midnight case
//     }

//     // Create a new Date object based on the selectedDate, then set the time
//     const slotDateTime = new Date(date);
//     slotDateTime.setHours(hours, minutes, 0, 0);
//     return slotDateTime;
//   };


//   // --- 2. Availability Check Logic ---
//   const isSlotAvailable = (date, slotTime) => {
//     const slotDateTime = parseSlotDateTime(date, slotTime);

//     // Resetting time components for date-only comparison
//     const slotDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
//     const earliestDateOnly = new Date(earliestReturnDateTime.getFullYear(), earliestReturnDateTime.getMonth(), earliestReturnDateTime.getDate());
//     
//     // If the slot date is after the earliest return date, it's available.
//     if (slotDateOnly.getTime() > earliestDateOnly.getTime()) {
//       return true;
//     }

//     // If the slot date is before the earliest return date, it's unavailable.
//     if (slotDateOnly.getTime() < earliestDateOnly.getTime()) {
//       return false;
//     }
//     
//     // If the dates are the same, compare the full datetime.
//     return slotDateTime.getTime() >= earliestReturnDateTime.getTime();
//   };


//   const handleSelectSlot = (slot) => {
//     // Check availability using the new logic
//     if (isSlotAvailable(selectedDate, slot)) { 
//       setSelectedSlot(slot);
//       onSlotSelect({ date: selectedDate.toISOString().split('T')[0], time: slot });
//     }
//   };

//   const handleDateChange = (days) => {
//     const newDate = new Date(selectedDate);
//     newDate.setDate(newDate.getDate() + days);
//     setSelectedDate(newDate);
//     // Clear selection when the date changes
//     setSelectedSlot(null); 
//   };

//   const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-lg shadow-sm p-8">
//         <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Time Slot</h2>
//         <p className="text-slate-600 mb-8">Choose a date and time for your appointment</p>

//         {/* Date Navigation */}
//         <div className="flex items-center justify-between mb-8">
//        <button
//             onClick={() => handleDateChange(-1)}
//             className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
//           >
//             ← Previous
//           </button>
//           <div className="text-center">
//             <p className="text-sm text-slate-600 mb-1">Selected Date</p>
//             <p className="text-lg font-bold text-slate-900">{dateStr}</p>
//           </div>
//           <button
//             onClick={() => handleDateChange(1)}
//             className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
//           >
//             Next →
//           </button>
//         </div>

//         {/* Time Slots */}
//         <div className="grid grid-cols-6 gap-2 mb-8">
//           {timeSlots.map((slot, idx) => {
//             // Pass both selectedDate and the current slot time
//             const isAvailable = isSlotAvailable(selectedDate, slot); 
//             const isSelected = selectedSlot === slot;
//             
//             return (
//               <button
//                 key={idx}
//                 onClick={() => handleSelectSlot(slot)}
//                 disabled={!isAvailable} // <-- Disabled if !isAvailable
//                 className={`py-3 px-2 rounded-lg text-sm font-medium transition ${
//                   !isAvailable
//                     ? 'bg-slate-100 text-slate-400 cursor-not-allowed' // <-- Greyed out style
//                     : isSelected
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-slate-50 text-slate-900 border border-slate-200 hover:border-blue-300 hover:bg-blue-50'
//                 }`}
//               >
//                 {slot}
//               </button>
//             );
//           })}
//         </div>

//         {selectedSlot && (
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={onBack}
//               className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
//             >
//               Back
//             </button>
//             <button
//               type="button"
//               onClick={onProceed}
//               className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
//             >
//               Confirm Appointment
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// ============================================
// STEP 5: SUCCESS & CONFIRMATION
// ============================================
function Step5Success({ customerData, carData, serviceData, slotData, selectedServiceIds, onReset, onBack }) {
  const [technicianName, setTechnicianName] = useState('Assigned Technician');
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirmAndSave = async () => {
    if (!customerData || !slotData) {
      onReset();
      return;
    }
    try {
      setIsSaving(true);
      const payload = {
        customerId: customerData.customerId,
        technicianId: null, // could be derived if needed
        bayId: null,
        date: slotData.date,
        time: slotData.time,
        serviceSummary: (selectedServiceIds || []).join(',')
      };
      await axios.post(`${API_URL}/appointments`, payload);
    } catch (err) {
      console.error('Error saving appointment', err);
    } finally {
      setIsSaving(false);
      onReset();
    }
  };

  // Fetch a qualified technician for the selected services, if any
  useEffect(() => {
    const fetchTechnician = async () => {
      if (!selectedServiceIds || selectedServiceIds.length === 0) return;
      try {
        const response = await axios.post(`${API_URL}/technicians/for-services`, selectedServiceIds);
        const techs = response.data || [];
        if (techs.length > 0) {
          setTechnicianName(techs[0].name || 'Assigned Technician');
        }
      } catch (err) {
        console.error('Error fetching technicians for services', err);
      }
    };

    fetchTechnician();
  }, [selectedServiceIds]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-6">
        <div className="mb-6">
          <CheckCircle size={64} className="text-emerald-500 mx-auto" />
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h2>
        <p className="text-slate-600 mb-8">Your service appointment has been successfully scheduled</p>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-left mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Customer</p>
              <p className="text-lg font-bold text-slate-900">{customerData?.name}</p>
              <p className="text-sm text-slate-600">{customerData?.phoneNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Vehicle</p>
              <p className="text-lg font-bold text-slate-900">{carData?.model}</p>
              <p className="text-sm text-slate-600">{carData?.color}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Service</p>
              <p className="text-lg font-bold text-slate-900">{serviceData?.service}</p>
              <p className="text-sm text-slate-600">{serviceData && serviceData.serviceTime != null ? (serviceData.serviceTime / 60).toFixed(1) : '--'}h duration</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Assigned Technician</p>
              <p className="text-lg font-bold text-slate-900">{technicianName || 'TBD'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Date & Time</p>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" />
                <span className="text-lg font-bold text-slate-900">{slotData?.date}</span>
                <Clock size={18} className="text-blue-500 ml-2" />
                <span className="text-lg font-bold text-slate-900">{slotData?.time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            Back
          </button>
          <button
            onClick={handleConfirmAndSave}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-60"
            disabled={isSaving}
          >
            {isSaving ? 'Saving Appointment...' : 'Back to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [backendReturnTime, setBackendReturnTime] = useState(null);

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedCustomer(null);
    setSelectedCar(null);
    setSelectedServiceIds([]);
    setSelectedSlot(null);
    setBackendReturnTime(null);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleVehicleSelect = (car) => {
    setSelectedCar(car);
    setCurrentStep(2);
  };

  const handleProceedFromDiagnosis = async () => {
    if (selectedServiceIds.length === 0) return;
    try {
      const response = await axios.post(`${API_URL}/returnslot`, selectedServiceIds);
      setBackendReturnTime(response.data);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error calling /returnslot:', error);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setCurrentStep(5);
  };

  return (
    <div className="bg-slate-50">
      <div className="p-8 min-h-screen">
        {/* Step Progress Indicator */}
        <div className="mb-12 flex items-center justify-center max-w-4xl mx-auto">
          <div className="flex items-center gap-0 w-full max-w-md">
            {[1, 2, 3, 4, 5].map(step => (
              <div key={step} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="relative z-10 flex justify-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step <= currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step}
                  </div>
                </div>
                {/* Line */}
                {step < 5 && (
                  <div className={`flex-1 h-1 mx-0 ${step < currentStep ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <Step1CustomerIdentification
            onCustomerSelect={handleCustomerSelect}
            onVehicleSelect={handleVehicleSelect}
          />
        )}
        {currentStep === 2 && (
          <Step2Diagnosis
            selectedServices={selectedServiceIds}
            onServicesChange={setSelectedServiceIds}
            onProceed={handleProceedFromDiagnosis}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <Step3ResourceIntelligence
            selectedServiceIds={selectedServiceIds}
            backendReturnTime={backendReturnTime}
            onBack={handleBack}
            onProceed={() => setCurrentStep(4)}
          />
        )}
        {currentStep === 4 && (
          <Step4SlotSelection
            backendReturnTime={backendReturnTime}
            onSlotSelect={handleSlotSelect}
            onBack={handleBack}
            onProceed={() => setCurrentStep(5)}
          />
        )}
        {currentStep === 5 && (
          <Step5Success
            customerData={selectedCustomer}
            carData={selectedCar}
            serviceData={null}
            slotData={selectedSlot}
            selectedServiceIds={selectedServiceIds}
            onReset={handleReset}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

export default App;