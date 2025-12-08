import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Search, Bell, User, ChevronDown, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load customers from backend and normalize customerId to numeric (Long -> JS number)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_URL}/customers`);
        const normalized = (response.data || []).map((c) => ({
          ...c,
          customerId: c.customerId != null ? Number(c.customerId) : c.customerId,
        }));
        setCustomers(normalized);
      } catch (err) {
        console.error('Error fetching customers', err);
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

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
function Step2Diagnosis({ selectedServices, onServicesChange, onProceed, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Hard-coded service catalog (no backend call)
  const services = [
    {
      serviceId: 1,
      service: 'Squeaking Brakes',
      issue: 'Squeaking Brakes',
      serviceTime: 120,
      serviceTimeMinutes: 120,
    },
    {
      serviceId: 2,
      service: 'Engine Light',
      issue: 'Engine Light',
      serviceTime: 180,
      serviceTimeMinutes: 180,
    },
    {
      serviceId: 3,
      service: 'Overheating',
      issue: 'Overheating',
      serviceTime: 60,
      serviceTimeMinutes: 60,
    },
    {
      serviceId: 4,
      service: 'Oil Change',
      issue: 'Oil Change',
      serviceTime: 60,
      serviceTimeMinutes: 60,
    },
    {
      serviceId: 5,
      service: 'Dead Battery',
      issue: 'Dead Battery',
      serviceTime: 60,
      serviceTimeMinutes: 60,
    },
    {
      serviceId: 6,
      service: 'Tire Issues',
      issue: 'Tire Issues',
      serviceTime: 90,
      serviceTimeMinutes: 90,
    },
  ];

  const filteredServices = services.filter(s =>
    s.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.issue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (serviceId) => selectedServices.includes(serviceId);

  const toggleService = (serviceId) => {
    if (isSelected(serviceId)) {
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
        
        <>
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

            {searchTerm && (
              <div className="grid grid-cols-1 gap-3 mb-6">
                {filteredServices.length > 0 ? (
                  filteredServices.map(service => (
                    <button
                      key={service.serviceId}
                      onClick={() => toggleService(service.serviceId)}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        isSelected(service.serviceId)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-blue-300'
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
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-4">No services found</p>
                )}
              </div>
            )}

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
                  onClick={onProceed}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Proceed to Resource Check
                </button>
              </div>
            )}
          </>
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

  // Fetch representative technician & bay for the selected services
  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedServiceIds || selectedServiceIds.length === 0) return;

      try {
        // Technician (reuse the existing endpoint used in Step5Success)
        const techResp = await axios.post(`${API_URL}/technicians/for-services`, selectedServiceIds);
        const techs = techResp.data || [];
        if (techs.length > 0) {
          setTechnicianName(techs[0].name || 'Assigned Technician');
        }
      } catch (err) {
        console.error('Error fetching technicians in Step3', err);
      }

      try {
        // Bay
        const bayResp = await axios.post(`${API_URL}/bays/for-services`, selectedServiceIds);
        const bays = bayResp.data || [];
        if (bays.length > 0) {
          setBayType(bays[0].bayType || 'Service Bay');
        }
      } catch (err) {
        console.error('Error fetching bays in Step3', err);
      }

      try {
        // Inventory / Parts for the first selected service
        const firstServiceId = selectedServiceIds[0];
        if (firstServiceId != null) {
          const invResp = await axios.post(`${API_URL}/inventory/for-service`, firstServiceId);
          const items = invResp.data || [];
          if (items.length > 0) {
            const primary = items[0];
            setParts({
              partName: primary.partName,
              availableParts: primary.availableParts
            });
          }
        }
      } catch (err) {
        console.error('Error fetching inventory in Step3', err);
      }
    };

    fetchResources();
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
            <p className="text-3xl font-bold text-blue-600">{earliestDateStr}</p>
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
            Find Slots starting {earliestDateStr}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP 4: SLOT SELECTION (CALENDAR)
// ============================================
function Step4SlotSelection({ backendReturnTime, onSlotSelect, onBack, onProceed }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    backendReturnTime ? new Date(backendReturnTime) : new Date()
  );

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM',
    '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
  ];

  const earliestDate = backendReturnTime ? new Date(backendReturnTime) : new Date();

  const isSlotAvailable = (date) => {
    return date >= earliestDate;
  };

  const handleSelectSlot = (slot) => {
    if (isSlotAvailable(selectedDate)) {
      setSelectedSlot(slot);
      onSlotSelect({ date: selectedDate.toISOString().split('T')[0], time: slot });
    }
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
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
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            ← Previous
          </button>
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-1">Selected Date</p>
            <p className="text-lg font-bold text-slate-900">{dateStr}</p>
          </div>
          <button
            onClick={() => handleDateChange(1)}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Next →
          </button>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-6 gap-2 mb-8">
          {timeSlots.map((slot, idx) => {
            const isAvailable = isSlotAvailable(selectedDate);
            const isSelected = selectedSlot === slot;
            
            return (
              <button
                key={idx}
                onClick={() => handleSelectSlot(slot)}
                disabled={!isAvailable}
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