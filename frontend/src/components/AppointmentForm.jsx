import React, { useState } from 'react';
import './AppointmentForm.css';

function AppointmentForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    serviceType: '',
    appointmentDate: '',
    appointmentTime: '',
    technicianId: '',
    bayId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      customerName: '',
      customerEmail: '',
      serviceType: '',
      appointmentDate: '',
      appointmentTime: '',
      technicianId: '',
      bayId: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <h2>New Appointment</h2>
      
      <div className="form-group">
        <label htmlFor="customerName">Customer Name</label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="customerEmail">Email</label>
        <input
          type="email"
          id="customerEmail"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="serviceType">Service Type</label>
        <input
          type="text"
          id="serviceType"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="appointmentDate">Date</label>
        <input
          type="date"
          id="appointmentDate"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="appointmentTime">Time</label>
        <input
          type="time"
          id="appointmentTime"
          name="appointmentTime"
          value={formData.appointmentTime}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="technicianId">Technician ID</label>
        <input
          type="number"
          id="technicianId"
          name="technicianId"
          value={formData.technicianId}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="bayId">Bay ID</label>
        <input
          type="number"
          id="bayId"
          name="bayId"
          value={formData.bayId}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="submit-btn">Schedule Appointment</button>
    </form>
  );
}

export default AppointmentForm;
