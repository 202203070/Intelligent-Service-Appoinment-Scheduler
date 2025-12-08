package com.appointmentscheduler.service;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryService {
    public LocalDateTime inventoryAvailability(int serviceIds);
}
