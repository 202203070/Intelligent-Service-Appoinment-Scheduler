package com.appointmentscheduler.service;

import com.appointmentscheduler.entity.Bay;
import com.appointmentscheduler.entity.Technician;

import java.time.LocalDateTime;
import java.util.List;

public interface BayAndTechnicianService {
    public LocalDateTime bayAndTechnicianAvailability(LocalDateTime partsArrivalTime, double serviceDurationMinutes, List<Technician> qualifiedTechs, List<Bay> qualifiedBays);
}
