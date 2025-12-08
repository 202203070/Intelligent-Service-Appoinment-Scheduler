import React from 'react';
import './AppointmentList.css';

function AppointmentList({ appointments, loading, onRefresh }) {
  return (
    <div className="appointment-list">
      <div className="list-header">
        <h2>Appointments</h2>
        <button onClick={onRefresh} className="refresh-btn">Refresh</button>
      </div>

      {loading ? (
        <p className="loading">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="no-data">No appointments scheduled yet.</p>
      ) : (
        <div className="appointments">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <h3>{appointment.customerName}</h3>
                <span className="status">{appointment.status || 'Scheduled'}</span>
              </div>
              <div className="appointment-details">
                <p><strong>Email:</strong> {appointment.customerEmail}</p>
                <p><strong>Service:</strong> {appointment.serviceType}</p>
                <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                {appointment.technicianId && (
                  <p><strong>Technician ID:</strong> {appointment.technicianId}</p>
                )}
                {appointment.bayId && (
                  <p><strong>Bay ID:</strong> {appointment.bayId}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
